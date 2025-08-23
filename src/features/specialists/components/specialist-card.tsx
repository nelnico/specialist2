"use client";

import React, { forwardRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { SpecialistListItem } from "../data/specialist-search-types";
import { Card } from "@/components/ui/card";

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
        {JSON.stringify(specialist, null, 2)}
      </Card>
    );
  }
);

SpecialistCard.displayName = "SpecialistCard";
export default SpecialistCard;
