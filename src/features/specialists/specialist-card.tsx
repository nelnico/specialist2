"use client";
import React, { forwardRef } from "react";
import type { SpecialistListItem } from "./specialist-search-types";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  getLabelByValueFromList,
  provinceOptions,
  specialtyOptions,
} from "@/lib/data/data-options";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type SpecialistCardProps = {
  specialist: SpecialistListItem;
};

const SpecialistCard = forwardRef<HTMLDivElement, SpecialistCardProps>(
  ({ specialist }, ref) => {
    return (
      <Card ref={ref} className="pt-0">
        <Carousel
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {specialist.photos.map((photo, index) => (
              <CarouselItem key={index}>
                <Image
                  className="rounded-t-lg"
                  src={photo.path}
                  alt={`Photo ${index + 1}`}
                  width={600}
                  height={800}
                  style={{
                    objectFit: "cover", // cover, contain, none
                  }}
                  priority={index === 0 ? true : false}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* <CardHeader>
          <CardTitle>{specialist.name}</CardTitle>
          <CardDescription>{specialist.mainPhone}</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>
            {specialist.specialtyIds
              .map((id) => getLabelByValueFromList(specialtyOptions, id))
              .join(", ")}
          </p>
          <p>{specialist.location}</p>
          <p>
            {getLabelByValueFromList(provinceOptions, specialist.provinceId)}
          </p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    );
  }
);

SpecialistCard.displayName = "SpecialistCard";
export default SpecialistCard;
