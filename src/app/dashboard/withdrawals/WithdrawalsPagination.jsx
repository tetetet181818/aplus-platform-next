import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";

const WithdrawalsPagination = () => {
  const { page, totalPages, setPage, loading } = useWithdrawalsStore();

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === page ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          disabled={loading || i === page}
          className="min-w-9 h-9 p-0"
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={loading || page === 1}
          className="h-9 px-2"
        >
          <ChevronsRight className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={loading || page === 1}
          className="h-9 px-2"
        >
          <ChevronRight className="size-4" />
        </Button>

        {renderPageNumbers()}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={loading || page === totalPages}
          className="h-9 px-2"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={loading || page === totalPages}
          className="h-9 px-2"
        >
          <ChevronsLeft className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default WithdrawalsPagination;
