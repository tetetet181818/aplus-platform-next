import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="md:col-span-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث عن ملخصات، مواد، أو جامعات..."
            className="w-full pr-10 pl-4 h-12 text-lg rounded-lg shadow-sm focus:ring-2 focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
