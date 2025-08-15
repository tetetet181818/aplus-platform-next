import ResetPassword from "@/components/auth/ResetPassword";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="جاري البحث..." />}>
      <ResetPassword />
    </Suspense>
  );
}
