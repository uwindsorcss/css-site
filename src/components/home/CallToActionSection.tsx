import Image from "next/image";
import Section from "./Section";
import AnimatedNumber from "../ui/animated-number";
import { Button } from "../ui/button";
import Link from "next/link";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { getMemberCount } from "@/lib/actions";

interface CallToActionSectionProps {
  content: {
    heading: string;
    count: Count;
    buttonText: string;
  };
}

interface Count {
  prefix: string;
  suffix: string;
}

async function CallToActionSection({ content }: CallToActionSectionProps) {
  const { memberCount } = await getMemberCount();

  return (
    <Section className="flex w-full flex-col items-center justify-center bg-radial-gradient">
      <div className="relative flex w-full max-w-[1000px] flex-col items-center justify-center gap-2 rounded-md bg-secondary px-12 py-24 text-center text-secondary-foreground md:gap-4">
        <div className="absolute right-[-15px] top-[-105px] h-[115px] w-[100px] sm:right-[-40px] sm:top-[-140px] sm:h-[150px] sm:w-[125px]">
          <Image src="/images/chip.png" alt="Chip" fill />
        </div>
        <h2 className="text-xl font-bold md:text-3xl lg:text-4xl">{content.heading}</h2>
        <span className="text-md mb-2 inline-block font-medium md:text-lg lg:text-xl">
          {content.count.prefix}
          <span className="min-w-[4rem] font-black md:mx-1">
            <AnimatedNumber value={memberCount} />
          </span>
          {content.count.suffix}
        </span>
        <Button variant="secondary" asChild>
          <Link href="/discord">
            <SiDiscord className="mr-2 h-5 w-5" />
            {content.buttonText}
          </Link>
        </Button>
      </div>
    </Section>
  );
}

export default CallToActionSection;
