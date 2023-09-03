import { prisma } from "@/lib/db";
import PaginationButtons from "../ui/pagination-buttons";
import { redirect } from "next/navigation";
import EventCard from "./EventCard";

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
                    <EventCard key={event.id} event={event} currentPage={currentPage} />
                ))
            }
            <PaginationButtons href={"/events"} currentPage={currentPage} totalPages={totalPages} />
        </>
    )
}

export default ListView