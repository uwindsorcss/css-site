import React from "react";

function LinkDiscordButton() {
  const oAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&response_type=code&scope=identify%20guilds.join`;
  return (
    <a
      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      href={oAuthUrl}>
      Link Discord
    </a>
  );
}
export default LinkDiscordButton;
