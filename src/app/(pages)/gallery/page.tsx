import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";

type Event = {
  name: string;
  slug: string;
  thumbnail: string;
  images?: string[];
};

const events: Event[] = [
  {
    name: "event 1",
    slug: "event1",
    thumbnail: "/images/placeholder/480x360.png",
  },
  {
    name: "event 2",
    slug: "event2",
    thumbnail: "/images/placeholder/480x360.png",
  },
  {
    name: "event 3",
    slug: "event3",
    thumbnail: "/images/placeholder/480x360.png",
  },
  {
    name: "event 4",
    slug: "event4",
    thumbnail: "/images/placeholder/480x360.png",
  },
];

const GalleryPage: NextPage = () => {
  return (
    <PageWrapper>
      <h1 className="text-2xl md:text-4xl text-center font-bold">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((event, i) => {
          return (
            <Link
              key={i}
              className="bg-card flex flex-col items-center p-5 border rounded-md border-border shadow-sm hover:shadow-md hover:border-blue-950/50 hover:shadow-blue-950/20 dark:hover:border-yellow-600/50  dark:hover:shadow-yellow-600/20 hover:-translate-y-1 transition duration-300 ease-in-out transform"
              href={`/gallery/${event.slug}`}>
              <Image
                className="rounded-md"
                src={event.thumbnail}
                alt={`Thumbnail for ${event.name}`}
                width={480}
                height={360}
                style={{ objectFit: "cover" }}
              />
              <span className="text-lg font-semibold mt-5">{event.name}</span>
            </Link>
          );
        })}
      </div>
    </PageWrapper>
  );
};

export default GalleryPage;
