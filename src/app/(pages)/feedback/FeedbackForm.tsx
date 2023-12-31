"use client";

import { useForm } from "@/hooks/useForm";
import * as z from "zod";
import { Form } from "@/components/form/form";
import { submitFeedback } from "@/lib/actions";
import { useAsyncFeedback } from "@/hooks/useAsyncFeedback";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/form/form-fields";
import { useState } from "react";
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
    .min(60, content.feedbackSchema.feedback.min_error)
    .max(1200, content.feedbackSchema.feedback.max_error),
});

export default function FeedbackForm({ authenticated }: { authenticated: boolean }) {
  const handleAsync = useAsyncFeedback();
  const form = useForm({ schema: feedbackSchema });
  const [success, setSuccess] = useState(false);
  const isPending = form.formState.isSubmitting;

  async function onSubmit(data: FeedbackSchema) {
    const feedback = {
      subject: data.subject,
      feedback: data.feedback,
    };

    setSuccess(await handleAsync(submitFeedback, feedback));

    if (success) {
      form.reset();
      form.setValue("subject", "");
      form.setValue("feedback", "");
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 mt-2 text-gray-200">
        <div className="flex items-center gap-2 justify-center">
          <div className="text-xl font-semibold">{content.feedbackSuccessMessage.title}</div>
          <Heart className="text-red-500 animate-pulse fill-current" />
        </div>
        <div className="text-lg font-semibold">{content.feedbackSuccessMessage.subtitle}</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="w-full flex justify-center">
        <Button className="w-full md:w-auto" onClick={() => signIn()}>
          Sign In to Leave Feedback
        </Button>
      </div>
    );
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4 w-full">
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
