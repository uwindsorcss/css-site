import { prisma } from "@/lib/db";
import PaginationButtons from "../../ui/pagination";
import PostCard from "@/components/PostCard";
import { canEditEvent, sanitizePageNumber } from "@/lib/utils";
import { auth } from "@/auth";

interface EventsFeedProps {
  requestedPage?: string | number;
  filter?: string;
}

const eventsPerPage = 5;
const baseUrl = "/events";

async function EventsFeed({ requestedPage, filter }: EventsFeedProps) {
  const totalPages = Math.ceil((await prisma.event.count()) / eventsPerPage);
  const page = requestedPage ? sanitizePageNumber(baseUrl, requestedPage, totalPages) : 1;
  const session = await auth();
  const events = await prisma.event.findMany({
    skip: (page - 1) * eventsPerPage,
    take: eventsPerPage,
    orderBy: [
      {
        startDate: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
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
      visible: session && canEditEvent(session) ? undefined : true,
    },
  });

  if (events === null || events.length === 0)
    return <h2 className="text-2xl text-center font-bold mt-10">No events found</h2>;

  return (
    <>
      {events.map((event) => (
        <PostCard key={event.id} post={event} currentPage={page} filter={filter} truncate />
      ))}
      <PaginationButtons
        baseUrl={"/events"}
        currentPage={page}
        filter={filter}
        totalPages={totalPages}
      />
    </>
  );
}

export default EventsFeed;
