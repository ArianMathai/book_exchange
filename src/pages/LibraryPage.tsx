import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
    Plus,
    Book,
    CheckCircle,
    AlertCircle,
    Search,
    Filter
} from 'lucide-react';
import BookCard from "@/components/book/BookCard.tsx";
import {BookType} from "@/components/book/bookTypes.ts";
import {client} from "@/lib/amplifyClient.ts";


// Main LibraryPage Page Component
const LibraryPage: React.FC = () => {

    const [ ,setLoading] = useState(true);
    const [,setError] = useState<string | null>(null);
    const [books, setBooks] = useState<BookType[]>([]);



    const fetchBooks = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log('📚 Calling Book.list()...');
            const result = await client.models.Book.list({
                selectionSet: ['id','title', 'author', 'isbn', 'ownerEmail', 'createdAt', 'loanedOut', 'loanedTo', 'imageSource', 'imageUrl']
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


        } catch (error) {
            console.error('💥 Error fetching books:', error);
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        console.log('🚀 LibraryPage mounted - fetching books');
        fetchBooks();
    }, []);



    const availableBooks = books.filter(book => !book.loanedOut);
    const loanedBooks = books.filter(book => book.loanedOut);

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

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-white border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Total Books</p>
                                    <p className="text-2xl font-bold text-slate-900">{books.length}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Book className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Available</p>
                                    <p className="text-2xl font-bold text-green-600">{availableBooks.length}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">Loaned Out</p>
                                    <p className="text-2xl font-bold text-red-600">{loanedBooks.length}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Books Grid */}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    {books.length === 0 && (
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
                </div>
            </div>
        </div>
    );
};

export default LibraryPage;