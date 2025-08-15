"use client";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import AddNotePage from "@/pages/notes/AddNotePage";
import { useAuthStore } from "@/stores/useAuthStore";
import { Suspense } from "react";

export default function AddNote() {
  const { isAuthenticated } = useAuthStore((state) => state);
  return (
    <Suspense fallback={<LoadingSpinner message="جاري التحميل..." />}>
      <AddNotePage isAuthenticated={isAuthenticated} />
    </Suspense>
  );
}
