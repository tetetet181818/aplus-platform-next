"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Head from "next/head";
import AddNoteForm from "@/components/add-note/AddNoteForm";
import AddNoteInstructions from "@/components/add-note/AddNoteInstructions";
import AddNoteLoginPrompt from "@/components/add-note/AddNoteLoginPrompt";
import AddNotePageHeader from "@/components/add-note/AddNotePageHeader";
import { universities } from "@/data/universityData";
export const metaData = {
  title: "إضافة ملخص جديد | منصة أ+",
  description: "أضف ملخصاتك الدراسية وشاركها مع الطلاب الآخرين",
};
const AddNotePage = ({ isAuthenticated, edit }) => {
  const router = useRouter();
  const userNotesCount = 0;

  if (!isAuthenticated) {
    return <AddNoteLoginPrompt onNavigate={router.push} />;
  }

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6">
        <AddNotePageHeader onBack={router.back} edit={edit} />

        <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.section
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AddNoteForm
              universities={universities}
              userNotesCount={userNotesCount}
              edit={edit}
            />
          </motion.section>

          <motion.aside
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AddNoteInstructions />
          </motion.aside>
        </div>
      </div>
    </>
  );
};

export default AddNotePage;
