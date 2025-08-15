"use client";
import AddNotePage from "@/pages/notes/AddNotePage";
import { useAuthStore } from "@/stores/useAuthStore";
import { useParams } from "next/navigation";

export default function Edit() {
  const { edit } = useParams();
  const { isAuthenticated } = useAuthStore((state) => state);
  return (
    <>
      <AddNotePage isAuthenticated={isAuthenticated} edit={edit} />
    </>
  );
}
