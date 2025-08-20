"use client";
import React, { forwardRef } from "react";
import type { SpecialistListItem } from "./specialist-search-types";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
import { StarRating } from "@/components/ui/star-rating";
import { spec } from "node:test/reporters";
import PhoneDisplay from "@/components/common/phone-display";
type SpecialistCardProps = {
  specialist: SpecialistListItem;
};

const SpecialistCard = forwardRef<HTMLDivElement, SpecialistCardProps>(
  ({ specialist }, ref) => {
    return (
      <div className="relative">
        <Card ref={ref} className="pt-0">
          <Carousel
            className="relative"
            opts={{
              loop: true,
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 text-white px-2 rounded z-10">
              {specialist.name}
            </div>
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 rounded z-10">
              {<PhoneDisplay phone={specialist.mainPhone} />}
            </div>
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
          <CardHeader className="flex items-center justify-between">
            <CardDescription className="truncate">
              {specialist.specialtyIds
                .map((id) => getLabelByValueFromList(specialtyOptions, id))
                .join(", ")}
            </CardDescription>

            <CardAction>Fav</CardAction>
          </CardHeader>
          <CardContent>
            <CardDescription className="truncate">
              {getLabelByValueFromList(provinceOptions, specialist.provinceId)}
            </CardDescription>
          </CardContent>
          <CardFooter>
            <StarRating
              rating={specialist.averageRating}
              reviewCount={specialist.numberOfReviews}
              size="sm"
            />
          </CardFooter>
        </Card>
      </div>
    );
  }
);

SpecialistCard.displayName = "SpecialistCard";
export default SpecialistCard;
