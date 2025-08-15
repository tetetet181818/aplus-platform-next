"use client";
import { useEffect, useMemo } from "react";
import Head from "next/head";
import { FileText, Users } from "lucide-react";
import { useFileStore } from "@/stores/useFileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSalesStore } from "@/stores/useSalesStore";
import RecentStudentsCard from "@/components/ui/RecentStudentsCard";
import RecentSalesCard from "@/components/ui/RecentSalesCard";
import StatCard from "@/components/ui/StatCard";

export default function Dashboard() {
  const {
    getFilesMonthlyGrowth,
    growthRate: growthRateFiles,
    totalNotes,
    getTotalNotes,
  } = useFileStore();
  const {
    getAllUsers,
    users,
    getUsersMonthlyGrowth,
    growthRate: growthRateUsers,
    totalUsers,
  } = useAuthStore();

  const { getMonthlyGrowthRate, getTotalSalesAmount, sales, getSales } =
    useSalesStore();
  const newStudents = useMemo(() => {
    if (!users) return [];
    return [...users]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [users]);

  useEffect(() => {
    getMonthlyGrowthRate();
    getTotalSalesAmount();
    getFilesMonthlyGrowth();
    getUsersMonthlyGrowth();
    getAllUsers();
    getTotalNotes();
    getSales();
  }, [
    getMonthlyGrowthRate,
    getTotalSalesAmount,
    getFilesMonthlyGrowth,
    getUsersMonthlyGrowth,
    getAllUsers,
    getTotalNotes,
    getSales,
  ]);

  return (
    <>
      <Head>
        <title>لوحة التحكم | منصة أ+</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex-1 space-y-4 p-4 md:p-8 bg-gradient-to-br from-background via-muted/5 to-primary/5">
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              لوحة التحكم
            </h1>
            <p className="text-muted-foreground text-lg">
              نظرة عامة على منصتك التعليمية
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <StatCard
              title="إجمالي الطلاب"
              value={totalUsers}
              icon={Users}
              trend={`+${growthRateUsers}% من الشهر الماضي`}
              color="blue"
            />
            <StatCard
              title="إجمالي الملفات"
              value={totalNotes}
              icon={FileText}
              trend={`+${growthRateFiles}% من الشهر الماضي`}
              color="green"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <RecentStudentsCard students={newStudents} />
            <RecentSalesCard sales={sales?.slice(0, 5)} />
          </div>
        </div>
      </div>
    </>
  );
}
