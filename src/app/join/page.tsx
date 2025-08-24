import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateAccountInfo } from "./components/create-account";
import prisma from "@/lib/data/prisma";
export const dynamic = "force-dynamic";

const Page = async () => {
  const { userId } = await auth();

  if (!userId) {
    return <CreateAccountInfo />;
  }

  const user = await prisma.user.findUnique({
    where: { authProviderId: userId },
    select: { role: true }, // adjust to your schema
  });
  if (!user || !user.role) redirect("/join/as");

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
