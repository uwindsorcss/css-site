import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_CALLBACK_URL}&response_type=code&scope=identify%20guilds.join`
  );
}
