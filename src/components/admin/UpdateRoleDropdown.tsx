"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAsyncFeedback } from "@/hooks/useAsyncFeedback";
import { updateUserRole } from "@/lib/admin-actions";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface EditRoleDropdownProps {
  currentRole: string;
  userId: number;
  disabled?: boolean;
}

export function UpdateRoleDropdown({
  disabled = false,
  userId,
  currentRole,
}: EditRoleDropdownProps) {
  const handleAsync = useAsyncFeedback();
  const [role, setRole] = useState(currentRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"} disabled={disabled}>
          <Pencil size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={role}
          onValueChange={(value) => {
            setRole(value);
            handleAsync(updateUserRole, userId, value);
          }}>
          <DropdownMenuRadioItem value="mod">Mod</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="eventEditor">Event Editor</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="postEditor">Post Editor</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
