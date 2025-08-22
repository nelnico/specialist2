"use server";

import prisma from "@/lib/data/prisma";
import {
  SpecialistContactInfo,
  SpecialistInfo,
  SpecialistPhoto,
  SpecialistReviewSummary,
} from "./specialist-types";
import { cache } from "react";

export const getSpecialistInfo = cache(
  async (rawId: number | string): Promise<SpecialistInfo | null> => {
    const id = typeof rawId === "string" ? Number(rawId) : rawId;

    if (!Number.isInteger(id) || id <= 0) return null;

    const row = await prisma.specialist.findUnique({
      where: { id },
      select: {
        id: true,
        specialtyIds: true,
        genderId: true,
        yearOfBirth: true,
        bio: true,
      },
    });

    if (!row) return null;

    return {
      id: row.id,
      specialtyIds: row.specialtyIds ?? [],
      genderId: row.genderId ?? null,
      yearOfBirth: row.yearOfBirth ?? null,
      bio: row.bio,
    };
  }
);

export const getSpecialistPhotos = cache(
  async (id: number): Promise<SpecialistPhoto[]> => {
    const rows = await prisma.specialistPhoto.findMany({
      where: { specialistId: id, isDeleted: false },
      select: { id: true, url: true },
      orderBy: [{ priority: "asc" }, { id: "asc" }],
    });
    return rows.map((r) => ({ id: r.id, url: r.url }));
  }
);

export const getSpecialistContactInfo = cache(
  async (id: number): Promise<SpecialistContactInfo> => {
    const row = await prisma.specialist.findUnique({
      where: { id },
      select: {
        contact: {
          select: {
            provinceId: true,
            location1: true,
            location2: true,
            location3: true,
            phones: { select: { phone: true }, orderBy: { id: "asc" } },
            emails: { select: { email: true }, orderBy: { id: "asc" } },
            websites: { select: { website: true }, orderBy: { id: "asc" } },
          },
        },
      },
    });

    if (!row?.contact) {
      return {
        phones: [],
        emails: [],
        websites: [],
        provinceId: null,
        location1: null,
        location2: null,
        location3: null,
      };
    }

    const c = row.contact;
    return {
      phones: c.phones.map((p) => p.phone),
      emails: c.emails.map((e) => e.email),
      websites: c.websites.map((w) => w.website),
      provinceId: c.provinceId ?? null,
      location1: c.location1 ?? null,
      location2: c.location2 ?? null,
      location3: c.location3 ?? null,
    };
  }
);

export const getSpecialistReviewSummary = cache(
  async (id: number): Promise<SpecialistReviewSummary> => {
    const sum = await prisma.specialistSummary.findUnique({
      where: { specialistId: id },
      select: {
        favoritedByCount: true,
        viewedCount: true,
        reviewCount: true,
        averageRating: true,
      },
    });

    return {
      favoritedByCount: sum?.favoritedByCount ?? 0,
      viewedCount: sum?.viewedCount ?? 0,
      reviewCount: sum?.reviewCount ?? 0,
      averageRating: sum?.averageRating ?? 0,
    };
  }
);
