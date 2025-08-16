"use client";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, AlertCircle, ImageUp, Loader } from "lucide-react";
import { motion } from "framer-motion";
import {
  ALLOWED_FILE_TYPES_STRING,
  MAX_NOTES_PER_USER,
  MAX_PAGES_PER_NOTE,
  universityColleges,
} from "@/constants/index";
import { useFileStore } from "@/stores/useFileStore";
import { addNoteSchema } from "@/utils/validation/fileValidation";
import { Checkbox } from "@/components/ui/checkbox";

const AddNoteForm = ({ universities, userNotesCount, edit }) => {
  const router = useRouter();
  const { createNote, updateNote, getSingleNote, loading } = useFileStore();
  const isEditMode = !!edit;
  const canAddMoreNotes = userNotesCount < MAX_NOTES_PER_USER;
  const [isUploading, setIsUploading] = useState({ file: false, image: false });
  const [availableColleges, setAvailableColleges] = useState([]);
  const [note, setNote] = useState(null);
  const [initialValuesSet, setInitialValuesSet] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchNote = async () => {
        try {
          const fetchedNote = await getSingleNote({ id: edit });
          if (fetchedNote) {
            setNote(fetchedNote);
            setAvailableColleges(
              universityColleges[fetchedNote.university] || []
            );
            setInitialValuesSet(true);
          } else {
            toast({
              title: "خطأ",
              description: "لم يتم العثور على الملخص.",
              variant: "destructive",
            });
          }
        } catch (err) {
          toast({
            title: "خطأ في جلب الملخص",
            description: err.message || "حدث خطأ أثناء جلب بيانات الملخص.",
            variant: "destructive",
          });
        }
      };
      fetchNote();
    } else {
      setInitialValuesSet(true);
    }
  }, [edit, getSingleNote, isEditMode]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: 0,
      university: "",
      college: "",
      subject: "",
      pagesNumber: 0,
      year: new Date().getFullYear(),
      contactMethod: "",
      file: null,
      imageFile: null,
      fileName: "",
      previewImage: "",
      removeFile: false,
      removePreviewImage: false,
      terms: false,
    },
    validationSchema: addNoteSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (key === "file" || key === "imageFile") {
              if (value) formData.append(key, value);
            } else {
              formData.append(key, value);
            }
          }
        });

        if (isEditMode) {
          await updateNote(edit, formData);
          toast({
            title: "تم التحديث بنجاح",
            description: "تم تحديث الملخص بنجاح.",
            variant: "success",
          });
          router.push(`/notes/${edit}`);
        } else {
          await createNote(formData);
          toast({
            title: "تم إنشاء الملخص بنجاح",
            variant: "success",
          });
          router.push("/notes");
        }
      } catch (err) {
        toast({
          title: isEditMode ? "خطأ في تحديث الملخص" : "خطأ في إضافة الملخص",
          description:
            err.message ||
            `حدث خطأ أثناء ${isEditMode ? "تحديث" : "إضافة"} الملخص.`,
          variant: "destructive",
        });
      }
    },
  });

  // Update form values when note data is loaded
  useEffect(() => {
    if (note && initialValuesSet) {
      formik.setValues({
        title: note.title || "",
        description: note.description || "",
        price: note.price || 0,
        university: note.university || "",
        college: note.college || "",
        subject: note.subject || "",
        pagesNumber: note.pages_number || 0,
        year: note.year || new Date().getFullYear(),
        contactMethod: note.contact_method || "",
        file: null,
        imageFile: null,
        fileName: note.file_path || "",
        previewImage: note.cover_url || "",
        removeFile: false,
        removePreviewImage: false,
        terms: false,
      });
    }
  }, [note, initialValuesSet]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files[0]) return;

    setIsUploading((prev) => ({ ...prev, [name.replace("File", "")]: true }));
    formik.setFieldValue(name, files[0]);
    if (isEditMode) {
      formik.setFieldValue(
        `remove${
          name.charAt(0).toUpperCase() + name.slice(1).replace("File", "")
        }`,
        false
      );
    }
    setIsUploading((prev) => ({ ...prev, [name.replace("File", "")]: false }));
  };

  const handleSelectChange = (name, value) => {
    formik.setFieldValue(name, value);
    if (name === "university") {
      formik.setFieldValue("college", "");
      setAvailableColleges(universityColleges[value] || []);
    }
  };

  if (!initialValuesSet) {
    return (
      <div className="flex justify-center items-center h-64">
        <Ring size={50} speed={1.5} bgOpacity={0.25} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {isEditMode ? "تعديل الملخص" : "إضافة ملخص جديد"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "قم بتحديث معلومات الملخص"
              : "املأ النموذج لإضافة ملخص جديد للبيع"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isEditMode && !canAddMoreNotes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">وصلت للحد الأقصى</p>
                <p className="text-sm text-yellow-700">
                  لقد وصلت إلى الحد الأقصى لعدد الملخصات المسموح به (
                  {MAX_NOTES_PER_USER} ملخص). لا يمكنك إضافة المزيد.
                </p>
              </div>
            </motion.div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان الملخص *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل عنوان الملخص"
                    disabled={!isEditMode && !canAddMoreNotes}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="text-sm text-red-500">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">السعر (ريال) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل سعر الملخص"
                    min="10"
                    disabled={!isEditMode && !canAddMoreNotes}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <p className="text-sm text-red-500">
                      {formik.errors.price}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف الملخص *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="أدخل وصفاً تفصيلياً للملخص"
                  rows={4}
                  disabled={!isEditMode && !canAddMoreNotes}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-sm text-red-500">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="university">الجامعة *</Label>
                  <Select
                    value={formik.values.university}
                    onValueChange={(value) =>
                      handleSelectChange("university", value)
                    }
                    disabled={!isEditMode && !canAddMoreNotes}
                  >
                    <SelectTrigger className={"w-full"}>
                      <SelectValue placeholder="اختر الجامعة" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((uni) => (
                        <SelectItem key={uni} value={uni}>
                          {uni}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.university && formik.errors.university && (
                    <p className="text-sm text-red-500">
                      {formik.errors.university}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">الكلية *</Label>
                  <Select
                    value={formik.values.college}
                    onValueChange={(value) =>
                      handleSelectChange("college", value)
                    }
                    disabled={
                      !formik.values.university ||
                      availableColleges.length === 0 ||
                      (!isEditMode && !canAddMoreNotes)
                    }
                  >
                    <SelectTrigger className={"w-full"}>
                      <SelectValue placeholder="اختر الكلية" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColleges.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.college && formik.errors.college && (
                    <p className="text-sm text-red-500">
                      {formik.errors.college}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">المادة *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل اسم المادة"
                    disabled={!isEditMode && !canAddMoreNotes}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <p className="text-sm text-red-500">
                      {formik.errors.subject}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pagesNumber">عدد الصفحات *</Label>
                  <Input
                    id="pagesNumber"
                    name="pagesNumber"
                    type="number"
                    value={formik.values.pagesNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل عدد الصفحات"
                    min="1"
                    max={MAX_PAGES_PER_NOTE}
                    disabled={!isEditMode && !canAddMoreNotes}
                  />
                  {formik.touched.pagesNumber && formik.errors.pagesNumber && (
                    <p className="text-sm text-red-500">
                      {formik.errors.pagesNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">السنة</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formik.values.year}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل السنة"
                    min="2000"
                    max={new Date().getFullYear() + 5}
                    disabled={!isEditMode && !canAddMoreNotes}
                  />
                  {formik.touched.year && formik.errors.year && (
                    <p className="text-sm text-red-500">{formik.errors.year}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactMethod">طريقة التواصل *</Label>
                <Input
                  id="contactMethod"
                  name="contactMethod"
                  value={formik.values.contactMethod}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="example@gmail.com | 0500000000"
                  disabled={!isEditMode && !canAddMoreNotes}
                />
                {formik.touched.contactMethod &&
                  formik.errors.contactMethod && (
                    <p className="text-sm text-red-500">
                      {formik.errors.contactMethod}
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">ملف الملخص *</Label>
                <div className="relative">
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    onChange={handleFileChange}
                    accept={ALLOWED_FILE_TYPES_STRING}
                    disabled={
                      (!isEditMode && !canAddMoreNotes) ||
                      formik.values.removeFile ||
                      isUploading.file
                    }
                    className={isUploading.file ? "opacity-50" : ""}
                  />
                  {isUploading.file && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                      <Loader className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>
                {formik.values.file && (
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    {formik.values.file.name} (
                    {(formik.values.file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                {isEditMode &&
                  formik.values.fileName &&
                  !formik.values.file &&
                  !formik.values.removeFile && (
                    <div className="mt-2 p-2 border rounded-md flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>الملف الحالي: {formik.values.fileName}</span>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="removeFile"
                          name="removeFile"
                          checked={formik.values.removeFile}
                          onCheckedChange={(checked) =>
                            formik.setFieldValue("removeFile", checked)
                          }
                        />
                        <Label
                          htmlFor="removeFile"
                          className="text-xs text-red-500 cursor-pointer ml-2"
                        >
                          حذف الملف الحالي
                        </Label>
                      </div>
                    </div>
                  )}
                {formik.touched.file && formik.errors.file && (
                  <p className="text-sm text-red-500">{formik.errors.file}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageFile">صورة الغلاف</Label>
                <div className="relative">
                  <Input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png"
                    disabled={
                      (!isEditMode && !canAddMoreNotes) ||
                      formik.values.removePreviewImage ||
                      isUploading.image
                    }
                    className={isUploading.image ? "opacity-50" : ""}
                  />
                  {isUploading.image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                      <Loader className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>
                {formik.values.imageFile && (
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <ImageUp className="h-4 w-4 mr-2" />
                    {formik.values.imageFile.name} (
                    {(formik.values.imageFile.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </div>
                )}
                {isEditMode &&
                  formik.values.previewImage &&
                  !formik.values.imageFile &&
                  !formik.values.removePreviewImage && (
                    <div className="mt-2 p-2 border rounded-md flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <ImageUp className="h-4 w-4 mr-2" />
                        <span>
                          صورة الغلاف الحالية:{" "}
                          <a
                            href={formik.values.previewImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            عرض
                          </a>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Checkbox
                          id="removePreviewImage"
                          name="removePreviewImage"
                          checked={formik.values.removePreviewImage}
                          onCheckedChange={(checked) =>
                            formik.setFieldValue("removePreviewImage", checked)
                          }
                        />
                        <Label
                          htmlFor="removePreviewImage"
                          className="text-xs text-red-500 cursor-pointer ml-2"
                        >
                          حذف الصورة الحالية
                        </Label>
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={formik.values.terms}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("terms", checked)
                }
              />
              <Label htmlFor="terms" className="text-xs cursor-pointer ml-2">
                أقر بأن الملف من إعدادي. أتحمل مسؤوليته
              </Label>
            </div>
            {formik.touched.terms && formik.errors.terms && (
              <p className="text-sm text-red-500">{formik.errors.terms}</p>
            )}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="gap-2"
                disabled={
                  loading ||
                  (!isEditMode && !canAddMoreNotes) ||
                  (!isEditMode && !formik.values.terms)
                }
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    {isEditMode ? "جاري التحديث..." : "جاري الإضافة..."}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {isEditMode ? "تحديث الملخص" : "إضافة الملخص"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <Ring size={50} speed={1.5} bgOpacity={0.25} />
        </div>
      )}
    </motion.div>
  );
};

export default AddNoteForm;
