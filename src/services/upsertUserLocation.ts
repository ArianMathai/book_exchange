import { fetchAuthSession } from 'aws-amplify/auth';

interface LocationPayload {
    userId: string;
    longitude: number;
    latitude: number;
}

const endpoint = import.meta.env.VITE_UPSERT_USER_LOCATION_ENDPOINT;

export const upsertUserLocation = async (payload: LocationPayload): Promise<void> => {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (!token) {
            throw new Error('No authentication token available');
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
    } catch (err) {
        console.error('❌ Error upserting user location:', err);
        throw err;
    }
};