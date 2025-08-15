import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const StarRatingInput = ({
  rating,
  setRating,
  maxRating = 5,
  size = "h-8 w-8",
}) => {
  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={starValue}
            onClick={() => setRating(starValue)}
            className={cn(
              "cursor-pointer transition-colors",
              starValue <= rating
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-200",
              size
            )}
            aria-label={`Rate ${starValue} out of ${maxRating} stars`}
          >
            <Star className="fill-current" />
          </button>
        );
      })}
    </div>
  );
};

export default StarRatingInput;
