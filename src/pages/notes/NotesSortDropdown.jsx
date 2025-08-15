import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotesSortDropdown({ sortBy, onSortChange }) {
  return (
    <div className="w-full md:w-auto md:min-w-[200px]">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full  text-sm py-6">
          <ArrowUpDown className="h-4 w-4 ml-2 text-muted-foreground" />
          <SelectValue placeholder="ترتيب حسب..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">الافتراضي</SelectItem>
          <SelectItem value="downloads_desc">الأكثر تحميلًا</SelectItem>
          <SelectItem value="price_asc">السعر: من الأقل للأعلى</SelectItem>
          <SelectItem value="price_desc">السعر: من الأعلى للأقل</SelectItem>
          <SelectItem value="date_desc">الأحدث</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
