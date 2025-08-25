import { useCallback, memo } from "react";
import formatArabicDate from "@/config/formateTime";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import Image from "next/image";

const FileDetailsDialog = memo(({ open, onClose, item }) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rtl">
        <div className="space-y-6 py-2">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 text-right">
            {item?.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            <DetailItem label="الكلية:" value={item?.college} />
            <DetailItem label="الجامعة:" value={item?.university} />
            <DetailItem label="المادة:" value={item?.subject} />
            <DetailItem label="السنة:" value={item?.year} />
            <DetailItem label="عدد الصفحات:" value={item?.pages_number} />
            <DetailItem
              label="السعر:"
              value={item?.price ? `${item.price} ر.س` : "غير محدد"}
            />
            <DetailItem label="التنزيلات:" value={item?.downloads || 0} />
            <DetailItem
              label="تاريخ الإنشاء:"
              value={formatArabicDate(item?.created_at)}
            />
          </div>

          {item?.description && (
            <div className="bg-gray-50 p-4 rounded-lg text-right">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                الوصف:
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {item?.contact_method && (
            <div className="text-right">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                طريقة التواصل:
              </h3>
              <a
                href={`tel:${item.contact_method}`}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                aria-label="اتصال على الرقم"
              >
                {item.contact_method}
              </a>
            </div>
          )}

          {item?.cover_url && (
            <div className="text-right">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                معاينة:
              </h3>
              <div className="relative w-full max-w-[300px] mx-auto aspect-[3/4]">
                <Image
                  src={item.cover_url}
                  alt="غلاف الملف"
                  fill
                  className="object-cover rounded-lg shadow-md"
                  sizes="(max-width: 768px) 100vw, 300px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjJmMmYyIi8+PC9zdmc+"
                />
              </div>
            </div>
          )}

          {item?.file_url && (
            <div className="text-right">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                الملف:
              </h3>
              <a
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                aria-label="عرض ملف PDF"
              >
                <span>عرض PDF</span>
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </a>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

const DetailItem = memo(({ label, value }) => {
  if (!value) return null;

  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      <span className="font-semibold text-gray-700">{label} </span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
});

FileDetailsDialog.displayName = "FileDetailsDialog";
DetailItem.displayName = "DetailItem";

export default FileDetailsDialog;
