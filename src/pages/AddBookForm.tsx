import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import {
    BookOpen,
    User,
    Hash,
    Save,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { client} from "@/lib/amplifyClient.ts";
import {fetchUserAttributes} from "aws-amplify/auth";

// Form data interface matching your book model
interface BookFormData {
    title: string;
    author: string;
    isbn: string;
}

// Form errors interface
interface FormErrors {
    title?: string;
    author?: string;
    isbn?: string;
    owner?: string;
}


const AddBookForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<BookFormData>({
        title: '',
        author: '',
        isbn: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);


    // Validation function
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Book title is required';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Title must be at least 2 characters long';
        }

        if (!formData.author.trim()) {
            newErrors.author = 'Author name is required';
        } else if (formData.author.trim().length < 2) {
            newErrors.author = 'Author name must be at least 2 characters long';
        }


        // ISBN validation
        if (formData.isbn.trim() && !/^(?:\d{10}|\d{13}|(?:\d{3}-?)?\d{1,5}-?\d{1,7}-?\d{1,7}-?[\dX])$/.test(formData.isbn.replace(/[-\s]/g, ''))) {
            newErrors.isbn = 'Please enter a valid ISBN (10 or 13 digits)';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleInputChange = (field: keyof BookFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const attributes = await fetchUserAttributes();
        const sub = attributes.sub;
        const ownerEmail = attributes.email

        if (!sub) {
            console.error('❌ Missing user sub (Cognito ID)');
            return;
        }
        if (!ownerEmail) {
            console.error('❌ Missing user email');
            return;
        }

        try {
            // Use the existing createBook helper and then pass to AddBook
            const bookData = {
                title: formData.title.trim(),
                author: formData.author.trim(),
                isbn: formData.isbn.trim() || null,
                owner: sub,
                ownerEmail: ownerEmail,
                createdAt: Math.floor(Date.now() / 1000), // Unix timestamp
                loanedOut: false,
                loanedTo: null
            };

            await client.models.Book.create(bookData);

            setSubmitSuccess(true);

            // Redirect after success
            setTimeout(() => {
                navigate('/library');
            }, 2000);

        } catch (error) {
            console.error('Error creating book:', error);
            // Handle error (you might want to show an error message)
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel/back
    const handleCancel = () => {
        navigate(-1);
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-green-100 rounded-full">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Book Added Successfully!</h3>
                                <p className="text-slate-600 text-sm">
                                    "{formData.title}" has been added to your library.
                                </p>
                            </div>
                            <div className="flex items-center text-sm text-slate-500">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Redirecting to library...
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="mb-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Library
                    </Button>

                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <BookOpen className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Add New Book</h1>
                            <p className="text-slate-600 mt-1">Add a book to your personal library</p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="shadow-lg border-slate-200">
                    <CardHeader className=" border-red-100">
                        <CardTitle className="text-xl text-slate-900 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-red-600" />
                            Book Information
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                            Fill in the details about your book. Fields marked with * are required.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title Field */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-slate-700 flex items-center">
                                    <BookOpen className="w-4 h-4 mr-1.5 text-slate-500" />
                                    Book Title *
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Enter the book title"
                                    value={formData.title}
                                    autoFocus={true}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className={cn(
                                        "transition-colors duration-200",
                                        errors.title
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-slate-300 focus:border-red-500 focus:ring-red-500"
                                    )}
                                />
                                {errors.title && (
                                    <div className="flex items-center text-sm text-red-600 mt-1">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.title}
                                    </div>
                                )}
                            </div>

                            {/* Author Field */}
                            <div className="space-y-2">
                                <Label htmlFor="author" className="text-sm font-medium text-slate-700 flex items-center">
                                    <User className="w-4 h-4 mr-1.5 text-slate-500" />
                                    Author *
                                </Label>
                                <Input
                                    id="author"
                                    type="text"
                                    placeholder="Enter the author's name"
                                    value={formData.author}
                                    onChange={(e) => handleInputChange('author', e.target.value)}
                                    className={cn(
                                        "transition-colors duration-200",
                                        errors.author
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-slate-300 focus:border-red-500 focus:ring-red-500"
                                    )}
                                />
                                {errors.author && (
                                    <div className="flex items-center text-sm text-red-600 mt-1">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.author}
                                    </div>
                                )}
                            </div>

                            {/* ISBN Field */}
                            <div className="space-y-2">
                                <Label htmlFor="isbn" className="text-sm font-medium text-slate-700 flex items-center">
                                    <Hash className="w-4 h-4 mr-1.5 text-slate-500" />
                                    ISBN
                                    <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                                </Label>
                                <Input
                                    id="isbn"
                                    type="text"
                                    placeholder="Enter ISBN (10 or 13 digits)"
                                    value={formData.isbn}
                                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                                    className={cn(
                                        "font-mono transition-colors duration-200",
                                        errors.isbn
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-slate-300 focus:border-red-500 focus:ring-red-500"
                                    )}
                                />
                                {errors.isbn && (
                                    <div className="flex items-center text-sm text-red-600 mt-1">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.isbn}
                                    </div>
                                )}
                                <p className="text-xs text-slate-500">
                                    Example: 978-0-123456-78-9 or 0123456789
                                </p>
                            </div>

                            <Separator className="my-6" />

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="order-2 sm:order-1"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="order-1 sm:order-2 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Adding Book...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Add Book
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Help Card */}
                <Card className="mt-6 border-blue-200 bg-blue-50/50">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <div className="p-1 bg-blue-100 rounded-full flex-shrink-0 mt-0.5">
                                <AlertCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-blue-900 mb-1">Need help?</h4>
                                <p className="text-sm text-blue-700">
                                    You can find the ISBN on the back cover or copyright page of most books.
                                    It's usually a 10 or 13-digit number that helps identify the book uniquely.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddBookForm;