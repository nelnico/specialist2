import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showReviewCount?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  reviewCount,
  size = "md",
  showReviewCount = true,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const renderStar = (index: number) => {
    const fillPercentage = Math.min(Math.max(rating - index, 0), 1);

    return (
      <div key={index} className="relative">
        {/* Background star (empty) */}
        <Star className={cn(sizeClasses[size], "text-muted-foreground/30")} />
        {/* Foreground star (filled) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage * 100}%` }}
        >
          <Star
            className={cn(sizeClasses[size], "text-yellow-400 fill-yellow-400")}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {reviewCount === 0 && <div>No Ratings Yet</div>}
      {reviewCount !== 0 && (
        <>
          <div className="flex items-center">
            {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
          </div>

          <div
            className={cn(
              "flex items-center gap-1 text-muted-foreground",
              textSizeClasses[size]
            )}
          >
            {showReviewCount && reviewCount !== undefined && (
              <span>
                ({reviewCount.toLocaleString()} review
                {reviewCount !== 1 ? "s" : ""})
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
