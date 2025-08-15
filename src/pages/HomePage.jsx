"use client";
import { motion } from "framer-motion";
import Head from "next/head";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import BuyerSellerSection from "@/components/home/BuyerSellerSection";

export const metadata = {
  title: "منصة أ+ | ملخصات دراسية جامعية",
  description:
    "منصة أ+ للدراسة الجامعية - احصل على أفضل الملخصات الدراسية من طلاب الجامعات",
  keywords: ["الملخصات الدراسيه", "الدراسه"],
};

const HomePage = () => {
  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-sky-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900"
      >
        <HeroSection />
        <FeaturesSection />
        <BuyerSellerSection />
        <CallToActionSection />
      </motion.main>
    </>
  );
};

export default HomePage;
