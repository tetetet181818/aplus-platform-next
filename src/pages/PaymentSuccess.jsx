"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFileStore } from "@/stores/useFileStore";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Head from "next/head";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { purchaseNote, loading } = useFileStore();

  const noteId = searchParams.get("noteId");
  const userId = searchParams.get("userId");
  const invoice_id = searchParams.get("invoice_id");
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  useEffect(() => {
    const handlePurchase = async () => {
      if (noteId && userId) {
        try {
          const success = await purchaseNote({
            noteId,
            userId,
            invoice_id,
            status,
            message,
          });

          if (success) {
            toast({
              title: "تم الشراء بنجاح!",
              description: "تم شراء الملخص بنجاح",
              variant: "success",
            });
          }
        } catch (error) {
          toast({
            title: "خطأ في العملية",
            description: "حدث خطأ أثناء تأكيد عملية الدفع",
            variant: "destructive",
          });
        }
      }
    };

    handlePurchase();
  }, [noteId, userId, invoice_id, status, message, purchaseNote, toast]);

  return (
    <>
      <Head>
        <title>تأكيد الدفع | منصة أ+</title>
        <meta name="description" content="صفحة تأكيد عملية الدفع الناجحة" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <LoadingSpinner message="جاري تأكيد عملية الدفع..." />
        ) : (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
              تمت عملية الدفع بنجاح
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              شكراً لشرائك من منصتنا. يمكنك الآن الوصول إلى الملخص الخاص بك.
            </p>
            <button
              onClick={() => router.push(`/notes/${noteId}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
            >
              الذهاب إلى الملخص
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentSuccess;
