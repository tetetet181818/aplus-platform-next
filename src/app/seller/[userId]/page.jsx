import { Suspense } from "react";
import SellerProfilePage from "./SellerClient";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default async function page({ params }) {
  const { userId } = await params;
  return (
    <Suspense fallback={<LoadingSpinner message="جاري البحث..." />}>
      <SellerProfilePage userId={userId} />
    </Suspense>
  );
}
