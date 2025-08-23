"use client";

import * as React from "react";

interface SpecialistRatingDisplayProps {
  numReviews: number;
  averageRating: number; // 0 to 5
}

export function SpecialistRatingDisplay({
  numReviews,
  averageRating,
}: SpecialistRatingDisplayProps) {
  if (numReviews === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet</p>;
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>Rating: {averageRating.toFixed(1)}</span>
      <span>
        ({numReviews} {numReviews === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}
