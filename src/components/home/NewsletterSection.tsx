import Section from "./Section";
import { Card, CardTitle } from "../ui/card";
import PostComponent from "@/components/newsletter/newsletter-post/Post";
import { Button } from "../ui/button";
import Link from "next/link";
import { prisma } from "@/lib/db";

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
      <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-4">
        {posts === null || posts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-2 w-full h-full p-20">
            <CardTitle>{content.heading.noNewsletters}</CardTitle>
          </Card>
        ) : (
          <>
            {posts.map((post) => (
              <PostComponent key={post.id} post={post} truncate animateOnHover />
            ))}
          </>
        )}
      </div>
      <Button asChild>
        <Link href="/newsletter">{content.buttonText}</Link>
      </Button>
    </Section>
  );
}

export default NewsletterSection;
