import { auth } from "@/auth";
import EventGallery from '@/components/gallery/EventGallery';
import { getEventImages } from "@/lib/actions";
import { canEditEvent } from "@/lib/utils";

interface PageProps {
  params: { events: string };
}

export default async function Event({ params }: PageProps) {
  const eventId = Number(params.events);
  const images = await getEventImages(eventId);
  const session = await auth();
  const canEdit = session ? canEditEvent(session) : false;

  return (
    <EventGallery
      eventId={eventId}
      initialImages={images || []}
      canEdit={canEdit}
    />
  );
}
