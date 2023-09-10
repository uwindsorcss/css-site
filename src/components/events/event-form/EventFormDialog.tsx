"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateTimePicker } from "../../ui/date-time-picker/date-time-picker";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { createEvent, updateEvent } from "@/app/_actions";
import { Loader2 } from "lucide-react";
import { CalendarDateTime } from "@internationalized/date";

const FormSchema = z.object({
  title: z
    .string({
      required_error: "A title is required.",
    })
    .nonempty(),
  description: z
    .string({
      required_error: "A description is required.",
    })
    .nonempty(),
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
  closeDialog: () => void;
  id?: number;
  initialValues?: z.infer<typeof FormSchema>;
  buttonText: string;
  pendingButtonText: string;
}

export function EventFormDialog({
  closeDialog,
  id,
  initialValues,
  buttonText,
  pendingButtonText,
}: EventFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    // @ts-ignore
    resolver: zodResolver(FormSchema),
    defaultValues: initialValues || undefined,
  });

  const isPending = form.formState.isSubmitting;

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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const startDate = new Date(...convertDate(data.startDate));
    const endDate = new Date(...convertDate(data.endDate));

    const event: EventFormData = {
      title: data.title,
      description: data.description,
      location: data.location,
      startDate,
      endDate,
    };

    if (id) await updateEvent(event, id);
    else await createEvent(event);

    closeDialog();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <DateTimePicker
                value={
                  initialValues
                    ? new CalendarDateTime(...convertDate(field.value, false))
                    : undefined
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
                  initialValues
                    ? new CalendarDateTime(...convertDate(field.value, false))
                    : undefined
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Textarea {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="full" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {pendingButtonText}
            </>
          ) : (
            <>{buttonText}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
