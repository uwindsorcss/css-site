import { Metadata } from "next";
import FeedView from "@/components/views/FeedView";
import MarkDownView from "@/components/views/MarkDownView";
import BackButton from "@/components/ui/back-button";
import EditPostButton from "@/components/newsletter/newsletter-post/EditPostButton";
import DeletePostButton from "@/components/newsletter/newsletter-post/DeletePostButton";
import { prisma } from "@/lib/db";
import { canEditPost, formatTimeDifference, getSession } from "@/lib/utils";

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function fetchPostById(id: string) {
  return await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: { author: true },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await fetchPostById(params.id);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post?.title,
  };
}

export default async function Post({ params, searchParams }: PageProps) {
  const session = await getSession();
  const post = await fetchPostById(params.id);
  if (!post) {
    return (
      <div className="text-center font-bold text-2xl mt-10 text-muted-foreground">
        Post Not Found
      </div>
    );
  }

  const authorName = post?.author?.name ?? "CSS Team";
  const formattedTime = formatTimeDifference(post!.createdAt);

  return (
    <FeedView heading={post?.title} subheading={`${authorName} ● ${formattedTime}`}>
      <MarkDownView allowLinks markdown={post!.content} />
      <div className="flex justify-between w-full mt-10">
        <BackButton href="/newsletter" searchParams={searchParams} />
        {session && canEditPost(session) && (
          <div className="space-x-2">
            <EditPostButton id={post!.id} post={post!} />
            <DeletePostButton id={post!.id} />
          </div>
        )}
      </div>
    </FeedView>
  );
}
