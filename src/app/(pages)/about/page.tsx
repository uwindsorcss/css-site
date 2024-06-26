import { Metadata } from "next";
import MarkDownView from "@/components/views/MarkDownView";
import { promises as fs } from "fs";
import FeedView from "@/components/views/FeedView";
import path from "path";
import ChipTyping from "@/components/easter-eggs/ChipTyping";

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
        <h1 className="mb-8 text-center text-4xl font-bold">About Us</h1>
        <MarkDownView allowLinks markdown={markdownFile} />
      </FeedView>
      <div className="relative w-full">
        <ChipTyping />
      </div>
    </>
  );
}
