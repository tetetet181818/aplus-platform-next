import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash, Edit, Eye, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

import Image from "next/image";

const UserNotesList = ({ userNotes, onNavigate, onDeleteRequest }) => {
  if (!userNotes || userNotes.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed border-gray-300 dark:border-gray-600">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full">
            <BookOpen className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          لا توجد ملخصات
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          لم تقم بإضافة أي ملخصات بعد. ابدأ الآن وشارك معرفتك!
        </p>
        <Button
          onClick={() => onNavigate("/add-note")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          إضافة ملخص جديد
        </Button>
      </Card>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          ملخصاتي المعروضة
        </h2>
        <Button
          onClick={() => onNavigate("/add-note")}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Edit className="ml-2 h-4 w-4" /> إضافة ملخص
        </Button>
      </div>

      {userNotes.map((note, index) => (
        <motion.div
          key={note.id}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 aspect-[16/10] overflow-hidden">
                <Image
                  alt={note.title || "صورة الملخص"}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  src={note?.cover_url}
                  width={"100%"}
                  height={"100%"}
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4 md:p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                      {note.title}
                    </h3>
                    <Badge className="text-sm px-3 py-1 bg-primary/10 text-primary border-primary/50 dark:bg-sky-400/10 dark:text-sky-300 dark:border-sky-400/50">
                      {note.price} ريال
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {note.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {note.university}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {note.college}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {note.subject}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                    <span>التحميلات: {note.downloads || 0}</span> |{" "}
                    <span>
                      التقييم:{" "}
                      {note.rating ? `${note.rating.toFixed(1)}/5` : "لا يوجد"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(`/notes/${note.id}`)}
                      className="text-primary border-primary hover:bg-primary/10 dark:text-sky-400 dark:border-sky-400 dark:hover:bg-sky-400/10"
                    >
                      <Eye className="h-4 w-4 ml-1" /> عرض
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(`/add-note?edit=${note.id}`)}
                      className="text-green-600 border-green-600 hover:bg-green-600/10 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-400/10"
                    >
                      <Edit className="h-4 w-4 ml-1" /> تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteRequest(note)}
                    >
                      <Trash className="h-4 w-4 ml-1" /> حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default UserNotesList;
