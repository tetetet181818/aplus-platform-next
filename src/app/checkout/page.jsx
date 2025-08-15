import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import Head from "next/head";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function CheckoutPage() {
  return (
    <>
      <Head>
        <title>إتمام الدفع | منصة أ+</title>
        <meta
          name="description"
          content="إتمام عملية الدفع لشراء الملخصات الدراسية"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Suspense fallback={<LoadingSpinner message="جاري البحث..." />}>
        <CheckoutClient />
      </Suspense>
    </>
  );
}
