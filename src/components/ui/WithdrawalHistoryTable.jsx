"use client";
import {
  MoreHorizontal,
  X,
  Check,
  Trash2,
  Loader2,
  CheckCircle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";
import Head from "next/head";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MobileWithdrawalCard from "../Withdrawals/MobileWithdrawalCard";
import { statusLabelMap, statusVariantMap } from "@/constants/index";
import FiltrationOperation from "@/app/dashboard/withdrawals/FiltrationOperation";

export default function WithdrawalHistoryTable() {
  const {
    withdrawals,
    loading,
    page,
    setPage,
    totalPages,
    getWithdrawals,
    acceptedWithdrawalOrder,
    rejectedWithdrawalOrder,
    deleteWithdrawalOrder,
    updateWithdrawalNotes,
    addRoutingDetails,
  } = useWithdrawalsStore();
  useEffect(() => {
    getWithdrawals();
  }, [getWithdrawals]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [transferNumber, setTransferNumber] = useState("");
  const [transferDate, setTransferDate] = useState(null);

  const handleActionWithNote = async () => {
    if (!selectedWithdrawal || !actionType) return;

    try {
      const payload = {
        id: selectedWithdrawal.id,
        admin_notes: adminNotes || "لا توجد ملاحظات",
      };

      await updateWithdrawalNotes(payload);

      if (actionType === "accept") {
        await acceptedWithdrawalOrder(payload);
      } else if (actionType === "reject") {
        await rejectedWithdrawalOrder(payload);
      } else if (actionType === "complete") {
        await addRoutingDetails({
          withdrawalId: selectedWithdrawal?.id,
          routing_number: transferNumber,
          routing_date: transferDate
            ? format(transferDate, "yyyy-MM-dd")
            : null,
        });
      }

      await getWithdrawals();
      setIsDialogOpen(false);
      setAdminNotes("");
      setTransferNumber("");
      setTransferDate(null);
    } catch (error) {
      console.error("فشل تنفيذ الإجراء:", error);
    }
  };

  const columns = [
    {
      header: "الطالب",
      accessor: "account_name",
      label: "الطالب",
      customRender: (name) => name || "طالب غير معروف",
    },
    {
      header: "البنك",
      accessor: "bank_name",
      label: "البنك",
      customRender: (bank) => bank || "غير محدد",
    },
    {
      header: "IBAN",
      accessor: "iban",
      label: "IBAN",
      customRender: (iban) => iban || "غير متوفر",
    },
    {
      header: "المبلغ",
      accessor: "amount",
      label: "المبلغ",
      customRender: (amount) => `${(amount || 0).toLocaleString()} ر.س`,
    },
    {
      header: "التاريخ",
      accessor: "created_at",
      label: "التاريخ",
      customRender: (date) =>
        new Date(date).toLocaleDateString("ar-EG") || "غير محدد",
    },
    {
      header: "الحالة",
      accessor: "status",
      label: "الحالة",
      customRender: (status) => (
        <Badge variant={statusVariantMap[status] || "default"}>
          {statusLabelMap[status] || status}
        </Badge>
      ),
    },
    {
      header: "ملاحظات",
      accessor: "admin_notes",
      label: "ملاحظات",
      customRender: (notes) => notes || "لا توجد ملاحظات",
    },
    {
      header: "رقم التحويل",
      accessor: "routing_number",
      label: "رقم التحويل",
      customRender: (routing_number) => routing_number || "لا توجد رقم تحويل",
    },
    {
      header: "تاريخ التحويل",
      accessor: "routing_date",
      label: "تاريخ التحويل",
      customRender: (routing_date) => routing_date || "لا توجد تاريخ تحويل",
    },
    ,
    {
      header: "الإجراءات",
      customRender: (_, withdrawal) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 shadow-lg">
            {withdrawal?.status === "accepted" && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWithdrawal(withdrawal);
                  setActionType("complete");
                  setIsDialogOpen(true);
                }}
                className="cursor-pointer"
              >
                <CheckCircle className="size-4 mr-2 text-green-800" />
                اكمال العمليه
              </DropdownMenuItem>
            )}
            {withdrawal?.status !== "accepted" && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWithdrawal(withdrawal);
                  setActionType("accept");
                  setIsDialogOpen(true);
                }}
                className="cursor-pointer"
              >
                <Check className="h-4 w-4 mr-2 text-green-600" />
                قبول الطلب
              </DropdownMenuItem>
            )}
            {withdrawal?.status !== "rejected" && (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedWithdrawal(withdrawal);
                  setActionType("reject");
                  setIsDialogOpen(true);
                }}
                className="cursor-pointer"
              >
                <X className="h-4 w-4 mr-2 text-red-600" />
                رفض الطلب
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => deleteWithdrawalOrder({ id: withdrawal.id })}
              className="cursor-pointer text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              حذف الطلب
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>سجل طلبات السحب | لوحة التحكم</title>
        <meta name="description" content="إدارة وتتبع جميع طلبات سحب الأرباح" />
      </Head>

      <div className="space-y-6 animate-fade-in">
        <FiltrationOperation />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === "accept"
                  ? "قبول طلب السحب"
                  : actionType === "reject"
                  ? "رفض طلب السحب"
                  : "إكمال العملية"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "accept"
                  ? "يرجى إضافة ملاحظات قبل قبول الطلب"
                  : actionType === "reject"
                  ? "يرجى توضيح سبب الرفض"
                  : "يرجى إضافة تفاصيل التحويل"}
              </DialogDescription>
            </DialogHeader>

            {actionType === "accept" && (
              <Textarea
                placeholder="أدخل ملاحظاتك هنا..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-[120px]"
              />
            )}
            {actionType === "complete" && (
              <div className="space-y-4">
                <Input
                  placeholder="رقم التحويل"
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  required
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !transferDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {transferDate ? (
                        format(transferDate, "yyyy-MM-dd")
                      ) : (
                        <span>تاريخ التحويل</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={transferDate}
                      onSelect={setTransferDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button
                onClick={handleActionWithNote}
                disabled={
                  loading ||
                  (actionType === "complete" &&
                    (!transferNumber || !transferDate))
                }
                variant={
                  actionType === "accept"
                    ? "success"
                    : actionType === "complete"
                    ? "success"
                    : "destructive"
                }
              >
                {actionType === "accept"
                  ? "تأكيد القبول"
                  : actionType === "complete"
                  ? "تأكيد الإكمال"
                  : "تأكيد الرفض"}
                {loading && <Loader2 className="animate-spin ml-2 h-4 w-4" />}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">سجل طلبات السحب</CardTitle>
            <CardDescription>عرض وإدارة جميع طلبات السحب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="md:hidden space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-muted/30">
                    <CardContent className="p-4 space-y-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </CardContent>
                  </Card>
                ))
              ) : withdrawals?.length ? (
                withdrawals.map((withdrawal) => (
                  <MobileWithdrawalCard
                    key={withdrawal.id}
                    withdrawal={withdrawal}
                    columns={columns}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد سحوبات لعرضها
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.header} className="text-right">
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {columns.map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : withdrawals?.length ? (
                    withdrawals.map((withdrawal) => (
                      <TableRow
                        key={withdrawal.id}
                        className="hover:bg-muted/50"
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={`${withdrawal.id}-${column.header}`}
                            className="text-right"
                          >
                            {column.customRender
                              ? column.customRender(
                                  withdrawal[column?.accessor],
                                  withdrawal
                                )
                              : withdrawal[column?.accessor] || "غير محدد"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-center py-8"
                      >
                        لا توجد سحوبات لعرضها
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1 || loading}
                  onClick={() => {
                    setPage(page - 1);
                    getWithdrawals();
                  }}
                >
                  السابق
                </Button>
                <div className="flex items-center px-4">
                  <span className="text-sm">
                    صفحة {page} من {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  disabled={page === totalPages || loading}
                  onClick={() => {
                    setPage(page + 1);
                    getWithdrawals();
                  }}
                >
                  التالي
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
