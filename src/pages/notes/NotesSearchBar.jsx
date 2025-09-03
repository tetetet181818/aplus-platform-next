import { FileText, Search as SearchIcon, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function NotesSearchBar({
  searchQuery,
  setSearchQuery,
  setSearchType,
  searchType,
}) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form
      onSubmit={handleSearchSubmit}
      className="relative flex w-full items-center gap-2"
    >
      <div className="relative flex w-full items-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus-within:ring-2 focus-within:ring-primary px-3">
        <SearchIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="search"
          placeholder={
            searchType === "file"
              ? "ابحث عن ملخصات، مواد، أو جامعات..."
              : "ابحث عن المستخدمين..."
          }
          className="flex-grow border-none bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus:shadow-none focus:border-none pr-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Select onValueChange={(value) => setSearchType(value)}>
        <SelectTrigger className="w-[60px]">
          <SearchIcon className="size-5" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">
            <User className="size-5" />
            <span>المستخدم</span>
          </SelectItem>
          <SelectItem value="file">
            <FileText className="size-5" />
            <span>ملخصات</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
}
