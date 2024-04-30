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
  const session = await auth();
  const post = await fetchPostById(params.id);
  if (!post) {
    return (
      <div className="text-center font-bold text-2xl mt-10 text-muted-foreground">
        Post Not Found
      </div>
    );
  }

  const authorName = post?.author?.name ?? "CSS Team";
  const formattedTime = getRelativeTimeDiff(post!.createdAt);

  return (
    <FeedView
      heading={post?.title}
      subheadings={[{ text: authorName, Icon: User, text2: formattedTime, Icon2: AlarmClock }]}>
      {session && canEditPost(session) && (
        <div className="flex flex-wrap w-full gap-2 my-2">
          <EditPostButton id={post!.id} post={post!} />
          <DeleteButton type={"post"} callback={deletePost} id={post!.id} />
        </div>
      )}
      <MarkDownView allowLinks markdown={post!.content} />
      <div className="w-full mt-10">
        <BackButton href="/newsletter" searchParams={searchParams} />
      </div>
    </FeedView>
  );
}
