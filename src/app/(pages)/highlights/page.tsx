import dynamic from "next/dynamic";
import { Metadata } from "next";
import PostsFeed from "@/components/highlights/PostsFeed";
import { Button } from "@/components/ui/button";
import { canEditPost } from "@/lib/utils";
import { Suspense } from "react";
import { SquarePen } from "lucide-react";
import { auth } from "@/auth";
const PostFormDialog = dynamic(() => import("@/components/highlights/PostFormDialog"));

export const metadata: Metadata = {
  title: "Newsletter",
};

interface NewsletterPageProps {
  searchParams: URLSearchParams & { page?: string };
}

export default async function NewsletterPage({ searchParams }: NewsletterPageProps) {
  const session = await auth();
  const page = searchParams.page;

  return (
    <>
      <h1 className="text-center text-4xl font-bold">Highlights</h1>
      <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-6">
        {session && canEditPost(session) && (
          <PostFormDialog
            triggerButton={
              <Button size="full" variant="accent">
                <SquarePen size={18} className="mr-2" />
                Create Post
              </Button>
            }
          />
        )}
        <Suspense fallback={postsSkeleton}>
          <PostsFeed requestedPage={page} />
        </Suspense>
      </div>
    </>
  );
}

const postsSkeleton = Array.from({ length: 3 }, (_, i) => (
  <div key={i} className="skeleton-card h-60 w-full rounded-md border border-border bg-card" />
));
