import { fetchAuthSession } from 'aws-amplify/auth';

// Type definitions
interface BookData {
    id: string;
    title: string;
    author: string;
    isbn?: string | null;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

interface IndexedBook {
    id: string;
    title: string;
    author: string;
    isbn: string | null;
    created_at: string;
    longitude?: number;
    latitude?: number;
}

interface IndexResponse {
    message: string;
    data?: IndexedBook;
}

const endpoint = import.meta.env.VITE_ADD_BOOK_ENDPOINT;

// Function to add book to the index database via Lambda
export const addBookToIndex = async (
    bookData: BookData,
    coordinates: Coordinates | null = null
): Promise<IndexResponse> => {
    try {
        // Get the current auth session to retrieve the JWT token
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (!token) {
            throw new Error('No authentication token available');
        }

        // Prepare the payload for the Lambda function
        const payload = {
            id: bookData.id, // The ID from the created book
            title: bookData.title,
            author: bookData.author,
            isbn: bookData.isbn || null,
            ...(coordinates && {
                longitude: coordinates.longitude,
                latitude: coordinates.latitude
            })
        };

        console.log('📤 Sending book to index:', payload);

        // Call the Lambda endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Cognito JWT token
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Book successfully added to index:', result);
        return result;

    } catch (error) {
        console.error('❌ Error adding book to index:', error);
        throw error;
    }
};

