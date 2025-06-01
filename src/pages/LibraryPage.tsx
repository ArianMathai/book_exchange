import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthenticator } from '@aws-amplify/ui-react';

import {
    Plus,
    Book,
    CheckCircle,
    AlertCircle,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import BookCard from "@/components/book/BookCard.tsx";
import {BookType} from "@/components/book/bookTypes.ts";
import {client} from "@/lib/amplifyClient.ts";

// Number of books to display per page
const BOOKS_PER_PAGE = 10;

// Main LibraryPage Page Component
const LibraryPage: React.FC = () => {
    const { user } = useAuthenticator();
    const currentUserEmail = user?.signInDetails?.loginId || '';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [books, setBooks] = useState<BookType[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);

    // Book count states
    const [totalCount, setTotalCount] = useState<number>(0);
    const [availableCount, setAvailableCount] = useState<number>(0);
    const [loanedCount, setLoanedCount] = useState<number>(0);

    // Improved pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [paginationTokens, setPaginationTokens] = useState<(string | null)[]>([null]); // page 1 token is null
    const [nextToken, setNextToken] = useState<string | null>(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [countLoading, setCountLoading] = useState(true);

    // Fetch only book counts for statistics
    const fetchBookCounts = async () => {
        if (!currentUserEmail) return;

        setCountLoading(true);

        try {
            console.log('📊 Fetching book counts...');

            // Fetch total count (minimal fields to reduce data transfer)
            const totalResult = await client.models.Book.list({
                selectionSet: ['id'],
                filter: {
                    ownerEmail: {
                        eq: currentUserEmail
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
                                eq: currentUserEmail
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
            setTotalCount(total);
            setLoanedCount(loaned);
            setAvailableCount(available);

            console.log(`📊 Counts: Total=${total}, Available=${available}, Loaned=${loaned}`);

        } catch (error) {
            console.error('💥 Error fetching book counts:', error);
            // Don't set error state here to avoid disrupting the main view
        } finally {
            setCountLoading(false);
        }
    };

    const fetchBooks = async (token: string | null = null) => {
        setLoading(true);
        setError(null);

        try {
            console.log('📚 Calling Book.list()...');
            const result = await client.models.Book.list({
                selectionSet: ['id','title', 'author', 'isbn', 'ownerEmail', 'createdAt', 'loanedOut', 'loanedTo', 'imageSource', 'imageUrl'],
                limit: BOOKS_PER_PAGE,
                nextToken: token,
                filter: {
                    ownerEmail: {
                        eq: currentUserEmail
                    }
                },

            });

            if (result.errors && result.errors.length > 0) {
                console.error('GraphQL Errors:', result.errors);
                setError(`GraphQL Error: ${result.errors[0].message}`);
                return;
            }

            const rawBooks = result.data ?? [];
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
                    : null, // Normalize to 'manual', 'google_books', or null
            }));
            console.log('Transformed books:', transformedBooks);
            setBooks(transformedBooks);
            setFilteredBooks(transformedBooks);

            // Update pagination state for next page availability
            if (result.nextToken) {
                setNextToken(result.nextToken);
                // If we're fetching the first page and there's a next token,
                // update the total pages estimate
                if (currentPage === 1) {
                    setTotalPages(prev => Math.max(prev, 2));
                }
            } else {
                setNextToken(null);
            }

            // After fetching books, update the counts to keep them in sync
            fetchBookCounts();

        } catch (error) {
            console.error('💥 Error fetching books:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        console.log('🚀 LibraryPage mounted - fetching data');
        if (currentUserEmail) {
            fetchBookCounts();
            fetchBooks();
        }
    }, [currentUserEmail]);

    // Handle search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredBooks(books);
            return;
        }

        setIsSearching(true);

        const query = searchQuery.toLowerCase().trim();
        const filtered = books.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            (book.isbn && book.isbn.toLowerCase().includes(query))
        );

        setFilteredBooks(filtered);
        setIsSearching(false);
    }, [searchQuery, books]);

    // Handle next page - simplified with paginationTokens array
    const handleNextPage = async () => {
        if (nextToken) {
            // Add the next token to our pagination tokens array
            setPaginationTokens(prev => [...prev, nextToken]);
            setCurrentPage(prev => prev + 1);
            await fetchBooks(nextToken);
        }
    };

    // Handle previous page - simplified with paginationTokens array
    const handlePrevPage = () => {
        if (currentPage > 1) {
            // Remove the current token from the array
            const newTokens = [...paginationTokens];
            newTokens.pop(); // Remove the current page's token
            setPaginationTokens(newTokens);

            // Get the previous page's token (now the last one in the array)
            const prevToken = newTokens[newTokens.length - 1];

            setCurrentPage(prev => prev - 1);
            fetchBooks(prevToken);
        }
    };

    const availableBooks = filteredBooks.filter(book => !book.loanedOut);
    const loanedBooks = filteredBooks.filter(book => book.loanedOut);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Book Library</h1>
                        <p className="text-slate-600">
                            Manage and browse your book collection
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                type="text"
                                placeholder="Search by title, author, or ISBN..."
                                className="pl-9 pr-4 py-2 w-full sm:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                        <Button asChild className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                            <Link to="/add-book" className="flex items-center">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Book
                            </Link>
                        </Button>
                    </div>
                </div>

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
                                            totalCount
                                        )}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg self-center sm:self-auto">
                                    <Book className="w-4 sm:w-6 h-4 sm:h-6 text-blue-600" />
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
                                            availableCount
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
                                            loanedCount
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
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                        <span className="ml-3 text-slate-600">Loading books...</span>
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
                {!loading && !error && (
                    <div className="space-y-8">
                        {/* Available Books Section */}
                        {availableBooks.length > 0 && (
                            <div>
                                <div className="flex items-center mb-6">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                    <h2 className="text-xl font-semibold text-slate-900">Available Books</h2>
                                    <Badge variant="secondary" className="ml-3 bg-green-100 text-green-800">
                                        {availableBooks.length}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {availableBooks.map((book) => (
                                        <BookCard key={book.id} book={book} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loaned Books Section */}
                        {loanedBooks.length > 0 && (
                            <div>
                                <div className="flex items-center mb-6">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                    <h2 className="text-xl font-semibold text-slate-900">Loaned Out Books</h2>
                                    <Badge variant="secondary" className="ml-3 bg-red-100 text-red-800">
                                        {loanedBooks.length}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {loanedBooks.map((book) => (
                                        <BookCard key={book.id} book={book} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {books.length === 0 && !isSearching && (
                            <div className="text-center py-12">
                                <Book className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No books in your library</h3>
                                <p className="text-slate-600 mb-6">Get started by adding your first book to the collection.</p>
                                <Button asChild className="bg-red-600 hover:bg-red-700">
                                    <Link to="/add-book">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Your First Book
                                    </Link>
                                </Button>
                            </div>
                        )}

                        {/* No Search Results */}
                        {filteredBooks.length === 0 && searchQuery.trim() !== '' && (
                            <div className="text-center py-12">
                                <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No matching books found</h3>
                                <p className="text-slate-600 mb-6">Try adjusting your search query.</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {filteredBooks.length > 0 && (
                            <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>

                                <span className="text-sm text-slate-600">
                                    Page {currentPage} {totalPages > 1 && `of ${totalPages}`}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={!nextToken}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LibraryPage;