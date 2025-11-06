import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();
type Book = Schema['Book']['type'];

interface LightweightError {
    message: string;
    code?: string;
    cause?: string;
}

export const useBooksByIds = (ids: string[], limit = 100) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<LightweightError[] | null>(null);

    useEffect(() => {
        if (ids.length === 0) {
            setBooks([]);
            setErrors(null);
            return;
        }

        const fetchBooks = async () => {
            setLoading(true);
            try {
                const filter = {
                    or: ids.map((id) => ({ id: { eq: id } }))
                };

                const { data, nextToken, errors } = await client.models.Book.list({
                    filter,
                    limit,
                });

                if (errors && errors.length > 0) {
                    setErrors(
                        errors.map((err) => {
                            const extensions = err.extensions ?? {};
                            return {
                                message: err.message || 'Unknown error',
                                code: typeof extensions.code === 'string' ? extensions.code : undefined,
                                cause: typeof extensions.cause === 'string' ? extensions.cause : undefined,
                            };
                        })
                    );
                }
                else {
                    setBooks(data);
                    setNextToken(nextToken || null);
                    setErrors(null);
                }
            } catch (err) {
                setErrors([
                    {
                        message: (err as Error).message,
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [ids]);

    return { books, nextToken, loading, errors };
};
