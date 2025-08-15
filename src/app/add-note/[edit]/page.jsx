"use client";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import AddNotePage from "@/pages/notes/AddNotePage";
import { useAuthStore } from "@/stores/useAuthStore";
import { useParams } from "next/navigation";
import { Suspense } from "react";

export default function Edit() {
  const { edit } = useParams();
  const { isAuthenticated } = useAuthStore((state) => state);
  return (
    <Suspense fallback={<LoadingSpinner message="جاري التحميل..." />}>
      <AddNotePage isAuthenticated={isAuthenticated} edit={edit} />
    </Suspense>
  );
}
