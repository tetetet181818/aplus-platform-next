"use client";
import WithdrawalHistoryTable from "@/components/ui/WithdrawalHistoryTable";
import { useWithdrawalsStore } from "@/stores/useWithdrawalsStore";
import { useEffect } from "react";

export default function WithdrawalsContent() {
  const {
    loading,
    withdrawals,
    getWithdrawals,
    acceptedWithdrawalOrder,
    rejectedWithdrawalOrder,
    deleteWithdrawalOrder,
    getWithdrawalById,
  } = useWithdrawalsStore();

  useEffect(() => {
    getWithdrawals();
  }, [getWithdrawals]);

  return (
    <div className="space-y-8 animate-fade-in">
      <WithdrawalHistoryTable
        withdrawals={withdrawals}
        loading={loading}
        acceptedWithdrawalOrder={acceptedWithdrawalOrder}
        rejectedWithdrawalOrder={rejectedWithdrawalOrder}
        deleteWithdrawalOrder={deleteWithdrawalOrder}
        getWithdrawalById={getWithdrawalById}
      />
    </div>
  );
}
