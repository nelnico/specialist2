import { getUserRole } from "@/lib/auth/getUserRole";
import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ChartLine, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SignUpPagePage() {
  const { userId, role } = await getUserRole();

  if (!userId) {
    return (
      <div className=" grid flex-1 lg:grid-cols-2">
        <div className="hidden flex-1 items-center justify-end p-6 md:p-10 lg:flex">
          <ul className="max-w-sm space-y-8">
            <li>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <p className="font-semibold">Lorem ipsum, dolor sit amet</p>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis
                aliquam id quam aliquid laborum corporis.
              </p>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <ChartLine className="size-4" />
                <p className="font-semibold">Lorem ipsum, dolor sit amet</p>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis
                aliquam id quam aliquid laborum corporis.
              </p>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4" />
                <p className="font-semibold">Lorem ipsum, dolor sit amet</p>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis
                aliquam id quam aliquid laborum corporis.
              </p>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4" />
                <p className="font-semibold">Lorem ipsum, dolor sit amet</p>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis
                aliquam id quam aliquid laborum corporis.
              </p>
            </li>
            <li>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <p className="font-semibold">Lorem ipsum, dolor sit amet</p>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis
                aliquam id quam aliquid laborum corporis.
              </p>
            </li>
          </ul>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 md:p-10 lg:justify-start">
          <SignUp />
        </div>
      </div>
    );
  }

  if (!role) redirect("/join/as");

  // if logged in and has role → home
  redirect("/");
}
