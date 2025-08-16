/* eslint-env node */
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg";

const secretClient = new SecretsManagerClient({ region: process.env.REGION });
let secretCache;

async function getDbUrl() {
    if (secretCache) return secretCache;
    const response = await secretClient.send(
        new GetSecretValueCommand({
            SecretId: process.env.SECRET_NAME,
            VersionStage: "AWSCURRENT",
        })
    );
    secretCache = response.SecretString;
    return secretCache;
}

let pool;
async function getPool() {
    if (!pool) {
        const connStr = await getDbUrl();
        pool = new Pool({
            connectionString: connStr,
            ssl: { require: true, rejectUnauthorized: false },
        });
    }
    return pool;
}

export const lambdaHandler = async (event) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '600',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: corsHeaders, body: '' };
    }

    try {
        const body = JSON.parse(event.body);
        const { userId, longitude, latitude } = body;

        if (!userId || longitude === undefined || latitude === undefined) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'userId, longitude and latitude are required' }),
            };
        }

        if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Invalid coordinate values' }),
            };
        }

        const db = await getPool();
        const client = await db.connect();
        try {
            const query = `
                INSERT INTO user_index(id, coordinates)
                VALUES($1, ST_Point($2,$3)::geography)
                ON CONFLICT (id) DO UPDATE
                SET coordinates = EXCLUDED.coordinates, updated_at = NOW()
                RETURNING id, ST_X(coordinates::geometry) AS longitude, ST_Y(coordinates::geometry) AS latitude, updated_at;
            `;
            const values = [userId, longitude, latitude];
            const result = await client.query(query, values);

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: 'User location upserted',
                    data: result.rows[0],
                }),
            };
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error upserting user location:', err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Failed to upsert user location' }),
        };
    }
};