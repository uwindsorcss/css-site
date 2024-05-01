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
      <div className="absolute top-0 bottom-0 w-full light-hero-gradient dark:dark-hero-gradient mask-gradient" />
      <HeroCircuitAnimation />
      <section className="flex flex-col items-center justify-center min-h-screen gap-4 sm:gap-8 relative z-10 p-5 text-center">
        <h2 className="text-[1.3rem] md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-purple-400">
          {content.preHeading}
        </h2>
        <h1 className="text-[1.5rem] md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r dark:from-[#7dacfc] dark:to-indigo-400 from-blue-600 to-indigo-600">
          {content.heading}
        </h1>
        <h3 className="text-[0.9rem] sm:text-[1.1rem] text-muted-foreground">
          {content.description}
        </h3>
        <Button variant="accent" asChild>
          <Link href="/discord">
            <SiDiscord className="w-5 h-5 mr-2" />
            {content.buttonText}
          </Link>
        </Button>
      </section>
    </div>
  );
}

export default HeroSection;
