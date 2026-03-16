import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface PaginationControlsProps {
  paginationData: PaginationData;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
}

export function PaginationControls({
  paginationData,
  onPageChange,
  className,
  showFirstLast = true,
}: PaginationControlsProps) {
  const {
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    hasNext,
    hasPrevious,
  } = paginationData;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 2; i <= Math.min(maxVisiblePages, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("ellipsis");
        for (let i = totalPages - (maxVisiblePages - 1); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate showing range
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalElements);

  if (totalPages <= 1) return null;

  return (
    <div className={cn("mt-4 space-y-3", className)}>
      {/* Info text */}
      <div className="mx-auto w-fit rounded-md border border-border/60 bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{startItem}</span> to{" "}
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{totalElements}</span>{" "}
        results
      </div>

      {/* Mobile pagination */}
      <div className="flex items-center justify-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => hasPrevious && onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className={cn(
            "h-8 rounded-md border px-3 text-xs font-medium transition-colors",
            hasPrevious
              ? "border-border bg-card hover:bg-muted"
              : "border-border/50 bg-muted/20 text-muted-foreground cursor-not-allowed",
          )}
        >
          Prev
        </button>

        <div className="min-w-20 rounded-md border border-border/60 bg-card px-3 py-1.5 text-center text-xs font-medium">
          {currentPage} / {totalPages}
        </div>

        <button
          type="button"
          onClick={() => hasNext && onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className={cn(
            "h-8 rounded-md border px-3 text-xs font-medium transition-colors",
            hasNext
              ? "border-border bg-card hover:bg-muted"
              : "border-border/50 bg-muted/20 text-muted-foreground cursor-not-allowed",
          )}
        >
          Next
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:block">
        <Pagination>
          <PaginationContent className="rounded-lg border border-border/60 bg-card px-1.5 py-1">
            {/* First page button */}
            {showFirstLast && currentPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(1)}
                  className="h-8 rounded-md px-2 text-xs"
                >
                  <span className="text-xs">First</span>
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Previous button */}
            {hasPrevious && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(currentPage - 1)}
                  className="h-8 rounded-md"
                />
              </PaginationItem>
            )}

            {/* Page numbers */}
            {pageNumbers.map((page, index) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                    className={cn(
                      "h-8 min-w-8 rounded-md px-2 text-xs",
                      currentPage === page && "pointer-events-none",
                    )}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            {/* Next button */}
            {hasNext && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(currentPage + 1)}
                  className="h-8 rounded-md"
                />
              </PaginationItem>
            )}

            {/* Last page button */}
            {showFirstLast && currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => onPageChange(totalPages)}
                  className="h-8 rounded-md px-2 text-xs"
                >
                  <span className="text-xs">Last</span>
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
