import MarkDownView from "@/components/MarkDownView";
import BackButton from "@/components/ui/back-button";
import { prisma } from "@/lib/db";
import { formatShortenedTimeDistance } from "@/lib/utils";
interface pageProps {
    params: { slug: string };
}

export default async function Post({ params }: pageProps) {
    const post = await prisma.post.findUnique({
        where: {
            slug: params.slug
        },
        include: {
            author: true
        }
    });

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-2">
            <h1 className="text-2xl md:text-4xl text-center font-bold">{post?.title}</h1>
            <span className="text-sm text-muted-foreground mb-8">{post?.author?.name ?? "CSS Team"} ● {formatShortenedTimeDistance(post!.createdAt)}</span>
            <MarkDownView
                allowLinks
                className="prose dark:prose-invert max-w-none w-full break-words"
                markdown={post!.content}
            />
            <BackButton href="/newsletter" />
        </div>
    )
}