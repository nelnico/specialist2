"use server";
import { Prisma } from "@prisma/client";
import {
  DefaultSpecialistSearchParams,
  SpecialistListItem,
  SpecialistsSearchForm,
  specialistOrderByMapping,
  type SpecialistSortOption,
} from "./specialist-search-types";
import prisma from "@/lib/data/prisma";
import { DEFAULT_PAGE_SIZE, MAX_AGE, MIN_AGE } from "@/lib/data/constants";

type IdInput = string | { value?: string };

/** Utils */
const toIds = (arr: IdInput[]): number[] =>
  arr
    .map((x) => (typeof x === "string" ? Number(x) : Number(x.value)))
    .filter((n): n is number => Number.isFinite(n));

const buildLocations = (c?: {
  location1?: string | null;
  location2?: string | null;
  location3?: string | null;
}) =>
  [c?.location3, c?.location2, c?.location1]
    .filter((x): x is string => !!x && x.trim().length > 0)
    .filter((loc, i, arr) => arr.indexOf(loc) === i)
    .join(", ") || "Unknown";

/** Normalize and clamp an age range; return undefined if it's effectively "no filter" */
function normalizeAgeRange(
  input?: [number, number]
): [number, number] | undefined {
  if (!input) return undefined;
  let [min, max] = input;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined;
  if (min > max) [min, max] = [max, min]; // swap if inverted
  min = Math.max(MIN_AGE, Math.floor(min));
  max = Math.min(MAX_AGE, Math.floor(max));
  if (min <= MIN_AGE && max >= MAX_AGE) return undefined; // full span = no-op
  return [min, max];
}

/** Convert an age range into a Prisma where condition against yearOfBirth */
function getAgeCondition(
  ageRange?: [number, number]
): Prisma.SpecialistWhereInput | undefined {
  const norm = normalizeAgeRange(ageRange);
  if (!norm) return undefined;

  const [min, max] = norm;
  const currentYear = new Date().getFullYear();

  // age X ⇒ yearOfBirth ≈ currentYear - X
  const minYear = currentYear - max; // older bound
  const maxYear = currentYear - min; // younger bound

  return {
    yearOfBirth: {
      gte: minYear,
      lte: maxYear,
    },
  };
}

/** Stable and re-usable select */
const specialistListSelect = {
  id: true,
  name: true,
  genderId: true,
  specialtyIds: true,
  photos: {
    where: { isDeleted: false },
    orderBy: { priority: "asc" as const },
    take: 2,
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
        select: { phone: true },
        take: 1,
      },
    },
  },
  specialistSummary: {
    select: {
      averageRating: true,
      reviewCount: true,
    },
  },
} satisfies Prisma.SpecialistSelect;

export async function searchSpecialist(
  params: Partial<SpecialistsSearchForm>
): Promise<SpecialistListItem[]> {
  try {
    /** Merge + sanitize paging */
    const merged = { ...DefaultSpecialistSearchParams, ...params };
    const page = Math.max(0, merged.page ?? 0);
    const pageSize = Math.min(
      Math.max(1, merged.pageSize ?? DEFAULT_PAGE_SIZE),
      DEFAULT_PAGE_SIZE
    );

    /** Inputs */
    const query = (merged.query ?? "").trim();
    const genderIds = toIds(merged.genderIds ?? []);
    const provinceIds = toIds(merged.provinceIds ?? []);
    const specialtyIds = toIds(merged.specialtyIds ?? []);
    const sortKey = (merged.sortOption ?? "newest") as SpecialistSortOption;

    /** Where (declarative) */
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

    /** OrderBy (single source of truth + deterministic tiebreaker) */
    const primaryOrder =
      specialistOrderByMapping[sortKey] ?? specialistOrderByMapping.newest;
    const orderBy = Array.isArray(primaryOrder)
      ? [...primaryOrder, { id: "desc" as const }]
      : [primaryOrder, { id: "desc" as const }];

    /** Query */
    const specialists = await prisma.specialist.findMany({
      where,
      skip: page * pageSize,
      take: pageSize,
      orderBy,
      select: specialistListSelect,
    });

    /** Map to list item */
    return specialists.map((s): SpecialistListItem => {
      const c = s.contact;
      return {
        id: s.id,
        name: s.name,
        genderId: s.genderId ?? undefined,
        provinceId: c?.provinceId ?? undefined,
        location: buildLocations(c ?? undefined),
        mainPhone: c?.phones?.[0]?.phone ?? "",
        photos: s.photos.map((p) => p.url),
        averageRating: s.specialistSummary?.averageRating ?? 0,
        numberOfReviews: s.specialistSummary?.reviewCount ?? 0,
        specialtyIds: s.specialtyIds ?? [],
      };
    });
  } catch (error) {
    console.error("Error in searchSpecialist:", error);
    return [];
  }
}
