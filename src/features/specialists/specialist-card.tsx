"use client";
import React, { forwardRef } from "react";
import type { SpecialistListItem } from "./specialist-search-types";
import Image from "next/image";
import {
  getLabelByValueFromList,
  provinceOptions,
} from "@/lib/data/data-options";

type SpecialistCardProps = {
  specialist: SpecialistListItem;
};

const SpecialistCard = forwardRef<HTMLDivElement, SpecialistCardProps>(
  ({ specialist }, ref) => {
    return (
      <div ref={ref} className="border p-4 mb-4">
        <div>Name: {specialist.name}</div>
        <div>Phone: {specialist.mainPhone}</div>
        <div>
          Province:{" "}
          {getLabelByValueFromList(provinceOptions, specialist.provinceId)}
        </div>
        <div>Address: {specialist.location || "No address provided"}</div>
        <div>
          Avg Rating: {specialist.averageRating || "No rating available"}
        </div>
        <div>
          Number of Reviews:{" "}
          {specialist.numberOfReviews || "No reviews available"}
        </div>
        <>
          {specialist.photos.map((photo, index) => (
            <Image
              key={specialist.id + "_" + index}
              src={photo.path}
              alt={specialist.name}
              width={200}
              height={200}
            />
          ))}
        </>
      </div>
    );
  }
);

SpecialistCard.displayName = "SpecialistCard";
export default SpecialistCard;
