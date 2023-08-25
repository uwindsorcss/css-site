"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DiscordAuthButtonProps {
  linked: boolean;
}

function DiscordAuthButton({ linked }: DiscordAuthButtonProps) {
  const router = useRouter();

  if (linked) {
    return (
      <Button
        variant="destructive"
        onClick={() => {
          router.replace("/api/discord/unlink");
        }}>
        Unlink Discord
      </Button>
    );
  } else {
    return (
      <Button
        onClick={() => {
          router.replace("/api/discord/link");
        }}>
        Link Discord
      </Button>
    );
  }
}
export default DiscordAuthButton;
