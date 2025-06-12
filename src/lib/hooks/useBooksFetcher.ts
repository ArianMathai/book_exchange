import { useQuery } from '@tanstack/react-query';
import {fetchAuthSession} from "aws-amplify/auth";

interface SearchParams {
    page: number;
    query?: string;
    radius?: number;
    latitude?: number;
    longitude?: number;
}

export interface BookIndexResponse {
    message: string;
    page: number;
    totalPages: number;
    count: number;
    results: {
        id: string;
        distance?: number; // optional, only present if location is included
    }[];
}


export const fetchBookIds = async (params: SearchParams): Promise<BookIndexResponse> => {
    try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (!token) {
            throw new Error('No authentication token available');
        }

        const res = await fetch(import.meta.env.VITE_GET_BOOK_INDEX_ENDPOINT!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                page: params.page,
                ...(params.query && { title: params.query, author: params.query, isbn: params.query }),
                ...(params.radius && params.latitude != null && params.longitude != null && {
                    // if your Lambda expects meters, multiply here:
                    // radius: params.radius * 1000,
                    radius: params.radius,
                    latitude: params.latitude,
                    longitude: params.longitude,
                })
            }),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to fetch book index (${res.status}): ${text}`);
        }

        return await res.json();
    } catch (err) {
        console.error('fetchBookIds error:', err);
        throw err;
    }
};

export const useBookIndex = (params: SearchParams) =>
    useQuery({
        queryKey: ['book-ids', params],
        queryFn: () => fetchBookIds(params),
        staleTime: 60 * 1000, // 1 min
    });
