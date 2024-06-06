"use client";

import { useForm } from "@/hooks/useForm";
import * as z from "zod";
import { Form } from "@/components/form/form";
import { submitFeedback } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/form/form-fields";
import content from "./content.json";
import { signIn } from "@/lib/utils";

type FeedbackSchema = z.infer<typeof feedbackSchema>;
const feedbackSchema = z.object({
  subject: z
    .string({
      required_error: content.feedbackSchema.subject.required_error,
    })
    .min(1)
    .max(120, content.feedbackSchema.subject.max_error),

  feedback: z
    .string({
      required_error: content.feedbackSchema.feedback.required_error,
    })
    .min(30, content.feedbackSchema.feedback.min_error)
    .max(1200, content.feedbackSchema.feedback.max_error),
});

export default function FeedbackForm({ authenticated }: { authenticated: boolean }) {
  const form = useForm({ schema: feedbackSchema });
  const isPending = form.formState.isSubmitting;

  async function onSubmit(data: FeedbackSchema) {
    const feedback = {
      subject: data.subject,
      feedback: data.feedback,
    };

    await submitFeedback(feedback);
  }

  if (!authenticated) {
    return (
      <div className="flex w-full justify-center">
        <Button className="w-full md:w-auto" onClick={() => signIn()}>
          Sign In to Leave Feedback
        </Button>
      </div>
    );
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="w-full space-y-4">
      <Input
        label={content.labels.subject}
        placeholder={content.placeholders.subject}
        className="w-full"
        {...form.register("subject")}
      />
      <Textarea
        label={content.labels.feedback}
        placeholder={content.placeholders.feedback}
        className="h-[300px] w-full"
        {...form.register("feedback")}
      />
      <Button size="full" type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? content.labels.submitting : content.labels.submit}
      </Button>
    </Form>
  );
}
