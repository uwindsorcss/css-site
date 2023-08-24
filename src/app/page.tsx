import MemberCount from "@/components/discord/MemberCount";
import Hero from "@/components/home/Hero";
import Section from "@/components/home/Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SiDiscord } from "@icons-pack/react-simple-icons";

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
        <h2 className="text-2xl md:text-3xl text-center font-bold text-yellow-500">
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
      <Section>
        <span className="text-4xl font-semibold">
          <span>Connect with </span>
          <MemberCount memberCount={memberCount} />
          <span> Students in Our Discord Server</span>
        </span>
      </Section>
      <Section>
        <h2 className="text-2xl text-center font-bold">Section 2</h2>
      </Section>
      <Section>
        <h2 className="text-2xl text-center font-bold">Section 3</h2>
      </Section>
    </>
  );
}
