import FeedView from "@/components/views/FeedView";
import MarkDownView from "@/components/views/MarkDownView";
import BackButton from "@/components/ui/back-button";
import { prisma } from "@/lib/db";
import { formatDateRange, getEventRelativeTime } from "@/lib/utils";
interface pageProps {
    params: { slug: string };
}

export default async function Post({ params }: pageProps) {
    const event = await prisma.event.findUnique({
        where: {
            slug: params.slug
        }
    });

    return (
        <FeedView heading={event?.title} subheading={`${formatDateRange(event!.startDate, event!.endDate)} ● ${getEventRelativeTime(event!.startDate, event!.endDate)}`}>
            <MarkDownView
                allowLinks
                markdown={event?.description!}
            />
            <BackButton href="/events" />
        </FeedView>
    )
}