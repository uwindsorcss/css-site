import { Pencil } from "lucide-react";
import { Event } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { fromDate } from "@internationalized/date";
import EventFormDialog from "@/components/events/EventFormDialog";

function transformEventToFormValues(event: Event) {
  const startDateETC = fromDate(event.startDate, "America/Toronto");
  const endDateETC = fromDate(event.endDate, "America/Toronto");
  return {
    title: event.title || "",
    description: event.description || "",
    location: event.location || "",
    registrable: event.registrationEnabled || false,
    visible: event.visible,
    capacity: event.capacity || 0,
    startDate: {
      year: startDateETC.year,
      month: startDateETC.month,
      day: startDateETC.day,
      hour: startDateETC.hour,
      minute: startDateETC.minute,
    },
    endDate: {
      year: endDateETC.year,
      month: endDateETC.month,
      day: endDateETC.day,
      hour: endDateETC.hour,
      minute: endDateETC.minute,
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
          <Pencil size={18} className="mr-1" />
          {"Edit"}
        </Button>
      }
    />
  );
}

export default EditEventButton;
