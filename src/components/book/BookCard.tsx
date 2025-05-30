import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Book,
    User,
    Calendar,
    Hash,
    CheckCircle,
    AlertCircle,
    Image as ImageIcon,
    Camera,
    Search,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookCardProps } from "@/components/book/bookTypes.ts";
import { getUrl } from "aws-amplify/storage";

const BookCard: React.FC<BookCardProps> = ({ book, className }) => {
    console.log("book: ",book);
    const [imageLoading, setImageLoading] = useState(book.imageUrl ? true : false);
    const [imageError, setImageError] = useState(false);
    const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);
    const [isResolvingUrl, setIsResolvingUrl] = useState(book.imageUrl && book.imageSource === 'manual');

    const hasImage = resolvedImageUrl && !imageError;



    
    // Resolve S3 URLs for manual uploads
    useEffect(() => {
        const resolveImageUrl = async () => {
            console.log('Starting resolveImageUrl, imageUrl:', book.imageUrl, 'source:', book.imageSource);
            if (!book.imageUrl) {
                console.log('No imageUrl, setting to null');
                setResolvedImageUrl(null);
                return;
            }

            try {
                if (book.imageSource === 'google_books') {
                    console.log('Google Books URL:', book.imageUrl);
                    setResolvedImageUrl(book.imageUrl);
                    return;
                }

                if (book.imageSource === 'manual') {
                    setIsResolvingUrl(true);
                    console.log('Manual source, checking if S3 key:', book.imageUrl);

                    if (book.imageUrl.startsWith('bookImages/')) {
                        console.log('Fetching signed URL for:', book.imageUrl);
                        try {
                            const { url } = await getUrl({
                                path: book.imageUrl,
                                options: {
                                    validateObjectExistence: true,
                                    expiresIn: 3600
                                }
                            });
                            console.log('Signed URL:', url.toString());
                            setResolvedImageUrl(url.toString());
                        } catch (error) {
                            console.error('Error getting signed URL:', error);
                            setImageError(true);
                        }
                    } else {
                        console.log('Not an S3 key, using directly:', book.imageUrl);
                        setResolvedImageUrl(book.imageUrl);
                    }

                    setIsResolvingUrl(false);
                } else {
                    console.log('Default case, using URL directly:', book.imageUrl);
                    setResolvedImageUrl(book.imageUrl);
                }
            } catch (error) {
                console.error('Error resolving image URL:', error);
                setImageError(true);
                setIsResolvingUrl(false);
            }
        };

        resolveImageUrl();
    }, [book.imageUrl, book.imageSource]);
    
    // Function to handle image load success
    const handleImageLoad = () => {
        setImageLoading(false);
    };
    
    // Function to handle image load error
    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    // Function to get source badge text and icon
    const getSourceBadge = () => {
        if (!book.imageSource) return null;
        
        switch (book.imageSource) {
            case 'manual':
                return {
                    icon: <Camera className="w-3 h-3 mr-1" />,
                    text: 'Manual',
                    className: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                };
            case 'google_books':
                return {
                    icon: <Search className="w-3 h-3 mr-1" />,
                    text: 'Google Books',
                    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                };
            default:
                return null;
        }
    };
    
    const sourceBadge = getSourceBadge();

    useEffect(() => {
        console.log("Resimgurl ",resolvedImageUrl);

    }, [resolvedImageUrl]);

    return (
        <Card className={cn(
            "group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-slate-200 hover:border-red-200",
            className
        )}>
            <div className="flex flex-col sm:flex-row">
                {/* Book Cover Image Section */}
                <div className="w-full sm:w-[100px] flex-shrink-0 p-3 sm:p-4">
                    <div className="relative w-full sm:w-[100px] h-[150px] sm:h-[150px] bg-slate-100 rounded-md overflow-hidden">
                        {(imageLoading || isResolvingUrl) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                            </div>
                        )}
                        
                        {hasImage ? (
                            <>
                                <img
                                    src={resolvedImageUrl}
                                    alt={`Cover of ${book.title} by ${book.author}`}
                                    className="w-full h-full object-cover rounded-md shadow-sm"
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    style={{ display: (imageLoading || isResolvingUrl) ? 'none' : 'block' }}
                                />
                                {sourceBadge && (
                                    <Badge 
                                        variant="secondary" 
                                        className={cn("absolute top-1 right-1 text-[10px]", sourceBadge.className)}
                                    >
                                        {sourceBadge.icon}
                                        {sourceBadge.text}
                                    </Badge>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 rounded-md">
                                <ImageIcon className="w-12 h-12 text-slate-300" />
                                <span className="text-xs text-slate-400 mt-2">No cover</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Book Information Section */}
                <div className="flex-1 flex flex-col min-w-0">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-red-900 transition-colors duration-300 line-clamp-2">
                                    {book.title}
                                </CardTitle>
                                <CardDescription className="flex items-center mt-2 text-slate-600">
                                    <User className="w-4 h-4 mr-1.5 flex-shrink-0" />
                                    <span className="truncate">{book.author}</span>
                                </CardDescription>
                            </div>
                            <div className="ml-3 flex-shrink-0">
                                {book.loanedOut ? (
                                    <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Loaned
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Available
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pb-3">
                        <div className="space-y-3">
                            {book.isbn && (
                                <div className="flex items-center text-sm text-slate-600">
                                    <Hash className="w-4 h-4 mr-2 text-slate-400" />
                                    <span className="font-mono">{book.isbn}</span>
                                </div>
                            )}

                            <div className="flex items-center text-sm text-slate-600">
                                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                Added {new Date(book.createdAt * 1000).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}
                            </div>

                            {book.loanedOut && book.loanedTo && (
                                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                    <p className="text-sm text-red-700">
                                        <span className="font-medium">Loaned to:</span> {book.loanedTo}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <div className="mt-auto">
                        <Separator  />

                        <CardFooter className="pt-4">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center text-xs text-slate-500">
                                    <Book className="w-3 h-3 mr-1" />
                                    <span>{book.ownerEmail}</span>
                                </div>
                            </div>
                        </CardFooter>
                    </div>
                </div>
            </div>
        </Card>
    );
};
export default BookCard;
