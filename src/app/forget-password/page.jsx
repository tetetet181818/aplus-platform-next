import ForgetPassword from "@/components/auth/ForgetPassword";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Suspense } from "react";

export default function ForgetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="جاري التحميل..." />}>
      <ForgetPassword />
    </Suspense>
  );
}
