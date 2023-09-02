import MarkDownView from "@/components/MarkDownView";
import BackButton from "@/components/newsletter/BackButton";
import { prisma } from "@/lib/db";
interface pageProps {
    params: { slug: string };
}

export default async function Post({ params }: pageProps) {
    const post = await prisma.post.findUnique({
        where: {
            slug: params.slug
        }
    });

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-4">
            <h1 className="text-4xl text-center font-bold mb-10">{post?.title}</h1>
            <MarkDownView
                className="prose dark:prose-invert max-w-none w-full break-words"
                markdown={post!.content}
            />
            <BackButton />
        </div>
    )
}