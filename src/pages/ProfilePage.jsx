"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import Head from "next/head";

import UserProfileSummaryCard from "@/components/profile/UserProfileSummaryCard";
import EditProfileFormDialog from "@/components/profile/EditProfileFormDialog";
import UserNotesList from "@/components/profile/UserNotesList";
import PurchasedItemsDisplay from "@/components/profile/PurchasedItemsDisplay";
import DeleteConfirmationDialog from "@/components/dashboard/DeleteConfirmationDialog";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { universities } from "../data/universityData";
import { useFileStore } from "@/stores/useFileStore";

const ProfilePage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const {
    user,
    updateProfile,
    logout,
    isAuthenticated,
    loading: authLoading,
  } = useAuthStore();
  const { getSellerNotes } = useFileStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [userNotes, setUserNotes] = useState([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router, toast]);

  useEffect(() => {
    const fetchUserNotes = async () => {
      if (isAuthenticated && user?.id) {
        try {
          const res = await getSellerNotes({ sellerId: user?.id });
          if (res) setUserNotes(res);
        } catch (error) {
          console.error("Error fetching user notes:", error);
        }
      }
    };
    fetchUserNotes();
  }, [isAuthenticated, user, getSellerNotes]);

  const handleProfileUpdate = async (profileData) => {
    try {
      await updateProfile(profileData);
      setIsEditMode(false);
      toast({
        title: "تم التحديث",
        description: "تم تحديث الملف الشخصي بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث الملف الشخصي",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNote(noteToDelete.id);
      setUserNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      toast({
        title: "نجاح",
        description: `تم حذف الملخص "${noteToDelete.title}" بنجاح.`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حذف الملخص. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!authLoading) {
    if (!isAuthenticated || !user) {
      return (
        <div className=" py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <User className="h-16 w-16 mx-auto text-primary mb-4" />
              <CardTitle className="text-2xl">مطلوب تسجيل الدخول</CardTitle>
              <CardDescription>
                يجب عليك تسجيل الدخول لعرض صفحة الملف الشخصي.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <Button onClick={() => router.push("/")} className="w-full">
                العودة إلى الرئيسية
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return (
    <>
      <Head>
        <title>ملفي الشخصي | منصة الملخصات الدراسية</title>
        <meta
          name="description"
          content="إدارة ملفك الشخصي وملخصاتك الدراسية والمشتريات"
        />
        <meta name="keywords" content="ملخصات, دراسية, جامعة, طالب, تعليم" />
      </Head>

      <main className=" py-12 px-4 md:px-6">
        <motion.h1
          className="text-4xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 dark:from-sky-400 dark:to-blue-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          الملف الشخصي
        </motion.h1>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <UserProfileSummaryCard
              user={user}
              onEdit={() => setIsEditMode(true)}
              onLogout={handleLogout}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <Tabs
              defaultValue="my-notes"
              className="bg-background rounded-xl border"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="my-notes">ملخصاتي</TabsTrigger>
                <TabsTrigger value="purchases">مشترياتي</TabsTrigger>
              </TabsList>

              <TabsContent value="my-notes" className="p-4">
                <UserNotesList
                  userNotes={userNotes}
                  onDeleteRequest={(note) => {
                    setNoteToDelete(note);
                    setIsDeleteDialogOpen(true);
                  }}
                />
              </TabsContent>

              <TabsContent value="purchases" className="p-4">
                <PurchasedItemsDisplay />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <EditProfileFormDialog
          isOpen={isEditMode}
          onOpenChange={setIsEditMode}
          user={user}
          onUpdateProfile={handleProfileUpdate}
          universities={universities}
        />

        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteNote}
          itemTitle={noteToDelete?.title || ""}
        />
      </main>
    </>
  );
};

export default ProfilePage;
