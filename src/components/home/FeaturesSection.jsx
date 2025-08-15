import { motion } from "framer-motion";
import {
  Bookmark,
  TrendingUp,
  Shield,
  Users,
  Rocket,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center h-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="p-4 bg-gradient-to-br from-primary to-blue-500 rounded-full text-white mb-4 inline-block shadow-md">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
      {description}
    </p>
  </motion.div>
);

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-sky-50 dark:to-gray-800/30">
      <div className=" px-4 md:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          ليش A+؟
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Bookmark className="h-8 w-8" />}
            title="مصممة خصيصًا للطلاب"
            description="منصة مصممة خصيصًا للطلاب لتلبية جميع احتياجاتهم الأكاديمية"
            delay={0.3}
          />
          <FeatureCard
            icon={<DollarSign className="h-8 w-8" />}
            title="نظام أرباح واضح"
            description="نظام أرباح واضح وسحب فوري لتحقيق أقصى استفادة من مشاركتك"
            delay={0.4}
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="تصفح مئات الملفات"
            description="تصفح مئات الملفات في تخصصك واختر ما يناسب احتياجاتك"
            delay={0.5}
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="حماية وضمان المحتوى"
            description="نظام حماية وضمان للمحتوى لضمان جودة وأمان جميع الملفات"
            delay={0.6}
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="مجتمع طلابي نشط"
            description="انضم إلى مجتمع طلابي نشط يشارك المعرفة والخبرات"
            delay={0.7}
          />
          <FeatureCard
            icon={<Rocket className="h-8 w-8" />}
            title="انطلق نحو التميز"
            description="ابدأ رحلتك نحو التميز الأكاديمي مع منصتنا المتكاملة"
            delay={0.8}
          />
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            A+ انضم اليوم وابدأ رحلتك مع
          </h3>
          <p className="text-xl font-semibold mb-8 text-primary dark:text-blue-300">
            شارك — تعلم — اربح
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={"/notes"}>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 px-8 py-3"
              >
                تصفح الملخصات
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
