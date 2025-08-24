"use client";

import React, { forwardRef, KeyboardEvent } from "react";
import type { SpecialistListItem } from "../../data/specialist-search-types";
import { Card } from "@/components/ui/card";
import { SpecialistRatingDisplay } from "@/features/specialist/components/specialist-rating-display";
import { LoadingOverlay } from "@/components/common/loading-overlay";

type SpecialistCardProps = {
  specialist: SpecialistListItem;
  onClick: () => void;
  isLoading?: boolean;
};

const SpecialistCard = forwardRef<HTMLDivElement, SpecialistCardProps>(
  ({ specialist, onClick, isLoading }, ref) => {
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <Card
        ref={ref}
        role="link"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className="p-0"
      >
        <div className="relative">
          <div className="p-4 cursor-pointer text-xs">
            <p className="line-clamp-6">
              {JSON.stringify(specialist, null, 2)}
            </p>
            <SpecialistRatingDisplay
              averageRating={specialist.averageRating}
              numReviews={specialist.numberOfReviews}
            />
          </div>
          {isLoading && <LoadingOverlay />}
        </div>
      </Card>
    );
  }
);

SpecialistCard.displayName = "SpecialistCard";
export default SpecialistCard;
