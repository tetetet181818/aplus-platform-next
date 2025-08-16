import { Suspense } from "react";
import SellerProfilePage from "./SellerClient";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function page({ params }) {
  const { userId } = params;
  console.log(userId);
  return (
    <Suspense fallback={<LoadingSpinner message="جاري البحث..." />}>
      <SellerProfilePage userId={userId} />
    </Suspense>
  );
}
