import type { Handler } from 'aws-lambda';
import { env } from '$amplify/env/fetchMapsApiKey';

export const handler: Handler = async (event) => {
    console.log('🚀 Function started');
    console.log('📋 Event:', JSON.stringify(event, null, 2));

    // Debug environment
    console.log('🔍 All env keys:', Object.keys(process.env));
    console.log('🔍 Amplify env keys:', Object.keys(env));
    console.log('🔍 GOOGLE_MAPS_API_KEY from env:', env.GOOGLE_MAPS_API_KEY);
    console.log('🔍 GOOGLE_MAPS_API_KEY from process.env:', process.env.GOOGLE_MAPS_API_KEY);

    // Check authentication
    const isAuthenticated = event?.identity?.sub || event?.identity?.username;
    console.log('🔐 Authentication check:', {
        sub: event?.identity?.sub,
        username: event?.identity?.username,
        isAuthenticated: !!isAuthenticated
    });

    if (!isAuthenticated) {
        console.error('❌ Authentication failed');
        throw new Error('Unauthorized - User must be authenticated');
    }

    const result = env.GOOGLE_MAPS_API_KEY;
    console.log('✅ Returning result:', result ? 'KEY_EXISTS' : 'NULL');
    console.log('✅ Result type:', typeof result);

    return result;
};