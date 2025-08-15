import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, Layers, Download } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const NoteCard = ({ note }) => {
  const cardVariants = {
    rest: {
      y: 0,
      scale: 1,
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 8px 16px rgba(59, 130, 246, 0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="h-full rounded-xl overflow-hidden"
    >
      <Link
        href={`/notes/${note.id}`}
        className="block h-full group"
        aria-label={`View ${note.title} note details`}
        prefetch={false}
      >
        <Card className="h-full flex flex-col border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30">
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <motion.div variants={imageVariants} className="w-full h-full">
              <Image
                src={note.cover_url}
                alt={`Cover image for ${note.title}`}
                width={800}
                height={500}
                className="rounded-lg object-cover"
              />
            </motion.div>

            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1 text-xs font-medium rounded-full shadow-md">
                {note.price > 0 ? `${note.price} ريال` : "مجاني"}
              </Badge>
            </div>

            {note.rating > 0 && (
              <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm text-foreground px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm border">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{note.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <CardContent className="p-4 flex flex-col flex-grow space-y-3">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {note.title}
            </h3>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs"
              >
                <Layers className="h-3.5 w-3.5 mr-1" />
                {note.university}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-xs"
              >
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                {note.subject}
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm line-clamp-3">
              {note.description}
            </p>

            <div className="mt-auto pt-3 border-t border-border">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{note.pages_number || "N/A"} صفحة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>{note.downloads || 0} تحميل</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default NoteCard;
