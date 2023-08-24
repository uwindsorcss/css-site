import { NextResponse } from "next/server";
import { linkDiscordAccount } from "@/app/_actions";

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

    if (discordResponse.id) {
      await linkDiscordAccount(discordResponse);
      return NextResponse.redirect(
        new URL(
          "/discord?success=Your%20account%20has%20been%20linked.",
          req.url
        )
      );
    }
    return NextResponse.redirect(
      new URL(
        "/discord?error=There%20was%20an%20error%20linking%20your%20account.%20Please%20try%20again.",
        req.url
      )
    );
  } catch (error) {
    console.error("Error handling Discord callback:", error);
    return NextResponse.redirect(
      new URL(
        "/discord?error=There%20was%20an%20error%20linking%20your%20account.%20Please%20try%20again.",
        req.url
      )
    );
  }
}
