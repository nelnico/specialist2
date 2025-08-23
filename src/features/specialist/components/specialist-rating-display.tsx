"use client";

import { Rating } from "@/components/ui/rating";

interface SpecialistRatingDisplayProps {
  numReviews: number;
  averageRating: number;
}

export function SpecialistRatingDisplay({
  numReviews,
  averageRating,
}: SpecialistRatingDisplayProps) {
  if (numReviews === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet</p>;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span>
        <Rating rating={averageRating} size="sm" />
      </span>
      <span>
        ({numReviews} {numReviews === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}
