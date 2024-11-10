"use server";

import { prisma } from "@/lib/db";
import { DiscordAccount } from "@prisma/client";
import {
  canEditEvent,
  canEditPost,
  error,
  errorRes,
  handleServerActionError,
  isUndergradStudent,
  success,
  successRes,
} from "@/lib/utils";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const DISCORD_API_ENDPOINT = "https://discordapp.com/api";

const discordEmbed = {
  title: "UWindsor Computer Science Society",
  url: "https://css.uwindsor.ca",
  thumbnail: { url: "https://css.uwindsor.ca/images/css-logo-shield.png" },
  color: "3447003",
};

export async function authorizeDiscordAccount() {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_CALLBACK_URL}&response_type=code&scope=identify%20guilds.join`;
  redirect(url);
}

export async function linkDiscordAccount(discordResponse: any) {
  try {
    const session = await auth();

    if (!session?.user.id)
      return errorRes("Error while linking account. It seems you're not logged in.", "/discord");

    if (discordResponse.error || !discordResponse.access_token)
      return errorRes("An error occurred while linking your account.", "/discord");

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

    if (member.user) return errorRes("You're already a member of the server.", "/discord");

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

    return successRes("Your account has been linked.", "/discord");
  } catch (error) {
    handleServerActionError(error as Error, "linkDiscordAccount");
  }
}

export async function unlinkDiscordAccount() {
  try {
    const session = await auth();

    if (!session?.user.id)
      return error("Error while unlinking account. It seems you're not logged in.");

    const discordAccount = await prisma.discordAccount.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!discordAccount) return error("No discord account found. Please try again.");

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

    return success("Your account has been unlinked.");
  } catch (error) {
    handleServerActionError(error as Error, "unlinkDiscordAccount");
  }
}

export async function getMemberFromServer(userId: string) {
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
    handleServerActionError(error as Error, "sendDiscordDM");
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
    handleServerActionError(error as Error, "getMemberCount");
    return { memberCount: 0, onlineCount: 0 };
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

export async function getDiscordAccountAvatar(discordId: string, avatarId: string) {
  return await fetch(`https://cdn.discordapp.com/avatars/${discordId}/${avatarId}.png`, {
    next: { revalidate: 300 },
  }).then((res) => res.url);
}

// Event Actions
export async function createEvent(event: EventFormData){
  try {
    // const session = await auth();
    // if (!session || !canEditEvent(session)) {
    //   error("You do not have permission to create events.");
    //   return -1;
    // }

    const eventCreated = await prisma.event.create({
      data: {
        title: event.title,
        description: event.description,
        registrationEnabled: event.registrable,
        waitListEnabled: event.waitListEnabled,
        visible: event.visible,
        capacity: event.capacity,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
      },
    });
    success("Event created successfully.");
    return eventCreated.id;
  } catch (error) {
    handleServerActionError(error as Error, "createEvent");
  }
}

export async function updateEvent(event: EventFormData, id: number) {
  try {
    const session = await auth();
    if (!session || !canEditEvent(session))
      return error("You do not have permission to update events.");

    if (!event.waitListEnabled && event.capacity !== undefined) {
      const registrations = await prisma.eventRegistration.count({
        where: {
          eventId: id,
        },
      });

      if (registrations > event.capacity) {
        const registrationsToDelete = registrations - event.capacity;
        const recentRegistrations = await prisma.eventRegistration.findMany({
          where: {
            eventId: id,
          },
          take: registrationsToDelete,
        });

        for (const registration of recentRegistrations) {
          await prisma.eventRegistration.delete({
            where: {
              id: registration.id,
            },
          });
        }
      }
    }

    await prisma.event.update({
      where: { id },
      data: {
        title: event.title,
        description: event.description,
        registrationEnabled: event.registrable,
        waitListEnabled: event.waitListEnabled,
        visible: event.visible,
        capacity: event.capacity,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
      },
    });

    return success("Event updated successfully.");
  } catch (error) {
    handleServerActionError(error as Error, "updateEvent");
  }
}

export async function deleteEvent(id: number) {
  try {
    const session = await auth();
    if (!session || !canEditEvent(session))
      return error("You do not have permission to delete events.");

    await prisma.event.delete({
      where: { id },
    });

    return success("Event deleted successfully.", "/events");
  } catch (error) {
    handleServerActionError(error as Error, "deleteEvent");
  }
}

export async function addEventImage({ eventId, url }: { eventId: number; url: string }) {
  try {
    await prisma.eventImage.create({
      data: {
        eventId,
        url,
      },
    });
    return success("Image added to database successfully.");
  } catch (error) {
    handleServerActionError(error as Error, "addEventImage");
  }
}

