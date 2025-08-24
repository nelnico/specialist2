"use client";
import { Button } from "@/components/ui/button";
import { UserRole } from "@prisma/client";
import { useState } from "react";

const RoleSelect = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  return (
    <div>
      <div>Allow user to select a role</div>
      <div>
        <p>List roles and allow user to choose one.</p>
        <p>On continue, create user with selected role</p>
      </div>
      <Button disabled={!selectedRole}>Continue</Button>
    </div>
  );
};

export default RoleSelect;
