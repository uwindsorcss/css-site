import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    const params = new URLSearchParams();
    params.append("client_id", process.env.DISCORD_CLIENT_ID!);
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET!);
    params.append("grant_type", "authorization_code");
    params.append("code", code!);
    params.append("redirect_uri", process.env.DISCORD_REDIRECT_URI!);
    params.append("scope", "guilds.join identify");

    // Exchange the authorization code for an access token from Discord
    const discordResponse = await fetch(
      "https://discordapp.com/api/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        body: params,
      }
    ).then((res) => res.json());

    const accessToken = discordResponse.access_token;

    //translate discordResponse.expires_in to a date
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + discordResponse.expires_in - 60
    );

    const user = await fetch("https://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());

    const session = await getServerSession(authOptions);
    const discordAccount = await prisma.discordAccount.findUnique({
      where: {
        userId: session?.user.id!,
      },
    });

    if (!discordAccount) {
      await prisma.discordAccount.create({
        data: {
          id: user.id,
          userId: session?.user.id!,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          access_token: accessToken,
          expires_at: expiresAt,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } else {
      await prisma.discordAccount.update({
        where: {
          userId: session?.user.id!,
        },
        data: {
          id: user.id,
          userId: session?.user.id!,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          access_token: accessToken,
          expires_at: expiresAt,
          updated_at: new Date(),
        },
      });
    }

    // redirect
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    console.error("Error handling Discord callback:", error);
    return new Response("Error handling Discord callback", {
      status: 500,
    });
  }
}
