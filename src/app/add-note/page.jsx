"use client";
import AddNotePage from "@/pages/notes/AddNotePage";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AddNote() {
  const { isAuthenticated } = useAuthStore((state) => state);
  return (
    <>
      <AddNotePage isAuthenticated={isAuthenticated} />
    </>
  );
}
