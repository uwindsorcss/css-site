import { Event } from "@prisma/client";
import Section from "./Section";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { getRelativeEventTime, isDateInFuture, isWithinDateRange } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { prisma } from "@/lib/db";

interface EventsSectionProps {
  content: {
    heading: EventsHeadings;
    subheading: EventsHeadings;
    buttonText: string;
  };
}

interface EventsHeadings {
  futureEvents: string;
  onGoingEvents: string;
  pastEvents: string;
  noEvents?: string;
}

const getEventsContent = (events: Event[], content: EventsSectionProps["content"]) => {
  let state: keyof EventsHeadings;
  if (events.some((event) => isWithinDateRange(event.startDate, event.endDate))) {
    state = "onGoingEvents";
  } else if (events.some((event) => isDateInFuture(event.startDate))) {
    state = "futureEvents";
  } else {
    state = "pastEvents";
  }

  return {
    heading: content.heading[state],
    subheading: content.subheading[state],
  };
};

async function EventsSection({ content }: EventsSectionProps) {
  const events = await prisma.event.findMany({
    take: 3,
    orderBy: {
      startDate: "desc",
    },
    where: {
      visible: true,
    },
  });

  const { heading, subheading } = getEventsContent(events, content);

  return (
    <Section heading={heading} subheading={subheading}>
      <div className="flex flex-wrap gap-5 justify-center w-full">
        {!events.length ? (
          <Card className="flex flex-col items-center justify-center gap-2 w-full h-full p-20">
            <CardTitle>{content.heading.noEvents}</CardTitle>
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
                    {getRelativeEventTime(event.startDate, event.endDate)}
                  </span>
                </CardDescription>
              </Card>
            </Link>
          ))
        )}
      </div>
      <Button>
        <Link href="/events">{content.buttonText}</Link>
      </Button>
    </Section>
  );
}

export default EventsSection;
