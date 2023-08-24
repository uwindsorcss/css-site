"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "../ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

interface DiscordAuthButtonProps {
  linked: boolean;
}

function DiscordAuthButton({ linked }: DiscordAuthButtonProps) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("error") !== null) {
      toast({
        title: "Error",
        description: searchParams.get("error") ?? "",
        variant: "destructive",
      });
      router.replace("/discord");
      router.refresh();
    } else if (searchParams.get("success") !== null) {
      toast({
        title: "Success",
        description: searchParams.get("success") ?? "",
        variant: "success",
      });
      router.replace("/discord");
      router.refresh();
    }
  }, [searchParams]);

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
