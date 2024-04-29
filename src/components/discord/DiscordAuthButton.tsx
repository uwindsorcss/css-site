"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "../ui/confirmation-dialog";
import { authorizeDiscordAccount, unlinkDiscordAccount } from "@/lib/actions";

interface DiscordAuthButtonProps {
  linked: boolean;
}

function DiscordAuthButton({ linked }: DiscordAuthButtonProps) {
  if (linked) {
    return (
      <ConfirmationDialog
        title="Unlink Discord Account"
        description="Are you sure you want to unlink your Discord account? This will remove your Discord account from the CSS server."
        actionButtonText="Unlink"
        onAction={() => {
          unlinkDiscordAccount();
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
          authorizeDiscordAccount();
        }}>
        Link Discord
      </Button>
    );
  }
}
export default DiscordAuthButton;
