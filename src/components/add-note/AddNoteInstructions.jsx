import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  FileUp,
  Info,
} from "lucide-react";
import {
  MAX_NOTES_PER_USER,
  MAX_FILE_SIZE_MB,
  MAX_PAGES_PER_NOTE,
  ALLOWED_FILE_TYPES_STRING,
} from "@/constants/index.js";

const InstructionItem = ({ icon, title, children }) => (
  <div className="flex items-start space-x-3 rtl:space-x-reverse">
    <div className="flex-shrink-0 text-primary">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-800 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
    </div>
  </div>
);

const AddNoteInstructions = () => {
  return (
    <Card className="bg-gray-50 dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">إرشادات وشروط الإضافة</CardTitle>
        </div>
        <CardDescription>
          يرجى قراءة الشروط والنصائح التالية بعناية قبل إضافة ملخصك.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center">
            <Info className="h-5 w-5 mr-2 text-red-500" />
            شروط أساسية (إلزامية):
          </h3>
          <div className="space-y-4 pl-2 border-r-2 border-red-500 dark:border-red-400 pr-4">
            <InstructionItem
              icon={<Users className="h-5 w-5 text-red-500" />}
              title={`الحد الأقصى للملخصات: ${MAX_NOTES_PER_USER}`}
            >
              يمكن لكل مستخدم إضافة ما يصل إلى {MAX_NOTES_PER_USER} ملخصًا.
            </InstructionItem>
            <InstructionItem
              icon={<FileText className="h-5 w-5 text-red-500" />}
              title={`عدد الصفحات: حتى ${MAX_PAGES_PER_NOTE} صفحة`}
            >
              يجب ألا يتجاوز عدد صفحات الملخص {MAX_PAGES_PER_NOTE} صفحة.
            </InstructionItem>
            <InstructionItem
              icon={<FileUp className="h-5 w-5 text-red-500" />}
              title={`الملف: ${ALLOWED_FILE_TYPES_STRING} فقط، بحجم ${MAX_FILE_SIZE_MB}MB كحد أقصى`}
            >
              يجب أن يكون الملف بصيغة PDF وألا يتجاوز حجمه {MAX_FILE_SIZE_MB}{" "}
              ميجابايت.
            </InstructionItem>
            <InstructionItem
              icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
              title="حقوق الملكية الفكرية"
            >
              يجب أن يكون الملخص من إعدادك الخاص ولا ينتهك حقوق الملكية الفكرية
              لأي طرف آخر. سيتم حذف أي ملخص مخالف.
            </InstructionItem>
          </div>
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            نصائح لتحسين ملخصك:
          </h3>
          <div className="space-y-4 pl-2 border-r-2 border-green-500 dark:border-green-400 pr-4">
            <InstructionItem
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              title="عنوان واضح وجذاب"
            >
              استخدم عنواناً مختصراً ودقيقاً يصف محتوى الملخص ويجذب انتباه
              الطلاب.
            </InstructionItem>
            <InstructionItem
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              title="وصف تفصيلي ومفيد"
            >
              اشرح محتويات الملخص، المواضيع التي يغطيها، ولمن هو موجه. كلما كان
              الوصف أفضل، زادت فرص البيع.
            </InstructionItem>
            <InstructionItem
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              title="سعر تنافسي وعادل"
            >
              حدد سعراً مناسباً يعكس جودة الملخص وجهدك، ويكون في متناول الطلاب.
            </InstructionItem>
            <InstructionItem
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              title="معلومات دقيقة ومحدثة"
            >
              تأكد من صحة المعلومات المتعلقة بالجامعة، الكلية، المادة الدراسية،
              والسنة.
            </InstructionItem>
            <InstructionItem
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              title="طريقة تواصل واضحة"
            >
              أضف وسيلة تواصل فعالة (رقم واتساب أو بريد إلكتروني) ليتمكن
              المشترون من التواصل معك بسهولة إذا لزم الأمر.
            </InstructionItem>
            <InstructionItem
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
              title="صورة غلاف مميزة (اختياري)"
            >
              صورة غلاف جذابة قد تزيد من فرص مشاهدة وبيع ملخصك.
            </InstructionItem>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddNoteInstructions;
