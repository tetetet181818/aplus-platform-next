import { Users, FileText } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import RecentStudentsCard from "@/components/ui/RecentStudentsCard";
import RecentSalesCard from "@/components/ui/RecentSalesCard";

export default function DashboardContent({
  totalUsers,
  totalFiles,
  newStudents,
  growthRateSales,
  totalAmount,
  growthRateFiles,
  growthRateUsers,
  sales,
}) {
  return (
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
          value={totalFiles}
          icon={FileText}
          trend={`+${growthRateFiles}% من الشهر الماضي`}
          color="green"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentStudentsCard students={newStudents} />
        <RecentSalesCard sales={sales?.slice(0, 4)} />
      </div>
    </div>
  );
}
