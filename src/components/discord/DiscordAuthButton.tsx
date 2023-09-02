"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DiscordAuthButtonProps {
  linked: boolean;
}

function DiscordAuthButton({ linked }: DiscordAuthButtonProps) {
  const router = useRouter();

  if (linked) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="full">
            Unlink Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Discord Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink your Discord account? This will
              remove your Discord account from the CSS server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                router.replace("/api/discord/unlink");
              }}>
              Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