export async function getEventImages(eventId: number) {
  try {
    const images = await prisma.eventImage.findMany({
      where: {
        eventId,
      },
    });
    return images;
  } catch (error) {
    handleServerActionError(error as Error, "getEventImages");
  }
}

export async function deleteEventImage(imageId: number) {
  try {
    await prisma.eventImage.delete({
      where: {
        id: imageId,
      },
    });
    return success("Image deleted successfully.");
  } catch (error) {
    handleServerActionError(error as Error, "deleteEventImage");
  }
}

export async function setEventThumbnail(eventId: number, imageUrl: string) {
  try {
    await prisma.thumbnailImage.upsert({
      where: { eventId }, 
      update: {
        url: imageUrl, 
      },
      create: {
        url: imageUrl,
        event: {
          connect: { id: eventId }, 
        },
      },
    });
    return success("Thumbnail updated successfully.");
  } catch (error) {
    handleServerActionError(error as Error, "setEventThumbnail");
  }
}

export async function registerForEvent(eventId: number) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!session) return error("You must be logged in to register for events.");

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return error("Event not found.");

    if (!event.registrationEnabled || !event.visible)
      return error("The registration has been disabled for this event.");

    if (!isUndergradStudent(session))
      return error("Only undergraduate students can register for events.");

    if (event.endDate < new Date())
      return error("You cannot register for an event that has already ended.");

    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        userId,
      },
    });

    if (existingRegistration) return error("You're already registered for this event.");

    const registrations = await prisma.eventRegistration.count({
      where: {
        eventId,
      },
    });

    if (event.capacity !== null && registrations >= event.capacity) {
      if (event.waitListEnabled) {
        await prisma.eventRegistration.create({
          data: {
            event: { connect: { id: eventId } },
            user: { connect: { id: userId } },
          },
        });

        return success("You've been added to the waitlist for this event.");
      }
      return error("This event is full. You've not been registered.");
    }

    await prisma.eventRegistration.create({
      data: {
        event: { connect: { id: eventId } },
        user: { connect: { id: userId } },
      },
    });

    return success("You've been registered for this event!");
  } catch (error) {
    handleServerActionError(error as Error, "registerForEvent");
  }
}

export async function unregisterForEvent(eventId: number) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!session) return error("You must be logged in to unregister from events.");

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return error("Event not found.");

    if (!event.registrationEnabled || !event.visible)
      return error("The registration has been disabled for this event.");

    if (event.endDate < new Date())
      return error("You cannot unregister from an event that has already ended.");

    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        userId,
      },
    });

    if (!existingRegistration) return error("You're not registered for this event.");

    await prisma.eventRegistration.deleteMany({
      where: {
        eventId,
        userId,
      },
    });

    return success("You've been unregistered from this event.");
  } catch (error) {
    handleServerActionError(error as Error, "unregisterForEvent");
  }
}

// Post Actions
export async function createPost(post: PostFormData) {
  try {
    const session = await auth();
    if (!session || !canEditPost(session))
      return error("You do not have permission to create posts.");

    await prisma.post.create({
      data: {
        title: post.title,
        bannerUrl: post.bannerUrl,
        bannerAlt: post.bannerAlt,
        content: post.content,
        ...(post.isTeam ? {} : { author: { connect: { id: session.user.id } } }),
      },
    });
    alert("Post created successfully.");

    return success("Post created successfully.");
  } catch (error) {
    handleServerActionError(error as Error, "createPost");
  }
}

export async function updatePost(post: PostFormData, id: number) {
  try {
    const session = await auth();
    if (!session || !canEditPost(session))
      return error("You do not have permission to update posts.");

    const data: any = {
      title: post.title,
      bannerUrl: post.bannerUrl,
      bannerAlt: post.bannerAlt,
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

    return success("Post updated successfully.");
  } catch (error) {
    handleServerActionError(error as Error, "updatePost");
  }
}

export async function deletePost(id: number) {
  try {
    const session = await auth();
    if (!session || !canEditPost(session))
      return error("You do not have permission to delete posts.");

    await prisma.post.delete({
      where: { id },
    });
    return success("Post deleted successfully.", "/highlight");
  } catch (error) {
    handleServerActionError(error as Error, "deletePost");
  }
}

// Feedback Action
export async function submitFeedback(feedback: feedbackFormData) {
  try {
    const session = await auth();
    if (!session) return error("You must be logged in to submit feedback.");

    const todayFeedbackTotal = await prisma.feedback.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    if (todayFeedbackTotal > 25) return error("Feedback submissions are currently closed.");

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

    return success("Feedback submitted successfully.");
  } catch (error) {
    handleServerActionError(error as Error, "submitFeedback");
  }
}
