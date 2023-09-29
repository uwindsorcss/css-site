import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import MarkDownView from "@/components/views/MarkDownView";
import { formatDateRange, getEventRelativeTime } from "@/lib/utils";
import { Event } from "@prisma/client";

interface EventCardProps {
  event: Event;
  currentPage: number;
  filter?: string;
}
function checkNew(createdAt: Date) {
  const currentDate = new Date();
  const millisecondsIn3Days = 3 * 24 * 60 * 60 * 1000;
  const timeDifference = Math.abs(createdAt.getTime() - currentDate.getTime());
  if (timeDifference <= millisecondsIn3Days) {
    return "float-right m-5";
  }
  return "hidden";

}

function EventCard({ event, currentPage, filter }: EventCardProps) {
  return (
    <Card className="hover:bg-gray-200 dark:hover:bg-card/50 transition-colors duration-300">
      <Link
        key={event.id}
        href={`/events/${event.id}?page=${currentPage}${filter ? `&filter=${filter}` : ""}`}>
        <img className={checkNew(event.createdAt)} width="80" height="80" src="/New.png" alt="" />
        <CardHeader>
          <CardTitle >{event.title} </CardTitle>
          <CardDescription className="font-medium mb-2">
            {formatDateRange(event.startDate, event.endDate)} (
            {getEventRelativeTime(event.startDate, event.endDate)})
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
