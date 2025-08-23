import { motion } from "framer-motion";
import visaImage from "../../../public/visa.png";
import mada_image from "../../../public/mada.svg";
import mastercard_image from "../../../public/MasterCard-logo.webp";
import Image from "next/image";

const PaymentMethodsSection = () => {
  const paymentMethods = [
    {
      name: "Visa",
      icon: (
        <Image
          loading="lazy"
          alt="Visa logo"
          className="h-6 w-auto"
          src={visaImage}
        />
      ),
    },
    {
      name: "Mada",
      icon: (
        <Image
          loading="lazy"
          alt="Mada logo"
          className="h-6 w-auto"
          src={mada_image}
        />
      ),
    },
    {
      name: "Master card",
      icon: (
        <Image
          loading="lazy"
          alt="master card logo"
          className="h-6 w-auto"
          src={mastercard_image}
        />
      ),
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 text-gray-700 dark:text-gray-200">
        طرق الدفع
      </h3>
      <motion.div
        className="flex gap-2"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {paymentMethods.map((method) => (
          <motion.div
            key={method.name}
            variants={itemVariants}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col flex-1 text-center items-center justify-center"
          >
            <div className="mb-1">{method.icon}</div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {method.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
      <motion.p
        className="text-gray-500 dark:text-gray-500 mt-3 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        جميع المعاملات مشفرة وآمنة.
      </motion.p>
    </div>
  );
};

export default PaymentMethodsSection;
