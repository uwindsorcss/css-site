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
      <Suspense fallback={eventsSkeleton}>
        <EventsFeed page={page} filter={filter} />
      </Suspense>
    </div>
  );
}

export default ListView;

const eventsSkeleton = Array.from({ length: 3 }, (_, i) => (
  <div key={i} className="w-full h-60 bg-card rounded-md border border-border loading-skeleton" />
));
