import { Metadata } from "next";
import MarkDownView from "@/components/views/MarkDownView";
import { promises as fs } from "fs";
import FeedView from "@/components/views/FeedView";
import path from "path";
import Image from "next/image";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const markdownFile = await fs.readFile(
    path.join(process.cwd(), "src", "app", "(pages)", "about") + "/content.mdx",
    "utf8"
  );

  return (
    <>
      <FeedView>
        <h1 className="text-4xl text-center font-bold mb-8">About Us</h1>
        <MarkDownView allowLinks markdown={markdownFile} />
      </FeedView>
      <div className="relative w-full">
        <div className="absolute w-[90px] h-[105px] sm:w-[125px] sm:h-[150px] top-[53px] right-[3%] sm:top-[44px] sm:right-[5%] rotate-[-16deg]">
          <Image src="/images/chip-2.webp" alt="Chip" fill />
        </div>
      </div>
    </>
  );
}
