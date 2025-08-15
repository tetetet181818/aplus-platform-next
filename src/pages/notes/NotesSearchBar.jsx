import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function NotesSearchBar({ searchQuery, setSearchQuery }) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative flex-grow w-full">
      <SearchIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="ابحث عن ملخصات، مواد، أو جامعات..."
        className="w-full pr-10 pl-4 h-12 text-base rounded-lg shadow-sm focus:ring-2 focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
}
