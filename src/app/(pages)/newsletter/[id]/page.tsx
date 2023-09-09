import FeedView from "@/components/views/FeedView";
import MarkDownView from "@/components/views/MarkDownView";
import BackButton from "@/components/ui/back-button";
import { prisma } from "@/lib/db";
import { formatShortenedTimeDistance } from "@/lib/utils";
import { Metadata } from "next";
interface pageProps {
  params: { id: string };
}

//generate meta tags
export async function generateMetadata(
  { params }: pageProps
): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(params.id),
    },
    select: {
      title: true,
    },
  });

  return {
    title: post?.title,
  }
}

export default async function Post({ params }: pageProps) {
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      author: true,
    },
  });

  return (
    <FeedView
      heading={post?.title}
      subheading={`${post?.author?.name ?? "CSS Team"} ● ${formatShortenedTimeDistance(
        post!.createdAt
      )}`}>
      <MarkDownView allowLinks markdown={post!.content} />
      <BackButton href="/newsletter" />
    </FeedView>
  );
}
