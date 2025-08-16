import { Dialog, DialogContent } from "@/components/ui/dialog";
import formatArabicDate from "@/config/formateTime";

export default function WithdrawalDetailsDialog({
  open,
  onClose,
  selectedWithdrawal,
}) {
  if (!selectedWithdrawal) return null;

  const withdrawalDetails = [
    { label: "اسم الحساب", value: selectedWithdrawal.account_name },
    { label: "اسم البنك", value: selectedWithdrawal.bank_name },
    { label: "رقم الآيبان", value: selectedWithdrawal.iban },
    { label: "المبلغ", value: `${selectedWithdrawal.amount} ر.س` },
    {
      label: "الحالة",
      value:
        statusLabelMap[selectedWithdrawal.status] || selectedWithdrawal.status,
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
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">تفاصيل طلب السحب</h2>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {withdrawalDetails.map((detail, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {detail.label}
                  </p>
                  <p className="text-sm font-semibold">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              إغلاق
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const statusLabelMap = {
  pending: "قيد الانتظار",
  accepted: "مقبول",
  rejected: "مرفوض",
  processing: "قيد المعالجة",
  completed: "مكتمل",
};
