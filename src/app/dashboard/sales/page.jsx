"use client";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Search,
  ExternalLink,
  CalendarIcon,
  ChevronUp,
  ChevronDown,
  Filter,
  X,
  Download,
  BarChart3,
  Eye,
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
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import formatArabicDate from "@/config/formateTime";
import { useToast } from "@/components/ui/use-toast";
import Head from "next/head";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import SalesDetailsDialog from "@/components/SalesDetailsDialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const commissionRate = 0.15;
const paymentMethodRate = 0.025;

const generateRowKey = (sale, index) => {
  return `${sale?.id || "no-id"}-${sale?.invoice_id || "no-invoice"}-${index}`;
};

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
  } = useSalesStore();

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [searchId, setSearchId] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchNote, setSearchNote] = useState("");
  const [searchInvoiceId, setSearchInvoiceId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = useCallback(
    (setter, value) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        setter(value);
        setCurrentPage(1);
      }, 300);
    },
    [setCurrentPage]
  );

  const filters = useMemo(
    () => ({
      ...(searchId && { id: searchId }),
      ...(searchInvoiceId && { invoice_id: searchInvoiceId }),
      ...(searchUser && { user_name: searchUser }),
      ...(searchNote && { note_title: searchNote }),
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(dateFilter && { date: format(dateFilter, "yyyy-MM-dd") }),
    }),
    [
      searchId,
      searchInvoiceId,
      searchUser,
      searchNote,
      statusFilter,
      dateFilter,
    ]
  );

  const totalPages = useMemo(
    () => Math.ceil(totalSales / itemsPerPage),
    [totalSales, itemsPerPage]
  );

  const fetchData = useCallback(async () => {
    try {
      await getSalesStatistics();
      await getSales(currentPage, itemsPerPage, filters, sortConfig);
    } catch (err) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات المبيعات",
        variant: "destructive",
      });
    }
  }, [
    currentPage,
    itemsPerPage,
    filters,
    sortConfig,
    getSales,
    getSalesStatistics,
    toast,
  ]);

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

  const handleSort = useCallback(
    (key) => {
      let direction = "desc";
      if (sortConfig.key === key && sortConfig.direction === "desc") {
        direction = "asc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig]
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

  const calculateCommission = (amount) => {
    return (amount * commissionRate).toFixed(2);
  };

  const calculatePaymentFee = (amount) => {
    return (amount * paymentMethodRate).toFixed(2);
  };

  const handelMount = (amount) => {
    const netAmount =
      amount - amount * commissionRate - amount * paymentMethodRate;

    return (
      <div className="flex flex-col">
        <span className="font-medium">{netAmount.toLocaleString()} ر.س</span>
        <div className="text-xs text-muted-foreground mt-1">
          <div>الإجمالي: {amount.toLocaleString()} ر.س</div>
          <div>رسوم المنصة: {calculateCommission(amount)} ر.س</div>
          <div>رسوم اضافيه: 2 ر.س</div>
        </div>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessor: "id",
        label: "ID",
        sortable: true,
        sortKey: "id",
        customRender: (value) => (
          <div className="flex items-center gap-2">
            {value || "غير متوفر"}
            {value && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-accent/20"
                onClick={() => handleCopyToClipboard(value)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        ),
        className: "min-w-[120px]",
      },
      {
        header: "الدورة",
        accessor: "note_title",
        label: "الدورة",
        sortable: true,
        sortKey: "note_title",
        customRender: (value) => value || "غير محدد",
        className: "min-w-[120px]",
      },
      {
        header: "الطالب",
        accessor: "user_name",
        label: "الطالب",
        sortable: true,
        sortKey: "user_name",
        customRender: (value) => value || "غير محدد",
        className: "min-w-[150px]",
      },
      {
        header: "رقم العملية",
        accessor: "invoice_id",
        label: "رقم العملية",
        sortable: true,
        sortKey: "invoice_id",
        customRender: (value) => (
          <div className="flex items-center gap-2">
            {value || "غير متوفر"}
            {value && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-accent/20"
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
        sortable: true,
        sortKey: "amount",
        customRender: (amount) => handelMount(amount),
        className: "min-w-[120px]",
      },
      {
        header: "التاريخ",
        accessor: "created_at",
        label: "التاريخ",
        sortable: true,
        sortKey: "created_at",
        customRender: (date) =>
          date ? formatArabicDate(date, { hijri: true }) : "غير محدد",
        className: "min-w-[150px]",
      },
      {
        header: "الحالة",
        accessor: "status",
        label: "الحالة",
        sortable: true,
        sortKey: "status",
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
            <Badge
              variant={variantMap[status] || "secondary"}
              className="rounded-full px-3 py-1"
            >
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
        customRender: (id, sale) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => {
                setShowDetailsDialog(true);
                setSelectedSalesId(id);
              }}
              title="عرض التفاصيل"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              title="تحميل الفاتورة"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ),
        className: "min-w-[120px]",
      },
    ],
    [handleCopyToClipboard]
  );

  const renderMobileCard = (sale, index) => {
    return (
      <Card
        key={generateRowKey(sale, index)}
        className="mb-4 shadow-sm hover:shadow-md transition-shadow border-border/60"
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-muted-foreground">
              رقم المبيعه:
            </span>
            <div className="flex items-center gap-2">
              {sale?.id || "غير متوفر"}
              {sale?.id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-accent/20"
                  onClick={() => handleCopyToClipboard(sale.id)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">الدورة:</span>
            <span className="font-medium">
              {sale?.note_title || "غير محدد"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">الطالب:</span>
            <span className="font-medium">{sale?.user_name || "غير محدد"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-muted-foreground">
              رقم العملية:
            </span>
            <div className="flex items-center gap-2">
              {sale?.invoice_id || "غير متوفر"}
              {sale?.invoice_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-accent/20"
                  onClick={() => handleCopyToClipboard(sale.invoice_id)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">المبلغ:</span>
            <div className="flex flex-col items-end">
              <span className="font-medium">
                {(sale.amount || 0).toLocaleString()} ر.س
              </span>
              <span className="text-xs text-muted-foreground">
                العمولة: {calculateCommission(sale.amount)} ر.س
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-muted-foreground">التاريخ:</span>
            <span>
              {sale?.created_at
                ? formatArabicDate(sale?.created_at, { hijri: true })
                : "غير محدد"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-muted-foreground">الحالة:</span>
            <Badge
              variant={
                {
                  completed: "default",
                  pending: "secondary",
                  failed: "destructive",
                }[sale?.status] || "secondary"
              }
              className="rounded-full px-3 py-1"
            >
              {{
                completed: "مكتمل",
                pending: "قيد الانتظار",
                failed: "فشل",
              }[sale?.status] || sale?.status}
            </Badge>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => {
                setShowDetailsDialog(true);
                setSelectedSalesId(sale?.id);
              }}
            >
              <Eye className="h-4 w-4 ml-1" />
              التفاصيل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              title="تحميل الفاتورة"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSortIcon = (column) => {
    if (!column.sortable) return null;

    if (sortConfig.key === column.sortKey) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="h-4 w-4 ml-1" />
      ) : (
        <ChevronDown className="h-4 w-4 ml-1" />
      );
    }
    return <ChevronUp className="h-4 w-4 ml-1 opacity-30" />;
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
      return sales.map((sale, index) => (
        <TableRow
          key={generateRowKey(sale, index)}
          className="hover:bg-muted/30 transition-colors even:bg-muted/10"
        >
          {columns.map((column) => {
            const value = column.accessor.includes(".")
              ? column.accessor
                  .split(".")
                  .reduce((obj, key) => obj?.[key], sale)
              : sale[column.accessor];
            return (
              <TableCell
                key={`${generateRowKey(sale, index)}-${column.accessor}`}
                className={`py-3 ${column.className}`}
              >
                {column.customRender(
                  column.accessor.includes(".")
                    ? column.accessor
                        .split(".")
                        .reduce((obj, key) => obj?.[key], sale)
                    : sale[column.accessor],
                  sale
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ));

    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
            {(searchId ||
              searchUser ||
              searchNote ||
              statusFilter !== "all" ||
              dateFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchId("");
                  setSearchUser("");
                  setSearchNote("");
                  setStatusFilter("all");
                  setDateFilter(null);
                  setCurrentPage(1);
                }}
                className="rounded-full"
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
    searchId,
    searchUser,
    searchNote,
    statusFilter,
    dateFilter,
    setCurrentPage,
  ]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

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
        <Card className="border-border/40 shadow-md rounded-xl overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-muted/5 to-muted/10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    المبيعات الحديثة
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    أحدث مشتريات الدورات والمعاملات
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    size="sm"
                    className="rounded-full flex items-center gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    الفلاتر
                    {activeFiltersCount > 0 && (
                      <span className="flex items-center justify-center h-5 w-5 bg-primary-foreground text-primary text-xs rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>

                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setSearchId("");
                        setSearchUser("");
                        setSearchNote("");
                        setDateFilter(null);
                        setSearchInvoiceId("");
                        setStatusFilter("all");
                      }}
                    >
                      <X className="h-4 w-4 ml-1" />
                      مسح الكل
                    </Button>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "grid gap-3 transition-all duration-300 overflow-hidden",
                  showFilters
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="ابحث برقم العملية (ID)"
                        value={searchInvoiceId}
                        onChange={(e) =>
                          handleSearchChange(setSearchInvoiceId, e.target.value)
                        }
                        className="pl-10 rounded-full"
                      />
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="ابحث برقم عملية البيع (ID)"
                        value={searchId}
                        onChange={(e) =>
                          handleSearchChange(setSearchId, e.target.value)
                        }
                        className="pl-10 rounded-full"
                      />
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="ابحث باسم المستخدم"
                        value={searchUser}
                        onChange={(e) =>
                          handleSearchChange(setSearchUser, e.target.value)
                        }
                        className="pl-10 rounded-full"
                      />
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="ابحث بعنوان الملخص"
                        value={searchNote}
                        onChange={(e) =>
                          handleSearchChange(setSearchNote, e.target.value)
                        }
                        className="pl-10 rounded-full"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="rounded-full">
                          <SelectValue placeholder="فلترة بحالة المعاملة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">جميع الحالات</SelectItem>
                          <SelectItem value="completed">مكتمل</SelectItem>
                          <SelectItem value="pending">قيد الانتظار</SelectItem>
                          <SelectItem value="failed">فشل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal rounded-full"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="block md:hidden">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="overflow-hidden">
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
                <div>
                  {sales.map((sale, index) => renderMobileCard(sale, index))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 p-4">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
                  {(searchId ||
                    searchUser ||
                    searchNote ||
                    statusFilter !== "all" ||
                    dateFilter) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchId("");
                        setSearchUser("");
                        setSearchNote("");
                        setStatusFilter("all");
                        setDateFilter(null);
                        setCurrentPage(1);
                        setSearchInvoiceId("");
                      }}
                      className="rounded-full"
                    >
                      إعادة تعيين الفلتر
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="hidden md:block rounded-lg border overflow-hidden shadow-sm">
              <div className="min-w-full">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead
                          className={cn(
                            "text-start py-3",
                            column.sortable &&
                              "cursor-pointer hover:bg-muted/50",
                            column.className
                          )}
                          key={column.accessor}
                          onClick={() =>
                            column.sortable && handleSort(column.sortKey)
                          }
                        >
                          <div className="flex items-center">
                            {column.header}
                            {renderSortIcon(column)}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>{tableBodyContent}</TableBody>
                </Table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mt-6">
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
                    <SelectTrigger className="w-20 rounded-full">
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
                    className="rounded-full"
                    disabled={currentPage === 1 || loading}
                    onClick={() => handlePageChange(1)}
                  >
                    الأولى
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
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
                    className="rounded-full"
                    disabled={currentPage >= totalPages || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
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
