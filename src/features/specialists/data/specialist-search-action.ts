"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/data/prisma";
import { DEFAULT_PAGE_SIZE, MAX_AGE, MIN_AGE } from "@/lib/data/constants";
import {
  DefaultSpecialistSearchParams,
  type SpecialistListItem,
  type SpecialistsSearchForm,
  specialistOrderByMapping,
  type SpecialistSortOption,
} from "./specialist-search-types";

// ---------- helpers ----------
const buildLocations = (c?: {
  location1?: string | null;
  location2?: string | null;
  location3?: string | null;
}) =>
  [c?.location3, c?.location2, c?.location1]
    .filter((x): x is string => !!x && x.trim().length > 0)
    .filter((loc, i, arr) => arr.indexOf(loc) === i)
    .join(", ") || "Unknown";

/** Normalize and clamp an age range; return undefined if it's effectively no-op */
function normalizeAgeRange(
  input?: [number, number]
): [number, number] | undefined {
  if (!input) return undefined;
  let [min, max] = input;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined;
  if (min > max) [min, max] = [max, min];
  min = Math.max(MIN_AGE, Math.floor(min));
  max = Math.min(MAX_AGE, Math.floor(max));
  if (min <= MIN_AGE && max >= MAX_AGE) return undefined;
  return [min, max];
}

/** Convert age range to a where condition on yearOfBirth */
function getAgeCondition(
  ageRange?: [number, number]
): Prisma.SpecialistWhereInput | undefined {
  const norm = normalizeAgeRange(ageRange);
  if (!norm) return undefined;

  const [min, max] = norm;
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - max; // older bound
  const maxYear = currentYear - min; // younger bound

  return { yearOfBirth: { gte: minYear, lte: maxYear } };
}

/** Stable select for list view */
const specialistListSelect = {
  id: true,
  name: true,
  genderId: true,
  specialtyIds: true,
  photos: {
    where: { isDeleted: false },
    orderBy: [{ priority: "desc" as const }, { id: "asc" as const }],
    take: 4,
    select: { url: true },
  },
  contact: {
    select: {
      provinceId: true,
      location1: true,
      location2: true,
      location3: true,
      phones: {
        where: { primary: true },
        orderBy: { id: "asc" as const },
        select: { phone: true },
        take: 1,
      },
    },
  },
  specialistSummary: {
    select: {
      averageRating: true,
      reviewCount: true,
      viewedCount: true,
    },
  },
} satisfies Prisma.SpecialistSelect;

// ---------- main ----------
export async function searchSpecialist(
  params: Partial<SpecialistsSearchForm>
): Promise<SpecialistListItem[]> {
  try {
    // Merge with defaults and clamp paging
    const merged = { ...DefaultSpecialistSearchParams, ...params };
    const page = Math.max(0, merged.page ?? 0);
    const pageSize = Math.min(
      Math.max(1, merged.pageSize ?? DEFAULT_PAGE_SIZE),
      DEFAULT_PAGE_SIZE
    );

    // Inputs
    const query = (merged.query ?? "").trim();
    const genderIds = merged.genderIds ?? [];
    const provinceIds = merged.provinceIds ?? [];
    const specialtyIds = merged.specialtyIds ?? [];
    const sortKey = (merged.sortOption ?? "newest") as SpecialistSortOption;

    // Where
    const where: Prisma.SpecialistWhereInput = {
      AND: [
        query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            {
              contact: {
                is: {
                  OR: [
                    {
                      phones: {
                        some: {
                          phone: { contains: query, mode: "insensitive" },
                        },
                      },
                    },
                    { location1: { contains: query, mode: "insensitive" } },
                    { location2: { contains: query, mode: "insensitive" } },
                    { location3: { contains: query, mode: "insensitive" } },
                  ],
                },
              },
            },
          ],
        },
        genderIds.length && { genderId: { in: genderIds } },
        provinceIds.length && {
          contact: { is: { provinceId: { in: provinceIds } } },
        },
        specialtyIds.length && { specialtyIds: { hasSome: specialtyIds } },
        getAgeCondition(merged.ageRange),
      ].filter(Boolean) as Prisma.SpecialistWhereInput[],
    };

    // OrderBy (mapping + deterministic tiebreaker)
    const primary =
      specialistOrderByMapping[sortKey] ?? specialistOrderByMapping.newest;
    const orderBy = Array.isArray(primary)
      ? [...primary, { id: "desc" as const }]
      : [primary, { id: "desc" as const }];

    // Query
    const specialists = await prisma.specialist.findMany({
      where,
      skip: page * pageSize,
      take: pageSize,
      orderBy,
      select: specialistListSelect,
    });

    // Map to list items
    return specialists.map((s) => {
      const c = s.contact;
      return {
        id: s.id,
        photos: s.photos.map((p) => p.url),
        mainPhone: c?.phones?.[0]?.phone ?? "",
        name: s.name,
        genderId: s.genderId ?? undefined,
        provinceId: c?.provinceId ?? undefined,
        location: buildLocations(c ?? undefined),
        averageRating: s.specialistSummary?.averageRating ?? 0,
        numberOfReviews: s.specialistSummary?.reviewCount ?? 0,
        specialtyIds: s.specialtyIds ?? [],
      } satisfies SpecialistListItem;
    });
  } catch (err) {
    console.error("Error in searchSpecialist:", err);
    return [];
  }
}
