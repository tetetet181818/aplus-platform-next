"use client";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

const NotesListHeader = ({
  onToggleFilters,
  showFilters,
  itemCount,
  totalCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">تصفح الملخصات</h1>
        <p className="text-sm text-muted-foreground">
          {hasActiveFilters ? (
            <>
              عرض <span className="font-medium">{itemCount}</span> من أصل{" "}
              <span className="font-medium">{totalCount}</span> ملخص
            </>
          ) : (
            <>
              إجمالي الملخصات المتاحة:{" "}
              <span className="font-medium">{totalCount}</span>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-1.5"
          >
            <X className="h-4 w-4" />
            مسح الفلاتر
          </Button>
        )}
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={onToggleFilters}
          className="flex items-center gap-1.5"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}
        </Button>
      </div>
    </div>
  );
};

export default NotesListHeader;
