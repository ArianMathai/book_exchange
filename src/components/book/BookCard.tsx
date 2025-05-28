import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Book,
    User,
    Calendar,
    Hash,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {BookCardProps} from "@/components/book/bookTypes.ts";



const BookCard: React.FC<BookCardProps> = ({ book, className }) => {

    return (
        <Card className={cn(
            "group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-slate-200 hover:border-red-200",
            className
        )}>
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

            <Separator  />

            <CardFooter className="pt-4">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center text-xs text-slate-500">
                        <Book className="w-3 h-3 mr-1" />
                        <span>Owner: {book.ownerEmail}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                        View Details
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
export default BookCard;