import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import formatArabicDate from "../../config/formateTime";

// Skeleton component for loading state
const ReviewSkeletonItem = () => (
  <div className="flex gap-4 py-4">
    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      </div>
      <div className="h-2 w-1/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    </div>
  </div>
);

const ReviewItem = ({ review }) => (
  <motion.div
    className="flex gap-4 py-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Avatar className="h-10 w-10">
      <AvatarFallback>{review.userName?.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-gray-800 dark:text-white">
          {review.userName}
        </h4>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3",
                i < review.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {review.comment}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {formatArabicDate(review.created_at)}
      </p>
    </div>
  </motion.div>
);

const NoteReviews = ({ reviews, loading }) => {
  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            التقييمات والتعليقات
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(3)].map((_, i) => (
            <ReviewSkeletonItem key={i} />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            التقييمات والتعليقات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 text-center py-4">
            لا توجد تقييمات أو تعليقات لهذا الملخص حتى الآن.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          التقييمات والتعليقات ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
        {reviews.map((review, index) => (
          <ReviewItem
            key={review.userId + review.createdAt + index}
            review={review}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default NoteReviews;
