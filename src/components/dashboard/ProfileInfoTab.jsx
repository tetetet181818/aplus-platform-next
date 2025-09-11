"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User, Mail, School, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import UpdateInfoDialog from "./UpdateInfoDialog";
import Link from "next/link";

const ProfileInfoTab = ({
  user,
  loading,
  deleteAccount,
  updateUserInfo,
  updateUserPassword,
}) => {
  const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
  if (!user) return null;
  const infoItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const handleDeleteAccount = async () => {
    let res = await deleteAccount();
  };
  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={Variants}
        className="w-full max-w-3xl mx-auto"
      >
        <Card className="shadow-lg border-gray-200 dark:border-gray-700">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              المعلومات الشخصية
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              <div className="flex gap-1">
                <span>+أ</span>
                <span>تفاصيل حسابك في منصة</span>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Name Field */}
            <motion.div
              variants={infoItemVariants}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                <User className="h-5 w-5 text-primary dark:text-primary-light" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  الاسم الكامل
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 mt-1">
                  {user?.full_name || "غير محدد"}
                </p>
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              variants={infoItemVariants}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                <Mail className="h-5 w-5 text-primary dark:text-primary-light" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  البريد الإلكتروني
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 mt-1">
                  {user.email}
                </p>
              </div>
            </motion.div>

            {/* University Field */}
            <motion.div
              variants={infoItemVariants}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                <School className="h-5 w-5 text-primary dark:text-primary-light" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  الجامعة
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 mt-1">
                  {user.university || "لم يتم التحديد"}
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={infoItemVariants}
              className="pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col justify-center sm:flex-row gap-3"
            >
              <Button className=" space-y-2">
                <Link
                  href={"/reset-password"}
                  className="flex items-center gap-1"
                >
                  <Edit3 className="size-4" />
                  <span> تعديل كلمه المرور</span>
                </Link>
              </Button>
              <Button
                onClick={() => setOpenDialogUpdate(true)}
                className={"flex gap-1"}
              >
                <Edit3 className="size-4" />
                <span>تعديل الملف الشخصي</span>
              </Button>
              <Button variant="destructive" onClick={() => deleteAccount()}>
                <Trash2 className="size-4" />
                <span>حذف الحساب</span>
              </Button>
            </motion.div>

            {/* Warning Message */}
            <motion.p
              variants={infoItemVariants}
              className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 px-2"
            >
              تذكر: حذف الحساب إجراء نهائي ولا يمكن التراجع عنه. سيتم حذف جميع
              بياناتك وملخصاتك.
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
      {openDialogUpdate && (
        <UpdateInfoDialog
          isOpen={setOpenDialogUpdate}
          onClose={setOpenDialogUpdate}
          user={user}
          loading={loading}
          updateUserInfo={updateUserInfo}
        />
      )}
    </>
  );
};

export default ProfileInfoTab;
