import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateRange, formatShortenedTimeDistance } from "@/lib/utils";
import PaginationButtons from "../ui/pagination-buttons";
import { redirect } from "next/navigation";

interface EventsListViewProps {
    searchParams: URLSearchParams & { page?: string };
}

async function ListView({ searchParams }: EventsListViewProps) {
    const page = searchParams.page;
    const postsPerPage = 10;
    const totalPages = Math.ceil((await prisma.post.count()) / postsPerPage);
    const currentPage = Math.min(Math.max(parseInt(page ?? "1"), 1), totalPages);

    if (parseInt(page ?? "1") > totalPages)
        redirect(`/events?page=${totalPages}`);

    const events = await prisma.event.findMany(
        {
            skip: (currentPage - 1) * postsPerPage,
            take: postsPerPage,
            orderBy: {
                startDate: "desc"
            }
        }
    );

    const getEventRelativeTime = (startDate: Date, endDate: Date) => {
        const now = new Date();
        if (startDate <= now && endDate >= now)
            return "Currently Happening";
        else if (startDate > now)
            return formatShortenedTimeDistance(startDate);
        return formatShortenedTimeDistance(endDate);
    }

    return (
        <>
            {
                events.map((event) => (
                    <Card>
                        <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription className="font-semibold">{formatDateRange(event.startDate, event.endDate)} ({getEventRelativeTime(event.startDate, event.endDate)
                            })</CardDescription>
                            <CardContent className="p-0 text-muted-foreground">{event.description}</CardContent>
                        </CardHeader>
                    </Card>
                ))
            }
            <PaginationButtons href={"/events"} currentPage={currentPage} totalPages={totalPages} />
        </>
    )
}

export default ListView