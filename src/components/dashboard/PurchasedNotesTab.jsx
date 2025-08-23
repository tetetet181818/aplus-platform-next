import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Loader } from "lucide-react";
import NoResults from "@/components/shared/NoResults";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

const PurchasedNotesTab = ({
  notes,
  onNavigate,
  onDownload,
  loading,
  downloadLoading,
}) => {
  if (!loading) {
    if (notes?.length === 0) {
      return (
        <NoResults
          icon={
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          }
          title="لا توجد مشتريات"
          message="لم تقم بشراء أي ملخصات بعد."
          actionButton={
            <Button onClick={() => onNavigate("/notes")}>تصفح الملخصات</Button>
          }
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      {notes.map((note) => {
        return (
          <Card
            key={note.id}
            className="py-0 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/3 lg:w-1/4 aspect-video sm:aspect-auto bg-gray-100 dark:bg-gray-800">
                <Image
                  loading="lazy"
                  alt={note.title}
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                  src={note?.cover_url}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {note.title}
                    </h3>
                    <Badge className="bg-green-500 text-white">تم الشراء</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                    {note.description}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs mb-3">
                    <Badge variant="outline">{note.university}</Badge>
                    <Badge variant="outline">{note.subject}</Badge>
                  </div>
                  <Badge variant="outline">
                    رقم المبيعه : <span className="mx-2">{note?.saleId}</span>
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
                    السعر: {note.price}
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
                      size="sm"
                      onClick={() => onDownload(note)}
                      variant="outline"
                      className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                      disabled={downloadLoading}
                    >
                      {downloadLoading ? (
                        <>
                          <Loader className="size-5 animate-spin" />
                          <span>جاري التحميل</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 ml-1" />
                          تحميل
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PurchasedNotesTab;
