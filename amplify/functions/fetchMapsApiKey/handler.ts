import type { Handler } from 'aws-lambda';
import { env } from '$amplify/env/fetchMapsApiKey';

// amplify/functions/fetchMapsApiKey/handler.ts

export const handler: Handler = async (event) => {
    const isAuthenticated = event?.identity?.sub || event?.identity?.username;

    if (!isAuthenticated) {
        throw new Error('Unauthorized - User must be authenticated');
    }

    return {
        // ✅ Important: wrap it inside `data`
        data: env.GOOGLE_MAPS_API_KEY
    };
};
