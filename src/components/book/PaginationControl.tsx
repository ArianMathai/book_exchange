import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationControlProps {
  // Current page number (1-based)
  currentPage: number;
  
  // Function to handle going to the previous page
  onPreviousPage: () => void;
  
  // Function to handle going to the next page
  onNextPage: () => void;
  
  // Whether there is a next page available
  hasNextPage: boolean;
  
  // Total number of pages (if known)
  totalPages?: number;
  
  // Additional CSS classes
  className?: string;
}

/**
 * PaginationControl component for Amplify token-based pagination
 * 
 * This component works with Amplify's token-based pagination system,
 * displaying a user-friendly page number interface while handling
 * the complexity of token-based navigation.
 */
const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  onPreviousPage,
  onNextPage,
  hasNextPage,
  totalPages,
  className = '',
}) => {
  // If we only have one page, don't show pagination
  if (currentPage === 1 && !hasNextPage) {
    return null;
  }

  // Generate array of page numbers to show
  const generatePageNumbers = () => {
    const pageNumbers: (number | 'ellipsis')[] = [];
    
    // If we don't know the total pages, just show current page and ellipsis if needed
    if (!totalPages) {
      pageNumbers.push(currentPage);
      if (hasNextPage) {
        pageNumbers.push('ellipsis');
      }
      return pageNumbers;
    }
    
    // We know the total pages, so we can show a more complete pagination UI
    const maxPagesToShow = 5; // Maximum number of page links to show
    
    if (totalPages <= maxPagesToShow) {
      // If we have few pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // We have many pages, so we need to be selective
      pageNumbers.push(1); // Always show first page
      
      if (currentPage > 3) {
        pageNumbers.push('ellipsis');
      }
      
      // Pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('ellipsis');
      }
      
      pageNumbers.push(totalPages); // Always show last page
    }
    
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                onPreviousPage();
              }
            }}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink 
                isActive={page === currentPage}
                // We don't implement direct page jumping with token-based pagination
                // as it would require storing all tokens
                className={page === currentPage ? 'pointer-events-none' : 'cursor-default'}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext 
            onClick={(e) => {
              e.preventDefault();
              if (hasNextPage) {
                onNextPage();
              }
            }}
            className={!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            aria-disabled={!hasNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationControl;
