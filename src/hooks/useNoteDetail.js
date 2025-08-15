"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/stores/useAuthStore";
import { useFileStore } from "@/stores/useFileStore";

const useNoteDetail = ({ id }) => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    user: currentUser,
    isAuthenticated,
    getUserById,
    addNoteToLikeList,
    removeNoteFromLikeList,
    likeLoading,
  } = useAuthStore();
  const {
    getSingleNote,
    note,
    deleteNote,
    downloadNote,
    addReviewToNote,
    loading,
    downloadLoading,
  } = useFileStore();

  const [isPurchaseConfirmOpen, setIsPurchaseConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [owner, setOwner] = useState(null);

  const fetchNote = useCallback(async () => {
    if (!id) return setError("معرف الملخص غير صالح");
    try {
      await getSingleNote({ id });
      setError(null);
    } catch (err) {
      setError("فشل في تحميل الملخص");
      console.error("Failed to fetch note:", err);
    }
  }, [id, getSingleNote]);

  useEffect(() => {
    if (id) fetchNote();
  }, [fetchNote, id]);

  useEffect(() => {
    const fetchOwner = async () => {
      if (note?.owner_id) {
        const ownerData = await getUserById({ id: note.owner_id });
        setOwner(ownerData);
      }
    };
    fetchOwner();
  }, [note?.owner_id, getUserById]);

  const isOwner = currentUser?.id === note?.owner_id;
  const hasPurchased = note?.purchased_by?.includes(currentUser?.id);
  const alreadyReviewed = note?.reviews?.some(
    (r) => r.userId === currentUser?.id
  );

  const handlePurchase = useCallback(() => {
    if (!isAuthenticated) {
      toast({
        title: "مطلوب تسجيل الدخول",
        description: "يرجى تسجيل الدخول أولاً لإتمام عملية الشراء",
        variant: "destructive",
      });
      return router.push(`/notes/${id}`);
    }
    setIsPurchaseConfirmOpen(true);
  }, [isAuthenticated, id, router, toast]);
  const confirmPurchase = () => {
    router.push(
      `/checkout?userId=${currentUser?.id}&noteId=${note?.id}&amount=${note?.price}`
    );
  };

  const confirmDelete = useCallback(async () => {
    try {
      await deleteNote({ id: note?.id });
      toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف ملخص "${note?.title}" بنجاح`,
      });
      router.push("/notes");
    } catch (err) {
      toast({
        title: "فشل في الحذف",
        description: err.message || "حدث خطأ أثناء حذف الملخص",
        variant: "destructive",
      });
    } finally {
      setIsDeleteConfirmOpen(false);
    }
  }, [note, deleteNote, router, toast]);

  const handleReviewRequest = useCallback(() => {
    if (!isAuthenticated) {
      toast({
        title: "مطلوب تسجيل الدخول",
        description: "يرجى تسجيل الدخول لتقييم الملخص",
        variant: "destructive",
      });
      return router.push(`/notes/${id}`);
    }
    if (!hasPurchased) {
      toast({
        title: "غير مسموح بالتقييم",
        description: "يجب شراء الملخص أولاً لتتمكن من تقييمه",
        variant: "destructive",
      });
      return;
    }
    setIsReviewDialogOpen(true);
  }, [hasPurchased, id, isAuthenticated, router, toast]);

  const handleDownloadFile = useCallback(async () => {
    try {
      await downloadNote(note?.file_path);
    } catch (err) {
      toast({
        title: "فشل في التحميل",
        description: "حدث خطأ أثناء تحميل الملف",
        variant: "destructive",
      });
    }
  }, [note?.file_path, downloadNote, toast]);

  return {
    note,
    currentUser,
    owner,
    isOwner,
    hasPurchased,
    alreadyReviewed,
    isAuthenticated,
    isPurchaseConfirmOpen,
    isDeleteConfirmOpen,
    isReviewDialogOpen,
    setIsPurchaseConfirmOpen,
    setIsDeleteConfirmOpen,
    setIsReviewDialogOpen,
    handlePurchase,
    confirmPurchase,
    confirmDelete,
    handleReviewRequest,
    handleDownloadFile,
    addReviewToNote,
    error,
    loading,
    addNoteToLikeList,
    removeNoteFromLikeList,
    likeLoading,
    downloadLoading,
  };
};

export default useNoteDetail;
