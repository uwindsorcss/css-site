import { Post } from "@prisma/client";
import Section from "./Section";
import { Card, CardTitle } from "../ui/card";
import PostComponent from "@/components/newsletter/newsletter-post/Post";
import { Button } from "../ui/button";
import Link from "next/link";

interface NewsletterSectionProps {
  posts: Post[];
  content: {
    [key: string]: string;
  };
}

function NewsletterSection({ posts, content }: NewsletterSectionProps) {
  return (
    <Section heading={content.featuredNewslettersHeading} subheading={content.subheadingSubheading}>
      <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-4">
        {posts === null || posts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-2 w-full h-full p-20">
            <CardTitle>{content.noNewslettersHeading}</CardTitle>
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
        <Link href="/newsletter">{content.viewAllNewslettersButtonText}</Link>
      </Button>
    </Section>
  );
}

export default NewsletterSection;
