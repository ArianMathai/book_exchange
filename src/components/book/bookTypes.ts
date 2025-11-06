// Book interface
export interface BookType {
    id: string;
    ownerEmail: string;
    title: string;
    author: string;
    isbn?: string | null;
    createdAt: string;
    loanedOut: boolean;
    loanedTo?: string | null;
    loanedToUsername?: string | null;
    imageUrl?: string | null;
    imageSource?: 'manual' | 'google_books' | null;
    ownerId?: string;
    isOriginalCopy?: boolean | null;
    originalOwnerId?: string | null;
    originalOwnerEmail?: string | null;
    originalOwnerUsername?: string | null;
    borrowStatus?: 'active' | 'returned' | 'overdue' | null;
}

// Book Card Component
export interface BookCardProps {
    book: BookType;
    distance?: number;
    className?: string;
}
