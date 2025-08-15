"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema, registerSchema } from "@/utils/validation/authValidation";
import { toast } from "@/components/ui/use-toast";

export const LoginDialog = ({
  isOpen,
  onOpenChange,
  onLogin,
  onSwitchToRegister,
}) => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await onLogin(values);
        onOpenChange(false);
      } catch (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message || "حدث خطأ أثناء تسجيل الدخول",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">تسجيل الدخول</DialogTitle>
          <DialogDescription>
            أدخل بياناتك للوصول إلى حسابك وإدارة ملخصاتك.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="your@email.com"
              className={`h-11 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="********"
              className={`h-11 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>
          <div className="text-sm text-right">
            <Link to="#" className="font-medium text-primary hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </DialogFooter>
        </form>
        <div className="mt-6 text-center text-sm">
          ليس لديك حساب؟{" "}
          <button
            className="font-semibold text-primary hover:underline"
            onClick={onSwitchToRegister}
          >
            إنشاء حساب جديد
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const RegisterDialog = ({
  isOpen,
  onOpenChange,
  onRegister,
  onSwitchToLogin,
}) => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await onRegister(values);
        onOpenChange(false);
      } catch (error) {
        toast({
          title: "خطأ في التسجيل",
          description: error.message || "حدث خطأ أثناء التسجيل",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            إنشاء حساب جديد
          </DialogTitle>
          <DialogDescription>
            أنشئ حسابك الآن للبدء في إضافة ومشاركة ملخصاتك.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="أدخل اسمك الكامل"
              className={`h-11 ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="your@email.com"
              className={`h-11 ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="********"
              className={`h-11 ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={loading}
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </Button>
          </DialogFooter>
        </form>
        <div className="mt-6 text-center text-sm">
          لديك حساب بالفعل؟{" "}
          <Button
            className="font-semibold text-primary hover:underline"
            onClick={onSwitchToLogin}
          >
            تسجيل الدخول
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
