import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
};

export default async function GalleryPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: "desc",
    },
    select: {
      id: true,
      title: true,
      thumbnailImage: true,
    },
    where: {
      NOT: {
        eventImages: {
          none: {},
        },
      },
    },
  });

  return (
    <>
      <h1 className="text-center text-2xl font-bold md:text-4xl">Gallery</h1>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 && (
          <div className="col-span-full text-center">
            <span className="text-lg font-semibold text-muted-foreground">No events to show</span>
          </div>
        )}
        {events.map((event, i) => {
          return (
            <Link
              key={i}
              className="flex transform flex-col items-center rounded-md border border-border bg-card p-5 shadow-sm transition duration-300 ease-in-out hover:-translate-y-1 hover:border-blue-950/50 hover:shadow-md hover:shadow-blue-950/20 dark:hover:border-yellow-600/50 dark:hover:shadow-yellow-600/20"
              href={`/gallery/${event.id}`}>
              <Image
                className="rounded-md"
                src={event.thumbnailImage?.url ?? "/images/placeholder/480x360.png"}
                alt={`Thumbnail for ${event.title}`}
                width={480}
                height={360}
                style={{ objectFit: "cover" }}
              />
              <span className="mt-5 text-lg font-semibold">{event.title}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
