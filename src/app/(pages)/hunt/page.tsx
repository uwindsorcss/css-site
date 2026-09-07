import { Metadata } from "next";
import MarkDownView from "@/components/views/MarkDownView";
import { promises as fs } from "fs";
import FeedView from "@/components/views/FeedView";
import path from "path";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Scavenger Hunt",
};

export default async function AboutPage() {
  const markdownFile = await fs.readFile(
    path.join(process.cwd(), "src", "app", "(pages)", "hunt") + "/content.mdx",
    "utf8"
  );

  return (
    <>
      <FeedView>
        <h1 className="mb-8 text-center text-4xl font-bold">Scavenger Hunt 2026</h1>
        <MarkDownView allowLinks markdown={markdownFile} />
      </FeedView>
      <div className="relative w-full">
      </div>
    </>
  );
}
