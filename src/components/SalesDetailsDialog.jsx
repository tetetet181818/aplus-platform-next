"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import formatArabicDate from "@/config/formateTime";
import { useEffect, useState } from "react";
import { useSalesStore } from "@/stores/useSalesStore";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

export default function SalesDetailsDialog({ open, onClose, salesId }) {
  const { getDetailsOfSales } = useSalesStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saleDetails, setSaleDetails] = useState(null);

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

  const fetchSaleDetails = async () => {
    if (!salesId) return;

    try {
      setLoading(true);
      setError(null);
      const details = await getDetailsOfSales({ salesId });
      setSaleDetails(details);
    } catch (err) {
      setError("فشل في تحميل تفاصيل المعاملة");
      console.error("Error fetching sale details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSaleDetails();
    }
  }, [open, salesId]);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md md:max-w-lg rounded-xl">
          <LoadingSpinner message="جاري تحميل التفاصيل..." />
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md md:max-w-lg rounded-xl">
          <div className="text-center py-4">
            <div className="text-red-500 mb-2">{error}</div>
            <Button onClick={fetchSaleDetails}>إعادة المحاولة</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg rounded-xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-right text-2xl font-bold text-gray-800">
            تفاصيل المعاملة
          </DialogTitle>
        </DialogHeader>

        {saleDetails ? (
          <div className="space-y-6">
            {/* Amount and Status */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-500 text-sm">المبلغ</h3>
                <p className="font-bold text-2xl text-primary">
                  {saleDetails?.amount} ر.س
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-gray-500 text-sm">الحالة</h3>
                <Badge
                  variant={statusVariantMap[saleDetails?.status] || "secondary"}
                  className="text-sm px-3 py-1 rounded-full"
                >
                  {saleDetails?.status === "paid"
                    ? "مدفوعة"
                    : saleDetails?.status === "pending"
                    ? "قيد الانتظار"
                    : "فاشلة"}
                </Badge>
              </div>
            </div>

            {/* Payment Method and Platform Fee */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-500 text-sm">
                  طريقة الدفع
                </h3>
                <p className="font-medium text-gray-700">
                  {paymentMethodMap[saleDetails?.payment_method] ||
                    saleDetails?.payment_method}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-gray-500 text-sm">
                  رسوم المنصة
                </h3>
                <p className="font-medium text-gray-700">
                  {saleDetails?.platform_fee} ر.س
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
                  {saleDetails?.invoice_id}
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-gray-500 text-sm">
                  رقم الملاحظة
                </h3>
                <Link
                  href={`/notes/${saleDetails?.note_id}`}
                  className="font-medium text-gray-700 hover:underline hover:text-primary"
                >
                  {saleDetails?.note_id}
                  <LinkIcon className="inline-block m-2" />
                </Link>
              </div>
            </div>

            {/* Note Title */}
            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">
                عنوان الملاحظة
              </h3>
              <p className="font-medium text-gray-700 p-3 bg-gray-50 rounded-lg">
                {saleDetails?.note_title || "لا يوجد عنوان"}
              </p>
            </div>

            {/* Message */}
            <div className="space-y-1">
              <h3 className="font-medium text-gray-500 text-sm">الرسالة</h3>
              <p className="font-medium text-gray-700 p-3 bg-gray-50 rounded-lg min-h-[60px]">
                {saleDetails?.message || "لا توجد رسالة"}
              </p>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-500 text-sm">
                  اسم المستخدم
                </h3>
                <Link
                  href={`/seller/${saleDetails?.user_id}`}
                  className="font-medium text-gray-700 hover:underline hover:text-primary"
                >
                  {saleDetails?.user_name}
                  <LinkIcon className="inline-block ml-1" />
                </Link>
              </div>

              <div className="space-y-1">
                <h3 className="font-medium text-gray-500 text-sm">
                  معرف المستخدم
                </h3>
                <p className="font-medium text-gray-700 truncate">
                  {saleDetails?.user_id}
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
                  {saleDetails?.created_at
                    ? formatArabicDate(saleDetails.created_at, {
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
                  {saleDetails?.updated_at
                    ? formatArabicDate(saleDetails.updated_at, {
                        hijri: true,
                      })
                    : "غير متوفر"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">لا توجد بيانات متاحة</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
