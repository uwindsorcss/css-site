import { prisma } from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://css.uwindsor.ca";
  //Post URLs
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });
  const postUrls = posts.map((post) => ({
    url: baseUrl + `/newsletter/${post.id}`,
    lastModified: post.updatedAt,
  }));

  //Event URLs
  const events = await prisma.event.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });
  const eventUrls = events.map((event) => ({
    url: baseUrl + `/events/${event.id}`,
    lastModified: event.updatedAt,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: baseUrl + "/about",
      lastModified: new Date(),
      priority: 0.9,
    },
    {
      url: baseUrl + "/events",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: baseUrl + "/newsletter",
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: baseUrl + "/discord",
      lastModified: new Date(),
      priority: 0.8,
    },
    ...postUrls,
    ...eventUrls,
  ];
}