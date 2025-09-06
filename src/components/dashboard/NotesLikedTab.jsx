"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Star } from "lucide-react";
import NoResults from "@/components/shared/NoResults";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";

const NotesLikedTab = () => {
  const router = useRouter();
  const { getNotesLiked, likedListLoading, likedNotes } = useAuthStore();
  const { toast } = useToast();

  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    getNotesLiked();
  }, [getNotesLiked]);

  useEffect(() => {
    if (!likedListLoading && likedNotes && !initialCheckDone) {
      const storedLikedIds =
        JSON.parse(localStorage.getItem("liked_notes_ids") || "[]") || [];

      const fetchedIds = likedNotes.map((note) => note.id);

      const missingIds = storedLikedIds.filter(
        (id) => !fetchedIds.includes(id)
      );

      if (missingIds.length > 0) {
        toast({
          title: "تنبيه",
          description: "تم حذف بعض الملخصات التي سبق أن أعجبت بها",
          variant: "destructive",
        });
      }

      setInitialCheckDone(true);
    }
  }, [likedListLoading, likedNotes, toast, initialCheckDone]);

  if (likedListLoading) {
    return <LoadingSpinner message="جاري التحميل..." />;
  }

  if (!likedNotes?.length) {
    return (
      <NoResults
        icon={<Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
        title="لا توجد ملخصات معجبة"
        message="لم تقم بالإعجاب بأي ملخصات بعد."
        actionButton={
          <Button
            onClick={() => router.push("/notes")}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            استكشاف الملخصات
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {likedNotes.map((note) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{
            scale: [480, 768].includes(window.innerWidth) ? 1 : 1.02,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full"
        >
          <Card className="py-0 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 w-full">
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-1/3 lg:w-1/4 py-0 aspect-video sm:aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-50 dark:from-gray-700 dark:to-gray-900">
                <Image
                  loading="lazy"
                  alt={note.title}
                  className="object-cover w-full h-full py-0"
                  src={note.cover_url}
                  width={500}
                  height={500}
                  placeholder="blur"
                  blurDataURL="/placeholder-image.jpg"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                <div className="sm:hidden absolute top-3 right-3">
                  <Badge
                    variant="primary"
                    className="text-xs font-medium  bg-blue-500  rounded-full text-white px-2.5 py-0.5 shadow-sm"
                  >
                    {note.price} ريال
                  </Badge>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                    <div className="hidden sm:block">
                      <Badge
                        variant="primary"
                        className="text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-white px-3 py-1 shadow-sm"
                      >
                        {note.price} ريال
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {note.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    <Badge
                      variant="outline"
                      className="text-xs sm:text-sm px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    >
                      {note.university}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs sm:text-sm px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    >
                      {note.college}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full xs:w-auto py-5 text-white transition-colors"
                      onClick={() => router.push(`/notes/${note?.id}`)}
                    >
                      <Eye className="h-4 w-4 ml-1 text-white" />
                      <span className="text-white">عرض التفاصيل</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full xs:w-auto py-5 px-4 text-white bg-red-600 hover:bg-red-700 hover:text-white transition-colors"
                    >
                      <Heart className="h-4 w-4 ml-1 fill-current" />
                      <span>إزالة الإعجاب</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default NotesLikedTab;
