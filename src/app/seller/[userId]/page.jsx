import { Suspense } from "react";
import SellerProfilePage from "./SellerClient";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function page() {
  return (
    <Suspense fallback={<LoadingSpinner message="جاري البحث..." />}>
      <SellerProfilePage />
    </Suspense>
  );
}
