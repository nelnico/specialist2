import { DEFAULT_PAGE_SIZE } from "@/lib/data/constants";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const SelectOption = z.object({
  label: z.string(),
  value: z.string(),
});

export const specialistsSearchSchema = z.object({
  page: z.coerce.number().int().nonnegative().default(0),
  pageSize: z.coerce.number().int().positive().default(DEFAULT_PAGE_SIZE),
  query: z.string().trim().default(""),
  genderIds: z.array(z.number()).default([]),
  provinceIds: z.array(z.number()).default([]),
  specialtyIds: z.array(z.number()).default([]),
  ageRange: z.tuple([z.number(), z.number()]).optional(),
  sortOption: z.string().optional(),
});

export type SpecialistsSearchForm = z.infer<typeof specialistsSearchSchema>;

export const DefaultSpecialistSearchParams: SpecialistsSearchForm =
  specialistsSearchSchema.parse({
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    query: "",
    genderIds: [],
    provinceIds: [],
    specialtyIds: [],
    sortOption: "newest",
  });

export const specialistOrderByMapping: Record<
  string,
  Prisma.SpecialistOrderByWithRelationInput
> = {
  highestRated: { specialistSummary: { averageRating: "desc" } },
  newest: { createdAt: "desc" },
  // You can add other options later when they are available
};

export const escortSortOptionLabels: Record<string, string> = {
  newest: "Newest",
  highestRated: "Top Rated",
  mostViewed: "Top Viewed",
  mostReviewed: "Top Reviewed",
};

export type SpecialistSortOption = keyof typeof specialistOrderByMapping;

export type SpecialistListItem = {
  id: number;
  photos: string[];
  mainPhone: string;
  name: string;
  genderId?: number;
  provinceId?: number;
  location: string;
  averageRating: number;
  numberOfReviews: number;
  specialtyIds: number[];
};
