import FeedView from "@/components/views/FeedView";
import MarkDownView from "@/components/views/MarkDownView";
import BackButton from "@/components/ui/back-button";
import { prisma } from "@/lib/db";
import { formatDateRange, getEventRelativeTime } from "@/lib/utils";
import type { Metadata } from 'next'

interface pageProps {
  params: { id: string };
}

//generate meta tags
export async function generateMetadata(
  { params }: pageProps
): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  return {
    title: event?.title,
  }
}

export default async function Post({ params }: pageProps) {
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
      subheading2={event?.location ? `Location: ${event?.location}` : undefined}
    >
      <MarkDownView allowLinks markdown={event?.description!} />
      <BackButton href="/events" />
    </FeedView>
  );
}
