import { motion } from "framer-motion";
import FilterPanelContainer from "@/components/notes/FilterPanelContainer";

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
      <FilterPanelContainer
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        universities={universities}
        years={years}
      />
    </motion.div>
  );
}
