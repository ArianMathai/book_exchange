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
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BookCardProps } from "@/components/book/bookTypes.ts";
import { getUrl } from "aws-amplify/storage";

const BookCard: React.FC<BookCardProps> = ({ book, className }) => {

    const [imageLoading, setImageLoading] = useState(book.imageUrl ? true : false);
    const [imageError, setImageError] = useState(false);
    const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);
    const [isResolvingUrl, setIsResolvingUrl] = useState(book.imageUrl && book.imageSource === 'manual');

    const hasImage = resolvedImageUrl && !imageError;


    // Resolve S3 URLs for manual uploads
    useEffect(() => {
        const resolveImageUrl = async () => {
            if (!book.imageUrl) {
                setResolvedImageUrl(null);
                return;
            }

            try {
                if (book.imageSource === 'google_books') {
                    setResolvedImageUrl(book.imageUrl);
                    return;
                }

                if (book.imageSource === 'manual') {
                    setIsResolvingUrl(true);

                    if (book.imageUrl.startsWith('bookImages/')) {
                        try {
                            const {url} = await getUrl({
                                path: book.imageUrl,
                                options: {
                                    validateObjectExistence: true,
                                    expiresIn: 3600
                                }
                            });
                            setResolvedImageUrl(url.toString());
                        } catch (error) {
                            console.error('Error getting signed URL:', error);
                            setImageError(true);
                        }
                    } else {
                        setResolvedImageUrl(book.imageUrl);
                    }

                    setIsResolvingUrl(false);
                } else {
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


    return (
        <Card className={cn(
            "group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-slate-200 hover:border-red-200",
            className
        )}>
            <div className="flex flex-row">
                {/* Book Cover Image Section */}
                <div className="w-[80px] sm:w-[100px] flex-shrink-0 p-2 sm:p-4">
                    {/* Consistent horizontal layout for all screen sizes */}
                    <div className="relative w-[80px] sm:w-[100px] h-[120px] sm:h-[150px] bg-slate-100 rounded-md overflow-hidden">
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
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 rounded-md">
                                <ImageIcon className="w-12 h-12 text-slate-300" />
                                <span className="text-xs text-slate-400 mt-2 text-center">No cover</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Book Information Section */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <CardHeader className="pb-3 pt-3 sm:pt-6">
                        <div className="flex items-start gap-2 sm:gap-3 w-full max-w-full overflow-hidden">
                            {/* Left: Title + Author */}
                            <div className="flex-1 min-w-0">
                                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-900 transition-colors duration-300 line-clamp-2 break-words">
                                    {book.title}
                                </CardTitle>

                                <CardDescription className="flex items-center mt-1 sm:mt-2 text-slate-600 min-w-0">
                                    <User className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-1.5 flex-shrink-0" />
                                    <span className="truncate text-sm sm:text-base">{book.author}</span>
                                </CardDescription>
                            </div>

                            {/* Right: Availability Badge */}
                            <div className="flex-shrink-0">
                                {book.loanedOut ? (
                                    <Badge className="max-w-[120px] truncate text-ellipsis whitespace-nowrap bg-red-100 text-red-800 text-xs sm:text-sm">
                                        <AlertCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-0.5 sm:mr-1" />
                                        Loaned Out
                                    </Badge>
                                ) : (
                                    <Badge className="max-w-[120px] truncate text-ellipsis whitespace-nowrap bg-green-100 text-green-800 text-xs sm:text-sm">
                                        <CheckCircle className="w-3.5 sm:w-4 h-3.5 sm:h-4 mr-0.5 sm:mr-1" />
                                        Available
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pb-2 sm:pb-3 flex-1">
                        <div className="space-y-2 sm:space-y-3">
                            {book.isbn && (
                                <div className="flex items-center text-xs sm:text-sm text-slate-600 min-w-0">
                                    <Hash className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2 text-slate-400 flex-shrink-0" />
                                    <span className="font-mono truncate">{book.isbn}</span>
                                </div>
                            )}

                            <div className="flex items-center text-xs sm:text-sm text-slate-600">
                                <Calendar className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2 text-slate-400 flex-shrink-0" />
                                <span className="truncate">
                                Added {new Date(book.createdAt * 1000).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                            </div>

                            {book.loanedOut && book.loanedTo && (
                                <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-100">
                                    <p className="text-xs sm:text-sm text-red-700 break-words">
                                        <span className="font-medium">Loaned to:</span> {book.loanedTo}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <div className="mt-auto">
                        <Separator />
                        <CardFooter className="pt-3 sm:pt-4">
                            <div className="flex items-center justify-between w-full min-w-0">
                                <div className="flex items-center text-xs text-slate-500 min-w-0">
                                    <Book className="w-2.5 sm:w-3 h-2.5 sm:h-3 mr-1 flex-shrink-0" />
                                    <span className="truncate">{book.ownerEmail}</span>
                                </div>
                            </div>
                        </CardFooter>
                    </div>
                </div>
            </div>
        </Card>
    );
}
export default BookCard;