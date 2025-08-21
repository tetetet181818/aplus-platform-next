import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";

const PageSizeSelector = () => {
  const { pageSize, setPageSize, getWithdrawals, filters } =
    useWithdrawalsStore();

  const handlePageSizeChange = (newSize) => {
    setPageSize(parseInt(newSize));
    // Reset to first page when changing page size
    getWithdrawals(filters, 1);
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="page-size">Rows per page</Label>
      <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PageSizeSelector;
