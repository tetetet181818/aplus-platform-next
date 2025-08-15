import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BookOpen, PlusCircle } from "lucide-react";

const CallToActionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-blue-600 dark:from-gray-800 dark:to-gray-900 text-white">
      <div className="container px-4 md:px-6 text-center">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          هل أنت مستعد لمشاركة معرفتك أو العثور على أفضل الملخصات؟
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-blue-100 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          انضم إلى مجتمعنا اليوم وابدأ رحلتك نحو التميز الأكاديمي. شارك ملخصاتك،
          ساعد الآخرين، وحقق دخلاً إضافياً.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href={"/notes"}>
            <Button
              size="xl"
              className="bg-white flex justify-center items-center gap-2 text-primary hover:bg-gray-100 shadow-xl transition-all hover:scale-105 w-full sm:w-auto px-8 py-3.5 text-base font-semibold"
            >
              <BookOpen className="mr-2 h-5 w-5" /> تصفح الملخصات
            </Button>
          </Link>
          <Link href="/add-note">
            <Button
              size="xl"
              variant="outline"
              className="text-black flex justify-center items-center gap-2 hover:bg-white/10 dark:text-white dark:border-white dark:hover:bg-white/10 shadow-xl transition-all hover:scale-105 w-full sm:w-auto px-8 py-3.5 text-base font-semibold"
            >
              <PlusCircle className="mr-2 h-5 w-5" /> أضف ملخصك الآن
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
