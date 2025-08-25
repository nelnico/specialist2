import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth/getUserRole";

export default async function Page() {
  const { userId, role } = await getUserRole();

  // if no logged in user, redirect to /join/signup
  if (!userId) redirect("/join/signup");

  // if logged in but no role, redirect to /join/as
  if (!role) redirect("/join/as");

  // if logged in and has role, they shouldn't be here
  redirect("/");
}
