import "server-only";

export const ROUTES = {
  home: "/",
  join: "/join",
  signup: "/join/signup",
  selectRole: "/join/as",
  joinClient: "/join/client",
  joinSpecialist: "/join/specialist",
  joinAdvertiser: "/join/advertiser",
} as const;

import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/auth/getCurrentUser";

/** Signed out only. If signed in, push them where they belong. */
export async function ensureSignedOut() {
  const user = await getOrCreateCurrentUser();
  if (!user) return; // OK: render signup
  if (!user.role) redirect(ROUTES.selectRole);
  redirect(ROUTES.home);
}

/** Must be signed in (role optional). Redirects to signup if not. */
export async function requireUser() {
  const user = await getOrCreateCurrentUser();
  if (!user) redirect(ROUTES.signup);
  return user;
}

/** Must be signed in *and* have a role. Sends to the right step otherwise. */
export async function requireUserWithRole() {
  const user = await getOrCreateCurrentUser();
  if (!user) redirect(ROUTES.signup);
  if (!user.role) redirect(ROUTES.selectRole);
  if (user.role === "ADVERTISER") redirect(ROUTES.joinAdvertiser);
  if (user.role === "CLIENT") redirect(ROUTES.joinClient);
  if (user.role === "SPECIALIST") redirect(ROUTES.joinSpecialist);
  return user;
}

/** Only for onboarding step (signed-in but no role). */
export async function requireOnboardingUser() {
  const user = await getOrCreateCurrentUser();
  if (!user) redirect(ROUTES.signup);
  if (user.role) redirect(ROUTES.home);
  return user; // role is null → render onboarding UI
}
