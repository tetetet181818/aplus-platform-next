import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const DeleteNoteDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  noteTitle,
}) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
          تأكيد الحذف
        </DialogTitle>
        <DialogDescription className="text-gray-600 dark:text-gray-400">
          هل أنت متأكد من رغبتك في حذف ملخص "{noteTitle}"؟ لا يمكن التراجع عن
          هذا الإجراء.
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center justify-center my-6 text-destructive">
        <AlertTriangle className="h-16 w-16" />
      </div>
      <DialogFooter className="gap-2 sm:justify-end">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          إلغاء
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          تأكيد الحذف
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const PurchaseNoteDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  note,
}) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
          تأكيد الشراء
        </DialogTitle>
        <DialogDescription className="text-gray-600 dark:text-gray-400">
          أنت على وشك شراء ملخص "{note.title}" بمبلغ {note.price} ريال.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 my-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              الملخص:
            </span>
            <span className="text-gray-800 dark:text-white">{note.title}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              السعر:
            </span>
            <span className="font-bold text-primary dark:text-primary-light">
              {note.price} ريال
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              المؤلف:
            </span>
            <span className="text-gray-800 dark:text-white">{note.author}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          بعد إتمام عملية الشراء، سيكون بإمكانك تحميل الملخص وتقييمه لاحقاً من
          قسم "مشترياتي" في ملفك الشخصي. (هذه عملية محاكاة لأغراض العرض).
        </p>
      </div>
      <DialogFooter className="gap-2 sm:justify-end">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          إلغاء
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-accent hover:bg-accent-dark text-white"
        >
          تأكيد الشراء
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
