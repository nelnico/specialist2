import { auth } from "@clerk/nextjs/server";
import prisma from "../data/prisma";

export async function getUserRole() {
  const { userId } = await auth();
  if (!userId) return { userId: null, role: null };

  const user = await prisma.user.findUnique({
    where: { authProviderId: userId },
    select: { role: true },
  });

  return { userId, role: user?.role ?? null };
}
