import { Metadata } from "next";
import FeedView from "@/components/views/FeedView";
import FeedbackForm from "./FeedbackForm";
import content from "./content.json";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Feedback",
};

export default async function FeedbackPage() {
  const session = await auth();
  return (
    <FeedView>
      <h1 className="text-4xl text-center font-bold mb-5">Feedback</h1>
      <p className="text-muted-foreground mb-5 text-center md:text-left">
        {content.feedbackPrompt.paragraph}
        <strong>{content.feedbackPrompt.strong}</strong>
        {content.feedbackPrompt.note}
      </p>
      <FeedbackForm authenticated={!!session} />
    </FeedView>
  );
}
