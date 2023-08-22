"use client";
import { unlinkDiscordAccount } from "@/app/_actions";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";

function UnlinkDiscordButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      onClick={() => {
        startTransition(() => {
          unlinkDiscordAccount();
        });
      }}
      disabled={isPending}>
      Unlink Discord
    </Button>
  );
}

export default UnlinkDiscordButton;
