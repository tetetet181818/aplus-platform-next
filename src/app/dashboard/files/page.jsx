"use client";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader,
  School,
  DollarSign,
  LinkIcon,
  Eye,
  Trash2,
  BookOpenCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFileStore } from "@/stores/useFileStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDebounce } from "@/hooks/useDebounce";
import Head from "next/head";
import { universityData } from "@/data/universityData";
import Link from "next/link";
import FileDetailsDialog from "@/components/dashboard/FileDetailsDialog";
import ConfirmDialog from "@/components/dashboard/ConfirmDialog";
import UnpublishDialog from "@/components/dashboard/UnpublishDialog";

const truncateText = (text, maxLength = 20) => {
  if (!text) return "N/A";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function FilesDashboard() {
  const itemsPerPage = 10;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [unpublishedNote, setUnpublishedNote] = useState(false);
  const [filters, setFilters] = useState({
    university: "",
    college: "",
    subject: "",
    year: "",
    priceMin: "",
    priceMax: "",
    priceOperator: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    getPaginatedNotes,
    loading,
    error,
    notes,
    downloadNote,
    downloadLoading,
    deleteNote,
    makeUnPublished,
  } = useFileStore();

  const universities = universityData.map((uni) => uni.name);
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetchNotes(currentPage);
  }, [currentPage, debouncedSearchQuery, filters]);

  useEffect(() => {
    if (filters.university) {
      // Find the selected university in universityData
      const selectedUniversity = universityData.find(
        (uni) => uni.name === filters.university
      );
      setColleges(selectedUniversity?.colleges || []);
    } else {
      setColleges([]);
      setFilters((prev) => ({ ...prev, college: "" }));
    }
  }, [filters.university]);

  const fetchNotes = async (page) => {
    const result = await getPaginatedNotes(page, itemsPerPage, {
      search: debouncedSearchQuery,
      ...filters,
    });
    if (result) setTotalItems(result.totalItems);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePriceFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      university: "",
      college: "",
      subject: "",
      year: "",
      priceMin: "",
      priceMax: "",
      priceOperator: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const columns = [
    { header: "العنوان", accessor: "title", customRender: truncateText },
    { header: "الوصف", accessor: "description", customRender: truncateText },
    { header: "الجامعة", accessor: "university", customRender: truncateText },
    { header: "الكلية", accessor: "college", customRender: truncateText },
    { header: "المادة", accessor: "subject", customRender: truncateText },
    { header: "السنة", accessor: "year" },
    {
      header: "صاحب الملخص",
      accessor: "owner_id",
      customRender: (ownerId) => (
        <Link
          className="hover:underline hover:text-blue-500"
          href={`/seller/${ownerId}`}
        >
          {ownerId.slice(0, 10) + "...."} <LinkIcon className="size-4 inline" />
        </Link>
      ),
    },
    {
      header: "السعر",
      accessor: "price",
      customRender: (price) => `${price} ر.س`,
    },
    {
      header: "تاريخ الإضافة",
      accessor: "created_at",
      customRender: (date) => new Date(date).toLocaleDateString(),
    },
    {
      header: "الإجراءات",
      customRender: (item) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant={"ghost"}
            onClick={() => {
              setIsDialogOpen(true);
              setSelectedFile(item);
              console.log(item);
            }}
          >
            <Eye className="size-4 " />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => downloadNote({ filePath: item.file_path })}
            disabled={downloadLoading}
          >
            {downloadLoading ? (
              <Loader className="animate-spin h-4 w-4" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
    {
      header: "الغاء النشر",
      customRender: (item) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant={item.isPublish ? "destructive" : "default"}
            onClick={() => {
              setSelectedFile(item);
              setUnpublishedNote(true);
            }}
          >
            {item.isPublish ? "الغاء النشر" : "نشر"}
          </Button>
        </div>
      ),
    },
  ];

  const hasActiveFilters =
    debouncedSearchQuery ||
    Object.values(filters).some(
      (value) => value !== "" && value !== null && value !== undefined
    );

  return (
    <>
      <Head>
        <title>الملفات الدراسية | لوحة التحكم</title>
      </Head>

      <div className="space-y-6">
        <SectionHeader
          title="الملاحظات الدراسية"
          description="قائمة بجميع الملاحظات المرفوعة على المنصة"
        />

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>الملاحظات</CardTitle>
                <CardDescription>
                  {hasActiveFilters ? "نتائج البحث" : "جميع الملاحظات المتاحة"}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن ملاحظة..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {showFilters && (
                <div className="w-full p-4 bg-muted/50 rounded-lg mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                    <Select
                      value={filters?.university}
                      onValueChange={(value) =>
                        handleFilterChange("university", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 opacity-70" />
                          <SelectValue placeholder="كل الجامعات" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {universities?.map((uni) => (
                          <SelectItem key={uni} value={uni}>
                            {uni}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filters.college}
                      onValueChange={(value) =>
                        handleFilterChange("college", value)
                      }
                      disabled={!filters.university}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="كل الكليات" />
                      </SelectTrigger>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem key={college} value={college}>
                            {college}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      placeholder="السنة"
                      className="w-full"
                      value={filters.year}
                      onChange={(e) =>
                        handleFilterChange("year", e.target.value)
                      }
                    />

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 opacity-70" />
                        <span className="text-sm">فلترة السعر</span>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={filters.priceOperator}
                          onValueChange={(value) =>
                            handleFilterChange("priceOperator", value)
                          }
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gt">أكبر من</SelectItem>
                            <SelectItem value="lt">أقل من</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="المبلغ"
                          className="flex-1"
                          name="priceMin"
                          value={filters.priceMin}
                          onChange={handlePriceFilterChange}
                        />
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        className="text-destructive w-full sm:w-auto"
                        onClick={resetFilters}
                      >
                        مسح الفلاتر
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableHead className={"text-start"} key={index}>
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        {columns.map((_, colIndex) => (
                          <TableCell key={colIndex}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center text-destructive py-4"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : notes?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-4"
                      >
                        {hasActiveFilters
                          ? "لا توجد نتائج مطابقة للبحث"
                          : "لا توجد ملاحظات لعرضها"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    notes?.map((note) => (
                      <TableRow key={note.id} className="hover:bg-muted/50">
                        {columns.map((column, colIndex) => (
                          <TableCell key={colIndex}>
                            {column.customRender
                              ? column.customRender(
                                  note[column.accessor] || note
                                )
                              : note[column.accessor] || "N/A"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <Card>
                  <CardContent className="pt-4 text-center text-destructive">
                    {error}
                  </CardContent>
                </Card>
              ) : notes?.length === 0 ? (
                <Card>
                  <CardContent className="pt-4 text-center">
                    {hasActiveFilters
                      ? "لا توجد نتائج مطابقة للبحث"
                      : "لا توجد ملاحظات لعرضها"}
                  </CardContent>
                </Card>
              ) : (
                notes?.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="pt-4 space-y-3">
                      {columns
                        .filter((col) => col.accessor)
                        .map((column, colIndex) => (
                          <div key={colIndex} className="flex justify-between">
                            <span className="font-medium">
                              {column.header}:
                            </span>
                            <span className="text-muted-foreground">
                              {column.customRender
                                ? column.customRender(note[column.accessor])
                                : note[column.accessor] || "N/A"}
                            </span>
                          </div>
                        ))}
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            downloadNote({ filePath: note.file_path })
                          }
                          disabled={downloadLoading}
                        >
                          {downloadLoading ? (
                            <Loader className="animate-spin h-4 w-4" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <div className="text-sm text-muted-foreground">
                  {loading ? (
                    <Skeleton className="h-4 w-48" />
                  ) : (
                    `عرض ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      totalItems
                    )} من ${totalItems} ملاحظة`
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {loading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      `الصفحة ${currentPage} من ${totalPages}`
                    )}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <FileDetailsDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        item={selectedFile}
      />
      <UnpublishDialog
        open={unpublishedNote}
        onClose={() => setUnpublishedNote(false)}
        onConfirm={() => makeUnPublished({ noteId: selectedFile.id })}
        loading={loading}
      />
    </>
  );
}
