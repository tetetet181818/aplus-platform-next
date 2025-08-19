import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, PlusCircle, Eye, Download, Loader } from "lucide-react";
import NoResults from "@/components/shared/NoResults";
import { BookOpen } from "lucide-react";
import Image from "next/image";

const UserNotesTab = ({
  notes,
  onDeleteRequest,
  onNavigate,
  onDownloadRequest,
  loading,
}) => {
  if (notes.length === 0) {
    return (
      <NoResults
        icon={<BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />}
        title="لا توجد ملخصات"
        message="لم تقم بإضافة أي ملخصات بعد."
        actionButton={
          <Button
            onClick={() => onNavigate("/add-note")}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            إضافة ملخص جديد
          </Button>
        }
      />
    );
  }
  return (
    <div className="space-y-6">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="py-0 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3 lg:w-1/4 aspect-video sm:aspect-auto bg-gray-100 dark:bg-gray-800">
              <Image
                alt={note.title}
                className="w-full h-full object-cover"
                src={note.cover_url}
                width={500}
                height={500}
              />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {note.title}
                  </h3>
                  <Badge className="bg-primary text-primary-foreground">
                    {note.price} ريال
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                  {note.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs mb-3">
                  <Badge variant="outline">{note.university}</Badge>
                  <Badge variant="outline">{note.subject}</Badge>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                  التحميلات: {note.downloads || 0} | التقييم:{" "}
                  {note.rating ? note.rating.toFixed(1) : "N/A"}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate(`/notes/${note.id}`)}
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    عرض
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownloadRequest(note)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader className="size-4 animate-spin" />
                        جاري التحميل
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 ml-1" />
                        تحميل
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900"
                    onClick={() => onNavigate(`/add-note/${note.id}`)}
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteRequest(note)}
                  >
                    <Trash className="h-4 w-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserNotesTab;
