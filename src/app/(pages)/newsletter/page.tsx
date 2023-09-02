import { prisma } from "@/lib/db";
import { formatShortenedTimeDistance } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import MarkDownView from "@/components/MarkDownView";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

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
          <Link key={post.id} href={`/newsletter/${post.slug}`}
            className="flex flex-col gap-2 p-6 w-full bg-card hover:bg-gray-200 dark:hover:bg-card/50 text-card-foreground rounded-md transition-colors duration-300">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <span className="text-sm text-muted-foreground mb-2">{post.author?.name ?? "CSS Team"} ● {formatShortenedTimeDistance(post.createdAt)}</span>
            <MarkDownView
              className="prose dark:prose-invert max-w-none w-full break-words"
              markdown={post.content}
            />
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {currentPage > 1 ? (
          <Button asChild size="icon">
            <Link href={`/newsletter?page=1`}>
              <ChevronsLeft />
            </Link>
          </Button>
        ) :
          <Button disabled size="icon"><ChevronsLeft /></Button>
        }
        {currentPage > 1 ? (
          <Button asChild size="icon">
            <Link href={`/newsletter?page=${currentPage - 1}`}>
              <ChevronLeft />
            </Link>
          </Button>
        ) :
          <Button disabled size="icon"><ChevronLeft /></Button>
        }
        {currentPage < totalPages ? (
          <Button asChild size="icon">
            <Link href={`/newsletter?page=${currentPage + 1}`}>
              <ChevronRight />
            </Link>
          </Button>
        ) : (
          <Button disabled size="icon"><ChevronRight /></Button>
        )}
        {currentPage < totalPages ? (
          <Button asChild size="icon">
            <Link href={`/newsletter?page=${totalPages}`}>
              <ChevronsRight />
            </Link>
          </Button>
        ) : (
          <Button disabled size="icon"><ChevronsRight /></Button>
        )}
      </div>
    </>
  );
}
