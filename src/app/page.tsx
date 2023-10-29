import { getMemberCount } from "@/lib/actions";
import { prisma } from "@/lib/db";
import content from "./content.json";
import EventsSection from "@/components/home/EventsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import HeroSection from "@/components/home/HeroSection";
import AboutUsSection from "@/components/home/AboutUsSection";
import CallToActionSection from "@/components/home/CallToActionSection";

export default async function Home() {
  const { memberCount } = await getMemberCount();

  const featuredEvents = await prisma.event.findMany({
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

  return (
    <>
      <HeroSection content={content.hero} />
      <AboutUsSection content={content.aboutUs} />
      <EventsSection events={featuredEvents} content={content.events} />
      <NewsletterSection posts={featuredNewsletters} content={content.newsletters} />
      <CallToActionSection content={content.callToAction} memberCount={memberCount} />
    </>
  );
}
