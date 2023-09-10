import FeedView from "@/components/views/FeedView";
import MarkDownView from "@/components/views/MarkDownView";
import BackButton from "@/components/ui/back-button";
import { prisma } from "@/lib/db";
import { formatShortenedTimeDistance, getSession, isModOrAdmin } from "@/lib/utils";
import { Metadata } from "next";
import EditPostButton from "@/components/newsletter/newsletter-post/EditPostButton";
import DeletePostButton from "@/components/newsletter/newsletter-post/DeletePostButton";
interface pageProps {
  params: { id: string };
}

//generate meta tags
export async function generateMetadata({ params }: pageProps): Promise<Metadata> {
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
  };
}

export default async function Post({ params }: pageProps) {
  const session = await getSession();
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
      <div className="flex justify-between w-full mt-10">
        <BackButton href="/newsletter" />
        {session && isModOrAdmin(session) && (
          <div className="space-x-2">
            <EditPostButton id={post!.id} post={post!} />
            <DeletePostButton id={post!.id} />
          </div>
        )}
      </div>
    </FeedView>
  );
}
