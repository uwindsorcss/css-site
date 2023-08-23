import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function LinkDiscordButton() {
  const oAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&response_type=code&scope=identify%20guilds.join`;
  return (
    <Button asChild>
      <Link href={oAuthUrl}>Link Discord</Link>
    </Button>
  );
}
export default LinkDiscordButton;
