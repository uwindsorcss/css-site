import dynamic from "next/dynamic";
import { prisma } from "@/lib/db";
import { Session } from "next-auth";
import { canEditEvent } from "@/lib/utils";
const EventsCalendar = dynamic(() => import("./EventsCalendar"));

interface CalendarViewProps {
  session: Session | null;
}

async function CalendarView({ session }: CalendarViewProps) {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
    },
    where: {
      visible: session && canEditEvent(session) ? undefined : true,
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
