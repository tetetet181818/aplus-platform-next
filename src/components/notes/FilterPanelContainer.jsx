import FilterPanel from "@/components/notes/FilterPanel";

export default function FilterPanelContainer({
  filters,
  onFilterChange,
  onClearFilters,
  universities,
  years,
}) {
  return (
    <FilterPanel
      filters={filters}
      onFilterChange={onFilterChange}
      onClearFilters={onClearFilters}
      universities={universities}
      years={years}
    />
  );
}
