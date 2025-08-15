"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecentSalesCard({ sales }) {
  return (
    <Card className="card-hover border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          المبيعات الحديثة
        </CardTitle>
        <CardDescription>أحدث مشتريات الدورات</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale, index) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{sale.note_title}</p>
                <p className="text-xs text-muted-foreground">
                  {sale.users?.full_name}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-semibold text-green-600">
                  {sale.amount} ر.س
                </p>
                <Badge
                  variant={sale.status === "مكتمل" ? "default" : "secondary"}
                  className="text-xs animate-scale-in"
                >
                  {sale.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
