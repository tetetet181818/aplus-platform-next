"use client";
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { navigationItems } from "@/constants/index";
import AppSidebar from "./components/AppSidebar";
import DashboardContent from "./components/DashboardContent";
import StudentsContent from "./components/StudentsContent";
import FilesContent from "./components/FilesContent";
import SalesContent from "./components/SalesContent";
import WithdrawalsContent from "./components/WithdrawalsContent";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Activity } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useFileStore } from "@/stores/useFileStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSalesStore } from "@/stores/useSalesStore";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

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

  const {
    getMonthlyGrowthRate,
    growthRate: growthRateSales,
    totalAmount,
    getTotalSalesAmount,
    sales,
    getSales,
  } = useSalesStore();
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

  const renderContent = () => {
    const components = {
      dashboard: (
        <DashboardContent
          totalUsers={totalUsers}
          totalFiles={totalNotes}
          newStudents={newStudents}
          growthRateSales={growthRateSales}
          totalAmount={totalAmount}
          growthRateFiles={growthRateFiles}
          growthRateUsers={growthRateUsers}
          sales={sales?.slice(0, 5)}
        />
      ),
      students: <StudentsContent />,
      files: <FilesContent />,
      sales: <SalesContent />,
      withdrawals: <WithdrawalsContent />,
    };

    return components[activeSection] || components.dashboard;
  };

  return (
    <>
      <Head>
        <title>لوحة التحكم | منصة أ+</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <SidebarProvider>
        <AppSidebar
          navigationItems={navigationItems}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-muted/20 px-4 bg-gradient-to-r from-background to-muted/10">
            <div className="flex items-center space-x-2 space-x-reverse">
              <SidebarTrigger className="-mr-1 hover:bg-primary/10 rounded-lg transition-colors" />
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">
                لوحة تحكم المنصة التعليمية
              </span>
            </div>
            <Separator orientation="vertical" className="ml-2 h-4" />
          </header>
          <main className="flex-1 space-y-4 p-4 md:p-8 bg-gradient-to-br from-background via-muted/5 to-primary/5">
            {renderContent()}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
