import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import Link from "next/link";
import { SiDiscord } from "@icons-pack/react-simple-icons";
const HeroCircuitAnimation = dynamic(() => import("./HeroCircuitAnimation"));

interface HeroProps {
  content: {
    preHeading: string;
    heading: string;
    description: string;
    buttonText: string;
  };
}

function HeroSection({ content }: HeroProps) {
  return (
    <div className="relative">
      <div className="light-hero-gradient dark:dark-hero-gradient mask-gradient absolute bottom-0 top-0 w-full" />
      <HeroCircuitAnimation />
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-4 p-5 text-center sm:gap-8">
        <h2 className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-[1.3rem] font-bold text-transparent dark:from-indigo-400 dark:to-purple-400 md:text-3xl">
          {content.preHeading}
        </h2>
        <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-[1.5rem] font-extrabold text-transparent dark:from-[#7dacfc] dark:to-indigo-400 md:text-5xl lg:text-6xl">
          {content.heading}
        </h1>
        <h3 className="text-[0.9rem] text-muted-foreground sm:text-[1.1rem]">
          {content.description}
        </h3>
        <Button variant="accent" asChild>
          <Link href="/discord">
            <SiDiscord className="mr-2 h-5 w-5" />
            {content.buttonText}
          </Link>
        </Button>
      </section>
    </div>
  );
}

export default HeroSection;
