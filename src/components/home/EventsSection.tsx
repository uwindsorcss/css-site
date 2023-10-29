import { Event } from "@prisma/client";
import Section from "./Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { getEventRelativeTime, isDateInFuture, isWithinDateRange } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { prisma } from "@/lib/db";

interface EventsSectionProps {
  content: {
    [key: string]: string;
  };
}

const getEventsContent = (events: Event[], content: any) => {
  let state;
  if (events.some((event) => isWithinDateRange(event.startDate, event.endDate))) {
    state = "onGoing";
  } else if (events.some((event) => isDateInFuture(event.startDate))) {
    state = "future";
  } else {
    state = "past";
  }

  return {
    heading: content[`${state}EventsHeading`],
    subheading: content[`${state}EventsSubheading`],
  };
};

async function EventsSection({ content }: EventsSectionProps) {
  const events = await prisma.event.findMany({
    take: 3,
    orderBy: {
      startDate: "desc",
    },
  });

  const { heading, subheading } = getEventsContent(events, content);

  return (
    <Section heading={heading} subheading={subheading}>
      <div className="flex flex-wrap gap-5 justify-center w-full">
        {!events.length ? (
          <Card className="flex flex-col items-center justify-center gap-2 w-full h-full p-20">
            <CardTitle>{content.noEventsHeading}</CardTitle>
          </Card>
        ) : (
          events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="w-full md:w-[20rem] lg:w-[25rem] transition-all duration-300 ease-in-out transform hover:-translate-y-2">
              <Card className="flex flex-col items-center justify-center gap-2 text-center w-full h-full px-2 py-10 md:p-20 drop-shadow-sm">
                <CardTitle>{event.title}</CardTitle>
                <CardDescription className="text-sm flex flex-col items-center justify-center gap-1">
                  <span className="flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {event.startDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-bold">
                    {getEventRelativeTime(event.startDate, event.endDate)}
                  </span>
                </CardDescription>
              </Card>
            </Link>
          ))
        )}
      </div>
      <Button>
        <Link href="/events">{content.viewAllEventsButtonText}</Link>
      </Button>
    </Section>
  );
}

export default EventsSection;
