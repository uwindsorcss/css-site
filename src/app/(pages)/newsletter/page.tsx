import dynamic from "next/dynamic";
import { Metadata } from "next";
import PostsFeed from "@/components/newsletter/PostsFeed";
import { Button } from "@/components/ui/button";
import { canEditPost } from "@/lib/utils";
import { Suspense } from "react";
import { SquarePen } from "lucide-react";
import { auth } from "@/auth";
const PostFormDialog = dynamic(() => import("@/components/newsletter/PostFormDialog"));

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
      <h1 className="text-4xl text-center font-bold">News</h1>
      <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-6">
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
  <div key={i} className="w-full h-60 bg-card rounded-md border border-border skeleton-card" />
));
