import { Prisma } from "@prisma/client";
import { z } from "zod";

export const SelectOption = z.object({
  label: z.string(),
  value: z.string(),
});

export const specialistsSearchSchema = z.object({
  page: z.number().optional().default(0),
  pageSize: z.number().optional().default(60),
  query: z.string().trim().optional().default(""),
  genderIds: z.array(SelectOption).optional(),
  provinceIds: z.array(SelectOption).optional(),
  specialtyIds: z.array(SelectOption).optional(),
  sortOption: z.string().optional(),
});

export type SpecialistsSearchForm = z.infer<typeof specialistsSearchSchema>;

export const DefaultSpecialistSearchParams: SpecialistsSearchForm =
  specialistsSearchSchema.parse({
    page: 0,
    pageSize: 60,
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
  photos: { path: string }[];
  mainPhone: string;
  name: string;
  genderId?: number;
  provinceId?: number;
  location: string;
  averageRating: number;
  numberOfReviews: number;
  specialtyIds: number[];
};
