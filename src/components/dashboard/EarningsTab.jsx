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
import FinanceDashboard from "./EarningsInfo";

const PLATFORM_FEE_PERCENTAGE = process.env.PLATFORM_FEE_PERCENTAGE;

const EarningsTab = ({ currentUser, getSellerNotes }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [availableBalance, setAvailableBalance] = useState(0);
  const [sellerStats, setSellerStats] = useState([]);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const { createWithdrawalOrder, loading, getUserWithdrawalsHistory } =
    useWithdrawalsStore();
  const [withdrawalHistory, setWithdrawalHistory] = useState();

  useEffect(() => {
    if (currentUser?.balance) {
      setAvailableBalance(currentUser.balance);
    }
  }, [currentUser]);
  useEffect(() => {
    const getWithdrawalsHistory = async () => {
      let res = await getUserWithdrawalsHistory({ userId: currentUser?.id });
      setWithdrawalHistory(res);
    };
    getWithdrawalsHistory();
  }, []);
  const calculatePlatformFee = useCallback(
    (balance) => balance * PLATFORM_FEE_PERCENTAGE,
    []
  );

  const calculateNetEarnings = useCallback(
    (balance) => balance - calculatePlatformFee(balance),
    [calculatePlatformFee]
  );

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
      className="space-y-6 lg:px-10 sm:px-0"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <FinanceDashboard
        availableBalance={availableBalance}
        withdrawalHistory={withdrawalHistory}
      />
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
