import { Prisma } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_PAGE_SIZE } from "@/lib/data/constants";

// ---------- Shared UI types ----------
export const SelectOption = z.object({
  label: z.string(),
  value: z.string(),
});

// ---------- Search schema ----------
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

// ---------- Sorting ----------
// Single source of truth: UI derives its options from these keys.
export const specialistOrderByMapping = {
  newest: [{ createdAt: "desc" as const }, { id: "desc" as const }],

  highestRated: [
    { specialistSummary: { averageRating: "desc" as const } },
    { specialistSummary: { reviewCount: "desc" as const } },
    { id: "desc" as const },
  ],

  mostViewed: [
    { specialistSummary: { viewedCount: "desc" as const } },
    { id: "desc" as const },
  ],

  mostReviewed: [
    { specialistSummary: { reviewCount: "desc" as const } },
    { id: "desc" as const },
  ],
} satisfies Record<
  string,
  | Prisma.SpecialistOrderByWithRelationInput
  | Prisma.SpecialistOrderByWithRelationInput[]
>;

export type SpecialistSortOption = keyof typeof specialistOrderByMapping;

export const escortSortOptionLabels: Record<
  keyof typeof specialistOrderByMapping,
  string
> = {
  newest: "Newest",
  highestRated: "Top Rated",
  mostViewed: "Top Viewed",
  mostReviewed: "Top Reviewed",
};

// ---------- List item projection ----------
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
