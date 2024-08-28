import Section from "./Section";
import { Card, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { prisma } from "@/lib/db";
import PostCard from "../PostCard";

interface NewsletterSectionProps {
  content: {
    heading: NewsletterHeading;
    subheading: string;
    buttonText: string;
  };
}

interface NewsletterHeading {
  featuredNewsletters: string;
  noNewsletters: string;
}

async function NewsletterSection({ content }: NewsletterSectionProps) {
  const posts = await prisma.post.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Section heading={content.heading.featuredNewsletters} subheading={content.subheading}>
      <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-4">
        {posts === null || posts.length === 0 ? (
          <Card className="flex h-full w-full flex-col items-center justify-center gap-2 p-20">
            <CardTitle>{content.heading.noNewsletters}</CardTitle>
          </Card>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} truncate />
            ))}
          </>
        )}
      </div>
      <Button asChild>
        <Link href="/highlight">{content.buttonText}</Link>
      </Button>
    </Section>
  );
}

export default NewsletterSection;
