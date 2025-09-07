import { Users, FileText, DollarSign, Download, BarChart3 } from "lucide-react";
import {
  HelpCircle,
  ShoppingCart,
  User,
  BookOpen,
  Shield,
  Server,
} from "lucide-react";
export const universities = [
  "جامعة الملك سعود",
  "جامعة الإمام محمد بن سعود ",
  "جامعة الملك فهد للبترول والمعادن",
  "جامعة الملك عبدالعزيز",
  "جامعة الملك خالد",
];

export const universityColleges = {
  "جامعة الملك سعود": [
    "كلية الطب",
    "كلية الهندسة",
    "كلية علوم الحاسب",
    "كلية الصيدلة",
    "كلية إدارة الأعمال",
    "كلية النشاط البدني والرياضي",
    "كلية العمارة والتخطيط",
  ],
  "جامعة الملك فهد للبترول والمعادن": [
    "كلية الهندسة الكيميائية",
    "كلية الهندسة الكهربائية",
    "كلية الهندسة الميكانيكية",
    "كلية هندسة الحاسب",
    "كلية الهندسة المدنية",
    "كلية الهندسة الصناعية",
    "كلية علوم الحاسب",
    "كلية إدارة الأعمال",
    "كلية العلوم",
  ],
  "جامعة الملك عبدالعزيز": [
    "كلية الطب",
    "كلية الهندسة",
    "كلية علوم الحاسب",
    "كلية الصيدلة",
    "كلية إدارة الأعمال",
    "كلية الإعلام",
    "كلية الآداب",
  ],
  "جامعة الإمام محمد بن سعود": [
    "كلية الشريعة",
    "كلية أصول الدين",
    "كلية الطب",
    "كلية القانون",
    "كلية إدارة الأعمال",
    "كلية الهندسة",
    "كلية الإعلام",
  ],
  "جامعة الملك خالد": [
    "كلية الطب",
    "كلية الهندسة",
    "كلية الحاسب الآلي",
    "كلية إدارة الأعمال",
    "كلية الصيدلة",
    "كلية العلوم الطبية التطبيقية",
    "كلية الهندسة",
    "كلية التربية",
  ],
};

export const navigationItems = [
  {
    title: "لوحة التحكم",
    icon: BarChart3,
    id: "dashboard",
    href: "/dashboard",
  },
  { title: "الطلاب", icon: Users, id: "students", href: "/dashboard/students" },
  { title: "الملفات", icon: FileText, id: "files", href: "/dashboard/files" },
  {
    title: "المبيعات",
    icon: DollarSign,
    id: "sales",
    href: "/dashboard/sales",
  },
  {
    title: "السحوبات",
    icon: Download,
    id: "withdrawals",
    href: "/dashboard/withdrawals",
  },
];

export const MAX_NOTES_PER_USER = 50;
export const MAX_FILE_SIZE_MB = 30;
export const MAX_PAGES_PER_NOTE = 300;
export const ALLOWED_FILE_TYPES = ["application/pdf"];
export const ALLOWED_FILE_TYPES_STRING = "pdf";

export const SAUDI_BANKS = [
  { name: "البنك الأهلي التجاري", code: "NCB" },
  { name: "مصرف الراجحي", code: "RJHI" },
  { name: "البنك السعودي البريطاني", code: "SABB" },
  { name: "البنك السعودي الفرنسي", code: "BSF" },
  { name: "البنك السعودي للاستثمار", code: "SAIB" },
  { name: "بنك الرياض", code: "RIBL" },
  { name: "البنك العربي الوطني", code: "ANB" },
  { name: "بنك البلاد", code: "BLAD" },
  { name: "بنك الجزيرة", code: "JAZIRA" },
  { name: "بنك الإنماء", code: "INMA" },
  { name: "بنك الخليج الدولي", code: "GIB" },
  { name: "بنك سامبا", code: "SAMBA" },
];

export const faqData = [
  {
    category: "عام",
    icon: HelpCircle,
    questions: [
      {
        question: "ما هي فكرة منصة أ+؟",
        answer:
          "منصة أ+ تتيح للطلاب رفع ملخصاتهم الدراسية وبيعها لزملائهم، كما يمكنهم شراء ملخصات جاهزة من طلاب آخرين لتسهيل المذاكرة وتوفير الوقت.",
      },
      {
        question: "هل منصة أ+ معتمدة من جهة رسمية؟",
        answer:
          "لسنا جهة تعليمية رسمية، ولكننا نوفر بيئة آمنة لتبادل المحتوى الدراسي بين الطلاب بشكل قانوني.",
      },
    ],
  },
  {
    category: "للطلاب المشترين",
    icon: ShoppingCart,
    questions: [
      {
        question: "كيف أشتري ملخص؟",
        answer:
          'قم بتسجيل الدخول، ابحث عن الملخص الذي تحتاجه، اضغط على "شراء"، واختر وسيلة الدفع المناسبة.',
      },
      {
        question: "ماذا لو كان الملخص سيئ الجودة أو غير مفيد؟",
        answer:
          "يمكنك تقييم المحتوى وكتابة ملاحظتك، وفي حال وجود مشكلة كبيرة أو تضليل، يمكنك تقديم بلاغ وسيتم النظر فيه سريعًا.",
      },
    ],
  },
  {
    category: "للطلاب البائعين",
    icon: User,
    questions: [
      {
        question: "كيف يمكنني بيع ملخصاتي؟",
        answer:
          'سجّل الدخول، اختر "رفع ملخص"، واملأ البيانات المطلوبة مثل اسم المادة، الجامعة، السعر، وصف الملخص، ثم ارفع الملف بصيغة PDF.',
      },
      {
        question: "كم أربح من كل عملية بيع؟",
        answer:
          "تأخذ منصة أ+ نسبة عمولة ثابتة (مثلاً 15%) من كل عملية، ويتم تحويل الأرباح المتبقية إلى محفظتك داخل الحساب.",
      },
      {
        question: "متى يتم تحويل أرباحي؟",
        answer:
          "يتم تحويل الأرباح في بداية كل شهر بشكل تلقائي إلى وسيلة الدفع التي اخترتها عند التسجيل كبائع.",
      },
    ],
  },
  {
    category: "المحتوى والجودة",
    icon: BookOpen,
    questions: [
      {
        question: "هل هناك حد أدنى أو أقصى لعدد الصفحات؟",
        answer:
          "نعم، الحد الأدنى هو صفحة واحدة والحد الأقصى 300 صفحة للملخص الواحد.",
      },
    ],
  },
  {
    category: "التقنية والدعم",
    icon: Server,
    questions: [
      {
        question: "ما هي وسائل الدفع المتاحة؟",
        answer: "ندعم وسائل الدفع التالية: مدى، فيزا/ماستر كارد.",
      },
    ],
  },
  {
    category: "الخصوصية والأمان",
    icon: Shield,
    questions: [
      {
        question: "هل بياناتي الشخصية محمية؟",
        answer:
          "نعم، نلتزم بسياسات خصوصية صارمة، ولا نشارك بياناتك مع أي جهة خارجية.",
      },
    ],
  },
];
export const statusLabelMap = {
  pending: "قيد الانتظار",
  accepted: "مقبول",
  rejected: "مرفوض",
  completed: "مكتمل",
};

export const statusVariantMap = {
  pending: "default",
  accepted: "success",
  rejected: "destructive",
  completed: "completed",
};
