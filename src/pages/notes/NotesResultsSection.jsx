import { BookOpen, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotesGrid from "@/components/notes/NotesGrid";
import NoResults from "@/components/shared/NoResults";

export default function NotesResultsSection({
  filteredNotes,
  hasActiveFilters,
  onClearFilters,
}) {
  if (filteredNotes?.length > 0) {
    return <NotesGrid notes={filteredNotes} />;
  }

  if (filteredNotes?.length === 0) {
    return (
      <NoResults
        icon={<BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />}
        title="لا توجد ملخصات"
        message={
          hasActiveFilters
            ? "لم يتم العثور على ملخصات تطابق معايير البحث الحالية."
            : "لا توجد ملخصات متاحة في الوقت الحالي."
        }
        actionButton={
          hasActiveFilters ? (
            <Button
              onClick={onClearFilters}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FilterX className="h-4 w-4" />
              مسح الفلاتر والبحث
            </Button>
          ) : null
        }
      />
    );
  }
}
