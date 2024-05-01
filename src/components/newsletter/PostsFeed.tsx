import { prisma } from "@/lib/db";
import PaginationButtons from "../ui/pagination";
import PostCard from "../PostCard";
import { sanitizePageNumber } from "@/lib/utils";

interface PostsFeedProps {
  requestedPage?: string | number;
}

const postsPerPage = 5;
const baseUrl = "/newsletter";

export default async function PostsFeed({ requestedPage }: PostsFeedProps) {
  const totalPages = Math.ceil((await prisma.post.count()) / postsPerPage);
  const page = requestedPage ? sanitizePageNumber(baseUrl, requestedPage, totalPages) : 1;
  const posts = await prisma.post.findMany({
    skip: (page - 1) * postsPerPage,
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
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentPage={page} truncate />
      ))}
      <PaginationButtons baseUrl={baseUrl} currentPage={page} totalPages={totalPages} />
    </>
  );
}
