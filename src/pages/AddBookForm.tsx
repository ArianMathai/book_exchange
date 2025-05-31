import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import {
    BookOpen,
    User,
    Hash,
    Save,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Loader2,
    Image as ImageIcon,
    Camera,
    Search,
    X,
    RefreshCw,
    Upload
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { client} from "@/lib/amplifyClient.ts";
import { fetchUserAttributes } from "aws-amplify/auth";
import { findBookCover } from '@/services/googleBooksApi';


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

const AddBookForm: React.FC = () => {
    const navigate = useNavigate();

    // User id for s3 image upload path

    const [formData, setFormData] = useState<BookFormData>({
        title: '',
        author: '',
        isbn: '',
    });

    // Image related state
    const [googleBooksImage, setGoogleBooksImage] = useState<string | null>(null);
    const [imageSource, setImageSource] = useState<ImageSource>(null);
    const [isSearchingImage, setIsSearchingImage] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("google");
    
    // FileUploader state
    const [uploadedS3Key, setUploadedS3Key] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Debounce timer for Google Books API search
    const searchTimerRef = useRef<number | null>(null);


    // Effect to search for book cover when ISBN or title+author changes
    useEffect(() => {
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

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Handle tab change
    const handleTabChange = (value: string) => {
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

            console.log("Bookdata: " ,bookData);

            const res = await client.models.Book.create(bookData);

            console.log("Bookdata res : ", res)

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

                            {/* Book Cover Image Section */}
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-slate-700 flex items-center">
                                        <ImageIcon className="w-4 h-4 mr-1.5 text-slate-500" />
                                        Book Cover
                                        <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
                                    </Label>
                                    
                                    {(imageSource || isSearchingImage) && (
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={clearImage}
                                            className="h-8 px-2 text-slate-500"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                
                                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="google" className="flex items-center">
                                            <Search className="w-4 h-4 mr-2" />
                                            Find Cover
                                        </TabsTrigger>
                                        <TabsTrigger value="manual" className="flex items-center">
                                            <Camera className="w-4 h-4 mr-2" />
                                            Upload Photo
                                        </TabsTrigger>
                                    </TabsList>
                                    
                                    {/* Google Books Cover Tab */}
                                    <TabsContent value="google" className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-600">
                                                {isSearchingImage 
                                                    ? "Searching for book cover..." 
                                                    : googleBooksImage 
                                                        ? "Cover found!" 
                                                        : "Enter ISBN or title and author to find cover"}
                                            </p>
                                            
                                            {!isSearchingImage && formData.title && formData.author && (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={searchBookImage}
                                                    className="h-8"
                                                >
                                                    <RefreshCw className="w-3 h-3 mr-2" />
                                                    Refresh
                                                </Button>
                                            )}
                                        </div>
                                        
                                        <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-center bg-slate-50 min-h-[200px]">
                                            {isSearchingImage ? (
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                                    <span className="text-sm">Searching...</span>
                                                </div>
                                            ) : googleBooksImage ? (
                                                <div className="relative">
                                                    <img 
                                                        src={googleBooksImage} 
                                                        alt="Book cover" 
                                                        className="max-h-[200px] rounded shadow-md" 
                                                    />
                                                    <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                                                        <Search className="w-3 h-3 mr-1" />
                                                        Google Books
                                                    </Badge>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Search className="w-8 h-8 mb-2" />
                                                    <span className="text-sm text-center">
                                                        {formData.title && formData.author 
                                                            ? "No cover found. Try entering an ISBN number." 
                                                            : "Enter book details to search for cover"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                    
                                    {/* Manual Upload Tab with FileUploader */}
                                    <TabsContent value="manual" className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-slate-600">
                                                Upload a photo of your book cover
                                            </p>
                                        </div>
                                        
                                        <div className="border border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 min-h-[200px]">
                                            {uploadedS3Key ? (
                                                <div className="relative flex flex-col items-center">
                                                    <div className="mb-2 text-green-600 flex items-center">
                                                        <CheckCircle className="w-5 h-5 mr-1" />
                                                        <span>Upload complete!</span>
                                                    </div>
                                                    <Badge className="mb-4 bg-purple-100 text-purple-800">
                                                        <Camera className="w-3 h-3 mr-1" />
                                                        Your Photo
                                                    </Badge>
                                                    <Button 
                                                        type="button" 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={clearImage}
                                                    >
                                                        Upload Different Image
                                                    </Button>
                                                </div>
                                            ) : (
                                                <FileUploader
                                                    acceptedFileTypes={['image/*']}
                                                    maxFileSize={5000000} // 5MB
                                                    maxFileCount={1} // Add the required maxFileCount prop
                                                    path={({ identityId }) => `bookImages/${identityId}/`}
                                                    isResumable={true}
                                                    onUploadStart={() => {
                                                        setIsUploading(true);
                                                        // Clear any existing errors
                                                        if (errors.image) {
                                                            setErrors(prev => ({ ...prev, image: undefined }));
                                                        }
                                                    }}
                                                    onUploadSuccess={(data) => {
                                                        setIsUploading(false);
                                                        setImageSource('manual');
                                                        // Add null check for data.key
                                                        if (data.key) {
                                                            setUploadedS3Key(data.key);
                                                        } else {
                                                            setErrors(prev => ({ 
                                                                ...prev, 
                                                                image: 'Failed to upload image: No file key returned' 
                                                            }));
                                                        }
                                                    }}
                                                    onUploadError={(error) => {
                                                        setIsUploading(false);
                                                        setErrors(prev => ({ 
                                                            ...prev, 
                                                            image: 'Failed to upload image: ' + error
                                                        }));
                                                    }}
                                                    components={{
                                                        Container: ({ children }) => (
                                                            <div className="w-full flex flex-col items-center">
                                                                {children}
                                                            </div>
                                                        ),
                                                        DropZone: ({ children }) => (
                                                            <div className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-red-300 transition-colors">
                                                                {children}
                                                            </div>
                                                        ),
                                                        FilePicker: ({ children, ...props }) => (
                                                            <div className="flex flex-col items-center">
                                                                <div className="mb-4 p-3 bg-slate-100 rounded-full">
                                                                    <Camera className="w-6 h-6 text-slate-400" />
                                                                </div>
                                                                <p className="text-sm text-slate-500 mb-4 text-center">
                                                                    Drag and drop a photo here, or click to select
                                                                </p>
                                                                <Button 
                                                                    type="button" 
                                                                    variant="outline" 
                                                                    onClick={props.onClick}
                                                                >
                                                                    <Upload className="w-4 h-4 mr-2" />
                                                                    Select Photo
                                                                </Button>
                                                                {children}
                                                            </div>
                                                        )
                                                    }}
                                                />
                                            )}
                                        </div>
                                        
                                        {errors.image && (
                                            <div className="flex items-center text-sm text-red-600 mt-1">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.image}
                                            </div>
                                        )}
                                        
                                        <p className="text-xs text-slate-500">
                                            Accepted formats: JPEG, PNG, WebP, GIF. Max size: 5MB.
                                        </p>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <Separator className="my-6" />

                            {/* Form Actions */}
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
                                    Adding an ISBN or detailed title/author information helps us find the book cover automatically.
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
