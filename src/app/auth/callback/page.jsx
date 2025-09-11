"use client";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuthStore((state) => state);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 z-50 h-screen w-screen flex flex-col items-center justify-center bg-white/40 backdrop-blur-md">
          <LoadingSpinner
            className="w-12 h-12 text-blue-600 mb-4"
            message="جاري تأكيد دخولك، برجاء الانتظار..."
          />
        </div>
      )}
    </>
  );
}
