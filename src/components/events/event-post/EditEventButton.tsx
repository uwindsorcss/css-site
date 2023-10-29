import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import { Event } from "@prisma/client";
import { Button } from "@/components/ui/button";
const EventFormDialog = dynamic(() => import("@/components/events/EventFormDialog"));

function transformEventToFormValues(event: Event) {
  return {
    title: event.title || "",
    description: event.description || "",
    location: event.location || "",
    registrable: event.registrationEnabled || false,
    capacity: event.capacity || 0,
    startDate: {
      year: event.startDate.getFullYear(),
      month: event.startDate.getMonth() + 1,
      day: event.startDate.getDate(),
      hour: event.startDate.getHours(),
      minute: event.startDate.getMinutes(),
    },
    endDate: {
      year: event.endDate.getFullYear(),
      month: event.endDate.getMonth() + 1,
      day: event.endDate.getDate(),
      hour: event.endDate.getHours(),
      minute: event.endDate.getMinutes(),
    },
  };
}

function EditEventButton({ id, event }: { id: number; event: Event }) {
  const initialValues = transformEventToFormValues(event);

  return (
    <EventFormDialog
      id={id}
      initialValues={initialValues}
      triggerButton={
        <Button>
          <Pencil className="w-5 h-5" />
        </Button>
      }
    />
  );
}

export default EditEventButton;
