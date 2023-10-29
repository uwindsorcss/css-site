import EventsFilter from "./EventsFilter";
import EventsFeed from "./EventsFeed";
import { Suspense } from "react";

interface EventsListViewProps {
  searchParams: URLSearchParams & {
    page?: string;
    filter?: string;
  };
}

async function ListView({ searchParams }: EventsListViewProps) {
  const { page, filter } = searchParams;

  return (
    <div className="grid grid-cols-1 gap-6">
      <EventsFilter filter={filter} />
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <EventsFeed page={page} filter={filter} />
      </Suspense>
    </div>
  );
}

export default ListView;
