"use client";

import React, { forwardRef, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { SpecialistListItem } from "../../data/specialist-search-types";
import { Card } from "@/components/ui/card";
import { SpecialistRatingDisplay } from "@/features/specialist/components/specialist-rating-display";
import { LoadingOverlay } from "@/components/common/loading-overlay";

type SpecialistCardProps = {
  specialist: SpecialistListItem;
  onClick: () => void;
};

const SpecialistCard = forwardRef<HTMLDivElement, SpecialistCardProps>(
  ({ specialist, onClick }, ref) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const go = () => router.push(`/${specialist.id}`);
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    };

    const handleClick = () => {
      setIsLoading(true);
      onClick();
      go();
    };

    return (
      <Card
        ref={ref}
        role="link"
        tabIndex={0}
        onClick={handleClick}
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
