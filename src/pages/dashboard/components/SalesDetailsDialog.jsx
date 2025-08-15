import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import formatArabicDate from "@/config/formateTime";

export default function SalesDetailsDialog({
  open,
  onClose,
  selectSalesDetails,
}) {
  const statusVariantMap = {
    paid: "default",
    pending: "secondary",
    failed: "destructive",
  };

  const paymentMethodMap = {
    bank: "تحويل بنكي",
    card: "بطاقة ائتمان",
    wallet: "محفظة إلكترونية",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg rounded-xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-right text-2xl font-bold text-gray-800">
            تفاصيل المعاملة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount and Status */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">المبلغ</h3>
              <p className="font-bold text-2xl text-primary">
                {selectSalesDetails?.amount} ر.س
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">الحالة</h3>
              <Badge
                variant={
                  statusVariantMap[selectSalesDetails?.status] || "secondary"
                }
                className="text-sm px-3 py-1 rounded-full"
              >
                {selectSalesDetails?.status === "paid"
                  ? "مدفوعة"
                  : selectSalesDetails?.status === "pending"
                  ? "قيد الانتظار"
                  : "فاشلة"}
              </Badge>
            </div>
          </div>

          {/* Payment Method and Platform Fee */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">طريقة الدفع</h3>
              <p className="font-medium text-gray-700">
                {paymentMethodMap[selectSalesDetails?.payment_method] ||
                  selectSalesDetails?.payment_method}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">رسوم المنصة</h3>
              <p className="font-medium text-gray-700">
                {selectSalesDetails?.platform_fee} ر.س
              </p>
            </div>
          </div>

          {/* Invoice and Note IDs */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">
                رقم الفاتورة
              </h3>
              <p className="font-medium text-gray-700">
                {selectSalesDetails?.invoice_id}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">
                رقم الملاحظة
              </h3>
              <p className="font-medium text-gray-700">
                {selectSalesDetails?.note_id}
              </p>
            </div>
          </div>

          {/* Note Title */}
          <div className="space-y-1">
            <h3 className="font-medium text-gray-500 text-sm">
              عنوان الملاحظة
            </h3>
            <p className="font-medium text-gray-700 p-3 bg-gray-50 rounded-lg">
              {selectSalesDetails?.note_title || "لا يوجد عنوان"}
            </p>
          </div>

          {/* Message */}
          <div className="space-y-1">
            <h3 className="font-medium text-gray-500 text-sm">الرسالة</h3>
            <p className="font-medium text-gray-700 p-3 bg-gray-50 rounded-lg min-h-[60px]">
              {selectSalesDetails?.message || "لا توجد رسالة"}
            </p>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">
                اسم المستخدم
              </h3>
              <p className="font-medium text-gray-700">
                {selectSalesDetails?.user_name}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">
                معرف المستخدم
              </h3>
              <p className="font-medium text-gray-700 truncate">
                {selectSalesDetails?.user_id}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">
                تاريخ الإنشاء
              </h3>
              <p className="font-medium text-gray-700">
                {selectSalesDetails?.created_at
                  ? formatArabicDate(selectSalesDetails.created_at, {
                      hijri: true,
                    })
                  : "غير متوفر"}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">
                تاريخ التحديث
              </h3>
              <p className="font-medium text-gray-700">
                {selectSalesDetails?.updated_at
                  ? formatArabicDate(selectSalesDetails.updated_at, {
                      hijri: true,
                    })
                  : "غير متوفر"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
