"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FormDialog } from "./FormDialog";
import { useState } from "react";
import { createSuggestion } from "@/app/_actions";
import { useAsyncFeedback } from "@/lib/useAsyncFeedback";
import { PenLine } from "lucide-react";

const FormSchema = z.object({
  title: z
    .string({
      required_error: "A title is required.",
    })
    .min(12, "The title must be at least 12 characters.")
    .max(120, "The title must be at most 120 characters."),
  suggestion: z
    .string({
      required_error: "The suggestion is required.",
    })
    .min(60, "The suggestion must be at least 60 characters.")
    .max(1200, "The suggestion must be at most 1200 characters."),
});

export function SuggestionDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    // @ts-ignore
    resolver: zodResolver(FormSchema),
  });

  const handleAsync = useAsyncFeedback();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const suggestion: SuggestionFormData = {
      title: data.title,
      suggestion: data.suggestion,
    };

    const success = await handleAsync(createSuggestion, suggestion);
    if (success) {
      setIsOpen(false);
      form.reset();
    }
  }

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}>
      <FormDialog
        form={form}
        triggerButton={
          <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground">
            <PenLine className="w-4 h-4 mr-3" />
            <span>Leave a Suggestion</span>
          </div>
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmitAction={onSubmit}
        title={"Leave a suggestion"}
        description={
          "We're always looking for ways to improve our community, if you have any suggestions in any area, please let us know!"
        }
        buttonText={"Submit"}
        pendingButtonText={"Submitting..."}
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
          name="suggestion"
          render={({ field }) => (
            <FormItem className="h-full">
              <FormLabel>Description</FormLabel>
              <Textarea className="h-[500px]" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
      </FormDialog>
    </div>
  );
}
