"use client";
import { useEffect } from "react";
import supabase from "../../../utils/Supabase-client";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (!searchParams.get("code")) return null;
  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get("code");
      if (!code) return;

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code:", error.message);
        return;
      }

      if (data?.session) {
        console.log("Session created:", data.session);
        router.push("/");
      }
    };

    exchangeCode();
  }, [router, searchParams]);

  return (
    <div className="fixed top-0 left-0 z-50 h-screen w-screen flex flex-col items-center justify-center bg-white/40 backdrop-blur-md">
      <LoadingSpinner
        className="w-12 h-12 text-blue-600 mb-4"
        message="جاري تأكيد دخولك، برجاء الانتظار..."
      />
    </div>
  );
}
