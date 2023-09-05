import { NextResponse } from "next/server";
import { linkDiscordAccount } from "@/app/_actions";

export const dynamic = "force-dynamic";
const DISCORD_API_ENDPOINT = "https://discordapp.com/api";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    const params = new URLSearchParams();
    params.append("client_id", process.env.DISCORD_CLIENT_ID!);
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET!);
    params.append("grant_type", "authorization_code");
    params.append("code", code!);
    params.append("redirect_uri", process.env.DISCORD_CALLBACK_URL!);
    params.append("scope", "guilds.join identify");

    // Exchange the authorization code for an access token from Discord
    const discordResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        body: params,
      }
    ).then((res) => res.json());

    console.log("discordResponse", discordResponse);

    if (!discordResponse.error && discordResponse.access_token) {
      await linkDiscordAccount(discordResponse);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/discord?success=Your%20account%20has%20been%20linked.`
      );
    }

    console.log(
      "from discord/callback/route.ts: discordResponse.error",
      discordResponse.error
    );

    const errorMessage = `There was an error linking your account. Please try again. From 1: ${discordResponse.error}`;

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/discord?error=${encodeURIComponent(
        errorMessage.trim()
      )}`
    );
  } catch (error) {
    const errorMessage = `There was an error linking your account. Please try again. From 2: ${error}`;

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/discord?error=${encodeURIComponent(
        errorMessage.trim()
      )}`
    );
  }
}
