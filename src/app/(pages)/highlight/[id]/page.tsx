import { Metadata } from "next";
import FeedView from "@/components/views/FeedView";
import MarkDownView from "@/components/views/MarkDownView";
import BackButton from "@/components/ui/back-button";
import EditPostButton from "@/components/newsletter/newsletter-post/EditPostButton";
import { prisma } from "@/lib/db";
import { canEditPost, getRelativeTimeDiff } from "@/lib/utils";
import { deletePost } from "@/lib/actions";
import DeleteButton from "@/components/DeleteButton";
import { AlarmClock, User } from "lucide-react";
import { auth } from "@/auth";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: { id: string };
  searchParams: Record<string, string>;
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
  const session = await auth();
  const post = await fetchPostById(params.id);
  if (!post) {
    return (
      <div className="mt-10 text-center text-2xl font-bold text-muted-foreground">
        Post Not Found
      </div>
    );
  }

  const authorName = post?.author?.name ?? "CSS Team";
  const formattedTime = getRelativeTimeDiff(post!.createdAt);

  return (
    <FeedView
      heading={post?.title}
      subheadings={[
        {
          text: authorName,
          Icon: User,
          text2: formattedTime,
          Icon2: AlarmClock,
        },
      ]}>
      <div className="my-2 flex w-full flex-wrap gap-2">
        <NextLink href={`/gallery/${post.id}`}>
          <Button>
            View Gallery
          </Button>
        </NextLink>
        {session && canEditPost(session) && (
          <>
          <EditPostButton id={post!.id} post={post!} />
          <DeleteButton type={"post"} callback={deletePost} id={post!.id} />
          </>
      )}
    </div>
  <MarkDownView allowLinks markdown={post!.content} />
      <div className="mt-10 w-full">
        <BackButton href="/highlight" searchParams={searchParams} />
      </div>
    </FeedView>
  );
}
