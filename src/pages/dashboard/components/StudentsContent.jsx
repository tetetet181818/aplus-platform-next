"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
  School,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import SectionHeader from "@/components/ui/SectionHeader";
import GetSingleStudentDialog from "./GetSingleStudentDialog";
import Head from "next/head";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { universities } from "@/constants/index";

export default function StudentsContent() {
  const router = useRouter();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [universityFilter, setUniversityFilter] = useState(null);
  const [showUser, setShowUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const {
    getAllUsers,
    loading,
    error,
    deleteUserById,
    searchAboutUser,
    totalUsers,
  } = useAuthStore();

  const columns = [
    {
      header: "الطالب",
      accessor: "full_name",
      label: "الطالب",
    },
    {
      header: "البريد الإلكتروني",
      accessor: "email",
      label: "البريد الإلكتروني",
    },
    {
      header: "الجامعة",
      accessor: "university",
      label: "الجامعة",
    },
    {
      header: "تاريخ الانضمام",
      accessor: "created_at",
      label: "تاريخ الانضمام",
      customRender: (date) =>
        format(new Date(date), "yyyy/MM/dd", { locale: ar }),
    },
    {
      header: "الإجراءات",
      customRender: (user) => (
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowUser(true);
              setSelectedUser(user);
            }}
            title="عرض التفاصيل"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDeleteUser(user.id)}
            title="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchMode(false);
      fetchUsers(currentPage);
    }
  }, [currentPage, dateFilter, universityFilter]);

  const fetchUsers = async (page) => {
    try {
      let params = { page, itemsPerPage };
      if (dateFilter) params.date = format(dateFilter, "yyyy-MM-dd");
      if (universityFilter) params.university = universityFilter;
      const result = await getAllUsers(params);
      if (result) {
        setUsers(result.data);
        setTotalItems(result.totalItems);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSearch = useCallback(
    async (query, page = 1) => {
      if (!query.trim()) {
        setSearchMode(false);
        fetchUsers(page);
        return;
      }
      setIsSearching(true);
      try {
        const result = await searchAboutUser({
          query,
          page,
          itemsPerPage,
          ...(dateFilter && { date: format(dateFilter, "yyyy-MM-dd") }),
          ...(universityFilter && { university: universityFilter }),
        });
        if (result) {
          setUsers(result.data);
          setTotalItems(result.totalItems);
          setCurrentPage(page);
          setSearchMode(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    },
    [dateFilter, universityFilter]
  );

  const debounceSearch = useCallback(() => {
    let timer;
    return (value) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        handleSearch(value, 1);
      }, 600);
    };
  }, [handleSearch])();

  const handleDeleteUser = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطالب؟")) return;
    try {
      await deleteUserById({ id });
      fetchUsers(currentPage);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (searchMode) handleSearch(searchQuery, newPage);
  };

  const clearFilters = () => {
    setDateFilter(null);
    setUniversityFilter(null);
    setCurrentPage(1);
    if (!searchQuery.trim()) fetchUsers(1);
    else handleSearch(searchQuery, 1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <Head>
        <title>إدارة الطلاب | لوحة التحكم</title>
        <meta
          name="description"
          content="إدارة قاعدة بيانات الطلاب في النظام"
        />
      </Head>

      <div className="space-y-6 animate-fade-in">
        <SectionHeader title="الطلاب" description="إدارة قاعدة الطلاب" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="py-6 text-center">
              <h2 className="text-3xl font-bold text-primary">
                إجمالي عدد الطلاب
              </h2>
              <p className="text-2xl font-bold mt-3">{totalUsers}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="py-6 text-center">
              <h2 className="text-3xl font-bold text-primary">
                الطلاب النشطين
              </h2>
              <p className="text-2xl font-bold mt-3">0</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <CardTitle className="text-xl font-semibold">
                  قائمة الطلاب
                </CardTitle>
                <CardDescription>
                  {searchMode ? "نتائج البحث" : "جميع الطلاب المسجلين"}
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="البحث عن الطلاب..."
                    className="pl-10 pr-3 py-2 rounded-md text-sm w-full"
                    value={searchQuery}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchQuery(val);
                      debounceSearch(val);
                    }}
                  />
                </div>

                <Select
                  value={universityFilter}
                  onValueChange={setUniversityFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      <SelectValue placeholder="الجامعة" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>جميع الجامعات</SelectItem>
                    {universities.map((uni) => (
                      <SelectItem key={uni} value={uni}>
                        {uni}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      <Calendar className="h-4 w-4 ml-2" />
                      {dateFilter ? (
                        format(dateFilter, "yyyy/MM/dd", { locale: ar })
                      ) : (
                        <span>التاريخ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComp
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                      locale={ar}
                    />
                  </PopoverContent>
                </Popover>

                {(dateFilter || universityFilter) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={clearFilters}
                  >
                    مسح الفلاتر
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Mobile View */}
            <div className="block md:hidden space-y-4">
              {loading || isSearching ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="pt-4 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))
              ) : error ? (
                <Card className="border-destructive/20 bg-destructive/10">
                  <CardContent className="pt-4 text-center text-destructive">
                    {error}
                  </CardContent>
                </Card>
              ) : users?.length === 0 ? (
                <Card>
                  <CardContent className="pt-4 text-center text-muted-foreground">
                    {searchMode
                      ? "لا توجد نتائج مطابقة للبحث"
                      : "لا توجد بيانات طلاب لعرضها"}
                  </CardContent>
                </Card>
              ) : (
                users?.map((user, index) => (
                  <Card
                    key={user.id}
                    className="border-muted/30 animate-slide-in hover:shadow-sm"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {columns
                          .filter((col) => col.accessor)
                          .map((column, colIndex) => (
                            <div
                              key={colIndex}
                              className="flex justify-between"
                            >
                              <span className="font-medium text-right">
                                {column.label}:
                              </span>
                              <span className="text-muted-foreground text-right">
                                {column.customRender
                                  ? column.customRender(user[column.accessor])
                                  : user[column.accessor] || "N/A"}
                              </span>
                            </div>
                          ))}
                        {columns
                          .find((col) => col.header === "الإجراءات")
                          ?.customRender(user)}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {columns.map((column, index) => (
                      <TableHead
                        key={index}
                        className="font-semibold text-right"
                      >
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading || isSearching ? (
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
                        className="text-center py-4 text-destructive"
                      >
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : users?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-4 text-muted-foreground"
                      >
                        {searchMode
                          ? "لا توجد نتائج مطابقة للبحث"
                          : "لا توجد بيانات طلاب لعرضها"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users?.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className="border-muted/30 hover:bg-muted/10 animate-slide-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {columns.map((column, colIndex) => (
                          <TableCell key={colIndex} className="text-right">
                            {column.customRender
                              ? column.customRender(
                                  user[column.accessor] || user
                                )
                              : user[column.accessor] || "N/A"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-muted-foreground">
                  {loading || isSearching ? (
                    <Skeleton className="h-4 w-48" />
                  ) : (
                    `عرض ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                      currentPage * itemsPerPage,
                      totalItems
                    )} من ${totalItems} طالب`
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || loading || isSearching}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {loading || isSearching ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      `الصفحة ${currentPage} من ${totalPages}`
                    )}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      currentPage >= totalPages || loading || isSearching
                    }
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

      {showUser && (
        <GetSingleStudentDialog
          open={showUser}
          onOpenChange={setShowUser}
          student={selectedUser}
        />
      )}
    </>
  );
}
