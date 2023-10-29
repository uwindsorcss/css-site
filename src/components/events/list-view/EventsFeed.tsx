import { prisma } from "@/lib/db";
import PaginationButtons from "../../ui/pagination-buttons";
import { redirect } from "next/navigation";
import EventCard from "./EventCard";

interface EventsFeedProps {
  page: string | undefined;
  filter: string | undefined;
}

async function EventsFeed({ page, filter }: EventsFeedProps) {
  const eventsPerPage = 5;
  const totalPages = Math.ceil((await prisma.event.count()) / eventsPerPage);
  const currentPage = Math.min(Math.max(parseInt(page ?? "1"), 1), totalPages);
  if (parseInt(page ?? "1") > totalPages) redirect(`/events?page=${totalPages}`);

  const events = await prisma.event.findMany({
    skip: (currentPage - 1) * eventsPerPage,
    take: eventsPerPage,
    orderBy: {
      startDate: "desc",
    },
    where: {
      startDate:
        filter === "Past"
          ? {
              lte: new Date(),
            }
          : filter === "Upcoming"
          ? {
              gt: new Date(),
            }
          : undefined,
    },
  });

  return (
    <>
      {events === null || events.length === 0 ? (
        <h2 className="text-2xl text-center font-bold mt-10">No events found</h2>
      ) : (
        <>
          {events.map((event) => (
            <EventCard key={event.id} event={event} currentPage={currentPage} filter={filter} />
          ))}
          <PaginationButtons
            href={"/events"}
            currentPage={currentPage}
            filter={filter}
            totalPages={totalPages}
          />
        </>
      )}
    </>
  );
}

export default EventsFeed;
