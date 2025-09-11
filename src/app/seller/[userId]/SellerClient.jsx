"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { BookOpen, School, UserCircle, RefreshCw } from "lucide-react";
import NoteCard from "@/components/shared/NoteCard";
import { useFileStore } from "@/stores/useFileStore";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const SellerProfilePage = ({ userId }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [sellerNotes, setSellerNotes] = useState([]);
  const {
    getUserById,
    loading: sellerLoading,
    seller,
    error: sellerError,
    clearError: clearSellerError,
  } = useAuthStore();

  const {
    getSellerNotes,
    loading: notesLoading,
    error: notesError,
    clearError: clearNotesError,
  } = useFileStore();

  useEffect(() => {
    const getSeller = async () => {
      await getUserById({ id: userId });
    };
    getSeller();
  }, [userId]);

  useEffect(() => {
    const getNotes = async () => {
      if (userId) {
        const res = await getSellerNotes({ sellerId: userId });
        if (res) {
          setSellerNotes(res);
        }
      }
    };
    getNotes();
  }, [userId]);

  useEffect(() => {
    if (sellerError) {
      clearSellerError();
    }

    if (notesError) {
      clearNotesError();
    }
  }, [sellerError, notesError]);

  if (sellerLoading || notesLoading) {
    return <LoadingSpinner message="جاري التحميل...." />;
  }

  if (!sellerLoading && !seller) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[70vh] flex items-center justify-center px-4"
      >
        <Card className="w-full max-w-md p-8 text-center shadow-lg rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full opacity-80"></div>
              <UserCircle className="relative z-10 h-full w-full text-red-500 dark:text-red-400 p-4" />
            </div>
          </motion.div>

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            البائع غير موجود
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            عذراً، لا يمكننا العثور على البائع الذي تبحث عنه. قد يكون الحساب غير
            موجود أو تم حذفه.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/notes" className="w-full sm:w-auto">
              <Button className="w-full" variant="outline">
                تصفح الملخصات المتاحة
              </Button>
            </Link>
            <Button
              onClick={() => router.refresh()}
              variant="ghost"
              className="w-full sm:w-auto bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              إعادة المحاولة
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع الدعم الفني
            </p>
            <Button
              variant="link"
              className="text-blue-600 dark:text-blue-400 mt-2"
            >
              تواصل معنا
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className=" py-12 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8 overflow-hidden shadow-lg">
          <div className="h-20 bg-gradient-to-r from-primary to-blue-500"></div>
          <CardContent className="p-6 pt-0 -mt-16">
            <div className="flex flex-col items-center md:flex-row md:items-end md:space-x-6">
              <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                <AvatarFallback className="text-4xl bg-gray-200">
                  {seller?.full_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 md:mt-0 text-center md:text-left my-5">
                <h1 className="text-3xl font-bold">
                  {seller?.full_name || "بائع غير معروف"}
                </h1>
                {seller?.university && (
                  <p className="text-gray-600 flex items-center justify-center md:justify-start mt-2">
                    <School className="ml-2 h-5 w-5 text-primary" />
                    {seller.university}
                  </p>
                )}
                <div className="flex items-center justify-center md:justify-start mt-4 space-x-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    {sellerNotes.length} ملخص
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seller Notes Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6">ملخصات {seller.full_name}</h2>

        {notesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <Skeleton className="h-40 w-full rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sellerNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={{
                  ...note,
                  author: seller.full_name,
                  authorId: seller.id,
                  avatar: seller.avatar,
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">لا توجد ملخصات</h3>
            <p className="text-gray-600">
              هذا البائع لم يقم بإضافة أي ملخصات بعد.
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default SellerProfilePage;
