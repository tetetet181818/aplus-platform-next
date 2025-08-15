import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("البريد الإلكتروني غير صالح")
    .trim()
    .required("البريد الإلكتروني مطلوب"),
  password: Yup.string()
    .trim()
    .min(8, "يجب أن لا تقل كلمة المرور عن 8 أحرف")
    .required("كلمة المرور مطلوبة"),
});

export const registerSchema = Yup.object({
  full_name: Yup.string()
    .required("اسم المستخدم مطلوب")
    .trim()
    .min(4, "يجب أن يكون اسم المستخدم 4 أحرف على الأقل")
    .max(15, "يجب أن لا يتجاوز اسم المستخدم 15 حرف")
    .matches(
      /^[a-zA-Z][a-zA-Z0-9]*$/,
      "يجب أن يحتوي اسم المستخدم على حروف إنجليزية (a-z) وأرقام (0-9) فقط، بدون رموز خاصة"
    )
    .test(
      "no-start-with-number",
      "لا يمكن أن يبدأ اسم المستخدم برقم",
      (value) => !/^[0-9]/.test(value)
    ),
  email: Yup.string()
    .email("البريد الإلكتروني غير صالح")
    .trim()
    .required("البريد الإلكتروني مطلوب"),
  password: Yup.string()
    .trim()
    .required("كلمة المرور مطلوبة")
    .min(8, "يجب أن تكون كلمة المرور8 أحرف على الأقل")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])/,
      "يجب أن تحتوي كلمة المرور على أحرف وأرقام"
    ),
  university: Yup.string().optional(),
});

export const updateSchema = Yup.object({
  full_name: Yup.string()
    .min(2, "الاسم الأول يجب أن يكون على الأقل حرفين")
    .max(50, "الاسم الأول يجب أن يكون أقل من 50 حرف")
    .required("الاسم الأول مطلوب"),
  university: Yup.string().optional(),
});
export const passwordSchema = Yup.object({
  password: Yup.string().required("كلمه المرور مطلوبه"),
  confirmPassword: Yup.string().required("تاكيد كلمه المرور مطلوب "),
});
export const resetPasswordValidation = Yup.object({
  email: Yup.string().required("البريد الإلكتروني مطلوب"),
  password: Yup.string()
    .min(6, "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "كلمتا المرور غير متطابقتين")
    .required("تأكيد كلمة المرور مطلوب"),
});

export const validationForgetPassword = Yup.object({
  email: Yup.string()
    .email("يرجى إدخال بريد إلكتروني صحيح")
    .required("البريد الإلكتروني مطلوب"),
});
