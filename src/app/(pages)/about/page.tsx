import { Metadata } from "next";
import MarkDownView from "@/components/views/MarkDownView";
import fs from 'fs';
import FeedView from "@/components/views/FeedView";

export const metadata: Metadata = {
  title: "About",
};


export default function AboutPage() {
  // const data = prisma.plainText.findMany({
  //   where: {id:1}
  // })
  const markdownFile = fs.readFileSync('src/app/(pages)/about/content.mdx', 'utf-8');

  return (
    <FeedView>
      <h1 className="text-4xl text-center font-bold mb-8">About Us</h1>
      <MarkDownView
        allowLinks
        markdown={markdownFile}
      />
    </FeedView>
  );
}

