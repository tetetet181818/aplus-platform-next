"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { loginSchema } from "@/utils/validation/authValidation";
import { useFormik } from "formik";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import Link from "next/link";

const LoginDialog = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuthStore();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const user = await login(values);
      if (user) {
        toast({
          title: `مرحبًا من جديد، ${user.full_name}! تم تسجيل دخولك بنجاح.`,
          variant: "success",
        });
        resetForm();
        onClose();
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        clearError();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تسجيل الدخول</DialogTitle>
          <DialogDescription>
            مرحبا بعودتك قم بتسجيل الدخول للوصول للصفحة الرئيسية
          </DialogDescription>
        </DialogHeader>

        <p className="text-center text-sm text-muted-foreground mb-2">
          سجّل دخولك بواسطة Google
        </p>
        <GoogleLoginButton />

        <br />

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
                  placeholder="اكتب البريد الإلكتروني هنا"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-sm text-destructive">
                  {formik.errors.email}
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
                  placeholder="اكتب كلمة المرور هنا"
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
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-sm text-destructive">
                  {formik.errors.password}
                </p>
              )}
            </div>
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={loading || formik.isSubmitting}
          >
            {loading || formik.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جارٍ الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>

          <Link
            href="/forget-password"
            className="mt-4 block text-center text-sm text-muted-foreground underline hover:text-primary"
            onClick={onClose}
          >
            نسيت كلمة المرور؟
          </Link>
        </form>

        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            لا تمتلك حساب؟{" "}
            <button
              className="font-semibold text-primary hover:underline"
              onClick={onSwitchToRegister}
            >
              إنشاء حساب جديد
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
