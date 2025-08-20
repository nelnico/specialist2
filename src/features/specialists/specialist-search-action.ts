"use server";
import { Prisma } from "@prisma/client";
import {
  DefaultSpecialistSearchParams,
  SpecialistListItem,
  SpecialistsSearchForm,
} from "./specialist-search-types";
import prisma from "@/lib/data/prisma";

const PAGE_SIZE = 10;

export async function searchSpecialist(
  params: Partial<SpecialistsSearchForm>
): Promise<SpecialistListItem[]> {
  try {
    const merged = { ...DefaultSpecialistSearchParams, ...params };

    const page = Math.max(0, merged.page ?? 0);
    const pageSize = merged.pageSize ?? PAGE_SIZE;
    const query = (merged.query ?? "").trim();
    const genderIds = merged.genderIds ?? [];
    const provinceIds = merged.provinceIds ?? [];
    const specialtyIds = merged.specialtyIds ?? [];
    const sortOption = merged.sortOption ?? "newest";

    const andConditions: Prisma.SpecialistWhereInput[] = [];

    if (query) {
      andConditions.push({
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          {
            contact: {
              is: {
                OR: [
                  {
                    phones: {
                      some: { phone: { contains: query, mode: "insensitive" } },
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
      });
    }

    if (genderIds.length) {
      andConditions.push({
        genderId: { in: genderIds.map((g) => Number(g.value ?? g)) },
      });
    }

    if (provinceIds.length) {
      andConditions.push({
        contact: {
          is: {
            provinceId: { in: provinceIds.map((p) => Number(p.value ?? p)) },
          },
        },
      });
    }

    if (specialtyIds.length) {
      andConditions.push({
        specialtyIds: {
          hasSome: specialtyIds.map((s) => Number(s.value ?? s)),
        },
      });
    }

    const where: Prisma.SpecialistWhereInput = andConditions.length
      ? { AND: andConditions }
      : {};

    const orderBy: Prisma.SpecialistOrderByWithRelationInput =
      sortOption === "highestRated"
        ? { specialistSummary: { averageRating: "desc" } }
        : sortOption === "mostViewed"
        ? { specialistSummary: { viewedCount: "desc" } }
        : sortOption === "mostReviewed"
        ? { specialistSummary: { reviewCount: "desc" } }
        : { createdAt: "desc" };

    const specialists = await prisma.specialist.findMany({
      where,
      skip: page * pageSize,
      take: pageSize,
      orderBy,
      select: {
        id: true,
        name: true,
        genderId: true,
        specialtyIds: true,
        // 👇 photos included, filtered & ordered
        photos: {
          where: { isDeleted: false },
          orderBy: { priority: "asc" },
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
            },
          },
        },
        specialistSummary: {
          select: {
            averageRating: true,
            reviewCount: true,
          },
        },
      },
    });

    return specialists.map((s): SpecialistListItem => {
      const c = s.contact;
      const locations = [c?.location1, c?.location2, c?.location3]
        .filter((loc): loc is string => Boolean(loc))
        .filter((loc, i, arr) => arr.indexOf(loc) === i)
        .join(", ");

      return {
        id: s.id,
        name: s.name,
        genderId: s.genderId ?? undefined,
        provinceId: c?.provinceId ?? undefined,
        location: locations || "Unknown",
        mainPhone: c?.phones?.[0]?.phone ?? "",
        photos: s.photos.map((p) => ({ path: p.url })), // 👈 mapped in priority order
        averageRating: s.specialistSummary?.averageRating ?? 0,
        numberOfReviews: s.specialistSummary?.reviewCount ?? 0,
      };
    });
  } catch (error) {
    console.error("Error in searchSpecialist:", error);
    return [];
  }
}

// function getAgeCondition([min, max]: [
//   number,
//   number
// ]): Prisma.SpecialistWhereInput {
//   if (min === MIN_AGE && max === MAX_AGE) return {};
//   const currentYear = new Date().getFullYear();
//   return {
//     yearOfBirth: {
//       gte: currentYear - max,
//       lte: currentYear - min,
//     },
//   };
// }
