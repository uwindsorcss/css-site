import MemberCount from "@/components/discord/MemberCount";
import Hero from "@/components/home/Hero";
import Section from "@/components/home/Section";
import { Button } from "@/components/ui/button";
import IconCard from "@/components/home/IconCard";
import Link from "next/link";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { GraduationCap, Code2, Users, FerrisWheel } from "lucide-react";
import { getMemberCount } from "@/app/_actions";
import { prisma } from "@/lib/db";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getEventRelativeTime } from "@/lib/utils";
import Post from "@/components/newsletter/Post";
import content from './content.json';

export default async function Home() {
  const { memberCount } = await getMemberCount();
  const upcomingEvents = await prisma.event.findMany({
    take: 3,
    orderBy: {
      startDate: "desc",
    },
  });
  const featuredNewsletters = await prisma.post.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });
  const areAllEventsInPast = upcomingEvents.every((event) => event.startDate < new Date());
  const icons = [GraduationCap, Code2, Users, FerrisWheel];

  return (
    <>
      <Hero>
        <h2 className="text-2xl md:text-3xl text-center font-bold text-blue-900 dark:text-yellow-500">
          {content.hero.heading}
        </h2>
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-center font-black">
          {content.hero.subheading}
        </h1>
        <h3 className="text-lg text-center mb-4">
          {content.hero.description}
        </h3>
        <Button variant="discord" asChild>
          <Link href="/discord">
            <SiDiscord className="w-5 h-5 mr-2" />
            {content.hero.buttonText}
          </Link>
        </Button>
      </Hero>
      <Section heading={content.aboutUs.heading} subheading={content.aboutUs.subheading}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:py-8">
          {content.aboutUs.cards.map((card, index) => (
            <IconCard
              key={index}
              icon={icons[index]}
              heading={card.heading}
              description={card.description}
            />
          ))}
        </div>
        <Button asChild>
          <Link href="/about">{content.aboutUs.learnMoreButtonText}</Link>
        </Button>
      </Section>

      <Section heading={areAllEventsInPast ? content.events.recentEventsHeading : content.events.upcomingEventsHeading}
        subheading={areAllEventsInPast ? content.events.recentEventsSubheading : content.events.upcomingEventsSubheading}>
        <div className="flex flex-wrap gap-5 justify-center w-full">
          {upcomingEvents === null || upcomingEvents.length === 0 ? (
            <Card className="flex flex-col items-center justify-center gap-2 w-full h-full p-20">
              <CardTitle>
                {content.events.noEventsHeading}
              </CardTitle>
            </Card>
          ) : (
            <>
              {upcomingEvents.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="w-full md:w-[20rem] lg:w-[25rem] transition-all duration-300 ease-in-out transform hover:-translate-y-2">
                  <Card className="flex flex-col items-center justify-center gap-2 w-full h-full p-20">
                    <CardTitle>
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-sm flex flex-col items-center justify-center gap-2">
                      {event.startDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      <span className="font-bold">
                        {getEventRelativeTime(event.startDate, event.endDate)}
                      </span>
                    </CardDescription>
                  </Card>
                </Link>
              ))}
            </>
          )}
        </div>
        <Button asChild>
          <Link href="/events">{content.events.viewAllEventsButtonText}</Link>
        </Button>
      </Section>

      <Section heading={content.newsletters.featuredNewslettersHeading} subheading={content.newsletters.subheadingSubheading}>
        <div className="flex flex-col items-center justify-center w-full max-w-3xl gap-4">
          {featuredNewsletters === null || featuredNewsletters.length === 0 ? (
            <Card className="flex flex-col items-center justify-center gap-2 w-full h-full p-20">
              <CardTitle>
                {content.newsletters.noNewslettersHeading}
              </CardTitle>
            </Card>
          ) : (
            <>
              {featuredNewsletters.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </>
          )}
        </div>
        <Button asChild>
          <Link href="/newsletter">{content.newsletters.viewAllNewslettersButtonText}</Link>
        </Button>
      </Section>

      <Section className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col items-center justify-center text-center gap-4 bg-secondary text-secondary-foreground rounded-md w-full py-28">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {content.connectWithStudents.heading}
          </h2>
          <span className="inline-block text-md md:text-lg lg:text-xl font-medium mb-2">
            {content.connectWithStudents.text1}
            <MemberCount
              count={memberCount}
              className="font-black md:mx-1"
            />
            {content.connectWithStudents.text2}
          </span>
          <Button variant="secondary" asChild>
            <Link href="/discord">
              <SiDiscord className="w-5 h-5 mr-2" />
              {content.connectWithStudents.buttonText}
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
