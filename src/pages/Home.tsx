import { useState, useEffect } from 'react';
import { useBookIndex } from '@/lib/hooks/useBooksFetcher';
import SearchBar from '@/components/search/SearchBar';
import PaginationControls from '@/components/search/PaginationControls';
import BookCard from '@/components/book/BookCard'; // your visual card
import { client } from '@/lib/amplifyClient';
import {BookType} from "@/components/book/bookTypes.ts";

type BookWithDistance = BookType & { distance?: number };


const Home: React.FC = () => {
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({
        page: 0,
        query: '',
        radius: 10,
        latitude: undefined as number | undefined,
        longitude: undefined as number | undefined,
    });

    const [booksWithDistance, setBooksWithDistance] = useState<BookWithDistance[]>([]);

    const { data, isLoading, error } = useBookIndex(params);

    // refetch params on page change
    useEffect(() => {
        setParams((p) => ({ ...p, page }));
    }, [page]);

    // Fetch full book data once we have the list of IDs from Lambda
    useEffect(() => {
        const fetchBooks = async () => {
            if (!data?.results) return;

            const fetchedBooks = await Promise.all(
                data.results.map(async (entry) => {
                    try {
                        const { data: book } = await client.models.Book.get({ id: entry.id });

                        // Only proceed if we have a valid book with required fields
                        if (!book || !book.id || !book.title || !book.author || !book.ownerEmail) {
                            console.warn(`Book ${entry.id} missing required fields`);
                            return null;
                        }

                        // Create a properly typed BookWithDistance object
                        const bookWithDistance: BookWithDistance = {
                            id: book.id,
                            title: book.title,
                            author: book.author,
                            ownerEmail: book.ownerEmail,
                            isbn: book.isbn || null,
                            createdAt: book.createdAt || Date.now(),
                            loanedOut: book.loanedOut || false,
                            loanedTo: book.loanedTo || null,
                            imageUrl: book.imageUrl || null,
                            imageSource: book.imageSource === 'manual' || book.imageSource === 'google_books'
                                ? book.imageSource
                                : null,
                            distance: entry.distance
                        };

                        return bookWithDistance;
                    } catch (err) {
                        console.error(`Failed to fetch book ${entry.id}`, err);
                        return null;
                    }
                })
            );

            const validBooks = fetchedBooks.filter((book): book is BookWithDistance => book !== null);
            setBooksWithDistance(validBooks);
        };

        fetchBooks();
    }, [data]);

    return (
        <div>
            <SearchBar
                onSearch={({ query, radius, latitude, longitude }) => {
                    setPage(0);
                    setParams({ page: 0, query, radius: radius ?? 10, latitude, longitude });
                }}
            />

            {isLoading && <p>Loading…</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}

            {data && (
                <div>
                    <p>Page {data.page + 1} of {data.totalPages}</p>
                    <ul className="space-y-4">
                        {booksWithDistance.map((book) => (
                            <li key={book.id}>
                                <BookCard book={book} distance={book.distance} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <PaginationControls
                page={page}
                setPage={setPage}
                totalPages={data?.totalPages ?? 0}
            />
        </div>
    );
};

export default Home;
