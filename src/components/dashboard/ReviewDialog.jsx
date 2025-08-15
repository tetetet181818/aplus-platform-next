import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRatingInput from "@/components/notes/StarRatingInput";
import { useToast } from "@/components/ui/use-toast";

const validationSchema = yup.object().shape({
  rating: yup
    .number()
    .min(1, "يرجى تحديد تقييم (عدد النجوم).")
    .required("التقييم مطلوب."),
  comment: yup.string().trim().required("يرجى كتابة تعليق."),
});

const ReviewDialog = ({
  isOpen,
  onOpenChange,
  noteTitle,
  currentUser,
  noteId,
  addReviewToNote,
}) => {
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const reviewData = {
        rating: values.rating,
        comment: values.comment,
        userId: currentUser.id,
        userName: currentUser.full_name,
        userAvatar: currentUser.avatar,
        created_at: new Date().toISOString(),
      };
      const res = await addReviewToNote({
        noteId,
        reviewData,
      });

      if (res) {
        toast({
          title: "نجاح",
          description: "تم إضافة تقييمك بنجاح.",
          variant: "success",
        });
        onOpenChange(false);
        resetForm();
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تقييم ملخص: {noteTitle}</DialogTitle>
          <DialogDescription>
            شاركنا رأيك حول هذا الملخص لمساعدة الآخرين.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="rating" className="mb-2 block font-medium">
              تقييمك (النجوم)
            </Label>
            <StarRatingInput
              rating={formik.values.rating}
              setRating={(value) => formik.setFieldValue("rating", value)}
            />
            {formik.touched.rating && formik.errors.rating && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.rating}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="comment" className="font-medium">
              تعليقك
            </Label>
            <Textarea
              id="comment"
              name="comment"
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="اكتب تعليقك هنا..."
              rows={4}
              className="mt-1"
            />
            {formik.touched.comment && formik.errors.comment && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.comment}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 mt-4">
            <Button variant="destructive" type="button" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit">إرسال التقييم</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
