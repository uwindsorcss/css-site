import { prisma } from "@/lib/db";
import Calendar from "./Calendar";

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

  return <Calendar events={CalendarEvents} />;
}

export default CalendarView;
