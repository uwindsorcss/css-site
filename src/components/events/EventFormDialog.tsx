"use client";

import { useForm } from "@/hooks/useForm";
import * as z from "zod";
import { DateTimePicker, convertDate } from "../form/form-fields";
import { Input, Textarea } from "../form/form-fields";
import { createEvent, updateEvent } from "@/lib/actions";
import { FormDialog } from "../form/FormDialog";
import { useState } from "react";
import { Checkbox } from "../form/form-fields";

type EventSchema = z.infer<typeof eventSchema>;
const eventSchema = z.object({
  title: z
    .string({
      required_error: "A title is required.",
    })
    .min(1),
  description: z
    .string({
      required_error: "A description is required.",
    })
    .min(1),
  registrable: z.boolean().default(false),
  visible: z.boolean().default(true),
  capacity: z.coerce.number().min(0).optional(),
  location: z.string().optional(),
  startDate: z.object(
    {
      year: z.number(),
      month: z.number(),
      day: z.number(),
      hour: z.number(),
      minute: z.number(),
    },
    {
      required_error: "A start date is required.",
    }
  ),
  endDate: z.object(
    {
      year: z.number(),
      month: z.number(),
      day: z.number(),
      hour: z.number(),
      minute: z.number(),
    },
    {
      required_error: "An end date is required.",
    }
  ),
});

interface EventFormProps {
  id?: number;
  initialValues?: EventSchema;
  triggerButton: React.ReactNode;
}

function EventFormDialog({ triggerButton, id, initialValues }: EventFormProps) {
  const form = useForm({
    schema: eventSchema,
    defaultValues: initialValues || {
      registrable: false,
      visible: true,
      capacity: 0,
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(data: EventSchema) {
    const startDate = new Date(...convertDate(data.startDate));
    const endDate = new Date(...convertDate(data.endDate));

    const event: EventFormData = {
      title: data.title,
      description: data.description,
      registrable: data.registrable,
      visible: data.visible,
      capacity: data.capacity,
      location: data.location,
      startDate,
      endDate,
    };

    if (id) await updateEvent(event, id);
    else await createEvent(event);

    setIsOpen(false);
  }

  return (
    <FormDialog
      form={form}
      triggerButton={triggerButton}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmitAction={onSubmit}
      title={id ? "Edit Event" : "Create Event"}
      buttonText={id ? "Update Event" : "Create Event"}
      pendingButtonText={id ? "Updating Event..." : "Creating Event..."}
      contentClassName="sm:max-w-[600px]">
      <Input label="Title" type="text" {...form.register("title", { required: true })} />
      <Textarea
        label="Description"
        type="text"
        className="h-40"
        {...form.register("description", { required: true })}
      />
      <DateTimePicker label="Start Date" {...form.register("startDate")} />
      <DateTimePicker label="End Date" {...form.register("endDate")} />
      <Input label="Location" type="text" {...form.register("location")} />
      <Input label="Capacity" type="number" {...form.register("capacity")} />
      <Checkbox label="Allow Registration" {...form.register("registrable")} />
      <Checkbox label="Visible" {...form.register("visible")} />
    </FormDialog>
  );
}

export default EventFormDialog;
