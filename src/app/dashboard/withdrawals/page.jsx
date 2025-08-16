"use client";
import WithdrawalHistoryTable from "@/components/ui/WithdrawalHistoryTable";
import WithdrawalsStatistics from "./WithdrawalsStatistics";

export default function WithdrawalsDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <WithdrawalsStatistics />
      <WithdrawalHistoryTable />
    </div>
  );
}
