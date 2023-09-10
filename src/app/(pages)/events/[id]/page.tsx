import FeedView from "@/components/views/FeedView";
import MarkDownView from "@/components/views/MarkDownView";
import BackButton from "@/components/ui/back-button";
import { prisma } from "@/lib/db";
import { formatDateRange, getEventRelativeTime, getSession, isModOrAdmin } from "@/lib/utils";
import type { Metadata } from "next";
import DeleteEventButton from "@/components/events/event-post/DeleteEventButton";
import EditEventButton from "@/components/events/event-post/EditEventButton";

interface pageProps {
  params: { id: string };
}

//generate meta tags
export async function generateMetadata({ params }: pageProps): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  return {
    title: event?.title,
  };
}

export default async function Post({ params }: pageProps) {
  const session = await getSession();
  const event = await prisma.event.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  return (
    <FeedView
      heading={event?.title}
      subheading={`${formatDateRange(event!.startDate, event!.endDate)} ● ${getEventRelativeTime(
        event!.startDate,
        event!.endDate
      )}`}
      subheading2={event?.location ? `Location: ${event?.location}` : undefined}>
      <MarkDownView allowLinks markdown={event?.description!} />
      <div className="flex justify-between w-full mt-10">
        <BackButton href="/events" />
        {session && isModOrAdmin(session) && (
          <div className="space-x-2">
            <EditEventButton id={event!.id} event={event!} />
            <DeleteEventButton id={event!.id} />
          </div>
        )}
      </div>
    </FeedView>
  );
}
