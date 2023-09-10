"use server";

import { prisma } from "@/lib/db";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { DiscordAccount, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession, isModOrAdmin } from "@/lib/utils";
import { redirect } from "next/navigation";

const DISCORD_API_ENDPOINT = "https://discordapp.com/api";

const discordEmbed = {
  title: "UWindsor Computer Science Society",
  url: "https://css.uwindsor.ca",
  thumbnail: { url: "https://css.uwindsor.ca/images/css-logo-shield.png" },
  color: "3447003",
};

export async function linkDiscordAccount(discordResponse: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) throw new Error("Error while linking account. Session not found.");

    const accessToken = discordResponse.access_token;

    const discordUser = await fetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());

    //translate discordResponse.expires_in to a date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + discordResponse.expires_in - 60);

    const data = {
      discordId: discordUser.id,
      userId: session.user.id,
      username: discordUser.username,
      discriminator: discordUser.discriminator,
      avatar: discordUser.avatar,
      accessToken: accessToken,
      expiresAt: expiresAt,
    };

    await prisma.discordAccount.upsert({
      where: {
        userId: session.user.id,
      },
      update: data,
      create: data,
    });

    const member = await getMemberFromServer(discordUser.id);

    if (member.user) return;

    //Check the name length because the Discord API doesn't allow nicknames longer than 32 characters
    let userName = session.user.name;
    if (userName.length > 32) {
      const lastSpaceIndex = userName.lastIndexOf(" ", 31);
      if (lastSpaceIndex !== -1) userName = userName.slice(0, lastSpaceIndex);
      else userName = userName.slice(0, 32);
    }

    // Add the user to the server
    await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordUser.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
          nick: userName,
        }),
      }
    );

    // Send a confirmation DM to the user
    await sendDiscordDM(
      discordUser.id,
      `🔗✅ You've successfully linked your account.\n\n Welcome to the **University of Windsor CS Discord**! You've come to a great place.\n\n
              We've set your nickname to **${session.user.name}**. Please contact a CSS member if you'd like to shorten your name (e.g. Johnathon Middlename Doe -> John Doe).`
    );
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

export async function unlinkDiscordAccount() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) throw new Error("Error while unlinking account. Session not found.");

    const discordAccount = await prisma.discordAccount.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!discordAccount || discordAccount === null)
      throw new Error("No discord account found. Please try again.");

    await sendDiscordDM(
      discordAccount.discordId,
      `🔗💥 You've successfully unlinked your account.\n\n 
          You've been removed from the server. If you'd like to rejoin, please [relink](https://css.uwindsor.ca/discord) your account.`
    );

    // Remove the user from the server
    await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordAccount.discordId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    // Delete the discord account from the database
    await prisma.discordAccount.delete({
      where: {
        id: discordAccount.id,
      },
    });

    return true;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

async function getMemberFromServer(userId: string) {
  return await fetch(
    `${DISCORD_API_ENDPOINT}/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  ).then((res) => res.json());
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
        embed: {
          ...discordEmbed,
          description: message,
        },
      }),
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function getMemberCount(): Promise<{
  memberCount: number;
  onlineCount: number;
}> {
  try {
    const response = await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${process.env.DISCORD_GUILD_ID}/preview`,
      {
        next: { revalidate: 3600 },
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const data = await response.json();
    return {
      memberCount: data.approximate_member_count,
      onlineCount: data.approximate_presence_count,
    };
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

export async function getUpdatedDiscordAccount(discordAccount: DiscordAccount) {
  let { username, avatar } = discordAccount;
  let avatarUrl = "/images/discord-avatar.png";

  if (discordAccount.updatedAt.getTime() < Date.now() - 300000) {
    const res = await fetch(`${DISCORD_API_ENDPOINT}/users/${discordAccount.discordId}`, {
      next: { revalidate: 300 },
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      await prisma.discordAccount.update({
        where: { id: discordAccount.id },
        data: {
          username: data.username,
          discriminator: data.discriminator,
          avatar: data.avatar,
        },
      });
      username = data.username;
      avatarUrl = await getDiscordAccountAvatar(data.id, data.avatar);
    }
  } else if (avatar) {
    avatarUrl = await getDiscordAccountAvatar(discordAccount.discordId, avatar);
  }

  return { username, avatarUrl };
}

async function getDiscordAccountAvatar(discordId: string, avatarId: string) {
  return await fetch(`https://cdn.discordapp.com/avatars/${discordId}/${avatarId}.png`, {
    next: { revalidate: 300 },
  }).then((res) => res.url);
}

// Events Actions
export async function createEvent(event: EventFormData) {
  const session = await getSession();
  if (!session || !isModOrAdmin(session))
    throw new Error("You do not have permission to create events.");

  await prisma.event.create({
    data: event,
  });
  revalidatePath("/events");
}

export async function updateEvent(event: EventFormData, id: number) {
  const session = await getSession();
  if (!session || !isModOrAdmin(session))
    throw new Error("You do not have permission to update events.");

  await prisma.event.update({
    where: { id },
    data: event,
  });
  revalidatePath(`/events/${id}`);
}

export async function deleteEvent(id: number) {
  const session = await getSession();
  if (!session || !isModOrAdmin(session))
    throw new Error("You do not have permission to delete events.");

  await prisma.event.delete({
    where: { id: id },
  });
  redirect("/events");
}
