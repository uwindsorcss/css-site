import MarkDownView from "@/components/MarkDownView";
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
        <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-2">
            <h1 className="text-2xl md:text-4xl text-center font-bold">{event?.title}</h1>
            <span className="text-sm font-semibold text-muted-foreground mb-8">{formatDateRange(event!.startDate, event!.endDate)} ({getEventRelativeTime(event!.startDate, event!.endDate)
            })</span>
            <MarkDownView
                allowLinks
                className="prose dark:prose-invert max-w-none w-full break-words"
                markdown={event?.description!}
            />
            <BackButton href="/events" />
        </div>
    )
}