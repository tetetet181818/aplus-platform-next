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
import { useEffect, useState, useCallback } from "react";
import { useSalesStore } from "@/stores/useSalesStore";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Link from "next/link";
import {
  Link as LinkIcon,
  Copy,
  Calendar,
  User,
  CreditCard,
  FileText,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function SalesDetailsDialog({ open, onClose, salesId }) {
  const { getDetailsOfSales } = useSalesStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saleDetails, setSaleDetails] = useState(null);
  const statusVariantMap = {
    paid: "default",
    pending: "secondary",
    failed: "destructive",
  };

  const statusLabelMap = {
    paid: "مدفوعة",
    pending: "قيد الانتظار",
    failed: "فاشلة",
  };

  const paymentMethodMap = {
    bank: "تحويل بنكي",
    card: "بطاقة ائتمان",
    wallet: "محفظة إلكترونية",
  };

  const paymentMethodIcons = {
    bank: CreditCard,
    card: CreditCard,
    wallet: CreditCard,
  };

  const fetchSaleDetails = useCallback(async () => {
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
  }, [salesId, getDetailsOfSales]);

  useEffect(() => {
    if (open) {
      fetchSaleDetails();
    } else {
      setSaleDetails(null);
      setError(null);
    }
  }, [open, fetchSaleDetails]);

  const handleCopyToClipboard = useCallback(
    (text, label) => {
      navigator.clipboard.writeText(text);
      toast({
        title: "تم النسخ",
        description: `تم نسخ ${label} بنجاح`,
        variant: "success",
      });
    },
    [toast]
  );

  const isValidUserId = (userId) => {
    return userId && typeof userId === "string" && userId.trim().length > 0;
  };

  const DetailItem = useCallback(
    ({
      icon: Icon,
      label,
      value,
      isLink = false,
      href,
      copyable = false,
      className,
      validateLink = true, // New prop to validate links
    }) => {
      if (!value) return null;

      // Fix: Don't render as link if validation fails
      const shouldRenderAsLink =
        isLink && (!validateLink || isValidUserId(value));

      const content = (
        <div className={cn("flex items-start gap-2", className)}>
          {Icon && (
            <Icon className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {label}
            </p>
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  "text-base font-semibold text-foreground break-words",
                  shouldRenderAsLink && "hover:text-primary transition-colors"
                )}
              >
                {value}
              </p>
              {copyable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-accent/20"
                  onClick={() => handleCopyToClipboard(value, label)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      );

      return shouldRenderAsLink ? (
        <Link
          href={href}
          className="block hover:bg-accent/5 rounded-lg p-2 -m-2 transition-colors"
          onClick={(e) => {
            // Fix: Prevent navigation if user ID is invalid
            if (!isValidUserId(value)) {
              e.preventDefault();
              toast({
                title: "خطأ",
                description: "معرف المستخدم غير صالح",
                variant: "destructive",
              });
            }
          }}
        >
          {content}
        </Link>
      ) : (
        <div className="rounded-lg p-2 -m-2">{content}</div>
      );
    },
    [handleCopyToClipboard, toast]
  );

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md md:max-w-lg rounded-xl sm:max-w-2xl">
          <LoadingSpinner message="جاري تحميل التفاصيل..." />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-w-2xl p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-right text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تفاصيل المعاملة
          </DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-destructive mb-4 rounded-full bg-destructive/10 p-3">
              <RefreshCw className="h-6 w-6" />
            </div>
            <p className="text-destructive font-medium mb-4">{error}</p>
            <Button onClick={fetchSaleDetails} className="rounded-full">
              إعادة المحاولة
            </Button>
          </div>
        ) : saleDetails ? (
          <div className="space-y-6 p-6">
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-xl">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المبلغ</p>
                    <p className="text-2xl font-bold text-primary">
                      {saleDetails?.amount} ر.س
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الحالة</p>
                    <Badge
                      variant={
                        statusVariantMap[saleDetails?.status] || "secondary"
                      }
                      className="text-sm px-3 py-1 rounded-full"
                    >
                      {statusLabelMap[saleDetails?.status] ||
                        saleDetails?.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Layout for Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  معلومات الدفع
                </h3>

                <div className="space-y-3">
                  <DetailItem
                    icon={
                      paymentMethodIcons[saleDetails?.payment_method] ||
                      CreditCard
                    }
                    label="طريقة الدفع"
                    value={
                      paymentMethodMap[saleDetails?.payment_method] ||
                      saleDetails?.payment_method
                    }
                  />

                  <DetailItem
                    icon={CreditCard}
                    label="رسوم المنصة"
                    value={`${saleDetails?.platform_fee} ر.س`}
                  />

                  <DetailItem
                    icon={FileText}
                    label="رقم الفاتورة"
                    value={saleDetails?.invoice_id}
                    copyable={true}
                  />
                </div>
              </div>

              {/* Note Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  معلومات الملاحظة
                </h3>

                <div className="space-y-3">
                  <DetailItem
                    icon={FileText}
                    label="رقم الملاحظة"
                    value={saleDetails?.note_id}
                    isLink={true}
                    href={`/notes/${saleDetails?.note_id}`}
                    copyable={true}
                    validateLink={false}
                  />

                  <DetailItem
                    icon={FileText}
                    label="عنوان الملاحظة"
                    value={saleDetails?.note_title || "لا يوجد عنوان"}
                    className="bg-muted/30 p-3 rounded-lg"
                  />
                </div>
              </div>

              {/* User Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  معلومات المستخدم
                </h3>

                <div className="space-y-3">
                  <DetailItem
                    label="معرف المشتري"
                    icon={User}
                    value={saleDetails?.user_id}
                    isLink={true}
                    href={`/seller/${saleDetails?.user_id}`}
                    copyable={true}
                    validateLink={true}
                  />
                  <DetailItem
                    label="معرف البائع"
                    icon={User}
                    value={saleDetails?.buyerId}
                    isLink={true}
                    href={`/seller/${saleDetails?.buyerId}`}
                    copyable={true}
                    validateLink={true}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  التواريخ
                </h3>

                <div className="space-y-3">
                  <DetailItem
                    icon={Calendar}
                    label="تاريخ الإنشاء"
                    value={
                      saleDetails?.created_at
                        ? formatArabicDate(saleDetails.created_at, {
                            hijri: true,
                          })
                        : "غير متوفر"
                    }
                  />

                  <DetailItem
                    icon={Calendar}
                    label="تاريخ التحديث"
                    value={
                      saleDetails?.updated_at
                        ? formatArabicDate(saleDetails.updated_at, {
                            hijri: true,
                          })
                        : "غير متوفر"
                    }
                  />
                </div>
              </div>
            </div>

            {/* Message Section */}
            {saleDetails?.message && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  الرسالة
                </h3>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">
                    {saleDetails.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد بيانات متاحة
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
