import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Loader2,
    Search,
    RefreshCw,
} from 'lucide-react';

interface GoogleBooksCoverProps {
    image: string | null;
    isSearching: boolean;
    onRefresh: () => void;
    canRefresh: boolean;
}

const GoogleBooksCover: React.FC<GoogleBooksCoverProps> = ({
                                                               image,
                                                               isSearching,
                                                               onRefresh,
                                                               canRefresh,
                                                           }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                    {isSearching
                        ? 'Searching for book cover...'
                        : image
                            ? 'Cover found!'
                            : 'Enter ISBN or title and author to find cover'}
                </p>
                {!isSearching && canRefresh && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className="h-8"
                    >
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Refresh
                    </Button>
                )}
            </div>

            <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-center bg-slate-50 min-h-[200px]">
                {isSearching ? (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-sm">Searching...</span>
                    </div>
                ) : image ? (
                    <div className="relative">
                        <img
                            src={image}
                            alt="Book cover"
                            className="max-h-[200px] rounded shadow-md"
                        />
                        <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                            <Search className="w-3 h-3 mr-1" />
                            Google Books
                        </Badge>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 text-center">
                        <Search className="w-8 h-8 mb-2" />
                        <span className="text-sm">
              No cover found. Try entering an ISBN number or more complete title and author.
            </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoogleBooksCover;
