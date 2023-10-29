import dynamic from "next/dynamic";
import { prisma } from "@/lib/db";
const EventsCalendar = dynamic(() => import("./EventsCalendar"));

async function CalendarView() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
    },
  });

  const CalendarEvents: any[] = events.map((event) => {
    return {
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
    };
  });

  return <EventsCalendar events={CalendarEvents} />;
}

export default CalendarView;
