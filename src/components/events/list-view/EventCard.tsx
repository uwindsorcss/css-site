import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import MarkDownView from "@/components/views/MarkDownView";
import { formatDateRange, getRelativeEventTime } from "@/lib/utils";
import { Event } from "@prisma/client";
import { CalendarDays } from "lucide-react";

interface EventCardProps {
  event: Event;
  currentPage: number;
  filter?: string;
}

function EventCard({ event, currentPage, filter }: EventCardProps) {
  function checkNew(createdAt: Date) {
    const currentDate = new Date();
    const currentUtcDate = new Date(currentDate.toUTCString());
    const millisecondsIn3Days = 3 * 24 * 60 * 60 * 1000;
    const timeDifference = Math.abs(createdAt.getTime() - currentUtcDate.getTime());
    return timeDifference <= millisecondsIn3Days;
  }

  return (
    <Card className="hover:bg-gray-200 dark:hover:bg-[#192236] transition-colors duration-300">
      <Link
        key={event.id}
        href={`/events/${event.id}?page=${currentPage}${filter ? `&filter=${filter}` : ""}`}>
        {checkNew(event.createdAt) && (
          <div className="relative w-full pb-1">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-bl rounded-tr">
              New
            </div>
          </div>
        )}
        <CardHeader>
          <CardTitle>{event.title} </CardTitle>
          <CardDescription className="flex font-medium mb-2">
            <CalendarDays className="w-4 h-4 mr-1" />
            <span>
              {formatDateRange(event.startDate, event.endDate)} (
              {getRelativeEventTime(event.startDate, event.endDate)})
            </span>
          </CardDescription>
          <CardContent className="p-0 text-muted-foreground">
            <MarkDownView
              className="prose dark:prose-invert max-w-none w-full break-words"
              markdown={event.description!}
            />
          </CardContent>
        </CardHeader>
      </Link>
    </Card>
  );
}

export default EventCard;
