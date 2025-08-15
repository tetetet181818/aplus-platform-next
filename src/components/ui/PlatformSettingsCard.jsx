import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PlatformSettingsCard() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">إعدادات المنصة</CardTitle>
        <CardDescription>تكوين تفضيلات المنصة</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">اسم المنصة</label>
          <Input
            placeholder="منصة التعليم"
            className="h-10 border-0 shadow-md bg-muted/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">المنطقة الزمنية</label>
          <select className="w-full h-10 px-3 border-0 shadow-md bg-muted/30 rounded-md">
            <option>UTC+3 (توقيت الرياض)</option>
            <option>UTC+2 (توقيت القاهرة)</option>
            <option>UTC+0 (توقيت غرينتش)</option>
            <option>UTC+1 (توقيت أوروبا الوسطى)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">اللغة</label>
          <select className="w-full h-10 px-3 border-0 shadow-md bg-muted/30 rounded-md">
            <option>العربية</option>
            <option>الإنجليزية</option>
            <option>الفرنسية</option>
            <option>الألمانية</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">العملة</label>
          <select className="w-full h-10 px-3 border-0 shadow-md bg-muted/30 rounded-md">
            <option>ريال سعودي (ر.س)</option>
            <option>دولار أمريكي ($)</option>
            <option>يورو (€)</option>
            <option>جنيه إسترليني (£)</option>
          </select>
        </div>

        <div className="p-4 rounded-lg bg-muted/30 border border-red-200 dark:border-red-800">
          <div className="space-y-2">
            <p className="font-medium text-red-600 dark:text-red-400">
              منطقة الخطر
            </p>
            <p className="text-sm text-muted-foreground">
              حذف حسابك وجميع البيانات نهائياً
            </p>
            <Button variant="destructive" size="sm" className="mt-2">
              حذف الحساب
            </Button>
          </div>
        </div>

        <Button className="w-full h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold">
          حفظ الإعدادات
        </Button>
      </CardContent>
    </Card>
  );
}
