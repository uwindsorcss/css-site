"use server";

import { prisma } from "@/lib/db";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const DISCORD_API_ENDPOINT = "https://discordapp.com/api";

export async function linkDiscordAccount(discordResponse: any) {
  try {
    const accessToken = discordResponse.access_token;

    //translate discordResponse.expires_in to a date
    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + discordResponse.expires_in - 60
    );

    const user = await fetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
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

    const data: any = {
      id: user.id,
      userId: session?.user.id!,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      access_token: accessToken,
      expires_at: expiresAt,
      updated_at: new Date(),
    };

    if (!discordAccount) {
      data.created_at = new Date();
      await prisma.discordAccount.create({
        data: data,
      });
    } else {
      await prisma.discordAccount.update({
        where: {
          id: discordAccount.id,
        },
        data: data,
      });
    }

    // Add the user to the server
    await fetch(
      `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${user.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
        }),
      }
    );

    // Send a confirmation DM to the user
    await sendDiscordDM(user.id, "You've successfully linked your account.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function unlinkDiscordAccount() {
  const session = await getServerSession(authOptions);
  try {
    const discordAccount = await prisma.discordAccount.findUnique({
      where: {
        userId: session?.user?.id!,
      },
    });

    if (discordAccount) {
      // Remove the user from the server
      await fetch(
        `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordAccount.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        }
      ).catch((error) => {
        console.error("An error occurred:", error);
      });

      await prisma.discordAccount.delete({
        where: {
          id: discordAccount.id,
        },
      });

      await sendDiscordDM(
        discordAccount.id,
        "You've successfully unlinked your account."
      );
    } else {
      throw new Error("Discord account not found");
    }

    return true;
  } catch (error) {
    console.error("An error occurred:", error);
    return false;
  }
}

export async function sendDiscordDM(userID: string, message: string) {
  try {
    const channel = await fetch(`${DISCORD_API_ENDPOINT}/users/@me/channels`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient_id: userID,
      }),
    });
    const channelJSON = await channel.json();

    await fetch(`${DISCORD_API_ENDPOINT}/channels/${channelJSON.id}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
