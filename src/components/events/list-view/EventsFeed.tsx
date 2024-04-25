import { prisma } from "@/lib/db";
import PaginationButtons from "../../ui/pagination";
import { redirect } from "next/navigation";
import PostCard from "@/components/PostCard";
import { Session } from "next-auth";
import { canEditEvent } from "@/lib/utils";

interface EventsFeedProps {
  page: string | undefined;
  filter: string | undefined;
  session: Session | null;
}

async function EventsFeed({ page, filter, session }: EventsFeedProps) {
  const eventsPerPage = 5;
  const totalPages = Math.ceil((await prisma.event.count()) / eventsPerPage);
  const currentPage = Math.min(Math.max(parseInt(page ?? "1"), 1), totalPages);
  if (parseInt(page ?? "1") > totalPages) redirect(`/events?page=${totalPages}`);

  const events = await prisma.event.findMany({
    skip: (currentPage - 1) * eventsPerPage,
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
        <PostCard key={event.id} post={event} currentPage={currentPage} filter={filter} truncate />
      ))}
      <PaginationButtons
        baseUrl={"/events"}
        currentPage={currentPage}
        filter={filter}
        totalPages={totalPages}
      />
    </>
  );
}

export default EventsFeed;
