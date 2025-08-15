import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const AddNotePageHeader = ({ onBack, edit }) => (
  <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
    <Button
      variant="ghost"
      className="mb-4 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
      onClick={onBack}
    >
      <ArrowRight className="ml-2 size-4" /> العودة
    </Button>
    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white">
      {edit ? "تعديل الملخص" : "إضافة ملخص جديد"}
    </h1>
    <p className="text-gray-600 dark:text-gray-400 mt-2 text-md sm:text-lg">
      {edit
        ? "قم بتحديث معلومات الملخص لضمان دقة المحتوى المعروض."
        : "شارك معرفتك وساعد زملائك بإضافة ملخص جديد للبيع على المنصة."}
    </p>
  </div>
);

export default AddNotePageHeader;
