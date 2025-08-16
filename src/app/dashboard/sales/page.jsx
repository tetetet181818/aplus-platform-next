"use client";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Loader2,
  Search,
  ExternalLink,
  CalendarIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSalesStore } from "@/stores/useSalesStore";
import { useEffect, useState, useCallback, useMemo } from "react";
import formatArabicDate from "@/config/formateTime";
import { useToast } from "@/components/ui/use-toast";
import Head from "next/head";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import SalesDetailsDialog from "@/components/SalesDetailsDialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const statusOptions = [
  { value: "all", label: "جميع الحالات" },
  { value: "completed", label: "مكتمل" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "failed", label: "فشل" },
];

const commissionRate = 0.15;

export default function SalesDashboard() {
  const { toast } = useToast();
  const {
    sales,
    loading,
    error,
    totalSales,
    currentPage,
    itemsPerPage,
    getSales,
    getSalesStatistics,
    clearError,
    setCurrentPage,
    setItemsPerPage,
    getDetailsOfSales,
  } = useSalesStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const totalPages = useMemo(
    () => Math.ceil(totalSales / itemsPerPage),
    [totalSales, itemsPerPage]
  );
  const filters = useMemo(
    () => ({
      search: searchQuery,
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(dateFilter && { date: format(dateFilter, "yyyy-MM-dd") }),
    }),
    [searchQuery, statusFilter, dateFilter]
  );

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        getSalesStatistics(),
        getSales(currentPage, itemsPerPage, filters),
      ]);
    } catch (err) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات المبيعات",
        variant: "destructive",
      });
    }
  }, [currentPage, itemsPerPage, filters, getSales, getSalesStatistics, toast]);

  useEffect(() => {
    fetchData();
    if (error) {
      toast({ title: "خطأ", description: error, variant: "destructive" });
      clearError();
    }
  }, [fetchData, error, clearError, toast]);

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage > 0 && newPage <= totalPages && !loading) {
        setCurrentPage(newPage);
      }
    },
    [totalPages, loading, setCurrentPage]
  );

  const handleSearchInputChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);
      if (searchTimeout) clearTimeout(searchTimeout);
      setSearchTimeout(setTimeout(() => setCurrentPage(1), 300));
    },
    [searchTimeout, setCurrentPage]
  );

  const handleStatusFilterChange = useCallback(
    (value) => {
      setStatusFilter(value);
      setCurrentPage(1);
    },
    [setCurrentPage]
  );

  const handleItemsPerPageChange = useCallback(
    (value) => {
      setItemsPerPage(Number(value));
      setCurrentPage(1);
    },
    [setItemsPerPage, setCurrentPage]
  );

  const handleCopyToClipboard = useCallback(
    (text) => {
      navigator.clipboard.writeText(text);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رقم العملية بنجاح",
        variant: "success",
      });
    },
    [toast]
  );

  const calculateCommission = useCallback((amount) => {
    return (amount * commissionRate).toLocaleString();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "الدورة",
        accessor: "files.title",
        label: "الدورة",
        customRender: (value) => value || "غير محدد",
        className: "min-w-[120px]",
      },
      {
        header: "الطالب",
        accessor: "users.full_name",
        label: "الطالب",
        customRender: (value) => value || "غير محدد",
        className: "min-w-[150px]",
      },
      {
        header: "رقم العملية",
        accessor: "invoice_id",
        label: "رقم العملية",
        customRender: (value) => (
          <div className="flex items-center gap-2">
            {value || "غير متوفر"}
            {value && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleCopyToClipboard(value)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        ),
        className: "min-w-[150px]",
      },
      {
        header: "المبلغ",
        accessor: "amount",
        label: "المبلغ",
        customRender: (amount) => (
          <div className="flex flex-col">
            <span>{(amount || 0).toLocaleString()} ر.س</span>
            <span className="text-xs text-muted-foreground">
              العمولة: {calculateCommission(amount)} ر.س
            </span>
          </div>
        ),
        className: "min-w-[120px]",
      },
      {
        header: "التاريخ",
        accessor: "created_at",
        label: "التاريخ",
        customRender: (date) =>
          date ? formatArabicDate(date, { hijri: true }) : "غير محدد",
        className: "min-w-[150px]",
      },
      {
        header: "الحالة",
        accessor: "status",
        label: "الحالة",
        customRender: (status) => {
          const variantMap = {
            completed: "default",
            pending: "secondary",
            failed: "destructive",
          };
          const labelMap = {
            completed: "مكتمل",
            pending: "قيد الانتظار",
            failed: "فشل",
          };
          return (
            <Badge variant={variantMap[status] || "secondary"}>
              {labelMap[status] || status}
            </Badge>
          );
        },
        className: "min-w-[120px]",
      },
      {
        header: "الاجراءات",
        accessor: "id",
        label: "الاجراءات",
        customRender: (id) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowDetailsDialog(true);
              setSelectedSalesId(id);
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            التفاصيل
          </Button>
        ),
        className: "min-w-[120px]",
      },
    ],
    [handleCopyToClipboard, calculateCommission]
  );

  const renderMobileCard = (sale) => {
    return (
      <Card key={sale?.id} className="mb-4">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">الدورة:</span>
            <span>{sale?.files?.title || "غير محدد"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">الطالب:</span>
            <span>{sale?.users?.full_name || "غير محدد"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">رقم العملية:</span>
            <div className="flex items-center gap-2">
              {sale?.invoice_id || "غير متوفر"}
              {sale?.invoice_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleCopyToClipboard(sale.invoice_id)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">المبلغ:</span>
            <div className="flex flex-col items-end">
              <span>{(sale.amount || 0).toLocaleString()} ر.س</span>
              <span className="text-xs text-muted-foreground">
                العمولة: {calculateCommission(sale.amount)} ر.س
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">التاريخ:</span>
            <span>
              {sale?.created_at
                ? formatArabicDate(sale?.created_at, { hijri: true })
                : "غير محدد"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">الحالة:</span>
            <Badge
              variant={
                {
                  completed: "default",
                  pending: "secondary",
                  failed: "destructive",
                }[sale?.status] || "secondary"
              }
            >
              {{
                completed: "مكتمل",
                pending: "قيد الانتظار",
                failed: "فشل",
              }[sale?.status] || sale?.status}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => {
              setShowDetailsDialog(true);
              setSelectedSalesId(sale?.id);
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            التفاصيل
          </Button>
        </CardContent>
      </Card>
    );
  };

  const tableBodyContent = useMemo(() => {
    if (loading)
      return (
        <TableRow>
          <TableCell colSpan={columns?.length} className="h-24 text-center">
            <LoadingSpinner message="جاري تحميل البيانات..." />
          </TableCell>
        </TableRow>
      );

    if (sales?.length > 0)
      return sales.map((sale) => (
        <TableRow
          key={sale?.id}
          className="hover:bg-muted/50 transition-colors"
        >
          {columns.map((column) => {
            const value = column.accessor.includes(".")
              ? column.accessor
                  .split(".")
                  .reduce((obj, key) => obj?.[key], sale)
              : sale[column.accessor];
            return (
              <TableCell
                key={`${sale.id}-${column.accessor}`}
                className={column.className}
              >
                {column.customRender(value)}
              </TableCell>
            );
          })}
        </TableRow>
      ));

    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          <div className="flex flex-col items-center gap-2">
            <p>لا توجد بيانات متاحة</p>
            {(searchQuery || statusFilter !== "all" || dateFilter) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDateFilter(null);
                  setCurrentPage(1);
                }}
              >
                إعادة تعيين الفلتر
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  }, [
    loading,
    sales,
    columns,
    searchQuery,
    statusFilter,
    dateFilter,
    setCurrentPage,
  ]);

  return (
    <>
      <Head>
        <title>إدارة المبيعات | لوحة التحكم</title>
        <meta
          name="description"
          content="إدارة معاملات المبيعات وعرض الإحصائيات"
        />
      </Head>

      <div className="space-y-6 animate-fade-in">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="text-xl font-semibold">
                  المبيعات الحديثة
                </CardTitle>
                <CardDescription>
                  أحدث مشتريات الدورات والمعاملات
                </CardDescription>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="ابحث عن مبيعات..."
                    className="w-full pl-9 h-10"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    disabled={loading}
                  />
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-10 justify-start text-left font-normal"
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter ? (
                        format(dateFilter, "yyyy-MM-dd")
                      ) : (
                        <span>فلترة بالتاريخ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="حالة البيع" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  className="h-10"
                  onClick={() => {
                    setSearchQuery("");
                    setDateFilter(null);
                    setStatusFilter("all");
                  }}
                  disabled={loading}
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="block md:hidden">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-full mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : sales?.length > 0 ? (
                <div>{sales.map(renderMobileCard)}</div>
              ) : (
                <div className="flex flex-col items-center gap-4 p-4">
                  <p>لا توجد بيانات متاحة</p>
                  {(searchQuery || statusFilter !== "all" || dateFilter) && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setDateFilter(null);
                        setCurrentPage(1);
                      }}
                    >
                      إعادة تعيين الفلتر
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <div className="rounded-md border overflow-x-auto">
                <div className="min-w-[800px] md:min-w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead
                            className={`text-start ${column.className}`}
                            key={column.accessor}
                          >
                            {column.header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>{tableBodyContent}</TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mt-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {loading ? (
                      <Skeleton className="h-4 w-48" />
                    ) : (
                      `عرض ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                        currentPage * itemsPerPage,
                        totalSales
                      )} من ${totalSales?.toLocaleString() || 0} عملية بيع`
                    )}
                  </div>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(1)}
                  >
                    الأولى
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center min-w-[120px]">
                    <span className="text-sm">
                      {loading ? (
                        <Skeleton className="h-4 w-16" />
                      ) : (
                        `الصفحة ${currentPage} من ${totalPages}`
                      )}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    الأخيرة
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <SalesDetailsDialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        salesId={selectedSalesId}
      />
    </>
  );
}
