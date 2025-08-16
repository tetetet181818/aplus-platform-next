"use client";
import WithdrawalStatsCard from "@/components/Withdrawals/WithdrawalStatsCard";
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";
import { useEffect } from "react";

export default function WithdrawalsStatistics() {
  const {
    totalCount,
    totalCountPaid,
    totalCountPending,
    totalCountFailed,
    getWithdrawalStats,
  } = useWithdrawalsStore();
  useEffect(() => {
    getWithdrawalStats();
  }, []);
  return (
    <div className="flex gap-4 flex-wrap">
      <WithdrawalStatsCard title="مجموع الطلبات" value={totalCount} />
      <WithdrawalStatsCard title="إجمالي المدفوع" value={totalCountPaid} />
      <WithdrawalStatsCard title="إجمالي المرفوض" value={totalCountFailed} />
      <WithdrawalStatsCard
        title="طلبات قيد الانتظار"
        value={totalCountPending}
      />
    </div>
  );
}
