"use server";

import { prisma } from "@/lib/db";
import { DiscordAccount } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { canEditEvent, canEditPost, getSession, isUndergradStudent } from "@/lib/utils";
import { redirect } from "next/navigation";

const DISCORD_API_ENDPOINT = "https://discordapp.com/api";

const discordEmbed = {
  title: "UWindsor Computer Science Society",
  url: "https://css.uwindsor.ca",
  thumbnail: { url: "https://css.uwindsor.ca/images/css-logo-shield.png" },
  color: "3447003",
};

async function linkDiscordAccount(discordResponse: any) {
  try {
    const session = await getSession();

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

async function unlinkDiscordAccount() {
  try {
    const session = await getSession();

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

async function sendDiscordDM(userID: string, message: string) {
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

async function getMemberCount(): Promise<{
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

async function getUpdatedDiscordAccount(discordAccount: DiscordAccount) {
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

// Event Actions
async function createEvent(event: EventFormData) {
  const session = await getSession();
  if (!session || !canEditEvent(session))
    throw new Error("You do not have permission to create events.");

  await prisma.event.create({
    data: {
      title: event.title,
      description: event.description,
      registrationEnabled: event.registrable,
      capacity: event.capacity,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
    },
  });
  revalidatePath("/events");
}

async function updateEvent(event: EventFormData, id: number) {
  const session = await getSession();
  if (!session || !canEditEvent(session))
    throw new Error("You do not have permission to update events.");

  await prisma.event.update({
    where: { id },
    data: {
      title: event.title,
      description: event.description,
      registrationEnabled: event.registrable,
      capacity: event.capacity,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
    },
  });
  revalidatePath(`/events/${id}`);
}

async function deleteEvent(id: number) {
  const session = await getSession();
  if (!session || !canEditEvent(session))
    throw new Error("You do not have permission to delete events.");

  await prisma.event.delete({
    where: { id },
  });
  redirect(`/events?success=${encodeURIComponent("Event deleted successfully.")}`);
}

async function registerForEvent(eventId: number, userId: number) {
  const session = await getSession();
  if (!session) throw new Error("You must be logged in to register for events.");

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new Error("Event not found.");

  if (!event.registrationEnabled) throw new Error("Event is not open for registration.");

  if (!isUndergradStudent(session))
    throw new Error("You must be an undergraduate student to register for events.");

  const registrations = await prisma.eventRegistration.count({
    where: {
      eventId,
    },
  });

  if (event.capacity !== null && registrations >= event.capacity)
    throw new Error("Event is full. Please try again later.");

  await prisma.eventRegistration.create({
    data: {
      event: { connect: { id: eventId } },
      user: { connect: { id: userId } },
    },
  });
  redirect(`/events/${eventId}?success=${encodeURIComponent("You've registered successfully.")}`);
}

async function unregisterForEvent(eventId: number, userId: number) {
  const session = await getSession();
  if (!session) throw new Error("You must be logged in to unregister for events.");

  await prisma.eventRegistration.deleteMany({
    where: {
      eventId,
      userId,
    },
  });
  redirect(`/events/${eventId}?success=${encodeURIComponent("You've unregistered successfully.")}`);
}

// Post Actions
async function createPost(post: PostFormData) {
  const session = await getSession();
  if (!session || !canEditPost(session))
    throw new Error("You do not have permission to create posts.");

  await prisma.post.create({
    data: {
      title: post.title,
      content: post.content,
      ...(post.isTeam ? {} : { author: { connect: { id: session.user.id } } }),
    },
  });
  revalidatePath("/newsletter");
}

async function updatePost(post: PostFormData, id: number) {
  const session = await getSession();
  if (!session || !canEditPost(session))
    throw new Error("You do not have permission to update posts.");

  const data: any = {
    title: post.title,
    content: post.content,
  };

  if (post.isTeam) {
    data.author = {
      disconnect: true,
    };
  } else {
    data.author = {
      connect: { id: session.user.id },
    };
  }

  await prisma.post.update({
    where: { id },
    data,
  });

  revalidatePath(`/newsletter/${id}`);
}

async function deletePost(id: number) {
  const session = await getSession();
  if (!session || !canEditPost(session))
    throw new Error("You do not have permission to delete posts.");

  await prisma.post.delete({
    where: { id },
  });
  redirect(`/newsletter?success=${encodeURIComponent("Post deleted successfully.")}`);
}

// Feedback Action
async function submitFeedback(feedback: feedbackFormData) {
  const session = await getSession();
  if (!session) return { error: "You must be logged in to submit feedback." };

  const todayFeedbackTotal = await prisma.feedback.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });

  if (todayFeedbackTotal > 25) return { error: "Feedback submissions are currently closed." };

  await fetch(`${process.env.DISCORD_SUGGESTION_WEBHOOK_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      embeds: [
        {
          title: feedback.subject,
          description: feedback.feedback,
          color: "3447003",
        },
      ],
    }),
  });

  await prisma.feedback.create({
    data: {
      subject: feedback.subject,
      feedback: feedback.feedback,
    },
  });

  return { success: "Feedback submitted successfully." };
}

export {
  linkDiscordAccount,
  unlinkDiscordAccount,
  getMemberFromServer,
  sendDiscordDM,
  getMemberCount,
  getUpdatedDiscordAccount,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterForEvent,
  createPost,
  updatePost,
  deletePost,
  submitFeedback,
};
