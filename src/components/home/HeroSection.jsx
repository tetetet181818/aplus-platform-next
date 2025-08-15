import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, BookOpen } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <header className="relative py-20 md:py-32 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-600/80 opacity-90 transform -skew-y-3 z-0"></div>
      <div className="container relative z-10 px-4 md:px-6">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          مرحبًا بك في منصة A+
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          المكان الأول لبيع وشراء الملخصات الجامعية بكل سهولة
        </motion.p>

        <motion.div
          className="max-w-md mx-auto text-right mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white mb-4">وفّر وقتك، وابدأ رحلتك الأكاديمية الذكية</p>

          <ul className="space-y-3 text-white/90 text-sm md:text-base">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>هل عندك ملخصات أو ملفات دراسية مفيدة؟</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>ترفع ملخصاتك بسهولة وتكسب منها دخل إضافي</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>تشترى ملخصات زملائك وتذاكر بذكاء</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>تخزن كل ملفاتك في مكان واحد — آمن وسهل الوصول</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link href={"/notes"}>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 shadow-lg transition-transform hover:scale-105 w-full sm:w-auto"
            >
              تصفح الملخصات <BookOpen className="mr-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href={"/add-note"}>
            <Button
              size="lg"
              variant="outline"
              className="text-black hover:bg-white/10 shadow-lg transition-transform hover:scale-105 w-full sm:w-auto"
            >
              أضف ملخصك الآن <Upload className="mr-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;
