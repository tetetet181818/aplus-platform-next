"use client";
import { Suspense } from "react";
import AuthCallback from "./AuthCallback";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
export default function page() {
  return (
    <Suspense
      fallback={
        <LoadingSpinner message="جاري تأكيد دخولك، برجاء الانتظار..." />
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
