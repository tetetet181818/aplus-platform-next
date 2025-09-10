import * as yup from "yup";
import { MAX_PAGES_PER_NOTE } from "@/constants/index.js";
export const addNoteSchema = yup.object().shape({
  title: yup.string().required("عنوان الملخص مطلوب"),
  description: yup
    .string()
    .required("وصف الملخص مطلوب")
    .min(30, "الحد الادني 30 حرف"),
  price: yup
    .number()
    .min(10, "السعر يجب أن يكون اكثر من 10 ريال")
    .max(1000, "السعر يجب أن يكون أقل من 1000 ريال")
    .required("السعر مطلوب"),
  university: yup.string().required("الجامعة مطلوبة"),
  college: yup.string().required("الكلية مطلوبة"),
  subject: yup.string().required("المادة مطلوبة"),
  pagesNumber: yup
    .number()
    .required("عدد الصفحات مطلوب")
    .min(1, "يجب أن يكون عدد الصفحات على الأقل 1")
    .max(
      MAX_PAGES_PER_NOTE,
      `يجب أن يكون عدد الصفحات أقل من ${MAX_PAGES_PER_NOTE}`
    ),
  year: yup
    .number()
    .required("السنة مطلوبة")
    .min(2000, "السنة يجب أن تكون 2000 أو بعدها")
    .max(new Date().getFullYear() + 5, "السنة يجب أن تكون في المستقبل القريب"),
  contactMethod: yup
    .string()
    .required("طريقة التواصل مطلوبة")
    .test(
      "is-valid-contact",
      "أدخل بريد إلكتروني صحيح أو رقم جوال يبدأ بـ 05 ويتكون من 10 أرقام",
      (value) => {
        if (!value) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^05\d{8}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    ),
});
