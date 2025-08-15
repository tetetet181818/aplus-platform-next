import { Suspense } from "react";
import Head from "next/head";
import PaymentSuccessClient from "./PaymentSuccessClient";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
export default function page() {
  return (
    <div>
      <Head>
        <title>تأكيد الدفع | منصة أ+</title>
        <meta name="description" content="صفحة تأكيد عملية الدفع الناجحة" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Suspense fallback={<LoadingSpinner message="جاري البحث..." />}>
        <PaymentSuccessClient />
      </Suspense>
    </div>
  );
}
