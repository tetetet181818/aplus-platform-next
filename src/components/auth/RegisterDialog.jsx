"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { registerSchema } from "@/utils/validation/authValidation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import {
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { universities } from "../../constants/index";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RegisterDialog = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { register, loading, error, clearError } = useAuthStore();
  const [activeTab, setActiveTab] = useState("register");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      university: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!termsAccepted) {
        toast({
          title: "يجب الموافقة على الشروط والأحكام",
          variant: "destructive",
        });
        return;
      }

      const user = await register(values);
      if (user?.needsVerification || user) {
        setRegisteredEmail(values.email);
        setActiveTab("verify");
        toast({
          title: "تم إنشاء الحساب",
          description: "يرجى التحقق من بريدك الإلكتروني",
          variant: "success",
        });
        resetForm();
      }
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "فشل التسجيل",
        description: error,
        variant: "destructive",
      });
      const timer = setTimeout(() => {
        clearError();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء حساب جديد</DialogTitle>
          <DialogDescription>
            قم بإنشاء حساب جديد للوصول إلى كافة الميزات
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="register">التسجيل</TabsTrigger>
            <TabsTrigger value="verify">التحقق</TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="full_name"
                    name="full_name"
                    className="pr-10"
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="اكتب اسمك هنا"
                  />
                </div>
                {formik.touched.full_name && formik.errors.full_name && (
                  <p className="text-sm text-destructive">
                    {formik.errors.full_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pr-10"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={"اكتب بريدك الإلكتروني هنا"}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-destructive">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">الجامعة</Label>
                <div className="relative">
                  <Building2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Select
                    name="university"
                    value={formik.values.university}
                    onValueChange={(value) =>
                      formik.setFieldValue("university", value)
                    }
                    onOpenChange={(open) =>
                      !open && formik.setFieldTouched("university", true)
                    }
                  >
                    <SelectTrigger
                      dir={"rtl"}
                      id="university"
                      className="pr-10 w-full"
                    >
                      <SelectValue placeholder="اختر الجامعة" />
                    </SelectTrigger>
                    <SelectContent dir={"rtl"}>
                      {universities?.map((uni) => (
                        <SelectItem key={uni} value={uni}>
                          {uni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formik.touched.university && formik.errors.university && (
                  <p className="text-sm text-destructive">
                    {formik.errors.university}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                    placeholder="**********"
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <p>كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل</p>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-destructive">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                />
                <label htmlFor="terms" className="text-sm leading-none">
                  أوافق على{" "}
                  <Link
                    href="/terms-of-service"
                    className="text-primary hover:underline"
                  >
                    الشروط والأحكام
                  </Link>{" "}
                  و{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-primary hover:underline"
                  >
                    سياسة الخصوصية
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || formik.isSubmitting || !termsAccepted}
              >
                {loading || formik.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  "إنشاء حساب"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  أو
                </span>
              </div>
            </div>

            <GoogleLoginButton />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              لديك حساب؟{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={onSwitchToLogin}
              >
                تسجيل الدخول
              </button>
            </div>
          </TabsContent>

          <TabsContent value="verify" className="py-6 text-center space-y-4">
            <h3 className="text-lg font-semibold">تحقق من بريدك الإلكتروني</h3>
            <p className="text-sm text-muted-foreground">
              لقد أرسلنا رسالة تحقق إلى:
              <span className="font-medium block mt-1">{registeredEmail}</span>
            </p>
            <p className="text-sm">
              افتح البريد واضغط على رابط التفعيل لتتمكن من تسجيل الدخول.
            </p>
            <Button onClick={() => setActiveTab("register")} variant="outline">
              العودة للتسجيل
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
