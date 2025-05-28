import React from 'react';
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


// Main LibraryPage Page Component
const LibraryPage: React.FC = () => {
    // Mock data - replace with your actual data fetching logic
    const mockBooks: BookType[] = [
        {
            id: '1',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            isbn: '978-0-7432-7356-5',
            owner: 'john@example.com',
            createdAt: Date.parse('2024-01-15T10:30:00Z'),
            loanedOut: false,
        },
        {
            id: '2',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            isbn: '978-0-06-112008-4',
            owner: 'jane@example.com',
            createdAt: Date.parse('2024-02-20T14:45:00Z'),
            loanedOut: true,
            loanedTo: 'alice@example.com',
        },
        {
            id: '3',
            title: '1984',
            author: 'George Orwell',
            owner: 'bob@example.com',
            createdAt: Date.parse('2024-03-10T09:15:00Z'),
            loanedOut: false,
        },
        {
            id: '4',
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            isbn: '978-0-14-143951-8',
            owner: 'sarah@example.com',
            createdAt: Date.parse('2024-03-25T16:20:00Z'),
            loanedOut: true,
            loanedTo: 'charlie@example.com',
        },
        {
            id: '5',
            title: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            owner: 'mike@example.com',
            createdAt: Date.parse('2024-04-05T11:10:00Z'),
            loanedOut: false,
        },
        {
            id: '6',
            title: 'Harry Potter and the Philosopher\'s Stone',
            author: 'J.K. Rowling',
            isbn: '978-0-7475-3269-6',
            owner: 'emma@example.com',
            createdAt: Date.parse('2024-04-18T13:30:00Z'),
            loanedOut: false,
        },
    ];

    const availableBooks = mockBooks.filter(book => !book.loanedOut);
    const loanedBooks = mockBooks.filter(book => book.loanedOut);

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
                                    <p className="text-2xl font-bold text-slate-900">{mockBooks.length}</p>
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
                    {mockBooks.length === 0 && (
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