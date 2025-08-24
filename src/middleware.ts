import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    // Require sign-in; Clerk will redirect to sign-in if unauthenticated
    await auth.protect();
    // (Optional) RBAC:
    // await auth.protect((has) => has({ permission: "org:admin" }));
  }
  return NextResponse.next();
});

// Keep the matcher lean so middleware runs on routes, not static assets
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/api/:path*"],
};
