"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SecuritySettingsCard() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">إعدادات الأمان</CardTitle>
        <CardDescription>إدارة أمان حسابك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">كلمة المرور الحالية</label>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-10 border-0 shadow-md bg-muted/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">كلمة المرور الجديدة</label>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-10 border-0 shadow-md bg-muted/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            تأكيد كلمة المرور الجديدة
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-10 border-0 shadow-md bg-muted/30"
          />
        </div>

        <div className="p-4 rounded-lg bg-muted/30 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">المصادقة الثنائية</p>
              <p className="text-sm text-muted-foreground">
                إضافة طبقة حماية إضافية
              </p>
            </div>
            <Button variant="outline" size="sm">
              تفعيل
            </Button>
          </div>
        </div>

        <Button className="w-full h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold">
          تحديث كلمة المرور
        </Button>
      </CardContent>
    </Card>
  );
}
