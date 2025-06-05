import React, { useState, useEffect, useRef } from 'react';
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
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { client} from "@/lib/amplifyClient.ts";
import { fetchUserAttributes } from "aws-amplify/auth";
import { findBookCover, searchCombinedSuggestions, BookSuggestion } from '@/services/googleBooksApi';
import {getCurrentLocation} from "@/services/getCurrentLocation.ts";
import {addBookToIndex} from "@/services/addBookToIndex.ts";
import SuccessMessage from "@/components/add-book-form/SuccessMessage.tsx";
import FormInputField from "@/components/add-book-form/FormInputField.tsx";
import BookSuggestionsDropdown from "@/components/add-book-form/BookSuggestionsDropdown.tsx";
import ImageTabSwitcher from "@/components/add-book-form/ImageTabSwitcher.tsx";
import HelpCard from "@/components/add-book-form/HelpCard.tsx";

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
    image?: string;
}

// Image source type
type ImageSource = 'manual' | 'google_books' | null;

//TODO: Possibly remove search book cover function, as search book by title also returns the cover? Explore this

const AddBookForm: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<BookFormData>({
        title: '',
        author: '',
        isbn: '',
    });

    // Image related state
    const [googleBooksImage, setGoogleBooksImage] = useState<string | null>(null);
    const [imageSource, setImageSource] = useState<ImageSource>(null);
    const [isSearchingImage, setIsSearchingImage] = useState(false);
    const [activeTab, setActiveTab] = useState<'google' | 'manual'>('google');

    // FileUploader state
    const [uploadedS3Key, setUploadedS3Key] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Debounce timer for Google Books API search
    const searchTimerRef = useRef<number | null>(null);

    // Autocomplete/suggestions state
    const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [activeSuggestionField, setActiveSuggestionField] = useState<'title' | 'author' | null>(null);

    // Refs for suggestion handling
    const suggestionTimerRef = useRef<number | null>(null);
    const suggestionContainerRef = useRef<HTMLDivElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);
    const authorInputRef = useRef<HTMLInputElement>(null);
    const skipNextImageSearchRef = useRef(false);
    const lastSuggestionQueryRef = useRef<{ title: string; author: string } | null>(null);



    // Effect to search for book cover when ISBN or title+author changes
    useEffect(() => {
        // If we chose a book suggestion we can skip the book cover search
        if (skipNextImageSearchRef.current) {
            skipNextImageSearchRef.current = false;
            return;
        }
        // Clear any existing timer
        if (searchTimerRef.current) {
            window.clearTimeout(searchTimerRef.current);
        }

        // Don't search if we're in manual mode
        if (imageSource === 'manual') return;

        const { isbn, title, author } = formData;

        // Only search if we have ISBN or both title and author
        if ((isbn && isbn.length >= 10) || (title.length > 2 && author.length > 2)) {
            setIsSearchingImage(true);

            // Set a debounce timer to avoid too many API calls
            searchTimerRef.current = window.setTimeout(async () => {
                await searchBookImage();
            }, 1000);
        }

        return () => {
            if (searchTimerRef.current) {
                window.clearTimeout(searchTimerRef.current);
            }
        };
    }, [formData.isbn, formData.title, formData.author]);

    // Effect to handle suggestions when title or author changes
    useEffect(() => {
        // Clear any existing timer
        if (suggestionTimerRef.current) {
            window.clearTimeout(suggestionTimerRef.current);
        }

        const { title, author } = formData;

        // Only search if we have meaningful input and suggestions are active
        if ((title.length >= 2 || author.length >= 2) && activeSuggestionField) {
            setIsLoadingSuggestions(true);

            // Set a debounce timer to avoid too many API calls
            suggestionTimerRef.current = window.setTimeout(async () => {
                await searchSuggestions();
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        return () => {
            if (suggestionTimerRef.current) {
                window.clearTimeout(suggestionTimerRef.current);
            }
        };
    }, [formData.title, formData.author, activeSuggestionField]);

    // Function to search for book suggestions
    const searchSuggestions = async () => {

        const { title, author } = formData;

        // Skip if this exact query was just made
        if (
            lastSuggestionQueryRef.current &&
            lastSuggestionQueryRef.current.title === title &&
            lastSuggestionQueryRef.current.author === author
        ) {
            return;
        }

        try {
            setIsLoadingSuggestions(true);

            const results = await searchCombinedSuggestions(title, author, 8); // change maxResults to get more book suggestions (limit is 40)
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
            setSelectedSuggestionIndex(-1);

            // Save the current query
            lastSuggestionQueryRef.current = { title, author };
        } catch (error) {
            console.error('Error searching for suggestions:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    // Function to search for book image using Google Books API
    const searchBookImage = async () => {
        try {
            setIsSearchingImage(true);
            const { isbn, title, author } = formData;

            // Only search if we have ISBN or both title and author
            if (!isbn && (!title || !author)) {
                setIsSearchingImage(false);
                return;
            }

            const coverUrl = await findBookCover(isbn, title, author);

            if (coverUrl) {
                setGoogleBooksImage(coverUrl);
                setImageSource('google_books');
            } else {
                setGoogleBooksImage(null);
                // Only clear image source if it was 'google_books'
                if (imageSource === 'google_books') {
                    setImageSource(null);
                }
            }
        } catch (error) {
            console.error('Error searching for book image:', error);
        } finally {
            setIsSearchingImage(false);
        }
    };

    // Handle suggestion selection
    const handleSuggestionSelect = (suggestion: BookSuggestion) => {
        setFormData(prev => ({
            ...prev,
            title: suggestion.title,
            author: suggestion.author,
            isbn: suggestion.isbn || ''
        }));

        skipNextImageSearchRef.current = true;

        // If suggestion has a cover image, use it
        if (suggestion.coverUrl) {
            setGoogleBooksImage(suggestion.coverUrl);
            setImageSource('google_books');
        }

        // Hide suggestions
        setShowSuggestions(false);
        setActiveSuggestionField(null);
        setSuggestions([]);

        // Clear any errors
        setErrors(prev => ({
            ...prev,
            title: undefined,
            author: undefined,
            isbn: undefined
        }));
    };

    // Handle keyboard navigation for suggestions
    const handleSuggestionKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0) {
                    handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setActiveSuggestionField(null);
                setSelectedSuggestionIndex(-1);
                break;
        }
    };

    // Handle input focus
    const handleInputFocus = (field: 'title' | 'author') => {
        setActiveSuggestionField(field);
        if (suggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    // Handle input blur (with delay to allow for suggestion clicks)
    const handleInputBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
            setActiveSuggestionField(null);
            setSelectedSuggestionIndex(-1);
        }, 150);
    };

    // Clear selected image
    const clearImage = () => {
        setUploadedS3Key(null);
        setGoogleBooksImage(null);
        setImageSource(null);

        // Clear any image errors
        if (errors.image) {
            setErrors(prev => ({ ...prev, image: undefined }));
        }
    };

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

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }

        // Reactivate suggestions if user types again
        if ((field === 'title' || field === 'author') && !activeSuggestionField) {
            setActiveSuggestionField(field);
        }
    };

    // Handle tab change
    const handleTabChange = (value: 'google' | 'manual') => {
        setActiveTab(value);

        if (value === 'google') {
            // Switch to Google Books image if available
            if (googleBooksImage) {
                setImageSource('google_books');
            } else {
                // Try to search for an image
                searchBookImage();
            }
        } else if (value === 'manual') {
            // Switch to manual image if available
            if (uploadedS3Key) {
                setImageSource('manual');
            } else {
                // Clear image source if no manual image
                setImageSource(null);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const attributes = await fetchUserAttributes();
            const sub = attributes.sub;
            const ownerEmail = attributes.email;

            if (!sub) {
                console.error('❌ Missing user sub (Cognito ID)');
                setErrors(prev => ({ ...prev, owner: 'User authentication error' }));
                return;
            }
            if (!ownerEmail) {
                console.error('❌ Missing user email');
                setErrors(prev => ({ ...prev, owner: 'User email not found' }));
                return;
            }

            // Prepare image data
            let imageUrl = null;

            try {
                if (imageSource === 'manual' && uploadedS3Key) {
                    // For manual uploads, use the S3 key from the FileUploader
                    imageUrl = uploadedS3Key;
                } else if (imageSource === 'google_books' && googleBooksImage) {
                    // For Google Books, use the URL directly
                    imageUrl = googleBooksImage;
                }
            } catch (error) {
                console.error('Error processing image:', error);
                setErrors(prev => ({
                    ...prev,
                    image: error instanceof Error ? error.message : 'Failed to process image'
                }));
                setIsSubmitting(false);
                return;
            }

            // Use the existing createBook helper and then pass to AddBook
            const bookData = {
                title: formData.title.trim(),
                author: formData.author.trim(),
                isbn: formData.isbn.trim() || null,
                owner: sub,
                ownerEmail: ownerEmail,
                createdAt: Math.floor(Date.now() / 1000), // Unix timestamp
                loanedOut: false,
                loanedTo: null,
                imageUrl: imageUrl,
                imageSource: imageSource
            };

            console.log("Bookdata: ", bookData);

            // Create book in document database
            const res = await client.models.Book.create(bookData);
            console.log("Bookdata res: ", res);

            // Check if book creation was successful
            if (!res.data?.id) {
                throw new Error('Book creation failed - no ID returned');
            }

            // After successful creation, add to index database
            try {
                // Optional: Get user's location for the index
                const coordinates = await getCurrentLocation();

                // Add book to the index database using the same ID
                await addBookToIndex({
                    id: res.data.id,
                    title: bookData.title,
                    author: bookData.author,
                    isbn: bookData.isbn
                }, coordinates);

                console.log('✅ Book successfully added to both databases');
            } catch (indexError) {
                // Log the error but don't fail the entire operation
                // The book was successfully created in the main database
                console.warn('⚠️ Book created in main database but failed to add to index:', indexError);

                // Optionally show a warning to the user
                setErrors(prev => ({
                    ...prev,
                    index: 'Book saved but may not appear in public search immediately'
                }));
            }

            setSubmitSuccess(true);

            // Redirect after success
            setTimeout(() => {
                navigate('/library');
            }, 2000);

        } catch (error) {
            console.error('Error creating book:', error);
            setErrors(prev => ({
                ...prev,
                owner: 'Failed to save book. Please try again.'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel/back
    const handleCancel = () => {
        navigate("/library");
    };

    if (submitSuccess) {
        return <SuccessMessage title={formData.title} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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

                <Card className="shadow-lg border-slate-200">
                    <CardHeader className="border-red-100">
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

                            <FormInputField
                                id="title"
                                label="Book Title *"
                                icon={<BookOpen className="w-4 h-4 mr-1.5 text-slate-500" />}
                                value={formData.title}
                                placeholder="Enter the book title"
                                error={errors.title}
                                isLoading={isLoadingSuggestions && activeSuggestionField === 'title'}
                                autoFocus
                                inputRef={titleInputRef}
                                onChange={(val) => handleInputChange('title', val)}
                                onFocus={() => handleInputFocus('title')}
                                onBlur={handleInputBlur}
                                onKeyDown={handleSuggestionKeyDown}
                            />

                            <FormInputField
                                id="author"
                                label="Author *"
                                icon={<User className="w-4 h-4 mr-1.5 text-slate-500" />}
                                value={formData.author}
                                placeholder="Enter the author's name"
                                error={errors.author}
                                isLoading={isLoadingSuggestions && activeSuggestionField === 'author'}
                                inputRef={authorInputRef}
                                onChange={(val) => handleInputChange('author', val)}
                                onFocus={() => handleInputFocus('author')}
                                onBlur={handleInputBlur}
                                onKeyDown={handleSuggestionKeyDown}
                            />

                            <BookSuggestionsDropdown
                                suggestions={suggestions}
                                show={showSuggestions}
                                selectedIndex={selectedSuggestionIndex}
                                onSelect={handleSuggestionSelect}
                                activeField={activeSuggestionField}
                                containerRef={suggestionContainerRef}
                            />

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

                            <ImageTabSwitcher
                                activeTab={activeTab}
                                onTabChange={handleTabChange}
                                imageSource={imageSource}
                                isSearchingImage={isSearchingImage}
                                googleBooksImage={googleBooksImage}
                                uploadedS3Key={uploadedS3Key}
                                onClearImage={clearImage}
                                onRefreshGoogleImage={searchBookImage}
                                onUploadStart={() => {
                                    setIsUploading(true);
                                    if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
                                }}
                                onUploadSuccess={(key) => {
                                    setIsUploading(false);
                                    setImageSource('manual');
                                    setUploadedS3Key(key);
                                }}
                                onUploadError={(msg) => {
                                    setIsUploading(false);
                                    setErrors(prev => ({ ...prev, image: msg }));
                                }}
                                imageError={errors.image}
                                canRefresh={!!formData.title && !!formData.author}
                            />

                            <Separator className="my-6" />

                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="order-2 sm:order-1"
                                    disabled={isSubmitting || isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="order-1 sm:order-2 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                    disabled={isSubmitting || isUploading}
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

                            {errors.owner && (
                                <div className="flex items-center text-sm text-red-600 mt-4 p-3 bg-red-50 rounded-md border border-red-100">
                                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>{errors.owner}</span>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                <HelpCard />
            </div>
        </div>
    );
};

export default AddBookForm;

