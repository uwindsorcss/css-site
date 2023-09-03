import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateRange, getEventRelativeTime } from "@/lib/utils";
import PaginationButtons from "../ui/pagination-buttons";
import { redirect } from "next/navigation";
import MarkDownView from "../MarkDownView";
import Link from "next/link";

interface EventsListViewProps {
    searchParams: URLSearchParams & { page?: string };
}

async function ListView({ searchParams }: EventsListViewProps) {
    const page = searchParams.page;
    const eventsPerPage = 10;
    const totalPages = Math.ceil((await prisma.event.count()) / eventsPerPage);
    const currentPage = Math.min(Math.max(parseInt(page ?? "1"), 1), totalPages);

    if (parseInt(page ?? "1") > totalPages)
        redirect(`/events?page=${totalPages}`);

    const events = await prisma.event.findMany(
        {
            skip: (currentPage - 1) * eventsPerPage,
            take: eventsPerPage,
            orderBy: {
                startDate: "desc"
            }
        }
    );

    return (
        <>
            {
                events.map((event) => (
                    <Card>
                        <Link key={event.id} href={`/events/${event.slug}?page=${currentPage}`} >
                            <CardHeader>
                                <CardTitle>{event.title}</CardTitle>
                                <CardDescription className="font-semibold">{formatDateRange(event.startDate, event.endDate)} ({getEventRelativeTime(event.startDate, event.endDate)
                                })</CardDescription>
                                <CardContent className="p-0 text-muted-foreground">
                                    <MarkDownView
                                        className="prose dark:prose-invert max-w-none w-full break-words"
                                        markdown={event.description!} />
                                </CardContent>
                            </CardHeader>
                        </Link>
                    </Card >
                ))
            }
            <PaginationButtons href={"/events"} currentPage={currentPage} totalPages={totalPages} />
        </>
    )
}

export default ListView