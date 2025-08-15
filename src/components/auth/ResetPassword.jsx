"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { toast } from "@/components/ui/use-toast";
import { resetPasswordValidation } from "../../utils/validation/authValidation";
export default function ResetPassword() {
  const { resetPasswordLoading, resetPassword } = useAuthStore(
    (state) => state
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordValidation,
    onSubmit: async ({ email, password }, { resetForm }) => {
      try {
        const res = await resetPassword({
          email: email,
          password: password,
        });
        if (res) {
          toast({
            title: "تم تغيير كلمة المرور بنجاح",
            variant: "success",
          });
          resetForm();
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "حدث خطأ",
          description: "حدث خطأ أثناء تغيير كلمة المرور",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-sm my-20">
      <h2 className="text-2xl font-semibold text-center mb-4">
        إعادة تعيين كلمة المرور
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        أدخل كلمة مرور جديدة لحسابك
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10"
              placeholder="برجاء كتابة البريد الإلكتروني"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور الجديدة</Label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10"
              placeholder="برجاء كتابة كلمة المرور"
            />
            <div
              className="absolute left-3 top-2.5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10"
              placeholder="برجاء تأكيد كلمة المرور"
            />
            <div
              className="absolute left-3 top-2.5 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={resetPasswordLoading}
          className="w-full"
        >
          {resetPasswordLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
              جاري الحفظ...
            </>
          ) : (
            "تحديث كلمة المرور"
          )}
        </Button>
      </form>
    </div>
  );
}
