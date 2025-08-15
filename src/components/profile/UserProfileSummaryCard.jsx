import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, LogOut, School as University } from "lucide-react";

const UserProfileSummaryCard = ({ currentUser, onEdit, onLogout }) => {
  if (!currentUser) return null;

  return (
    <Card className="shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 w-full">
      <CardHeader className="text-center bg-gradient-to-br from-primary/10 to-blue-500/10 dark:from-gray-800/50 dark:to-gray-900/50 p-6">
        <div className="flex justify-center mb-4">
          <Avatar className="h-28 w-28 border-4 border-white dark:border-gray-600 shadow-lg">
            <AvatarImage
              src={currentUser.avatar || ""}
              alt={currentUser.name}
            />
            <AvatarFallback className="text-3xl bg-gray-200 dark:bg-gray-700 text-primary">
              {currentUser.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {currentUser.name}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {currentUser.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              الجامعة
            </p>
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <University className="h-5 w-5 ml-2 text-primary dark:text-sky-400" />
              <p className="font-semibold">
                {currentUser.university || "غير محددة"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              نوع الحساب
            </p>
            <Badge
              variant="outline"
              className="text-primary border-primary dark:text-sky-400 dark:border-sky-400"
            >
              {currentUser.role === "student"
                ? "طالب"
                : currentUser.role || "مستخدم"}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          className="flex items-center gap-2 w-full sm:w-auto text-primary border-primary hover:bg-primary/10 dark:text-sky-400 dark:border-sky-400 dark:hover:bg-sky-400/10"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          تعديل الملف
        </Button>
        <Button
          variant="destructive"
          className="flex items-center gap-2 w-full sm:w-auto"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfileSummaryCard;
