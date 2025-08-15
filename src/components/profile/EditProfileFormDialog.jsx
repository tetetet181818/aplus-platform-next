"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";

const EditProfileFormDialog = ({
  isOpen,
  onOpenChange,
  currentUser,
  onUpdateProfile,
  universities,
}) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    university: "",
  });

  useEffect(() => {
    if (currentUser && isOpen) {
      setProfileData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        university: currentUser.university || "",
      });
    }
  }, [currentUser, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUniversityChange = (value) => {
    setProfileData((prev) => ({ ...prev, university: value }));
  };

  const handleSubmit = () => {
    onUpdateProfile(profileData);
  };

  if (!currentUser) {
    return null;
  }

  const universityOptions = universities
    ? universities.map((uni) => ({ value: uni, label: uni }))
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            تعديل الملف الشخصي
          </DialogTitle>
          <DialogDescription>
            قم بتحديث معلومات ملفك الشخصي هنا.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="edit-profile-name">الاسم الكامل</Label>
            <Input
              id="edit-profile-name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              placeholder="أدخل اسمك الكامل"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-profile-email">البريد الإلكتروني</Label>
            <Input
              id="edit-profile-email"
              name="email"
              type="email"
              value={profileData.email}
              disabled
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              لا يمكن تغيير البريد الإلكتروني.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-profile-university">الجامعة</Label>
            <Combobox
              options={universityOptions}
              value={profileData.university}
              onSelect={handleUniversityChange}
              placeholder="اختر جامعتك"
              searchPlaceholder="ابحث عن جامعتك..."
              emptyPlaceholder="لم يتم العثور على الجامعة."
              className="h-11"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>حفظ التغييرات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileFormDialog;
