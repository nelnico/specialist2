"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import type { UserRole } from "@prisma/client";
import { upsertUserByAuthProviderId } from "@/actions/user-actions";

const options = [
  {
    id: "specialist",
    title: "Specialist",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis aliquam id quam aliquid laborum corporis.",
  },
  {
    id: "client",
    title: "Client",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis aliquam id quam aliquid laborum corporis.",
  },
  {
    id: "advertiser",
    title: "Advertiser",
    description: "Not currently supported as a role in the system.",
  },
] as const;

type OptionId = (typeof options)[number]["id"];

const roleMap: Record<Exclude<OptionId, "advertiser">, UserRole> = {
  specialist: "SPECIALIST",
  client: "CLIENT",
};

const SelectRole = () => {
  const { user, isLoaded } = useUser();
  const [selectedOption, setSelectedOption] = useState<OptionId | "">("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null);
    setSuccess(null);

    if (!isLoaded || !user?.id) {
      setError("You must be signed in to continue.");
      return;
    }
    if (!selectedOption) return;

    if (selectedOption === "advertiser") {
      setError(
        "The 'Advertiser' option isn’t available yet. Pick Client or Specialist."
      );
      return;
    }

    const role = roleMap[selectedOption];

    startTransition(async () => {
      try {
        const createdOrUpdated = await upsertUserByAuthProviderId({
          authProviderId: user.id, // <-- Clerk user id
          role,
        });

        setSuccess(`Saved! Your role is now ${createdOrUpdated.role}.`);
        // e.g. navigate somewhere next:
        // router.push("/dashboard");
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Choose Your Role {selectedOption}
          </h1>
          <p className="text-muted-foreground">
            Select the option that best fits your needs
          </p>
        </div>

        <div className="flex flex-col items-center">
          <RadioGroup
            value={selectedOption}
            onValueChange={(v: OptionId) => setSelectedOption(v)}
            className="space-y-4 w-full"
          >
            {options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isDisabled = option.id === "advertiser";
              return (
                <div key={option.id} className="relative">
                  <Label
                    htmlFor={option.id}
                    className={`cursor-pointer ${
                      isDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Card
                      className={`transition-all duration-200 hover:shadow-md w-full ${
                        isSelected
                          ? "ring-2 ring-primary border-primary"
                          : "hover:border-muted-foreground/50"
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-baseline gap-3">
                          <RadioGroupItem
                            value={option.id}
                            id={option.id}
                            className="mt-1"
                            disabled={isDisabled}
                          />
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">
                              {option.title}
                            </CardTitle>
                            <CardDescription className="text-sm leading-relaxed">
                              {option.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <div className="mt-8 text-center space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={!selectedOption || isPending || !isLoaded || !user}
            className="px-8 py-2"
          >
            {isPending ? "Saving..." : "Continue with Selected Role"}
          </Button>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-emerald-600" role="status">
              {success}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
