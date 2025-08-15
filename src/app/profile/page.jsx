import LoadingSpinner from "@/components/shared/LoadingSpinner";
import UserDashboardPage from "@/pages/UserDashboardPage";
import { Suspense } from "react";

export default function Profile() {
  return (
    <Suspense fallback={<LoadingSpinner message="جاري التحميل..." />}>
      <UserDashboardPage />
    </Suspense>
  );
}
