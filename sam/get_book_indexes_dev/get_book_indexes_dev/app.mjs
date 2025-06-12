/* eslint-env node */
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg";

const secretClient = new SecretsManagerClient({ region: process.env.REGION });
let secretCache;

async function getDbUrl() {
    if (secretCache) {
        return secretCache;
    }
    try {
        const response = await secretClient.send(
            new GetSecretValueCommand({
                SecretId: process.env.SECRET_NAME,
                VersionStage: "AWSCURRENT"
            })
        );
        secretCache = response.SecretString;
        return secretCache;
    } catch (error) {
        console.error('Error retrieving secret:', error);
        throw error;
    }
}

let pool;
async function getPool() {
    if (!pool) {
        const connStr = await getDbUrl();
        pool = new Pool({
            connectionString: connStr,
            ssl: { require: true, rejectUnauthorized: false }
        });
    }
    return pool;
}

let cachedCount = null;
let cacheTimestamp = null;
const CACHE_TTL_MS = 60000; // 1 minute cache for COUNT(*) for queries with no filter

export const lambdaHandler = async (event) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '600'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: corsHeaders, body: '' };
    }

    try {
        const body = JSON.parse(event.body);
        const { latitude, longitude, radius, title, page: rawPage } = body;
        let page = parseInt(rawPage, 10);
        if (isNaN(page) || page < 0) page = 0;

        const conditions = [];
        const values = [];
        let idx = 1;

        const sortByDistance = latitude && longitude && radius;
        const sortLat = latitude;
        const sortLong = longitude;

        // Location filter
        if (sortByDistance) {
            conditions.push(`ST_DWithin(coordinates, ST_MakePoint($${idx++}, $${idx++})::geography, $${idx++})`);
            values.push(longitude, latitude, radius);
        }

        // Fuzzy search: title OR author OR isbn
        const orConditions = [];
        if (title && title.trim().length > 0) {
            const searchTerm = `%${title.toLowerCase()}%`;

            orConditions.push(`LOWER(title) LIKE $${idx}`);
            values.push(searchTerm);
            idx++;

            orConditions.push(`LOWER(author) LIKE $${idx}`);
            values.push(searchTerm);
            idx++;

            orConditions.push(`LOWER(isbn) LIKE $${idx}`);
            values.push(searchTerm);
            idx++;
        }

        // Combine WHERE clause
        const whereParts = [];
        if (conditions.length > 0) whereParts.push(...conditions);
        if (orConditions.length > 0) whereParts.push(`(${orConditions.join(' OR ')})`);
        const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

        const limit = 100;
        const offset = page * limit;

        const db = await getPool();
        const client = await db.connect();

        try {
            // Total count
            let totalCount;
            const now = Date.now();
            if (values.length === 0 && cachedCount && cacheTimestamp && now - cacheTimestamp < CACHE_TTL_MS) {
                totalCount = cachedCount;
            } else {
                const countQuery = `
                    SELECT COUNT(*) AS total
                    FROM books_index
                             ${whereClause};
                `;
                const countResult = await client.query(countQuery, values);
                totalCount = parseInt(countResult.rows[0].total, 10);

                if (values.length === 0) {
                    cachedCount = totalCount;
                    cacheTimestamp = now;
                }
            }

            const totalPages = Math.ceil(totalCount / limit);

            // Final query with optional distance sort
            let query;
            if (sortByDistance) {
                values.push(sortLong, sortLat);
                const distLongIdx = idx++;
                const distLatIdx = idx++;

                query = `
                    SELECT id,
                           ST_Distance(coordinates, ST_MakePoint($${distLongIdx}, $${distLatIdx})::geography) AS distance
                    FROM books_index
                    ${whereClause}
                    ORDER BY distance ASC
                    LIMIT ${limit} OFFSET ${offset};
                `;
            } else {
                query = `
                    SELECT id
                    FROM books_index
                    ${whereClause}
                    ORDER BY created_at DESC
                    LIMIT ${limit} OFFSET ${offset};
                `;
            }

            const result = await client.query(query, values);

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Success",
                    page,
                    totalPages,
                    count: result.rowCount,
                    results: result.rows.map(row => ({
                        id: row.id,
                        ...(row.distance !== undefined && { distance: Math.round(row.distance) })
                    }))
                })
            };
        } finally {
            client.release();
        }
    } catch (err) {
        console.error("Error in getBooks handler:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Failed to fetch books", error: err.message })
        };
    }
};
