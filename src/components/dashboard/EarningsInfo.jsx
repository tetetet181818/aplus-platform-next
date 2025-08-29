"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Info,
  CreditCard,
  Calendar,
  Zap,
  Shield,
  Coins,
} from "lucide-react";
import formatArabicDate from "@/config/formateTime";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { y: -5, transition: { duration: 0.2 } },
};

const mockData = {
  withdrawalsHistory: [
    {
      status: "مكتمل",
      date: "2023-10-15",
      transactionId: "TX-7892",
      amount: 2500,
    },
    {
      status: "مكتمل",
      date: "2023-09-28",
      transactionId: "TX-6541",
      amount: 1800,
    },
    {
      status: "قيد المعالجة",
      date: "2023-11-05",
      transactionId: "TX-8934",
      amount: 3200,
    },
  ],
  platformFeePercent: 15,
  paymentProcessingPercent: 2.75,
};

const FinanceDashboard = ({ availableBalance, withdrawalHistory }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "مكتمل":
        return (
          <Badge variant="success" className="text-xs">
            {status}
          </Badge>
        );
      case "قيد المعالجة":
        return (
          <Badge variant="warning" className="text-xs">
            {status}
          </Badge>
        );
      case "ملغى":
        return (
          <Badge variant="destructive" className="text-xs">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const formatCurrency = (amount) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-primary rounded-lg">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">
          لوحة التحكم المالية
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="md:col-span-1"
        >
          <Card className="bg-gradient-to-br from-primary to-primary/90 text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-full">
                  <DollarSign className="size-5" />
                </div>
                الرصيد المتاح للسحب
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                هذا هو المبلغ الذي يمكنك سحبه حاليًا بعد خصم رسوم المنصة
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {isLoading ? (
                <div className="h-12 bg-white/20 rounded-lg animate-pulse"></div>
              ) : (
                <p className="text-4xl font-bold tracking-tight">
                  {formatCurrency(availableBalance)}{" "}
                  <span className="text-xl font-medium">ريال</span>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              تفاصيل الرسوم والخصومات
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  شروط ومعلومات السحب
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <span>
                      تساعد هذه الرسوم في الحفاظ على جودة الخدمات والتطوير
                      المستمر
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <span>يتم احتساب الرسوم تلقائياً عند كل عملية بيع</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                    <span>
                      الحد الأدنى للسحب هو{" "}
                      <strong className="text-gray-900 dark:text-gray-100">
                        50 ريال سعودي
                      </strong>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Coins className="h-5 w-5 text-emerald-500" />
                  خصومات ورسوم الدفع
                </h3>

                <div className="rounded-xl p-4 space-y-3">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <span>
                        تطبق رسوم منصة بنسبة {mockData.platformFeePercent}% على
                        جميع المعاملات
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <span>
                        تطبق رسوم معالجة مدفوعات بنسبة{" "}
                        <strong className="text-gray-900 dark:text-gray-100">
                          {mockData.paymentProcessingPercent}%
                        </strong>{" "}
                        على جميع عمليات السحب بشكل تلقائي.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <span>1 ريال خاص بالـ refund</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      <span>1 ريال رسوم الاحتيال</span>
                    </li>
                  </ul>
                </div>

                {/* Extra Note */}
                <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <Info className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span>
                    يتم خصم رسوم المعالجة تلقائيًا من كل عملية شراء أو سحب، ولا
                    تحتاج إلى أي إجراء يدوي من طرفك.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {withdrawalHistory?.length > 0 && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                سجل التحويلات البنكية
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-start">
                    <tr>
                      <th className="px-4 py-3 text-start font-medium">
                        المبلغ
                      </th>
                      <th className="px-4 py-3 text-start font-medium">
                        الحالة
                      </th>
                      <th className="px-4 py-3 text-start font-medium">
                        التاريخ
                      </th>
                      <th className="px-4 py-3 text-start font-medium">
                        رقم العملية
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {withdrawalHistory?.map((withdrawal, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          {formatCurrency(withdrawal.amount)} ر.س
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(withdrawal.status)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatArabicDate(withdrawal.created_at)}
                        </td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          {withdrawal.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default FinanceDashboard;
