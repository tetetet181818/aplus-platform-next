import LoadingSpinner from "@/components/shared/LoadingSpinner";
import NoteDetailPage from "@/pages/notes/NoteDetailPage";
import { Suspense } from "react";

export default function NoteDetail({ params }) {
  const { id } = params;
  return (
    <Suspense fallback={<LoadingSpinner message="جاري البحث..." />}>
      <NoteDetailPage id={id} />
    </Suspense>
  );
}
