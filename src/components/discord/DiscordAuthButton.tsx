"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "../ui/confirmation-dialog";

interface DiscordAuthButtonProps {
  linked: boolean;
}

function DiscordAuthButton({ linked }: DiscordAuthButtonProps) {
  const router = useRouter();

  if (linked) {
    return (
      <ConfirmationDialog
        title="Unlink Discord Account"
        description="Are you sure you want to unlink your Discord account? This will remove your Discord account from the CSS server."
        actionButtonText="Unlink"
        onAction={() => {
          router.replace("/api/discord/unlink");
        }}>
        <Button variant="destructive" size="full">
          Unlink Account
        </Button>
      </ConfirmationDialog>
    );
  } else {
    return (
      <Button
        size="full"
        variant="discord"
        onClick={() => {
          router.replace("/api/discord/link");
        }}>
        Link Discord
      </Button>
    );
  }
}
export default DiscordAuthButton;
