"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import EventFormTrigger from "../event-form/EventFormTrigger";
import { Event } from "@prisma/client";

function EditEventButton({ id, event }: { id: number; event: Event }) {
  const values = {
    title: event.title,
    description: event.description,
    location: event.location,
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

  return (
    <EventFormTrigger
      title="Edit Event"
      id={id}
      initialValues={values}
      buttonText="Update"
      pendingButtonText="Updating...">
      <Button>
        <Pencil className="w-5 h-5" />
      </Button>
    </EventFormTrigger>
  );
}

export default EditEventButton;
