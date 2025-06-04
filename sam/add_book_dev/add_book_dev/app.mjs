/* eslint-env node */
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { Pool } from "pg"; // CommonJS for 'pg' as it may not fully support ES modules

// Initialize Secrets Manager client
const client = new SecretsManagerClient({
    region: process.env.REGION // Use region from environment variable
});

let secretCache; // Cache the secret to avoid repeated calls

// Function to get the secret
async function getDbUrl() {
    if (secretCache) {
        return secretCache;
    }
    try {
        const response = await client.send(
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

// Initialize the PostgreSQL connection pool
let pool;
async function getPool() {
    if (!pool) {
        const connectionString = await getDbUrl();
        pool = new Pool({
            connectionString,
            ssl: {
                require: true,
                rejectUnauthorized: false // Allows self-signed certs for Neon
            }
        });
    }
    return pool;
}

export const lambdaHandler = async (event) => {
    // Add CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*', // Change to specific domain in production
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '600'
    };


    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    try {
        // Parse the incoming POST request body
        const body = JSON.parse(event.body);
        const { id, title, author, isbn, longitude, latitude } = body;

        // Validate required fields
        if (!id || !title || !author) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: 'Missing required fields: id, title, and author are required'
                })
            };
        }

        // Validate coordinates if provided
        if ((longitude !== undefined && latitude === undefined) ||
            (longitude === undefined && latitude !== undefined)) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: 'Both longitude and latitude must be provided together'
                })
            };
        }

        // Validate coordinate ranges
        if (longitude !== undefined && latitude !== undefined) {
            if (longitude < -180 || longitude > 180) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        message: 'Longitude must be between -180 and 180'
                    })
                };
            }
            if (latitude < -90 || latitude > 90) {
                return {
                    statusCode: 400,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        message: 'Latitude must be between -90 and 90'
                    })
                };
            }
        }

        // Get the connection pool and insert data
        const pool = await getPool();

        // Build query based on whether coordinates are provided
        let query, values;

        if (longitude !== undefined && latitude !== undefined) {
            // Insert with coordinates using PostGIS ST_Point function
            query = `
                INSERT INTO books_index (id, title, author, isbn, coordinates)
                VALUES ($1, $2, $3, $4, ST_Point($5, $6)::geography)
                RETURNING id, title, author, isbn, created_at, 
                         ST_X(coordinates::geometry) as longitude, 
                         ST_Y(coordinates::geometry) as latitude;
            `;
            values = [id, title, author, isbn || null, longitude, latitude];
        } else {
            // Insert without coordinates
            query = `
                INSERT INTO books_index (id, title, author, isbn)
                VALUES ($1, $2, $3, $4)
                RETURNING id, title, author, isbn, created_at;
            `;
            values = [id, title, author, isbn || null];
        }

        const client = await pool.connect();
        try {
            const result = await client.query(query, values);
            return {
                statusCode: 201, // Use 201 for resource creation
                headers: corsHeaders,
                body: JSON.stringify({
                    message: 'Book added successfully',
                    data: result.rows[0]
                })
            };
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Error executing query or retrieving secret', err.stack);

        // Handle specific database errors
        let errorMessage = 'Error adding book to database';
        let statusCode = 500;

        if (err.code === '23505') { // Unique constraint violation
            errorMessage = 'A book with this ID already exists';
            statusCode = 409;
        } else if (err.code === '22P02') { // Invalid input syntax
            errorMessage = 'Invalid data format provided';
            statusCode = 400;
        }

        return {
            statusCode,
            headers: corsHeaders,
            body: JSON.stringify({
                message: errorMessage,
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            })
        };
    }
};