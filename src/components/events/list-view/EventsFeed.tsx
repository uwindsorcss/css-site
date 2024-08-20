import { prisma } from "@/lib/db";
import PaginationButtons from "../../ui/pagination";
import PostCard from "@/components/PostCard";
import { canEditEvent, sanitizePageNumber } from "@/lib/utils";
import { auth } from "@/auth";

interface EventsFeedProps {
  requestedPage?: string | number;
  filter?: string;
}

const eventsPerPage = 14;
const baseUrl = "/events";

function getStartDate(filter: string) {
  const currentDate = new Date();

  return filter === "Past"
    ? { lte: currentDate }
    : filter === "Upcoming"
      ? { gt: currentDate }
      : undefined;
}

async function EventsFeed({ requestedPage, filter }: EventsFeedProps) {
  const session = await auth();
  const count = await prisma.event.count({
    where: {
      startDate: filter && getStartDate(filter),
      visible: session && canEditEvent(session) ? undefined : true,
    },
  });
  const totalPages = Math.ceil(count / eventsPerPage);
  const page = requestedPage ? sanitizePageNumber(baseUrl, requestedPage, totalPages) : 1;
  const events = await prisma.event.findMany({
    skip: (page - 1) * eventsPerPage,
    take: eventsPerPage,
    orderBy: [
      {
        startDate: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    where: {
      startDate: filter && getStartDate(filter),
      visible: session && canEditEvent(session) ? undefined : true,
    },
  });

  if (events === null || events.length === 0)
    return <h2 className="mt-10 text-center text-2xl font-bold">No events found</h2>;

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
