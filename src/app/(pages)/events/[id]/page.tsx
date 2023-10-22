import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import FeedView from "@/components/views/FeedView";
import MarkDownView from "@/components/views/MarkDownView";
import BackButton from "@/components/ui/back-button";
import DeleteEventButton from "@/components/events/event-post/DeleteEventButton";
import EditEventButton from "@/components/events/event-post/EditEventButton";
import RegistrationButton from "@/components/events/event-post/RegistrationButton";
import ViewRegisteredUsersButton from "@/components/events/event-post/ViewRegisteredUsersButton";
import { prisma } from "@/lib/db";
import {
  canEditEvent,
  formatDateRange,
  getEventRelativeTime,
  getSession,
  isUndergradStudent,
} from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const eventId = parseInt(params.id);
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) return {};

  const descriptionSnippet = event.description?.substring(0, 200) ?? "";

  return {
    title: `${event.title} | Computer Science Society`,
    description: descriptionSnippet,
    openGraph: {
      title: `${event.title} | Computer Science Society`,
      description: descriptionSnippet,
    },
    twitter: {
      title: `${event.title} | Computer Science Society`,
      description: descriptionSnippet,
    },
  };
}

export default async function Post({ params }: PageProps) {
  const session = await getSession();
  const userID = session?.user.id;

  const eventId = parseInt(params.id);
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      _count: { select: { EventRegistration: true } },
    },
  });

  if (!event) {
    return (
      <div className="text-center font-bold text-2xl mt-10 text-muted-foreground">
        Event Not Found
      </div>
    );
  }

  const registered = await prisma.eventRegistration.findFirst({
    where: {
      userId: userID,
      eventId: event.id,
    },
  });

  return (
    <FeedView
      heading={event.title}
      subheading={`${formatDateRange(event.startDate, event.endDate)} ● ${getEventRelativeTime(
        event.startDate,
        event.endDate
      )}`}
      subheadingIcon={<CalendarDays className="w-4 h-4 mr-1" />}
      subheading2={event.location ? `Location: ${event.location}` : undefined}
      subheading2Icon={event.location ? <MapPin className="w-4 h-4 mr-1" /> : undefined}>
      <MarkDownView allowLinks markdown={event.description || ""} />
      <div className="flex justify-between w-full mt-10 flex-wrap gap-2">
        <BackButton href="/events" />
        <div className="flex flex-wrap gap-2">
          {session && canEditEvent(session) && (
            <>
              <EditEventButton id={event.id} event={event} />
              <DeleteEventButton id={event.id} />
            </>
          )}
          {event.registrationEnabled && (
            <>
              <ViewRegisteredUsersButton session={session} eventID={event.id} />
              <RegistrationButton
                eventID={eventId}
                notAllowed={userID && !isUndergradStudent(session)}
                userID={userID}
                registered={registered !== null}
                full={event.capacity !== null && event._count?.EventRegistration === event.capacity}
              />
            </>
          )}
        </div>
      </div>
    </FeedView>
  );
}
