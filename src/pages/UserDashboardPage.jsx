"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { User, BookOpen, ShoppingBag, DollarSign, Heart } from "lucide-react";
import Head from "next/head";

import UserProfileCard from "@/components/dashboard/UserProfileCard";
import EditProfileDialog from "@/components/dashboard/EditProfileDialog";
import UserNotesTab from "@/components/dashboard/UserNotesTab";
import PurchasedNotesTab from "@/components/dashboard/PurchasedNotesTab";
import DeleteConfirmationDialog from "@/components/dashboard/DeleteConfirmationDialog";
import ReviewDialog from "@/components/dashboard/ReviewDialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ProfileInfoTab from "@/components/dashboard/ProfileInfoTab";
import EarningsTab from "@/components/dashboard/EarningsTab";
import { universities } from "@/data/universityData";
import { useFileStore } from "@/stores/useFileStore";
import NotesLikedTab from "@/components/dashboard/NotesLikedTab";

export const metadata = {
  title: "لوحة التحكم - ملخصاتي",
  description: "إدارة ملخصاتك، مشترياتك، وأرباحك في منصة ملخصاتي",
  keywords: ["ملخصات", "دراسة", "جامعة", "أرباح", "لوحة تحكم"],
  openGraph: {
    title: "لوحة التحكم - ملخصاتي",
    description: "إدارة ملخصاتك الدراسية ومتابعة أرباحك",
    url: "https://aplusplatformsa.com",
    type: "website",
  },
};

const UserDashboardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const {
    user,
    updateProfile,
    deleteAccount,
    loading: authLoading,
    updateUserInfo,
    updateUserPassword,
  } = useAuthStore();
  const {
    notes,
    loading: notesLoading,
    hasUserReviewed,
    getPurchasedNotes: fetchPurchasedNotes,
    getSellerNotes,
    addReviewToNote,
    getPurchasedNote,
    downloadNote,
    deleteNote,
    downloadLoading,
  } = useFileStore((state) => state);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userNotesState, setUserNotesState] = useState([]);
  const [purchasedNotesState, setPurchasedNotesState] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [noteToReview, setNoteToReview] = useState(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const activeTab = searchParams.get("tab") || "profile";
  const [userTotalEarnings, setUserTotalEarnings] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      toast({
        title: "الرجاء تسجيل الدخول",
        description: "يجب عليك تسجيل الدخول لعرض هذه الصفحة.",
        variant: "destructive",
      });
    }
  }, [user, authLoading, router, toast]);

  const fetchUserData = useCallback(async () => {
    if (user) {
      try {
        const [uNotes, purchased] = await Promise.all([
          getSellerNotes({ sellerId: user.id }),
          fetchPurchasedNotes({ userId: user.id }),
        ]);

        setUserNotesState(uNotes || []);
        setPurchasedNotesState(purchased || []);

        const totalEarnings = uNotes?.reduce((sum, note) => {
          return sum + (note.downloads || 0) * note.price;
        }, 0);

        setUserTotalEarnings(totalEarnings * 0.85);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }
  }, [user, getSellerNotes, fetchPurchasedNotes]);

  useEffect(() => {
    fetchUserData();
  }, [user, fetchUserData, activeTab, notes]);

  const handleUpdateProfile = async (updatedData) => {
    const success = await updateProfile(updatedData);
    if (success) {
      toast({ title: "نجاح", description: "تم تحديث ملفك الشخصي بنجاح." });
      setIsEditProfileOpen(false);
    } else {
      toast({
        title: "خطأ",
        description: "فشل تحديث الملف الشخصي. حاول مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (id) => {
    const res = await deleteNote(id);
    if (res) {
      setUserNotesState((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete || !deleteType) return;

    let success = false;
    let message = "";

    if (deleteType === "note") {
      success = await deleteNote({ id: itemToDelete.id });
      message = success
        ? `تم حذف الملخص "${itemToDelete.title}" بنجاح.`
        : "فشل حذف الملخص.";
      if (success) {
        setUserNotesState((prev) =>
          prev.filter((n) => n.id !== itemToDelete.id)
        );
      }
    } else if (deleteType === "account") {
      success = await deleteAccount();
      if (success) {
        router.push("/");
      }
      message = success
        ? "تم حذف حسابك وجميع بياناتك بنجاح."
        : "فشل حذف الحساب.";
    }

    toast({
      title: success ? "نجاح" : "خطأ",
      description: message,
      variant: success ? "default" : "destructive",
    });

    setIsDeleteConfirmOpen(false);
    setItemToDelete(null);
    setDeleteType(null);
  };

  const handleReviewRequest = (note) => {
    setNoteToReview(note);
    setIsReviewDialogOpen(true);
  };

  const handleAddReview = async (rating, comment) => {
    if (noteToReview && user) {
      const reviewData = {
        userId: user.id,
        userName: user.full_name,
        userAvatar: user.avatar,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      const res = await addReviewToNote({
        noteId: noteToReview.id,
        reviewData,
      });

      if (res?.success) {
        toast({
          title: "نجاح",
          description: "تم إضافة تقييمك بنجاح.",
        });
        setIsReviewDialogOpen(false);
        fetchUserData();
      }
    }
  };

  const handleDownloadNote = async (note) => {
    try {
      await downloadNote({ filePath: note?.file_path });
      toast({
        title: "بدء التحميل",
        description: `جاري تحميل ملف "${note.title || "الملخص"}"`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل الملف",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.replace(`/profile?${params.toString()}`);
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <motion.div
        className=" py-8 px-4 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <UserProfileCard
          user={user}
          onEditProfile={() => setIsEditProfileOpen(true)}
          userNotesCount={userNotesState.length}
          purchasedNotesCount={purchasedNotesState.length}
          totalEarnings={userTotalEarnings}
        />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="mt-20"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-muted/50 dark:bg-muted/30 p-1.5 rounded-lg mb-6">
            {[
              { value: "profile", icon: User, label: "معلوماتي" },
              { value: "my-notes", icon: BookOpen, label: "ملخصاتي" },
              { value: "purchased", icon: ShoppingBag, label: "مشترياتي" },
              { value: "earnings", icon: DollarSign, label: "أرباحي" },
              { value: "notesLiked", icon: Heart, label: "الاعجابات" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-3 text-sm font-medium transition-all
                    data-[state=active]:bg-primary data-[state=active]:text-white
                    data-[state=active]:shadow-sm rounded-md hover:bg-muted dark:hover:bg-muted/50"
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileInfoTab
              user={user}
              onEditProfile={() => setIsEditProfileOpen(true)}
              handleDeleteNote={handleDeleteNote}
              loading={authLoading}
              updateUserInfo={updateUserInfo}
              deleteAccount={deleteAccount}
              updateUserPassword={updateUserPassword}
            />
          </TabsContent>

          <TabsContent value="my-notes" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <UserNotesTab
                notes={userNotesState}
                onDeleteRequest={(note) => {
                  setItemToDelete(note);
                  setDeleteType("note");
                  setIsDeleteConfirmOpen(true);
                }}
                onNavigate={router.push}
                onDownloadRequest={handleDownloadNote}
                loading={notesLoading}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="purchased" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PurchasedNotesTab
                notes={purchasedNotesState}
                onReviewRequest={handleReviewRequest}
                hasUserReviewed={hasUserReviewed}
                userId={user.id}
                onNavigate={router.push}
                onDownload={handleDownloadNote}
                downloadLoading={downloadLoading}
                loading={notesLoading}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <EarningsTab currentUser={user} getSellerNotes={getSellerNotes} />
            </motion.div>
          </TabsContent>

          <TabsContent value="notesLiked" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <NotesLikedTab />
            </motion.div>
          </TabsContent>
        </Tabs>

        <EditProfileDialog
          isOpen={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          user={user}
          onUpdateProfile={handleUpdateProfile}
          universities={universities}
        />

        <DeleteConfirmationDialog
          isOpen={isDeleteConfirmOpen}
          onOpenChange={setIsDeleteConfirmOpen}
          onConfirm={confirmDeleteItem}
          itemName={
            deleteType === "note" ? itemToDelete?.title : "حسابك بالكامل"
          }
        />

        <ReviewDialog
          isOpen={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
          noteTitle={noteToReview?.title}
          onSubmit={handleAddReview}
          user={user}
        />
      </motion.div>
    </>
  );
};

export default UserDashboardPage;
