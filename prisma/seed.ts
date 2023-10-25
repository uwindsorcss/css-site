import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import { parse } from "lossless-json";

const prisma = new PrismaClient();

async function seed() {
  let counter = 0;
  let data: any;

  if (process.env.SEED === "false") return;

  // development data
  if (process.env.NODE_ENV === "development" && process.env.SEED_OLD_DATA === "false") {
    console.log("Seeding development data.");

    const eventsJsonData = await fs.readFile("./prisma/developmentData/events.json", "utf-8");
    data = parse(eventsJsonData);

    //events
    for (const eventData of data) {
      const event = await prisma.event.create({
        data: {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          location: eventData.location,
          thumbnailImage: {
            create: {
              url: eventData.thumbnailUrl!,
            },
          },
          eventImages: {
            create: eventData.imageUrls.map((url: string) => ({
              url,
            })),
          },
        },
      });

      console.log(`Event "${event.title}" created.`);
      counter++;
    }
    console.log(`${counter} development events seeded.`);

    //Newsletter Posts
    counter = 0;
    const newsletterPostsJsonData = await fs.readFile(
      "./prisma/developmentData/newsletter-posts.json",
      "utf-8"
    );
    data = parse(newsletterPostsJsonData);

    for (const newsletterPostData of data) {
      const newsletterPost = await prisma.post.create({
        data: {
          title: newsletterPostData.title,
          id: newsletterPostData.id,
          content: newsletterPostData.content,
        },
      });

      console.log(`Newsletter Post "${newsletterPost.title}" created.`);
      counter++;
    }
    console.log(`${counter} development newsletter posts seeded.`);
  } else if (process.env.SEED_OLD_DATA === "true") {
    console.log("Seeding old data.");

    // Posts
    const jsonData = await fs.readFile("./prisma/oldData/posts.json", "utf-8");
    data = parse(jsonData);

    for (const post of data) {
      await prisma.post.create({
        data: {
          id: Number(post.id),
          title: post.title,
          content: post.content,
          createdAt: new Date(post.created_at),
          updatedAt: new Date(post.updated_at),
        },
      });
      counter++;
    }
    console.log(`${counter} posts seeded.`);

    // Events
    counter = 0;
    const eventsJsonData = await fs.readFile("./prisma/oldData/events.json", "utf-8");
    data = parse(eventsJsonData);

    for (const event of data) {
      await prisma.event.create({
        data: {
          id: Number(event.id),
          title: event.title,
          description: event.description,
          startDate: new Date(event.start_date),
          endDate: new Date(event.end_date),
          location: event.location,
          capacity: event.capacity === null ? null : Number(event.capacity),
          registrationEnabled: event.registration_enabled === "t" ? true : false,
          createdAt: new Date(event.created_at),
          updatedAt: new Date(event.updated_at),
        },
      });
      counter++;
    }
    console.log(`${counter} events seeded.`);

    // Users
    counter = 0;
    const usersJsonData = await fs.readFile("./prisma/oldData/users.json", "utf-8");
    data = parse(usersJsonData);

    for (const user of data) {
      await prisma.user.create({
        data: {
          id: Number(user.id),
          name: user.name,
          email: user.email,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at),
        },
      });
      counter++;
    }
    console.log(`${counter} users seeded.`);

    // Discord Accounts
    counter = 0;
    const discordAccountsJsonData = await fs.readFile(
      "./prisma/oldData/discord_users.json",
      "utf-8"
    );
    data = parse(discordAccountsJsonData);

    for (const discordAccount of data) {
      if (discordAccount.discord_uid === null || discordAccount.user_id === null) {
        continue;
      }

      await prisma.discordAccount.create({
        data: {
          id: Number(discordAccount.id),
          discordId: discordAccount.discord_uid.toString(),
          userId: Number(discordAccount.user_id),
          createdAt: new Date(discordAccount.created_at),
          updatedAt: new Date(discordAccount.updated_at),
        },
      });
      counter++;
    }
    console.log(`${counter} discord accounts seeded.`);
  }

  //blacklist
  counter = 0;
  const blacklistedEmailsJsonData = await fs.readFile("./prisma/blacklist.json", "utf-8");
  const blacklistedEmails: any = parse(blacklistedEmailsJsonData);
  for (const email of blacklistedEmails) {
    //skip if already exists
    const exists = await prisma.blackList.findUnique({
      where: { email: email },
    });
    if (exists) {
      continue;
    }
    await prisma.blackList.create({
      data: {
        email: email,
      },
    });
    counter++;
  }
  console.log(`${counter} blacklisted emails seeded.`);

  console.log("Seeding completed.");
}

seed()
  .catch((error) => {
    console.error("Error while seeding:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
