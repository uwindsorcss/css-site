"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateTimePicker } from "../../ui/date-time-picker/date-time-picker";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { createEvent } from "@/app/_actions";
import { Loader2 } from "lucide-react";

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

export function CreateEventForm({ closeDialog }: { closeDialog: () => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    // @ts-ignore
    resolver: zodResolver(FormSchema),
  });

  const pending = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const startDate = new Date(
      data.startDate.year,
      data.startDate.month - 1,
      data.startDate.day,
      data.startDate.hour,
      data.startDate.minute
    );

    const endDate = new Date(
      data.endDate.year,
      data.endDate.month - 1,
      data.endDate.day,
      data.endDate.hour,
      data.endDate.minute
    );

    const event = {
      title: data.title,
      description: data.description,
      location: data.location,
      startDate,
      endDate,
    };

    await createEvent(event);
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
              <DateTimePicker granularity={"minute"} onChange={field.onChange} label="Start Date" />
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
              <DateTimePicker granularity={"minute"} onChange={field.onChange} label="End Date" />
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
        <Button size="full" type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </Form>
  );
}
