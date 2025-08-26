"use server";

import prisma from "@/lib/data/prisma";
import { UserRole } from "@prisma/client";

/**
 * Create or update a User by authProviderId and role.
 * - If a user with authProviderId exists, updates its role.
 * - Otherwise creates a new user with the given authProviderId and role.
 * Returns the created/updated user.
 */
export async function upsertUserByAuthProviderId(params: {
  authProviderId: string;
  role: UserRole;
}) {
  const { authProviderId, role } = params;

  if (!authProviderId) {
    throw new Error("authProviderId is required");
  }

  // Guard against unexpected role strings if you’re accepting user input
  if (!Object.values(UserRole).includes(role)) {
    throw new Error(`Invalid role: ${role}`);
  }

  const user = await prisma.user.upsert({
    where: { authProviderId },
    update: { role },
    create: { authProviderId, role },
    // select what you need; this returns everything
  });

  return user;
}
