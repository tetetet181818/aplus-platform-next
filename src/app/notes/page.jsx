import LoadingSpinner from "@/components/shared/LoadingSpinner";
import NotesListPage from "@/pages/notes/NotesListPage";
import { Suspense } from "react";

export default function Notes() {
  return (
    <Suspense fallback={<LoadingSpinner message="جاري البحث..." />}>
      <NotesListPage />
    </Suspense>
  );
}
