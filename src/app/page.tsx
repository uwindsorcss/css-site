import MemberCount from "@/components/discord/MemberCount";
import Hero from "@/components/home/Hero";
import Section from "@/components/home/Section";
import { Button } from "@/components/ui/button";
import IconCard from "@/components/home/IconCard";
import Link from "next/link";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { GraduationCap, Code2, Users, FerrisWheel } from "lucide-react";

export default async function Home() {
  const memberCount = await fetch(
    `https://discordapp.com/api/guilds/${process.env.DISCORD_GUILD_ID}/preview`,
    {
      next: { revalidate: 3600 },
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  )
    .then((res) => res.json().then((data) => data.approximate_member_count))
    .catch(() => 0);

  return (
    <>
      <Hero>
        <h2 className="text-2xl md:text-3xl text-center font-bold text-blue-900 dark:text-yellow-500">
          University of Windsor
        </h2>
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-center font-black">
          Computer Science Society
        </h1>
        <h3 className="text-lg text-center mb-4">
          A student-run organization that aims to provide a community for
          Computer Science students.
        </h3>
        <Button variant="discord" asChild>
          <Link href="/discord">
            <SiDiscord className="w-5 h-5 mr-2" />
            Join Our Discord
          </Link>
        </Button>
      </Hero>
      <Section title="A Little About Us">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-28">
          <IconCard
            icon={GraduationCap}
            title="Learn"
            description="We are a group of passionate computer science students dedicated to expanding our knowledge and skills beyond the classroom. Our goal is to foster a community of learners who are excited about exploring the world of technology."
          />
          <IconCard
            icon={Code2}
            title="Code"
            description="At our core, we're a coding-centric society. We host coding workshops, hackathons, and coding challenges to help our members enhance their programming skills. Whether you're a beginner or an experienced coder, there's a place for you here."
          />
          <IconCard
            icon={Users}
            title="Connect"
            description="Building connections is as important as writing code. Our society provides numerous opportunities to network with fellow students, professors, and professionals in the tech industry. Expand your circle and forge valuable relationships."
          />
          <IconCard
            icon={FerrisWheel}
            title="Fun"
            description="We're not all work and no play. We host a variety of events throughout the year to help our members unwind and have fun. From game nights to movie nights, there's always something to do."
          />
        </div>
        <Button asChild>
          <Link href="/about">Learn More</Link>
        </Button>
      </Section>
      <Section title="Upcoming Events"></Section>
      <Section title="Featured Newsletters"></Section>
      <Section>
        <span className="text-xl md:text-2xl lg:text-3xl text-center font-semibold">
          <span>Connect with </span>
          <MemberCount memberCount={memberCount} />
          <span> Students in Our Discord Server</span>
        </span>
        <Button variant="discord" asChild>
          <Link href="/discord">
            <SiDiscord className="w-5 h-5 mr-2" />
            Link Your Account
          </Link>
        </Button>
      </Section>
    </>
  );
}
