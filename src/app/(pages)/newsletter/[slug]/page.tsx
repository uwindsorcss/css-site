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
            <h1 className="text-4xl text-center font-bold">{post?.title}</h1>
            <p>{post?.content}</p>
        </div>
    )
}