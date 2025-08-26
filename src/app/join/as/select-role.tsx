"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { upsertUserByAuthProviderId } from "@/actions/user-actions";

const options = [
  {
    id: "specialist",
    title: "Specialist",
    description: "Offer your expertise.",
  },
  { id: "client", title: "Client", description: "Hire specialists." },
  {
    id: "advertiser",
    title: "Advertiser",
    description: "Promote opportunities.",
  },
] as const;

type OptionId = (typeof options)[number]["id"];

const roleMap: Record<OptionId, UserRole> = {
  specialist: "SPECIALIST",
  client: "CLIENT",
  advertiser: "ADVERTISER",
};

const redirectMap: Record<OptionId, string> = {
  client: "/join/client",
  specialist: "/join/specialist",
  advertiser: "/join/advertiser",
};

export default function SelectRole() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [selected, setSelected] = useState<OptionId | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!isLoaded || !user?.id) {
      setError("You must be signed in to continue.");
      return;
    }
    if (!selected) return;

    try {
      setLoading(true);
      await upsertUserByAuthProviderId({
        authProviderId: user.id,
        role: roleMap[selected],
      });
      router.push(redirectMap[selected]);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Role</h1>
          <p className="text-muted-foreground">
            Select the option that best fits your needs.
          </p>
        </header>

        <RadioGroup
          value={selected}
          onValueChange={(v: OptionId) => setSelected(v)}
          className="space-y-4"
        >
          {options.map((o) => (
            <Label
              key={o.id}
              htmlFor={o.id}
              className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent"
            >
              <RadioGroupItem id={o.id} value={o.id} className="mt-1" />
              <div>
                <div className="font-medium">{o.title}</div>
                <div className="text-sm text-muted-foreground">
                  {o.description}
                </div>
              </div>
            </Label>
          ))}
        </RadioGroup>

        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={!selected || loading || !isLoaded || !user}
            className="w-full"
          >
            {loading ? "Saving..." : "Continue"}
          </Button>

          {error && (
            <p className="text-sm text-destructive text-center" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
