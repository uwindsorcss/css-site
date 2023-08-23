import Hero from "@/components/home/Hero";
import Section from "@/components/home/Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";

export default async function Home() {
  return (
    <>
      <Hero>
        <h2 className="text-3xl text-center font-bold text-yellow-500">
          University of Windsor
        </h2>
        <h1 className="text-6xl text-center font-black">
          Computer Science Society
        </h1>
        <h3 className="text-lg text-center mb-4">
          A student-run organization that aims to provide a community for
          Computer Science students.
        </h3>
        <Button variant="discord" asChild>
          <Link href="/discord">
            <BsDiscord className="text-lg mr-2" />
            Join Our Discord
          </Link>
        </Button>
      </Hero>
      <Section>
        <h2 className="text-2xl text-center font-bold">Section 1</h2>
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
