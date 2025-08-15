import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = "blue",
  compact = false,
}) {
  const colorClasses = {
    blue: {
      bg: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    green: {
      bg: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      textColor: "text-green-700 dark:text-green-300",
    },
    purple: {
      bg: "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    orange: {
      bg: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
      iconBg: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      textColor: "text-orange-700 dark:text-orange-300",
    },
    red: {
      bg: "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
      iconBg: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-700 dark:text-red-300",
    },
  };

  return (
    <Card
      className={`card-hover border-0 shadow-lg bg-gradient-to-br ${colorClasses[color].bg}`}
    >
      <CardHeader
        className={`flex flex-row items-center justify-between ${
          compact ? "pb-3" : "pb-4"
        }`}
      >
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 ${colorClasses[color].iconBg} rounded-lg`}>
          <Icon className={`h-5 w-5 ${colorClasses[color].iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`${compact ? "text-2xl" : "text-3xl"} font-bold ${
            colorClasses[color].textColor
          }`}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {trend && (
          <div className="flex items-center space-x-1 space-x-reverse mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {trend}
            </p>
          </div>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
