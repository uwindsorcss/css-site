import Link from "next/link";
import { Button } from "../ui/button";
import IconCard from "./IconCard";
import Section from "./Section";
import { GraduationCap, Code2, Users, FerrisWheel } from "lucide-react";

export const revalidate = 3600;

interface IconCardContent {
  heading: string;
  description: string;
}

interface AboutUsSectionProps {
  content: {
    heading: string;
    subheading: string;
    cards: IconCardContent[];
    learnMoreButtonText: string;
  };
}

function AboutUsSection({ content }: AboutUsSectionProps) {
  const icons = [GraduationCap, Code2, Users, FerrisWheel];
  return (
    <Section heading={content.heading} subheading={content.subheading}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {content.cards.map((card, index) => (
          <IconCard
            key={index}
            icon={icons[index]}
            heading={card.heading}
            description={card.description}
          />
        ))}
      </div>
      <Button asChild>
        <Link href="/about">{content.learnMoreButtonText}</Link>
      </Button>
    </Section>
  );
}

export default AboutUsSection;
