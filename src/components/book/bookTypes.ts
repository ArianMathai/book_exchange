// Book interface
export interface BookType {
    id?: string;
    ownerEmail: string;
    title: string;
    author: string;
    isbn?: string | null;
    createdAt: number;
    loanedOut: boolean;
    loanedTo?: string | null;
}

// Book Card Component
export interface BookCardProps {
    book: BookType;
    className?: string;
}