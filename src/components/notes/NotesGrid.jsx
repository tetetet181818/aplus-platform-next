import { motion } from "framer-motion";
import NoteCard from "@/components/shared/NoteCard";

const NotesGrid = ({ notes }) => {
  const Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={Variants}
      initial="hidden"
      animate="show"
    >
      {notes.map((note) => (
        <motion.div key={note.id} variants={itemVariants}>
          <NoteCard note={note} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NotesGrid;
