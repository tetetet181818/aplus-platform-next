"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";
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
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row">
              <div className="relative sm:w-1/3 lg:w-1/4 aspect-video sm:aspect-[4/3] bg-gray-100 dark:bg-gray-800">
                <Image
                  alt={note.title}
                  fill
                  className="object-cover"
                  src={note.cover_url}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                      {note.title}
                    </h2>
                    <Badge variant="secondary">{note.price} ريال</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {note.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{note.university}</Badge>
                    <Badge variant="outline">{note.subject}</Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                    التحميلات: {note.downloads || 0} | التقييم:{" "}
                    {note.rating ? note.rating.toFixed(1) : "N/A"}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/notes/${note.id}`)}
                    >
                      <Eye className="h-4 w-4 ml-1" />
                      عرض
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
                    >
                      <Heart className="h-4 w-4 ml-1" />
                      إزالة الإعجاب
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
