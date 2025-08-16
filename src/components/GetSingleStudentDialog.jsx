"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User, Mail, School, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function GetSingleStudentDialog({ open, onClose, student }) {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>عرض بيانات الطالب</DialogTitle>
          <DialogDescription>قم بتحديد الطالب لعرض بياناته</DialogDescription>
        </DialogHeader>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={Variants}
          className="w-full"
        >
          <Card>
            <CardHeader className="border-b">
              <CardTitle>المعلومات الشخصية</CardTitle>
              <CardDescription>تفاصيل الحساب في منصة A+</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <motion.div
                variants={infoItemVariants}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الاسم الكامل</p>
                  <p className="font-medium">
                    {student?.full_name || "غير محدد"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={infoItemVariants}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    البريد الإلكتروني
                  </p>
                  <p className="font-medium">{student?.email}</p>
                </div>
              </motion.div>

              <motion.div
                variants={infoItemVariants}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <School className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الجامعة</p>
                  <p className="font-medium">
                    {student?.university || "لم يتم التحديد"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={infoItemVariants}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted"
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الرصيد</p>
                  <p className="font-medium">{student?.balance}</p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
