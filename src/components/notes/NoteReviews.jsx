import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import formatArabicDate from "../../config/formateTime";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useFileStore } from "@/stores/useFileStore";

// مكون هيكل التحميل
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

// مكون عنصر التقييم
const ReviewItem = ({ review }) => (
  <motion.div
    className="flex gap-4 py-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Avatar className="h-10 w-10 flex-shrink-0">
      <AvatarFallback className="bg-blue-100 text-blue-600">
        {review.userName?.charAt(0) || "U"}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
        <h4 className="font-semibold text-gray-800 dark:text-white truncate">
          {review.userName || "مستخدم مجهول"}
        </h4>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3",
                i < (review.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words">
        {review.comment || "لا يوجد تعليق"}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {review.created_at
          ? formatArabicDate(review.created_at)
          : "تاريخ غير معروف"}
      </p>
    </div>
  </motion.div>
);

const SortSelector = ({ sortOption, setSortOption }) => {
  const getDescription = useCallback((option) => {
    switch (option) {
      case "latest":
        return "سيتم عرض أحدث العناصر أولاً";
      case "oldest":
        return "سيتم عرض أقدم العناصر أولاً";
      case "highest":
        return "سيتم عرض أعلى التقييمات أولاً";
      case "lowest":
        return "سيتم عرض أدنى التقييمات أولاً";
      default:
        return "سيتم عرض أحدث العناصر أولاً";
    }
  }, []);

  return (
    <div className="flex flex-col space-y-2 w-full max-w-xs rtl">
      <label
        htmlFor="sort-select"
        className="text-sm font-medium text-gray-700 text-right"
      >
        ترتيب حسب:
      </label>

      <Select value={sortOption} onValueChange={setSortOption}>
        <SelectTrigger
          id="sort-select"
          className="w-full h-12 px-4 text-right border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <SelectValue placeholder="اختر طريقة الترتيب" />
        </SelectTrigger>

        <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg rtl text-right dark:bg-gray-800 dark:border-gray-700">
          <SelectItem
            value="latest"
            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 text-right flex items-center justify-start dark:hover:bg-blue-900/20"
          >
            <div className="flex items-center">
              <ArrowUp className="h-5 w-5 ml-2 text-blue-500" />
              <span>الأحدث</span>
            </div>
          </SelectItem>

          <SelectItem
            value="oldest"
            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 text-right flex items-center justify-start dark:hover:bg-blue-900/20"
          >
            <div className="flex items-center">
              <ArrowDown className="h-5 w-5 ml-2 text-blue-500" />
              <span>الأقدم</span>
            </div>
          </SelectItem>

          <SelectItem
            value="highest"
            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 text-right flex items-center justify-start dark:hover:bg-blue-900/20"
          >
            <div className="flex items-center">
              <ArrowUpCircle className="h-5 w-5 ml-2 text-blue-500" />
              <span>الأعلى تقييماً</span>
            </div>
          </SelectItem>

          <SelectItem
            value="lowest"
            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 text-right flex items-center justify-start dark:hover:bg-blue-900/20"
          >
            <div className="flex items-center">
              <ArrowDownCircle className="h-5 w-5 ml-2 text-blue-500" />
              <span>الأدنى تقييماً</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <p className="text-xs text-gray-500 text-right mt-1 dark:text-gray-400">
        {getDescription(sortOption)}
      </p>
    </div>
  );
};

const NoteReviews = ({ loading, noteId }) => {
  const { getAllReviews } = useFileStore((state) => state);
  const [reviewsList, setReviewsList] = useState([]);
  const [sortOption, setSortOption] = useState("latest");

  const sortedReviews = useMemo(() => {
    if (!reviewsList.length) return [];

    const sorted = [...reviewsList];

    switch (sortOption) {
      case "latest":
        return sorted.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      case "highest":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "lowest":
        return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      default:
        return sorted;
    }
  }, [reviewsList, sortOption]);

  useEffect(() => {
    const getReviews = async () => {
      if (!noteId) {
        return;
      }

      try {
        const res = await getAllReviews({ noteId });
        if (res) {
          setReviewsList(res);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    getReviews();
  }, [noteId, getAllReviews]);

  if (loading || loading) {
    return (
      <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
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

  // حالة عدم وجود تقييمات
  if (!reviewsList || reviewsList.length === 0) {
    return (
      <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
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
    <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            التقييمات والتعليقات ({reviewsList.length})
          </CardTitle>
          <SortSelector sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      </CardHeader>
      <CardContent className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedReviews.map((review, index) => (
          <ReviewItem
            key={`${review.userId}_${review.created_at}_${index}`}
            review={review}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default NoteReviews;
