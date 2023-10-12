"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { submitFeedback } from "@/app/_actions";
import { useAsyncFeedback } from "@/lib/useAsyncFeedback";
import { Heart, Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import FeedbackSignInButton from "./FeedbackSignInButton";

type FeedbackSchema = z.infer<typeof feedbackSchema>;
const feedbackSchema = z.object({
  subject: z
    .string({
      required_error: "A subject line is required.",
    })
    .min(1)
    .max(120, "The subject line must be at most 120 characters."),
  feedback: z
    .string({
      required_error: "The feedback field is required.",
    })
    .min(60, "The feedback field must be at least 60 characters.")
    .max(1200, "The feedback field must be at most 1200 characters."),
});

export default function FeedbackForm({ authenticated }: { authenticated: boolean }) {
  const handleAsync = useAsyncFeedback();

  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
  });

  const [success, setSuccess] = useState(false);
  const isPending = form.formState.isSubmitting;

  async function onSubmit(data: FeedbackSchema) {
    const feedback: feedbackFormData = {
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
          <div className="text-xl font-semibold">{"Thank you for your feedback!"}</div>
          <Heart className="text-red-500 animate-pulse fill-current" />
        </div>
        <div className="text-lg font-semibold">{"We appreciate your input."}</div>
      </div>
    );
  }

  return (
    <>
      <p className="text-muted-foreground mb-5 text-center md:text-left">
        {
          "We're dedicated to improving our community and value your input. If you have any feedback or suggestions in any aspect, please don't hesitate to share them with us. "
        }
        <strong>{"Your feedback is anonymous, and sign-in is required to prevent spam. "}</strong>
        {"If you would like a response from us, please leave your email in the suggestion box."}
      </p>
      {authenticated ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
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
                  <FormLabel>Feedback</FormLabel>
                  <Textarea className="h-[300px]" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button size="full" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {"Submitting..."}
                </>
              ) : (
                <>{"Submit"}</>
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <FeedbackSignInButton />
      )}
    </>
  );
}
