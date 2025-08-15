"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationSettingsCard() {
  const notificationItems = [
    {
      title: "إشعارات البريد الإلكتروني",
      description: "استلام التحديثات عبر البريد الإلكتروني",
      checked: true,
    },
    {
      title: "تنبيهات الطلاب الجدد",
      description: "الحصول على إشعار عند التسجيلات الجديدة",
      checked: true,
    },
    {
      title: "إشعارات المبيعات",
      description: "تنبيه عند شراء الدورات الجديدة",
      checked: true,
    },
    {
      title: "التقارير الأسبوعية",
      description: "استلام ملخص التحليلات الأسبوعي",
      checked: false,
    },
    {
      title: "تحديثات التسويق",
      description: "أخبار المنصة والتحديثات",
      checked: false,
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          إعدادات الإشعارات
        </CardTitle>
        <CardDescription>اختر الإشعارات التي تريد استلامها</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {notificationItems.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <input
                type="checkbox"
                className="w-4 h-4 text-primary"
                defaultChecked={item.checked}
              />
            </div>
          ))}
        </div>

        <Button className="w-full h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold">
          حفظ التفضيلات
        </Button>
      </CardContent>
    </Card>
  );
}
