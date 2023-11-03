import Image from "next/image";
import Section from "./Section";
import MemberCount from "../discord/DiscordMemberCount";
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
    <Section className="flex flex-col items-center justify-center w-full">
      <div className="relative flex flex-col items-center justify-center text-center gap-2 md:gap-4 bg-secondary text-secondary-foreground rounded-md w-full max-w-[1000px] py-24 px-12">
        <div className="absolute w-[100px] h-[115px] sm:w-[125px] sm:h-[150px] top-[-105px] right-[-20px] sm:top-[-140px] sm:right-[-40px]">
          <Image src="/images/chip.png" alt="Chip" fill />
        </div>
        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold">{content.heading}</h2>
        <span className="inline-block text-md md:text-lg lg:text-xl font-medium mb-2">
          {content.count.prefix}
          <MemberCount count={memberCount} className="font-black md:mx-1" />
          {content.count.suffix}
        </span>
        <Button variant="secondary" asChild>
          <Link href="/discord">
            <SiDiscord className="w-5 h-5 mr-2" />
            {content.buttonText}
          </Link>
        </Button>
      </div>
    </Section>
  );
}

export default CallToActionSection;
