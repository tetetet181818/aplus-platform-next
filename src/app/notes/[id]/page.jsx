import LoadingSpinner from "@/components/shared/LoadingSpinner";
import NoteDetailPage from "@/pages/notes/NoteDetailPage";
import { Suspense } from "react";

export default async function NoteDetail({ params }) {
  const { id } = await params;
  return (
    <Suspense fallback={<LoadingSpinner message="جاري البحث..." />}>
      <NoteDetailPage id={id} />
    </Suspense>
  );
}
