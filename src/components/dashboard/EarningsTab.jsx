"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DollarSign, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useFormik } from "formik";

import WithdrawalForm from "./WithdrawalForm";
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";

const PLATFORM_FEE_PERCENTAGE = process.env.PLATFORM_FEE_PERCENTAGE;

const EarningsTab = ({ currentUser, getSellerNotes }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [availableBalance, setAvailableBalance] = useState(0);
  const [sellerStats, setSellerStats] = useState([]);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const { createWithdrawalOrder, loading } = useWithdrawalsStore();

  useEffect(() => {
    if (currentUser?.balance) {
      setAvailableBalance(currentUser.balance);
    }
  }, [currentUser]);

  const calculatePlatformFee = useCallback(
    (balance) => balance * PLATFORM_FEE_PERCENTAGE,
    []
  );

  const calculateNetEarnings = useCallback(
    (balance) => balance - calculatePlatformFee(balance),
    [calculatePlatformFee]
  );

  const calculateTotalPrice = (price, downloads) => price * downloads;

  const formik = useFormik({
    initialValues: {
      accountHolderName: "",
      bankName: "",
      iban: "",
      withdrawalAmount: "",
    },
    validationSchema: Yup.object({
      accountHolderName: Yup.string()
        .trim()
        .required("اسم صاحب الحساب مطلوب")
        .matches(
          /^[\u0600-\u06FF\s]{3,}(?:\s[\u0600-\u06FF\s]{3,}){2,}$/,
          "يجب إدخال الاسم ثلاثي"
        ),
      bankName: Yup.string()
        .required("اسم البنك مطلوب")
        .min(3, "اسم البنك يجب أن يكون على الأقل 3 أحرف"),
      iban: Yup.string()
        .trim()
        .required("رقم الحساب (IBAN) مطلوب")
        .matches(
          /^SA[0-9]{22}$/,
          "يجب أن يبدأ رقم الحساب بـ SA ويحتوي على 24 حرفاً"
        ),
      withdrawalAmount: Yup.number()
        .required("مبلغ السحب مطلوب")
        .min(3, "الحد الأدنى للسحب هو 3 ريال")
        .max(availableBalance, "لا يمكنك سحب مبلغ أكبر من رصيدك المتاح"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await createWithdrawalOrder({
          id: currentUser?.id,
          ...values,
        });
        if (res) {
          toast({ title: "تم تقديم طلب السحب بنجاح" });
          resetForm();
          router.refresh();
        }
      } catch (error) {
        toast({
          title: "حدث خطأ",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  useEffect(() => {
    const fetchSellerStats = async () => {
      if (currentUser?.id) {
        try {
          const userNotes = await getSellerNotes({ sellerId: currentUser?.id });
          setSellerStats(userNotes || []);
        } catch (error) {
          toast({
            title: "حدث خطأ",
            description: "تعذر تحميل إحصائيات البائع",
            variant: "destructive",
          });
        }
      }
    };

    fetchSellerStats();
  }, [currentUser?.id, getSellerNotes, toast]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  const currentNetEarnings = calculateNetEarnings(availableBalance);

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={cardVariants} whileHover="hover">
        <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              الرصيد المتاح للسحب
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              هذا هو المبلغ الذي يمكنك سحبه حاليًا بعد خصم رسوم المنصة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">
              {currentNetEarnings.toFixed(2)}{" "}
              <span className="text-xl font-medium">ريال</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} whileHover="hover">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              ملخص المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  إجمالي المبيعات:
                </p>
                <p className="text-lg font-semibold">
                  {availableBalance.toFixed(2)} ريال
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  رسوم المنصة (15%):
                </p>
                <p className="text-lg font-semibold text-destructive">
                  -{calculatePlatformFee(availableBalance).toFixed(2)} ريال
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="font-medium">صافي الأرباح:</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>يتم خصم 15% رسوم من إجمالي الأرباح كرسوم خدمة المنصة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {currentUser?.withdrawalsHistory?.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    سجل التحويلات البنكية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left border">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 border">الحالة</th>
                          <th className="px-4 py-2 border">التاريخ</th>
                          <th className="px-4 py-2 border">رقم العملية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUser.withdrawalsHistory.map((w, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="px-4 py-2 border">{w.status}</td>
                            <td className="px-4 py-2 border">{w.date}</td>
                            <td className="px-4 py-2 border">
                              {w.transactionId}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        {currentUser.withdrawal_times > 0 ? (
          <WithdrawalForm
            formik={formik}
            isProcessingWithdrawal={isProcessingWithdrawal}
            netEarnings={currentNetEarnings}
            remainingWithdrawals={currentUser.withdrawal_times}
            loading={loading}
          />
        ) : (
          <Card className="border-destructive/20 bg-destructive/10">
            <CardContent className="p-6 text-center">
              <p className="font-semibold text-destructive">
                لقد استهلكت كل محاولات السحب المتاحة هذا الشهر
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EarningsTab;
