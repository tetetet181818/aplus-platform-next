"use client";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/components/ui/use-toast";
import { validationForgetPassword } from "@/utils/validation/authValidation";
export default function ForgetPassword() {
  const { loadingForgetPassword, forgetPassword } = useAuthStore(
    (state) => state
  );

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationForgetPassword,
    onSubmit: async ({ email }) => {
      try {
        await forgetPassword({ email });
        toast({
          title: "تم إرسال رابط إعادة التعيين",
          description: "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.",
          variant: "success",
        });
      } catch (err) {
        toast({
          title: " حاول مرة أخرى",
          description: "حدث خطأ أثناء إرسال البريد. حاول مرة أخرى.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-sm my-20">
      <h2 className="text-2xl font-semibold text-center mb-4">
        نسيت كلمة المرور
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="pr-10"
            />
            <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loadingForgetPassword}
          className="w-full"
        >
          {loadingForgetPassword ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
              جارٍ الإرسال...
            </>
          ) : (
            "إرسال رابط إعادة التعيين"
          )}
        </Button>
      </form>
    </div>
  );
}
