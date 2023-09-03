import { prisma } from "@/lib/db";
import { formatShortenedTimeDistance } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import MarkDownView from "@/components/MarkDownView";
import PaginationButtons from "@/components/ui/pagination-buttons";
import Post from "@/components/newsletter/Post";

export const metadata: Metadata = {
  title: "Newsletter",
};

interface NewsletterPageProps {
  searchParams: URLSearchParams & { page?: string };
}

export default async function NewsletterPage({ searchParams }: NewsletterPageProps) {
  const page = searchParams.page;
  const currentPage = parseInt(page ?? "1");
  const postsPerPage = 10;
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
      <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-4">
        {posts.map((post) => (
          <Post key={post.id} post={post} currentPage={currentPage} />
        ))}
      </div>
      <PaginationButtons href={"/newsletter"} currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
