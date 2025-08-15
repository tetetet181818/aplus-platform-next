import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Edit3,
  BookOpen,
  ShoppingBag,
  School as University,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

const UserProfileCard = ({
  currentUser,
  onEditProfile,
  userNotesCount,
  purchasedNotesCount,
  totalEarnings,
}) => {
  if (!currentUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden shadow-xl bg-gradient-to-br from-primary to-blue-600 dark:from-gray-800 dark:to-gray-900 text-white">
        <CardHeader className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage
              src={currentUser.avatar || ""}
              alt={currentUser.name}
            />
            <AvatarFallback className="text-3xl bg-gray-200 dark:bg-gray-700 text-primary">
              {currentUser.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-right">
            <CardTitle className="text-3xl font-bold">
              {currentUser.name}
            </CardTitle>
            <p className="text-blue-100 dark:text-gray-300 mt-1">
              {currentUser.email}
            </p>
            <div className="flex items-center justify-center sm:justify-start text-sm text-blue-200 dark:text-gray-400 mt-1">
              <University className="h-4 w-4 ml-1" />
              <span>{currentUser.university || "الجامعة غير محددة"}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEditProfile}
            className="mt-4 sm:mt-0 sm:mr-auto bg-white/20 hover:bg-white/30 text-white border-white/50"
          >
            <Edit3 className="ml-2 h-4 w-4" /> تعديل الملف الشخصي
          </Button>
        </CardHeader>
        <CardContent className="p-6 bg-white/10 dark:bg-black/20 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-white/5 dark:bg-black/10">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-200 dark:text-blue-300" />
              <p className="text-2xl font-semibold">{userNotesCount}</p>
              <p className="text-sm text-blue-100 dark:text-gray-300">
                ملخصاتي المعروضة
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 dark:bg-black/10">
              <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-blue-200 dark:text-blue-300" />
              <p className="text-2xl font-semibold">{purchasedNotesCount}</p>
              <p className="text-sm text-blue-100 dark:text-gray-300">
                ملخصاتي المشتراة
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 dark:bg-black/10">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-300 dark:text-green-400" />
              <p className="text-2xl font-semibold">
                {totalEarnings !== undefined
                  ? totalEarnings.toFixed(2)
                  : "0.00"}{" "}
                <span className="text-lg">ريال</span>
              </p>
              <p className="text-sm text-blue-100 dark:text-gray-300">
                إجمالي الأرباح
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfileCard;
