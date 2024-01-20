import dynamic from "next/dynamic";
import { Metadata } from "next";
import PostsFeed from "@/components/newsletter/PostsFeed";
import { Button } from "@/components/ui/button";
import { getSession, canEditPost } from "@/lib/utils";
import { Suspense } from "react";
import { PlusSquare } from "lucide-react";
const PostFormDialog = dynamic(() => import("@/components/newsletter/PostFormDialog"));

export const metadata: Metadata = {
  title: "Newsletter",
};

interface NewsletterPageProps {
  searchParams: URLSearchParams & { page?: string };
}

export default async function NewsletterPage({ searchParams }: NewsletterPageProps) {
  const session = await getSession();
  const page = searchParams.page;

  return (
    <>
      <h1 className="text-4xl text-center font-bold">News</h1>
      <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-6">
        {session && canEditPost(session) && (
          <PostFormDialog triggerButton={
            <Button size="full">
              <PlusSquare size={18} className="mr-2" />
              Create Post
            </Button>} />
        )}
        <Suspense fallback={postsSkeleton}>
          <PostsFeed currentPage={parseInt(page ?? "1")} />
        </Suspense>
      </div>
    </>
  );
}

const postsSkeleton = Array.from({ length: 3 }, (_, i) => (
  <div key={i} className="w-full h-60 bg-card rounded-md border border-border skeleton-card" />
));
