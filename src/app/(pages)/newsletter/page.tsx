import dynamic from "next/dynamic";
import { prisma } from "@/lib/db";
import { Metadata } from "next";
import PaginationButtons from "@/components/ui/pagination-buttons";
import Post from "@/components/newsletter/newsletter-post/Post";
import { Button } from "@/components/ui/button";
import { getSession, isModOrAdmin } from "@/lib/utils";
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
  const currentPage = parseInt(page ?? "1");
  const postsPerPage = 5;
  const totalPages = Math.ceil((await prisma.post.count()) / postsPerPage);
  const posts = await prisma.post.findMany({
    skip: (currentPage - 1) * postsPerPage,
    take: postsPerPage,
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <h1 className="text-4xl text-center font-bold">News</h1>
      <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-6">
        {session && isModOrAdmin(session) && (
          <PostFormDialog triggerButton={<Button size="full">Create Post</Button>} />
        )}
        {posts.map((post) => (
          <Post key={post.id} post={post} currentPage={currentPage} />
        ))}
      </div>
      <PaginationButtons href={"/newsletter"} currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
