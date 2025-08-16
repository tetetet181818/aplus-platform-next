"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import formatArabicDate from "@/config/formateTime";
import { statusLabelMap } from "@/constants/index";
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WithdrawalDetailsDialog({
  open,
  onClose,
  selectedWithdrawal,
}) {
  if (!selectedWithdrawal) return null;

  const { getSingleWithdrawal, singleWithdrawal, loading } =
    useWithdrawalsStore((state) => state);

  useEffect(() => {
    getSingleWithdrawal({ id: selectedWithdrawal.id });
  }, [selectedWithdrawal.id, getSingleWithdrawal]);

  const withdrawalDetails = [
    { label: "اسم الحساب", value: selectedWithdrawal.account_name },
    { label: "اسم البنك", value: selectedWithdrawal.bank_name },
    { label: "رقم الآيبان", value: selectedWithdrawal.iban },
    { label: "المبلغ", value: `${selectedWithdrawal.amount} ر.س` },
    {
      label: "الحالة",
      value:
        statusLabelMap[selectedWithdrawal.status] || selectedWithdrawal.status,
      className: "capitalize",
    },
    {
      label: "تاريخ الإنشاء",
      value: formatArabicDate(selectedWithdrawal.created_at),
    },
    {
      label: "تاريخ التحديث",
      value: formatArabicDate(selectedWithdrawal.updated_at),
    },
    {
      label: "ملاحظات المسؤول",
      value: selectedWithdrawal.admin_notes || "لا يوجد ملاحظات",
      colSpan: "md:col-span-2",
    },
    {
      label: "اسم المستخدم",
      value: singleWithdrawal?.user?.full_name,
      section: "user",
    },
    {
      label: "البريد الإلكتروني",
      value: singleWithdrawal?.user?.email,
      section: "user",
    },
    {
      label: "الجامعة",
      value: singleWithdrawal?.user?.university,
      section: "user",
    },
    {
      label: "الرصيد الحالي",
      value: `${singleWithdrawal?.user?.balance} ر.س`,
      section: "user",
    },
  ];

  const groupedDetails = withdrawalDetails.reduce((acc, detail) => {
    const section = detail.section || "withdrawal";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(detail);
    return acc;
  }, {});

  const renderDetailValue = (value) => {
    if (loading) {
      return <Skeleton className="h-4 w-full" />;
    }
    return <span className="text-sm font-semibold">{value}</span>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {loading ? (
            <Skeleton className="h-8 w-48 mx-auto" />
          ) : (
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 dark:text-white">
              تفاصيل طلب السحب
            </h2>
          )}

          {/* Withdrawal Details Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6 space-y-4">
            {loading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                معلومات السحب
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedDetails.withdrawal.map((detail, index) => (
                <div
                  key={index}
                  className={`space-y-1 ${detail.colSpan || ""}`}
                >
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {detail.label}
                  </p>
                  {renderDetailValue(detail.value)}
                </div>
              ))}
            </div>
          </div>

          {/* User Details Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-6 space-y-4">
            {loading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                معلومات المستخدم
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupedDetails.user?.map((detail, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {detail.label}
                  </p>
                  {renderDetailValue(detail.value)}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-white dark:bg-gray-900 pb-4">
            {loading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                إغلاق
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
