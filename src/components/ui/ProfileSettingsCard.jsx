"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileSettingsCard() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">
          إعدادات الملف الشخصي
        </CardTitle>
        <CardDescription>تحديث معلوماتك الشخصية</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              أم
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" size="sm">
              تغيير الصورة
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG حتى 2 ميجابايت
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">الاسم الأول</label>
            <Input
              placeholder="أحمد"
              className="h-10 border-0 shadow-md bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">اسم العائلة</label>
            <Input
              placeholder="محمد"
              className="h-10 border-0 shadow-md bg-muted/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">البريد الإلكتروني</label>
          <Input
            placeholder="ahmed@example.com"
            className="h-10 border-0 shadow-md bg-muted/30"
            type="email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">نبذة شخصية</label>
          <textarea
            placeholder="أخبرنا عن نفسك..."
            className="w-full p-3 border-0 shadow-md bg-muted/30 rounded-md resize-none"
            rows={3}
          />
        </div>

        <Button className="w-full h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold">
          حفظ التغييرات
        </Button>
      </CardContent>
    </Card>
  );
}
