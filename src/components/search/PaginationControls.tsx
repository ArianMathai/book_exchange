// components/ui/PaginationControls.tsx
import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";

interface Props {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}

const PaginationControls: React.FC<Props> = ({ page, setPage, totalPages }) => {
    const maxVisiblePages = 5;

    const createPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            for (let i = 0; i < totalPages; i++) pages.push(i);
        } else {
            if (page <= 2) {
                pages.push(0, 1, 2, "...", totalPages - 1);
            } else if (page >= totalPages - 3) {
                pages.push(0, "...", totalPages - 3, totalPages - 2, totalPages - 1);
            } else {
                pages.push(0, "...", page, "...", totalPages - 1);
            }
        }

        return pages;
    };

    const pageNumbers = createPageNumbers();

    const goToPage = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== page) {
            setPage(newPage);
        }
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => goToPage(page - 1)}
                        className={page === 0 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {pageNumbers.map((p, idx) => (
                    <PaginationItem key={idx}>
                        {p === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                isActive={p === page}
                                onClick={() => goToPage(p as number)}
                            >
                                {(p as number) + 1}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => goToPage(page + 1)}
                        className={page === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationControls;
