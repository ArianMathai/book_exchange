import React, { useEffect, useState, useCallback } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Book as BookIcon,
    Search,
    Filter,
    Loader2,
    HandshakeIcon,
    CheckCircle,
    AlertCircle,
    XCircle
} from 'lucide-react';
import BookCard from "@/components/book/BookCard.tsx";
import { BookType } from "@/components/book/bookTypes.ts";
import { client } from "@/lib/amplifyClient.ts";
import PaginationControl from "@/components/book/PaginationControl.tsx";

// Number of books to display per page
const BOOKS_PER_PAGE = 10;
// Debounce timeout for search (milliseconds)
const SEARCH_DEBOUNCE_MS = 300;

const FindBook: React.FC = () => {
    const { user } = useAuthenticator();
    const currentUserEmail = user?.signInDetails?.loginId || '';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [books, setBooks] = useState<BookType[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
    
    // Book count states
    const [totalBooksCount, setTotalBooksCount] = useState<number>(0);
    const [availableBooksCount, setAvailableBooksCount] = useState<number>(0);
    const [loanedBooksCount, setLoanedBooksCount] = useState<number>(0);
    const [countLoading, setCountLoading] = useState(true);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [paginationTokens, setPaginationTokens] = useState<(string | null)[]>([null]); // page 1 token is null
    const [nextToken, setNextToken] = useState<string | null>(null);
    const [pageTransitioning, setPageTransitioning] = useState(false);
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<BookType[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isInSearchMode, setIsInSearchMode] = useState(false);
    
    // Store previous pagination state when searching
    const [previousPaginationState, setPreviousPaginationState] = useState<{
        page: number;
        tokens: (string | null)[];
        currentToken: string | null;
    } | null>(null);

    // Calculate total pages based on total items count
    useEffect(() => {
        if (totalBooksCount > 0) {
            const calculatedTotalPages = Math.ceil(totalBooksCount / BOOKS_PER_PAGE);
            setTotalPages(calculatedTotalPages);
        }
    }, [totalBooksCount]);

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Handle debounced search query changes
    useEffect(() => {
        if (debouncedSearchQuery) {
            // Save current pagination state before searching
            if (!isInSearchMode) {
                setPreviousPaginationState({
                    page: currentPage,
                    tokens: [...paginationTokens],
                    currentToken: nextToken
                });
                setIsInSearchMode(true);
            }
            searchBooks(debouncedSearchQuery);
        } else if (isInSearchMode) {
            // Clear search and restore pagination
            setIsInSearchMode(false);
            setSearchResults([]);
            
            // Restore previous pagination state
            if (previousPaginationState) {
                setCurrentPage(previousPaginationState.page);
                setPaginationTokens(previousPaginationState.tokens);
                setNextToken(previousPaginationState.currentToken);
                
                // Re-fetch books for the restored page
                const tokenToUse = previousPaginationState.tokens[previousPaginationState.tokens.length - 1];
                fetchBooks(tokenToUse);
            } else {
                // If no previous state, reset to first page
                setCurrentPage(1);
                setPaginationTokens([null]);
                fetchBooks(null);
            }
        }
    }, [debouncedSearchQuery]);

    // Fetch only book counts for statistics (more efficient)
    const fetchBookCounts = async () => {
        if (!currentUserEmail) return;
        
        setCountLoading(true);
        
        try {
            console.log('📊 Fetching book counts from other users...');
            
            // Fetch total count (minimal fields to reduce data transfer)
            const totalResult = await client.models.Book.list({
                selectionSet: ['id'],
                filter: {
                    ownerEmail: {
                        ne: currentUserEmail
                    }
                },
                limit: 1000 // Set a high limit to get all books (for counting)
            });
            
            // Fetch loaned count
            const loanedResult = await client.models.Book.list({
                selectionSet: ['id'],
                filter: {
                    and: [
                        {
                            ownerEmail: {
                                ne: currentUserEmail
                            }
                        },
                        {
                            loanedOut: {
                                eq: true
                            }
                        }
                    ]
                },
                limit: 1000 // Set a high limit to get all loaned books (for counting)
            });
            
            // Calculate counts
            const total = totalResult.data?.length || 0;
            const loaned = loanedResult.data?.length || 0;
            const available = total - loaned;
            
            // Update state
            setTotalBooksCount(total);
            setLoanedBooksCount(loaned);
            setAvailableBooksCount(available);
            
            console.log(`📊 Counts from other users: Total=${total}, Available=${available}, Loaned=${loaned}`);
            
        } catch (error) {
            console.error('💥 Error fetching book counts:', error);
            // Don't set error state here to avoid disrupting the main view
        } finally {
            setCountLoading(false);
        }
    };

    // Function to search all books globally
    const searchBooks = async (query: string) => {
        if (!currentUserEmail || !query.trim()) return;
        
        setSearchLoading(true);
        
        try {
            console.log(`🔍 Searching all books for: "${query}"`);
            
            // Normalize the search query
            const normalizedQuery = query.toLowerCase().trim();
            
            // Fetch all books that match the search query
            // Note: In a real production app, this should be handled by a backend search endpoint
            // to avoid fetching all books. This is a simplified implementation.
            const result = await client.models.Book.list({
                selectionSet: ['id', 'title', 'author', 'isbn', 'ownerEmail', 'createdAt', 'loanedOut', 'loanedTo', 'imageSource', 'imageUrl'],
                limit: 1000, // Set a high limit to get as many books as possible
                filter: {
                    and: [
                        {
                            ownerEmail: {
                                ne: currentUserEmail
                            }
                        },
                        {
                            or: [
                                {
                                    title: {
                                        containsIgnoreCase: normalizedQuery
                                    }
                                },
                                {
                                    author: {
                                        containsIgnoreCase: normalizedQuery
                                    }
                                },
                                {
                                    isbn: {
                                        containsIgnoreCase: normalizedQuery
                                    }
                                }
                            ]
                        }
                    ]
                }
            });
            
            if (result.errors && result.errors.length > 0) {
                console.error('GraphQL Errors:', result.errors);
                setError(`Error: ${result.errors[0].message}`);
                return;
            }
            
            const rawBooks = result.data ?? [];
            console.log(`🔍 Search found ${rawBooks.length} matching books`);
            
            const transformedBooks: BookType[] = rawBooks.map(book => ({
                id: book.id,
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                ownerEmail: book.ownerEmail,
                createdAt: book.createdAt,
                loanedOut: book.loanedOut,
                loanedTo: book.loanedTo,
                imageUrl: book.imageUrl,
                imageSource: book.imageSource === 'manual' || book.imageSource === 'google_books'
                    ? book.imageSource
                    : null,
            }));
            
            setSearchResults(transformedBooks);
            setFilteredBooks(transformedBooks);
            
        } catch (error) {
            console.error('💥 Error searching books:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setSearchLoading(false);
        }
    };

    // Function to fetch books from other users
    const fetchBooks = async (token: string | null = null) => {
        if (!currentUserEmail) return;

        setLoading(true);
        setError(null);

        try {
            console.log('📚 Fetching books from other users...');
            const result = await client.models.Book.list({
                selectionSet: ['id', 'title', 'author', 'isbn', 'ownerEmail', 'createdAt', 'loanedOut', 'loanedTo', 'imageSource', 'imageUrl'],
                limit: BOOKS_PER_PAGE,
                nextToken: token,
                filter: {
                    ownerEmail: {
                        ne: currentUserEmail
                    }
                },
                orderBy: {
                    field: 'createdAt',
                    direction: 'DESC'
                }
            });

            if (result.errors && result.errors.length > 0) {
                console.error('GraphQL Errors:', result.errors);
                setError(`Error: ${result.errors[0].message}`);
                return;
            }

            const rawBooks = result.data ?? [];
            console.log(`📚 Received ${rawBooks.length} books for page ${currentPage}`);

            const transformedBooks: BookType[] = rawBooks.map(book => ({
                id: book.id,
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                ownerEmail: book.ownerEmail,
                createdAt: book.createdAt,
                loanedOut: book.loanedOut,
                loanedTo: book.loanedTo,
                imageUrl: book.imageUrl,
                imageSource: book.imageSource === 'manual' || book.imageSource === 'google_books'
                    ? book.imageSource
                    : null,
            }));

            setBooks(transformedBooks);
            setFilteredBooks(transformedBooks);
            
            // Update pagination state for next page availability
            if (result.nextToken) {
                setNextToken(result.nextToken);
            } else {
                setNextToken(null);
            }

        } catch (error) {
            console.error('💥 Error fetching books:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
            setPageTransitioning(false);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        if (currentUserEmail) {
            fetchBookCounts();
            fetchBooks();
        }
    }, [currentUserEmail]);

    // Handle next page - improved with better state management
    const handleNextPage = async () => {
        if (nextToken) {
            setPageTransitioning(true);
            
            // Add the next token to our pagination tokens array
            setPaginationTokens(prev => [...prev, nextToken]);
            setCurrentPage(prev => prev + 1);
            
            await fetchBooks(nextToken);
        }
    };

    // Handle previous page - improved with better state management
    const handlePrevPage = async () => {
        if (currentPage > 1) {
            setPageTransitioning(true);
            
            // Remove the current token from the array
            const newTokens = [...paginationTokens];
            newTokens.pop(); // Remove the current page's token
            setPaginationTokens(newTokens);
            
            // Get the previous page's token (now the last one in the array)
            const prevToken = newTokens[newTokens.length - 1];
            
            setCurrentPage(prev => prev - 1);
            await fetchBooks(prevToken);
        }
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery('');
    };

    // Handle loan request (UI only for now)
    const handleLoanRequest = (bookId: string) => {
        console.log(`Loan request for book ID: ${bookId}`);
        // This would connect to a backend endpoint in the future
        alert(`Loan request sent for book ID: ${bookId}`);
    };

    // Render available books
    const renderAvailableBooks = () => {
        const availableBooks = filteredBooks.filter(book => !book.loanedOut);
        
        if (availableBooks.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-slate-600">No available books found.</p>
                </div>
            );
        }

        return (
            <div>
                <div className="flex items-center mb-6">
                    <BookIcon className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold text-slate-900">Available Books</h2>
                    <Badge variant="secondary" className="ml-3 bg-green-100 text-green-800">
                        {availableBooks.length}
                    </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableBooks.map((book) => (
                        <div key={book.id} className="relative">
                            <BookCard book={book} />
                            <div className="mt-2 flex justify-end">
                                <Button 
                                    onClick={() => handleLoanRequest(book.id || '')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                >
                                    <HandshakeIcon className="w-4 h-4 mr-2" />
                                    Request Loan
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render loaned books
    const renderLoanedBooks = () => {
        const loanedBooks = filteredBooks.filter(book => book.loanedOut);
        
        if (loanedBooks.length === 0) {
            return null;
        }

        return (
            <div>
                <div className="flex items-center mb-6">
                    <BookIcon className="w-5 h-5 text-red-600 mr-2" />
                    <h2 className="text-xl font-semibold text-slate-900">Currently Loaned Books</h2>
                    <Badge variant="secondary" className="ml-3 bg-red-100 text-red-800">
                        {loanedBooks.length}
                    </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loanedBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Books</h1>
                        <p className="text-slate-600">
                            Discover books from other users to borrow
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                type="text"
                                placeholder="Search by title, author, or ISBN..."
                                className="pl-9 pr-10 py-2 w-full sm:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button 
                                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                                    onClick={handleClearSearch}
                                >
                                    <XCircle className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Search Status Indicator */}
                {isInSearchMode && (
                    <div className="mb-4 p-2 bg-blue-50 border border-blue-100 rounded-md">
                        <p className="text-sm text-blue-700 flex items-center">
                            <Search className="h-4 w-4 mr-2" />
                            {searchLoading ? (
                                <>
                                    <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                    Searching for "{searchQuery}"...
                                </>
                            ) : (
                                <>
                                    Showing {searchResults.length} results for "{searchQuery}"
                                </>
                            )}
                        </p>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
                    <Card className="bg-white border-slate-200">
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <p className="text-xs sm:text-sm font-medium text-slate-600">Total Books</p>
                                    <p className="text-lg sm:text-2xl font-bold text-slate-900">
                                        {countLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-slate-400 inline" />
                                        ) : (
                                            totalBooksCount
                                        )}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg self-center sm:self-auto">
                                    <BookIcon className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200">
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <p className="text-xs sm:text-sm font-medium text-slate-600">Available</p>
                                    <p className="text-lg sm:text-2xl font-bold text-green-600">
                                        {countLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-slate-400 inline" />
                                        ) : (
                                            availableBooksCount
                                        )}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-green-100 rounded-lg self-center sm:self-auto">
                                    <CheckCircle className="w-4 sm:w-6 h-4 sm:h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200">
                        <CardContent className="p-3 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="mb-2 sm:mb-0">
                                    <p className="text-xs sm:text-sm font-medium text-slate-600">Loaned Out</p>
                                    <p className="text-lg sm:text-2xl font-bold text-red-600">
                                        {countLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin text-slate-400 inline" />
                                        ) : (
                                            loanedBooksCount
                                        )}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-red-100 rounded-lg self-center sm:self-auto">
                                    <AlertCircle className="w-4 sm:w-6 h-4 sm:h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Loading State */}
                {(loading || pageTransitioning || searchLoading) && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        <span className="ml-3 text-slate-600">
                            {searchLoading ? 'Searching books...' : 'Loading books...'}
                        </span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        <p className="font-medium">Error loading books</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Books Grid */}
                {!loading && !pageTransitioning && !searchLoading && !error && (
                    <div className="space-y-12">
                        {/* Available Books Section */}
                        {renderAvailableBooks()}

                        {/* Loaned Books Section */}
                        {renderLoanedBooks()}

                        {/* Empty State */}
                        {filteredBooks.length === 0 && (
                            <div className="text-center py-12">
                                <BookIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No books found</h3>
                                <p className="text-slate-600 mb-6">
                                    {searchQuery 
                                        ? `No books match "${searchQuery}". Try a different search term.` 
                                        : "There are no books from other users available at the moment."}
                                </p>
                            </div>
                        )}

                        {/* Pagination Controls - Only show when not in search mode */}
                        {filteredBooks.length > 0 && !isInSearchMode && (
                            <div className="pt-6 border-t border-slate-200">
                                <PaginationControl
                                    currentPage={currentPage}
                                    onPreviousPage={handlePrevPage}
                                    onNextPage={handleNextPage}
                                    hasNextPage={!!nextToken}
                                    totalPages={totalPages}
                                    className="mt-4"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindBook;
