"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFileStore } from "@/stores/useFileStore";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import NotesListHeader from "./NotesListHeader";
import NotesSearchBar from "./NotesSearchBar";
import NotesSortDropdown from "./NotesSortDropdown";
import NotesFilterSection from "./NotesFilterSection";
import NotesResultsSection from "./NotesResultsSection";
import Pagination from "@/components/ui/Pagination";
export const metaData = {
  title: "تصفح وابحث عن الملخصات",
  description: "تصفح وابحث عن أفضل الملخصات الدراسية الجامعية",
  keywords: ["ملخصات دراسية", "جامعة", "ملخصات جامعية", "دروس", "محاضرات"],
};
const NotesListPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const searchTimeoutRef = useRef(null);
  const itemsPerPage = 10;
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);
  const {
    files,
    loading: isLoadingNotes,
    searchNotes,
    universities,
    getCollegesByUniversity,
    totalNotes,
  } = useFileStore();

  const [filters, setFilters] = useState({
    university: searchParams.get("university") || "",
    college: searchParams.get("college") || "",
    year: searchParams.get("year") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    subject: searchParams.get("subject") || "",
    sortBy: searchParams.get("sortBy") || "default",
  });

  // Initialize state from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);
    setShowFilters(
      Boolean(
        searchParams.get("university") ||
          searchParams.get("college") ||
          searchParams.get("year") ||
          searchParams.get("maxPrice")
      )
    );
  }, [searchParams]);

  const performSearch = useCallback(async () => {
    try {
      await searchNotes(searchQuery, filters, currentPage, itemsPerPage);
      setError(null);
    } catch (err) {
      setError("فشل في تحميل الملاحظات");
      console.error("Error:", err);
    } finally {
      setIsTyping(false);
    }
  }, [searchQuery, filters, currentPage, searchNotes]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsTyping(true);
    searchTimeoutRef.current = setTimeout(performSearch, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [performSearch]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (currentPage > 1) params.set("page", currentPage);

    Object.entries(filters).forEach(([key, value]) => {
      if (value && (key !== "sortBy" || value !== "default")) {
        params.set(key, value);
      }
    });

    router.replace(`?${params.toString()}`);
  }, [searchQuery, filters, currentPage, router]);

  // Fetch colleges when university changes
  useEffect(() => {
    const fetchColleges = async () => {
      if (!filters?.university) return;
      try {
        await getCollegesByUniversity(filters?.university);
      } catch (err) {
        console.error("Error fetching colleges:", err);
      }
    };

    fetchColleges();
  }, [filters?.university, getCollegesByUniversity]);

  const years = useMemo(
    () =>
      [...new Set(files.map((note) => note.year).filter(Boolean))].sort(
        (a, b) => b - a
      ),
    [files]
  );

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (value) => handleFilterChange("sortBy", value),
    [handleFilterChange]
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = useCallback(() => {
    setFilters({
      university: "",
      college: "",
      year: "",
      maxPrice: "",
      subject: "",
      sortBy: "default",
    });
    setSearchQuery("");
    setCurrentPage(1);
    setShowFilters(false);
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      Object.entries(filters).some(
        ([key, value]) => value && (key !== "sortBy" || value !== "default")
      ) || searchQuery,
    [filters, searchQuery]
  );

  if (isLoadingNotes && !isTyping) {
    return <LoadingSpinner message="جاري تحميل الملخصات..." />;
  }

  if (error && !isTyping) {
    return (
      <div className=" py-12 px-4 md:px-6">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className=" py-12 px-4 md:px-6">
        <NotesListHeader
          onToggleFilters={toggleFilters}
          showFilters={showFilters}
          itemCount={files.length}
          totalCount={totalNotes || 0}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <NotesSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoading={isTyping}
          />
          <NotesSortDropdown
            sortBy={filters.sortBy}
            onSortChange={handleSortChange}
          />
        </div>

        {showFilters && (
          <div className="mb-6 transition-all duration-300 ease-in-out">
            <NotesFilterSection
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              universities={universities}
              years={years}
            />
          </div>
        )}

        {isLoadingNotes ? (
          <LoadingSpinner message="جاري البحث..." />
        ) : (
          <>
            <NotesResultsSection
              filteredNotes={files}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />

            {totalNotes > itemsPerPage && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalNotes / itemsPerPage)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NotesListPage;
