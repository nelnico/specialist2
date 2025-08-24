import { auth } from "@clerk/nextjs/server";
import React from "react";
import { CreateAccountInfo } from "./components/create-account";
import prisma from "@/lib/data/prisma";
import RoleSelect from "./components/role-select";
import { unstable_noStore } from "next/cache";

const Page = async () => {
  unstable_noStore();
  const { userId } = await auth();

  if (!userId) {
    return <CreateAccountInfo />;
  }

  const user = await prisma.user.findUnique({
    where: { authProviderId: userId },
  });

  if (!user) return <RoleSelect />;

  return (
    <div>
      <div>Join Page</div>
      <ul>
        <li>
          If not logged in: show message with continue or login link (render
          CreateAccountInfo)
        </li>
        <li>If logged in, but no user in system: redirect to join/as</li>
        <li>If logged in, got user, but no role: redirect to join/as</li>
        <li>If logged in, got user, got role....redirect to home</li>
      </ul>
    </div>
  );
};

export default Page;
