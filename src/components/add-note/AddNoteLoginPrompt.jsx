import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const AddNoteLoginPrompt = ({ onNavigate }) => {
  return (
    <div className=" py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">يجب تسجيل الدخول</CardTitle>
          <CardDescription>
            لإضافة ملخص جديد، يرجى تسجيل الدخول إلى حسابك أو إنشاء حساب جديد.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            انضم إلى مجتمعنا وشارك ملخصاتك مع آلاف الطلاب.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => onNavigate("/")} className="w-full">
              العودة للرئيسية
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-300 pt-2">
            تسجيل الدخول متاح من خلال القائمة العلوية.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNoteLoginPrompt;
