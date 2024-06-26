import Link from "next/link";
import { Button } from "../ui/button";
import IconCard from "./IconCard";
import Section from "./Section";
import { GraduationCap, Code2, Users, FerrisWheel } from "lucide-react";

export const revalidate = 3600;

interface Card {
  heading: string;
  description: string;
}

interface AboutUsSectionProps {
  content: {
    heading: string;
    subheading: string;
    cards: Card[];
    buttonText: string;
  };
}

function AboutUsSection({ content }: AboutUsSectionProps) {
  const icons = [GraduationCap, Code2, Users, FerrisWheel];
  return (
    <Section heading={content.heading} subheading={content.subheading}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <Link href="/about">{content.buttonText}</Link>
      </Button>
    </Section>
  );
}

export default AboutUsSection;
