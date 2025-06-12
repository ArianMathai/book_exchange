import type { Handler } from 'aws-lambda';
import { env } from '$amplify/env/fetchMapsApiKey';

export const handler: Handler = async (event) => {


    // Check authentication
    const isAuthenticated = event?.identity?.sub || event?.identity?.username;


    if (!isAuthenticated) {
        console.error('❌ Authentication failed');
        throw new Error('Unauthorized - User must be authenticated');
    }

    const result = env.GOOGLE_MAPS_API_KEY;
    console.log('✅ Returning result:', result ? 'KEY_EXISTS' : 'NULL');
    console.log('✅ Result type:', typeof result);

    return result;
};