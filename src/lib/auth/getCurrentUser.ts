import "server-only";
import { currentUser } from "@clerk/nextjs/server"; // use currentUser() only if you need profile fields
import prisma from "../data/prisma";
import { UserRole } from "@prisma/client";

export type CurrentUser = { id: number; role: UserRole | null };

export async function getOrCreateCurrentUser(): Promise<CurrentUser | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await prisma.user.upsert({
    where: { authProviderId: clerkUser.id },
    update: {},
    create: { authProviderId: clerkUser.id },
    select: { id: true, role: true },
  });

  return user;
}
