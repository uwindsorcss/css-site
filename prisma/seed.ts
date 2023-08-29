import { PrismaClient } from "@prisma/client";
import blacklistedEmails from "../data/blacklist.json";
import eventsData from "../data/events.json";

const prisma = new PrismaClient();

async function seed() {
  // development data
  if (process.env.NODE_ENV === "development") {
    //events
    for (const eventData of eventsData) {
      const event = await prisma.event.create({
        data: {
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          location: eventData.location,
          slug: eventData.slug,
          thumbnailImage: {
            create: {
              url: eventData.thumbnailUrl!,
            },
          },
          eventImages: {
            create: eventData.imageUrls.map((url) => ({
              url,
            })),
          },
        },
      });

      console.log(`Event "${event.title}" created.`);
    }
  }

  //blacklist
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
  }
  console.log("Blacklist seeded.");

  console.log("Seeding completed.");
}

seed()
  .catch((error) => {
    console.error("Error while seeding:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
