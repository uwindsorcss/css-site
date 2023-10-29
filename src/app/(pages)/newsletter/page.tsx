import dynamic from "next/dynamic";
import { Metadata } from "next";
import PostsFeed from "@/components/newsletter/PostsFeed";
import { Button } from "@/components/ui/button";
import { getSession, isModOrAdmin } from "@/lib/utils";
import { Suspense } from "react";
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
        {session && isModOrAdmin(session) && (
          <PostFormDialog triggerButton={<Button size="full">Create Post</Button>} />
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <PostsFeed currentPage={parseInt(page ?? "1")} />
        </Suspense>
      </div>
    </>
  );
}
