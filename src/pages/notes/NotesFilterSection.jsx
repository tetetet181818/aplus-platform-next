import { motion } from "framer-motion";
import FilterPanel from "@/components/notes/FilterPanel";

export default function NotesFilterSection({
  filters,
  onFilterChange,
  onClearFilters,
  universities,
  years,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <FilterPanel
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        universities={universities}
        years={years}
      />
    </motion.div>
  );
}
