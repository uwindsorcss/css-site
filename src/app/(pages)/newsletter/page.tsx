import { prisma } from "@/lib/db";
import { Metadata } from "next";
import Link from "next/link";
import { formatDistanceToNowStrict } from 'date-fns'

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

  function formatShortenedTimeDistance(date: Date) {
    const distance = formatDistanceToNowStrict(date);
    const unitMap: { [key: string]: string } = {
      seconds: 's',
      minutes: 'm',
      hours: 'h',
      days: 'd',
      months: 'mo',
      years: 'y',
    };

    return distance.replace(/(seconds|minutes|hours|days|months|years)/g, (match) => unitMap[match]).replace(/\s/g, '');
  }

  return (
    <>
      <h1 className="text-4xl text-center font-bold">News</h1>
      <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/newsletter/${post.slug}`}
            className="flex flex-col p-6 w-full bg-card hover:bg-gray-200 dark:hover:bg-card/50 text-card-foreground rounded-md transition-colors duration-300 break-words overflow-hidden">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <span className="text-sm text-muted-foreground mb-2">{post.author?.name ?? "CSS Team"} ● {formatShortenedTimeDistance(post.createdAt)}</span>
            <p>{post.content}</p>
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {currentPage > 1 && (
          <Link href={`/newsletter?page=${currentPage - 1}`} className="p-2 bg-card text-card-foreground rounded-md hover:bg-card/50 transition-colors duration-300">
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link href={`/newsletter?page=${currentPage + 1}`} className="p-2 bg-card text-card-foreground rounded-md hover:bg-card/50 transition-colors duration-300">
            Next
          </Link>
        )}
      </div>
    </>
  );
}
