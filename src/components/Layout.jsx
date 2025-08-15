"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutWrapper({
  children,
  isRegisterDialogOpen,
  setIsRegisterDialogOpen,
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isRegisterDialogOpen={isRegisterDialogOpen}
        setIsRegisterDialogOpen={setIsRegisterDialogOpen}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
