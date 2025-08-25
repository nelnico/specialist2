import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth/getUserRole";

export default async function Page() {
  const { userId, role } = await getUserRole();

  // if not logged in → to /join/signup
  if (!userId) redirect("/join/signup");

  // if logged in and already has role → not allowed here
  if (role) redirect("/");

  // render role selection (user will set their role here)
  return <div>here user will select role</div>;
}
