import { Metadata } from "next";
import FeedView from "@/components/views/FeedView";
import FeedbackForm from "./FeedbackForm";
import { getSession } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Feedback",
};

export default async function FeedbackPage() {
  const session = await getSession();
  return (
    <FeedView>
      <h1 className="text-4xl text-center font-bold mb-5">Feedback</h1>
      <FeedbackForm authenticated={!!session} />
    </FeedView>
  );
}
