"use client";
import { unlinkDiscordAccount } from "@/app/_actions";
import React, { useTransition } from "react";

function UnlinkDiscordButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(() => {
          unlinkDiscordAccount();
        })
      }
      disabled={isPending}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
      Unlink Discord
    </button>
  );
}

export default UnlinkDiscordButton;
