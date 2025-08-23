"use client";

import React, { forwardRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { SpecialistListItem } from "../../data/specialist-search-types";
import { Card } from "@/components/ui/card";
import { SpecialistRatingDisplay } from "@/features/specialist/components/specialist-rating-display";

type SpecialistCardProps = {
  specialist: SpecialistListItem;
  onClick: () => void;
};

const SpecialistCard = forwardRef<HTMLDivElement, SpecialistCardProps>(
  ({ specialist, onClick }, ref) => {
    const router = useRouter();

    const go = () => router.push(`/${specialist.id}`);
    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    };

    const handleClick = () => {
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
        className="cursor-pointer p-2 text-xs"
      >
        <>
          <p className="line-clamp-6">{JSON.stringify(specialist, null, 2)}</p>
          <SpecialistRatingDisplay
            averageRating={specialist.averageRating}
            numReviews={specialist.numberOfReviews}
          />
        </>
      </Card>
    );
  }
);

SpecialistCard.displayName = "SpecialistCard";
export default SpecialistCard;
