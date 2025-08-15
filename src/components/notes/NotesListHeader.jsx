import { Button } from "@/components/ui/button";
import { SlidersHorizontal, FilterX } from "lucide-react";

const NotesListHeader = ({
  onToggleFilters,
  showFilters,
  itemCount,
  totalCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          تصفح الملخصات
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {hasActiveFilters
            ? `تم العثور على ${itemCount} ملخص من أصل ${totalCount}`
            : `متوفر ${totalCount} ملخص`}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <FilterX className="h-4 w-4" />
            مسح الفلاتر
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
        </Button>
      </div>
    </div>
  );
};

export default NotesListHeader;
