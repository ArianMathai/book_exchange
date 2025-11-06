import React from 'react';
import { BookSuggestion } from '@/services/googleBooksApi';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

interface BookSuggestionsDropdownProps {
    suggestions: BookSuggestion[];
    show: boolean;
    selectedIndex: number;
    onSelect: (suggestion: BookSuggestion) => void;
    activeField: 'title' | 'author' | null;
    containerRef?: React.RefObject<HTMLDivElement>;
}

const BookSuggestionsDropdown: React.FC<BookSuggestionsDropdownProps> = ({
                                                                             suggestions,
                                                                             show,
                                                                             selectedIndex,
                                                                             onSelect,
                                                                             containerRef,
                                                                         }) => {
    if (!show || suggestions.length === 0) return null;

    // This will render the dropdown near the top of the screen
    const style: React.CSSProperties = {
        position: 'fixed',
        top: '64px', // adjust to just below your nav (your nav is ~64px tall)
        left: '0',
        width: '100%',
        zIndex: 1000,
        maxHeight: '25vh',
        overflowY: 'auto',
    };

    const dropdown = (
        <div
            ref={containerRef}
            className="bg-white border border-slate-200 rounded-b-lg shadow-xl"
            style={style}
        >
            <div className="p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Book Suggestions
          </span>
                    <Badge variant="secondary" className="text-xs">
                        {suggestions.length} found
                    </Badge>
                </div>

                {suggestions.map((suggestion, index) => (
                    <div
                        key={suggestion.id}
                        onClick={() => onSelect(suggestion)}
                        className={cn(
                            "flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
                            selectedIndex === index
                                ? "bg-red-50 border border-red-200"
                                : "hover:bg-slate-50"
                        )}
                    >
                        <div className="flex-shrink-0 w-12 h-16 bg-slate-100 rounded border overflow-hidden">
                            {suggestion.coverUrl ? (
                                <img
                                    src={suggestion.coverUrl}
                                    alt="Book cover"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-slate-400" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 truncate">{suggestion.title}</div>
                            <div className="text-sm text-slate-600 truncate">by {suggestion.author}</div>
                            <div className="flex items-center space-x-2 mt-1">
                                {suggestion.isbn && (
                                    <Badge variant="outline" className="text-xs font-mono">
                                        {suggestion.isbn}
                                    </Badge>
                                )}
                                {suggestion.publishedDate && (
                                    <span className="text-xs text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                                        {suggestion.publishedDate.split('-')[0]}
                  </span>
                                )}
                            </div>
                        </div>

                        <ChevronDown className="w-4 h-4 text-slate-400 transform rotate-[-90deg]" />
                    </div>
                ))}
            </div>
        </div>
    );

    return createPortal(dropdown, document.body);
};

export default BookSuggestionsDropdown;