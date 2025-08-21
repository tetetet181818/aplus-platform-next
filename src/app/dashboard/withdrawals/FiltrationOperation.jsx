"use client";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";
import { statusLabelMap } from "@/constants";

export default function FiltrationOperation() {
  const { getWithdrawals, setPage } = useWithdrawalsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filtersChanged, setFiltersChanged] = useState(false);

  const handleSearch = useCallback(() => {
    if (!filtersChanged) return;

    setPage(1);
    getWithdrawals({
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    });
    setFiltersChanged(false);
  }, [
    filtersChanged,
    searchQuery,
    statusFilter,
    dateFrom,
    dateTo,
    setPage,
    getWithdrawals,
  ]);

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setStatusFilter(null);
    setDateFrom("");
    setDateTo("");
    setPage(1);
    getWithdrawals({});
    setFiltersChanged(false);
  }, [setPage, getWithdrawals]);

  const handleFilterChange = useCallback((setter, value) => {
    setter(value);
    setFiltersChanged(true);
  }, []);

  return (
    <div className="flex flex-col gap-4 mb-6 p-4 bg-card rounded-lg border shadow-sm">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث بالاسم, البنك, IBAN..."
          className="pl-10 pr-4 py-2 w-full"
          value={searchQuery}
          onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="w-full sm:w-[180px]">
          <Select
            value={statusFilter ?? "all"}
            onValueChange={(value) =>
              handleFilterChange(
                setStatusFilter,
                value === "all" ? null : value
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="حالة الطلب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {Object.entries(statusLabelMap)?.map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date inputs - stack on mobile, inline on larger screens */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <Input
            type="date"
            placeholder="من تاريخ"
            className="w-full sm:w-[150px]"
            value={dateFrom}
            onChange={(e) => handleFilterChange(setDateFrom, e.target.value)}
          />

          <Input
            type="date"
            placeholder="إلى تاريخ"
            className="w-full sm:w-[150px]"
            value={dateTo}
            onChange={(e) => handleFilterChange(setDateTo, e.target.value)}
            min={dateFrom}
          />
        </div>

        {/* Buttons - full width on mobile, auto width on larger screens */}
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={handleSearch}
            className="flex-1 sm:flex-none sm:w-[120px]"
            disabled={!filtersChanged}
          >
            <Search className="h-4 w-4 ml-2" />
            بحث
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 sm:flex-none sm:w-[120px]"
            disabled={!searchQuery && !statusFilter && !dateFrom && !dateTo}
          >
            <X className="h-4 w-4 ml-2" />
            إعادة تعيين
          </Button>
        </div>
      </div>
    </div>
  );
}
