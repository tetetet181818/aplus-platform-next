"use client";
import { motion } from "framer-motion";
import Head from "next/head";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Palette } from "lucide-react";
import { faqData } from "@/constants/index";

const FAQPage = () => {
  return (
    <>
      <Head>
        <title>الأسئلة الشائعة | منصة أ+</title>
        <meta
          name="description"
          content="إجابات على الأسئلة الشائعة حول استخدام منصة أ+ للدراسة الجامعية وتبادل الملخصات"
        />
        <meta
          name="keywords"
          content="أسئلة شائعة, منصة أ+, دراسة جامعية, ملخصات, دعم فني"
        />
      </Head>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1
              className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent dark:from-primary-light dark:to-accent-light mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              الأسئلة الشائعة
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              نجيب هنا على أكثر الأسئلة شيوعًا حول منصة أ+
            </motion.p>
          </div>

          <div className="space-y-10">
            {faqData?.map((categoryItem, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <categoryItem.icon className="h-6 w-6 mr-3 text-primary dark:text-primary-light" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
                    {categoryItem.category}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-2">
                  {categoryItem.questions.map((faq, qIndex) => (
                    <AccordionItem
                      value={`item-${index}-${qIndex}`}
                      key={qIndex}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-start">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.section>
            ))}
          </div>

          <motion.div
            className="mt-16 text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <Palette className="h-10 w-10 text-accent dark:text-accent-light" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              لم تجد إجابتك؟
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              فريق الدعم لدينا جاهز لمساعدتك
            </p>
            <Link
              href="/contact-us"
              className="inline-block px-6 py-2 bg-primary hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary text-white dark:text-gray-900 rounded-md transition-colors"
            >
              اتصل بنا الآن
            </Link>
          </motion.div>
        </div>
      </motion.main>
    </>
  );
};

export default FAQPage;
