"use client";
import "./Calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import { createRef, useCallback, useEffect } from "react";
import { timeFormatter } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";

function EventsCalendar({ events }: { events: any[] }) {
  function renderEventContent(eventInfo: any) {
    return (
      <>
        <HoverCard>
          <HoverCardTrigger className="hidden md:block mx-auto transform hover:scale-105 transition-all duration-300 ease-in-out">
            <Link href={`/events/${eventInfo.event.id}?view=calendar`} className="relative flex">
              <div
                className="w-5 h-5 rounded-md bg-blue-500/50 dark:bg-amber-400/50 animate-ping opacity-40"
                style={{ animationDuration: "3s" }}
              />
              <div className="absolute w-5 h-5 rounded-md bg-blue-500 dark:bg-amber-400 transition-all duration-300 ease-in-out" />
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto text-xs font-medium">
            <span>{`${eventInfo.event.title} - `}</span>
            <span className="text-muted-foreground">
              {`${timeFormatter.format(eventInfo.event.start)} - ${timeFormatter.format(
                eventInfo.event.end
              )}`}
            </span>
          </HoverCardContent>
        </HoverCard>
        <span className="md:hidden font-medium">{eventInfo.event.title}</span>
      </>
    );
  }

  const calendarRef = createRef<FullCalendar>();

  const resizeHandler = useCallback(() => {
    if (window.innerWidth < 768) calendarRef?.current?.getApi().changeView("listWeek");
    else calendarRef?.current?.getApi().changeView("dayGridMonth");
  }, [calendarRef]);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [resizeHandler]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, listPlugin]}
      initialView={window.innerWidth < 768 ? "listWeek" : "dayGridMonth"}
      events={events}
      eventContent={renderEventContent}
      ref={calendarRef}
    />
  );
}

export default EventsCalendar;
