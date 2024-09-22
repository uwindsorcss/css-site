import content from "./content.json";
import EventsSection from "@/components/home/EventsSection";
import HighlightSection from "@/components/home/HighlightSection";
import HeroSection from "@/components/home/HeroSection";
import AboutUsSection from "@/components/home/AboutUsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <HeroSection content={content.hero} />
      <AboutUsSection content={content.aboutUs} />
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <EventsSection content={content.events} />
      </Suspense>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <HighlightSection content={content.highlights} />
      </Suspense>
      <CallToActionSection content={content.callToAction} />
    </>
  );
}
