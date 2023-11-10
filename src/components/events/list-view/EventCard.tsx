import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import MarkDownView from "@/components/views/MarkDownView";
import { formatDateRange, getRelativeEventTime } from "@/lib/utils";
import { Event } from "@prisma/client";
import { AlarmClock, CalendarDays, MapPin } from "lucide-react";

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
        <CardHeader className="flex flex-col gap-1 pb-2">
          <CardTitle>{event.title}</CardTitle>
          <CardDescription className="flex font-medium gap-2 flex-col md:flex-row flex-wrap">
            <span className="flex items-center gap-1">
              <CalendarDays size={18} />
              {`${formatDateRange(event.startDate, event.endDate)}`}
            </span>
            <span className="hidden md:block">•</span>
            <span className="flex items-center gap-1">
              <AlarmClock size={18} />
              {getRelativeEventTime(event.startDate, event.endDate)}
            </span>
            {event.location && (
              <>
                <span className="hidden md:block">•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={18} />
                  {event.location}
                </span>
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-0 text-muted-foreground">
          <MarkDownView
            className="prose dark:prose-invert max-w-none w-full break-words"
            markdown={event.description!}
          />
        </CardContent>
      </Link>
    </Card>
  );
}

export default EventCard;
