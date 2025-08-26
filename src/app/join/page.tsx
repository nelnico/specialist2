import { requireUserWithRole, ROUTES } from "@/lib/auth/join-guards";
import { redirect } from "next/navigation";

export default async function Page() {
  await requireUserWithRole();
  redirect(ROUTES.home);
}
