import SelectRole from "./select-role";
import { requireOnboardingUser } from "@/lib/auth/join-guards";

export default async function Page() {
  await requireOnboardingUser();
  return <SelectRole />;
}
