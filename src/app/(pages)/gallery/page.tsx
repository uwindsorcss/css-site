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
      slug: true,
      thumbnailImage: true,
    },
  });

  return (
    <>
      <h1 className="text-2xl md:text-4xl text-center font-bold">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.length === 0 && (
          <div className="col-span-full text-center">
            <span className="text-lg text-muted font-semibold">
              No events to show
            </span>
          </div>
        )}
        {events.map((event, i) => {
          return (
            <Link
              key={i}
              className="bg-card flex flex-col items-center p-5 border rounded-md border-border shadow-sm hover:shadow-md hover:border-blue-950/50 hover:shadow-blue-950/20 dark:hover:border-yellow-600/50  dark:hover:shadow-yellow-600/20 hover:-translate-y-1 transition duration-300 ease-in-out transform"
              href={`/gallery/${event.slug}`}>
              <Image
                className="rounded-md"
                src={
                  event.thumbnailImage?.url ?? "/images/placeholder/480x360.png"
                }
                alt={`Thumbnail for ${event.title}`}
                width={480}
                height={360}
                style={{ objectFit: "cover" }}
              />
              <span className="text-lg font-semibold mt-5">{event.title}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
