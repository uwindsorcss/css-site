import type { Metadata } from "next";
import { AlarmClock, CalendarDays, Link, MapPin } from "lucide-react";
import FeedView from "@/components/views/FeedView";
import MarkDownView from "@/components/views/MarkDownView";
import BackButton from "@/components/ui/back-button";
import EditEventButton from "@/components/events/event-post/EditEventButton";
import RegistrationButton from "@/components/events/event-post/RegistrationButton";
import ViewRegisteredUsersButton from "@/components/events/event-post/ViewRegisteredUsersButton";
import { prisma } from "@/lib/db";
import {
  canEditEvent,
  formatDateRange,
  getRelativeEventTime,
  getSession,
  isUndergradStudent,
} from "@/lib/utils";
import CopyButton from "@/components/ui/copy-button";
import DeleteButton from "@/components/DeleteButton";
import { deleteEvent } from "@/lib/actions";

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const eventId = parseInt(params.id);
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) return { title: "Event Not Found" };

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

export default async function Post({ params, searchParams }: PageProps) {
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
      subheadings={[
        {
          text: `${formatDateRange(event.startDate, event.endDate)}`,
          Icon: CalendarDays,
          text2: getRelativeEventTime(event.startDate, event.endDate),
          Icon2: AlarmClock,
        },
        { text: event.location, Icon: MapPin },
      ]}>
      <div className="flex flex-wrap w-full gap-2 my-2">
        <>
          {event.registrationEnabled && (
            <>
              <RegistrationButton
                eventID={eventId}
                isLoggedOut={!userID}
                isRegistered={registered !== null}
                isNotAllowed={!userID || !isUndergradStudent(session)}
                isFull={event.capacity !== null && event._count?.EventRegistration === event.capacity}
                isExpired={event.endDate < new Date()}
              />
              <ViewRegisteredUsersButton session={session} eventID={event.id} />
            </>
          )}
          <CopyButton
            string={`${process.env.NEXTAUTH_URL}/events/${event.id}`}
            label="Share"
            Icon={<Link size={18} className="mr-1" />}
          />
          {session && canEditEvent(session) && (
            <div className="flex flex-wrap gap-2">
              <EditEventButton id={event.id} event={event} />
              <DeleteButton type={"event"} callback={deleteEvent} id={event.id} />
            </div>
          )}
        </>
      </div>
      <MarkDownView allowLinks markdown={event.description || ""} />
      <div className="w-full mt-10">
        <BackButton href="/events" searchParams={searchParams} />
      </div>
    </FeedView>
  );
}
