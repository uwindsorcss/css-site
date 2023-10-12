"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateTimePicker } from "../ui/date-time-picker/date-time-picker";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { createEvent, updateEvent } from "@/app/_actions";
import { CalendarDateTime } from "@internationalized/date";
import { FormDialog } from "../FormDialog";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

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

export function EventFormDialog({ triggerButton, id, initialValues }: EventFormProps) {
  const form = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialValues || undefined,
  });

  const [isOpen, setIsOpen] = useState(false);

  function convertDate(
    date: {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
    },
    adjustMonth = true
  ): [number, number, number, number, number] {
    return [date.year, adjustMonth ? date.month - 1 : date.month, date.day, date.hour, date.minute];
  }

  async function onSubmit(data: EventSchema) {
    const startDate = new Date(...convertDate(data.startDate));
    const endDate = new Date(...convertDate(data.endDate));

    const event: EventFormData = {
      title: data.title,
      description: data.description,
      registrable: data.registrable,
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
      buttonText={id ? "Edit Event" : "Create Event"}
      pendingButtonText={id ? "Editing Event..." : "Creating Event..."}
      contentClassName="sm:max-w-[600px]">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <Textarea className="h-40" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Start Date</FormLabel>
            <DateTimePicker
              value={
                initialValues ? new CalendarDateTime(...convertDate(field.value, false)) : undefined
              }
              granularity={"minute"}
              onChange={field.onChange}
              label="Start Date"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>End Date</FormLabel>
            <DateTimePicker
              value={
                initialValues ? new CalendarDateTime(...convertDate(field.value, false)) : undefined
              }
              granularity={"minute"}
              onChange={field.onChange}
              label="End Date"
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <Input {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacity</FormLabel>
            <Input type="number" {...field} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="registrable"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <Checkbox
                defaultChecked={field.value || false}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FormLabel>Registrable</FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormDialog>
  );
}
