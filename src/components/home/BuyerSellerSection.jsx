import {
  ShoppingCart,
  Upload,
  Star,
  Download,
  Shield,
  Wallet,
  BarChart,
  Settings,
  Search,
  Bookmark,
  DollarSign,
  Tag,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
const FeatureItem = ({ icon, text }) => (
  <motion.li
    className="flex items-start gap-3"
    whileHover={{ x: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <span className="text-primary mt-0.5">{icon}</span>
    <span>{text}</span>
  </motion.li>
);

const BuyerSellerSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          مميزات المنصة
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Buyers Card */}
          <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-300">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                للمشترين
              </h3>
            </div>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              <FeatureItem
                icon={<Search className="h-5 w-5" />}
                text="تصفح جميع الملخصات المصنفة حسب الجامعة والتخصص"
              />
              <FeatureItem
                icon={<Download className="h-5 w-5" />}
                text="شراء فوري واستلام الملف مباشرة"
              />
              <FeatureItem
                icon={<Star className="h-5 w-5" />}
                text="تقييمات وآراء المستخدمين على كل ملخص"
              />
              <FeatureItem
                icon={<Shield className="h-5 w-5" />}
                text="ضمان استرداد إذا كان الملف فيه مشكلة فنية"
              />
              <FeatureItem
                icon={<Bookmark className="h-5 w-5" />}
                text="محفوظات 'مشترياتي' - يمكنك تحميلها في أي وقت"
              />
              <FeatureItem
                icon={<Wallet className="h-5 w-5" />}
                text="سهولة التواصل مع البائع عبر البريد أو الجوال (إن وُفر)"
              />
            </ul>
          </Card>

          {/* Sellers Card */}
          <Card className="p-6 md:p-8 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full text-green-600 dark:text-green-300">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                للبائعين
              </h3>
            </div>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              <FeatureItem
                icon={<DollarSign className="h-5 w-5" />}
                text="بيع الملخصات وتحقيق دخل إضافي"
              />
              <FeatureItem
                icon={<Wallet className="h-5 w-5" />}
                text="نظام أرباح شفاف وسحب فوري مرتين بالشهر"
              />
              <FeatureItem
                icon={<Settings className="h-5 w-5" />}
                text="لوحة تحكم واضحة لإدارة ملخصاتك ومبيعاتك"
              />
              <FeatureItem
                icon={<Tag className="h-5 w-5" />}
                text="تحكم بالسعر والتعديل عليه بسهولة"
              />
              <FeatureItem
                icon={<BarChart className="h-5 w-5" />}
                text="إحصائيات الأداء (عدد مرات التحميل، المبيعات...)"
              />
            </ul>
          </Card>
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            انضم إلى مجتمعنا الأكاديمي وابدأ رحلتك سواء كبائع أو مشتري
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BuyerSellerSection;
