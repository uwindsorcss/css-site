"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { submitFeedback } from "@/lib/actions";
import { useAsyncFeedback } from "@/hooks/useAsyncFeedback";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import FeedbackSignInButton from "./FeedbackSignInButton";
import content from "./content.json";

type FeedbackSchema = z.infer<typeof feedbackSchema>;
const feedbackSchema = z.object({
  subject: z.string({
    required_error: content.feedbackSchema.subject.required_error,
  }).min(1).max(120, content.feedbackSchema.subject.max_error),
  
  feedback: z.string({
    required_error: content.feedbackSchema.feedback.required_error,
  }).min(60, content.feedbackSchema.feedback.min_error).max(1200, content.feedbackSchema.feedback.max_error),
});

export default function FeedbackForm({ authenticated }: { authenticated: boolean }) {
  const handleAsync = useAsyncFeedback();
  const form = useForm<FeedbackSchema>({ resolver: zodResolver(feedbackSchema) });
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
    return <FeedbackSignInButton />;
  }

  return (
    <>
      <p className="text-muted-foreground mb-5 text-center md:text-left">
        {content.feedbackPrompt.paragraph}
        <strong>{content.feedbackPrompt.strong}</strong>
        {content.feedbackPrompt.note}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{content.labels.subject}</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem className="h-full">
                <FormLabel>{content.labels.feedback}</FormLabel>
                <Textarea className="h-[300px]" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="full" type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {content.labels.submitting}
              </>
            ) : (
              <>{content.labels.submit}</>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
