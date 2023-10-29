import content from "./content.json";
import EventsSection from "@/components/home/EventsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import HeroSection from "@/components/home/HeroSection";
import AboutUsSection from "@/components/home/AboutUsSection";
import CallToActionSection from "@/components/home/CallToActionSection";

export default async function Home() {
  return (
    <>
      <HeroSection content={content.hero} />
      <AboutUsSection content={content.aboutUs} />
      <EventsSection content={content.events} />
      <NewsletterSection content={content.newsletters} />
      <CallToActionSection content={content.callToAction} />
    </>
  );
}
