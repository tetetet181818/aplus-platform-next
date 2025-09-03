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
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [searchType, setSearchType] = useState(
    searchParams.get("type") || "file"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const searchTimeoutRef = useRef(null);
  const itemsPerPage = 10;

  const toggleFilters = useCallback(() => setShowFilters((prev) => !prev), []);

  const {
    files,
    loading: isLoadingNotes,
    searchNotes,
    universities,
    getCollegesByUniversity,
    totalNotes,
    searchUsers,
    users,
    totalUsers,
    loading: isLoadingUsers,
  } = useFileStore();

  const [filters, setFilters] = useState({
    university: searchParams.get("university") || "",
    college: searchParams.get("college") || "",
    year: searchParams.get("year") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    subject: searchParams.get("subject") || "",
    sortBy: searchParams.get("sortBy") || "default",
  });

  // init page + filters
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

  // main search handler
  const performSearch = useCallback(async () => {
    try {
      if (searchType === "file") {
        await searchNotes(searchQuery, filters, currentPage, itemsPerPage);
      } else {
        await searchUsers(searchQuery, currentPage, itemsPerPage);
      }
      setError(null);
    } catch (err) {
      setError("فشل في تحميل النتائج");
      console.error("Error:", err);
    } finally {
      setIsTyping(false);
      setIsInitialLoad(false);
    }
  }, [searchQuery, filters, currentPage, searchNotes, searchUsers, searchType]);

  // debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setIsTyping(true);
    searchTimeoutRef.current = setTimeout(performSearch, 500);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [performSearch]);

  // update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (currentPage > 1) params.set("page", currentPage);
    if (searchType) params.set("type", searchType);

    if (searchType === "file") {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && (key !== "sortBy" || value !== "default")) {
          params.set(key, value);
        }
      });
    }
    router.replace(`?${params.toString()}`);
  }, [searchQuery, filters, currentPage, searchType, router]);

  // load colleges if file search
  useEffect(() => {
    const fetchColleges = async () => {
      if (!filters?.university || searchType !== "file") return;
      try {
        await getCollegesByUniversity(filters?.university);
      } catch (err) {
        console.error("Error fetching colleges:", err);
      }
    };
    fetchColleges();
  }, [filters?.university, getCollegesByUniversity, searchType]);

  const years = useMemo(
    () =>
      [...new Set(files.map((note) => note.year).filter(Boolean))].sort(
        (a, b) => b - a
      ),
    [files]
  );

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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

  // loading state
  const isLoading =
    (searchType === "file" && isLoadingNotes) ||
    (searchType === "user" && isLoadingUsers);
  const showLoadingState = (isLoading && !isTyping) || isInitialLoad;

  if (error && !isTyping) {
    return (
      <div className="py-12 px-4 md:px-6">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-6">
      <NotesListHeader
        onToggleFilters={toggleFilters}
        showFilters={showFilters}
        itemCount={searchType === "file" ? files.length : users.length}
        totalCount={searchType === "file" ? totalNotes || 0 : totalUsers || 0}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <NotesSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSearchType={setSearchType}
          searchType={searchType}
        />
        {searchType === "file" && (
          <NotesSortDropdown
            sortBy={filters.sortBy}
            onSortChange={handleSortChange}
          />
        )}
      </div>

      {showFilters && searchType === "file" && (
        <NotesFilterSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          universities={universities}
          years={years}
        />
      )}

      {showLoadingState ? (
        <LoadingSpinner message="جاري البحث..." />
      ) : searchType === "file" ? (
        <>
          <NotesResultsSection
            filteredNotes={files}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
          {totalNotes > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalNotes / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <>
          <div className="flex justify-around items-center flex-wrap gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 border rounded-lg shadow-sm bg-white w-fit flex justify-around items-center flex-col"
              >
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                  />
                  <AvatarFallback>
                    {user.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{user.full_name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Link
                  className="text-blue-500 hover:underline"
                  href={`/seller/${user.id}`}
                >
                  ملف المستخدم
                </Link>
              </div>
            ))}
          </div>
          {totalUsers > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalUsers / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default NotesListPage;
