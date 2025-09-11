// CheckoutClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFileStore } from "@/stores/useFileStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { createPaymentLink } = useFileStore();

  const noteId = searchParams.get("noteId");
  const userId = searchParams.get("userId");
  const amount = searchParams.get("amount");
  const buyerId = searchParams.get("buyerId");

  const handlePay = async () => {
    if (!noteId || !userId || !amount) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يوجد مشكلة في بيانات الدفع، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await createPaymentLink({ noteId, userId, amount, buyerId });

      if (res?.url) {
        toast({
          title: "جاري التحويل",
          description: "سيتم تحويلك إلى صفحة الدفع الآن",
          variant: "success",
        });
        window.location.href = res.url;
      } else {
        throw new Error(res?.error || "فشل في إنشاء رابط الدفع");
      }
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "فشل في إنشاء رابط الدفع، يرجى المحاولة لاحقًا",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-3/6 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          إتمام عملية الشراء
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          سيتم تحويلك إلى بوابة الدفع الآمنة لإتمام عملية الشراء
        </p>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            المبلغ:{" "}
            <span className="text-primary dark:text-primary-light">
              {amount} ريال
            </span>
          </p>
        </div>

        <Button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 text-lg"
        >
          {loading ? "جاري التحميل..." : "الانتقال للدفع"}
        </Button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          عملية الدفع آمنة ومشفرة بالكامل
        </p>
      </div>
    </main>
  );
}
