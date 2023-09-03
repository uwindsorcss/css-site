import { Metadata } from "next";
import MarkDownView from "@/components/MarkDownView";
import fs from 'fs';

export const metadata: Metadata = {
  title: "About",
};


export default function AboutPage() {
  // const data = prisma.plainText.findMany({
  //   where: {id:1}
  // })
  const markdownFile = fs.readFileSync('src/app/(pages)/about/content.mdx', 'utf-8');

  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-4xl text-center font-bold mb-8">About Us</h1>
      <MarkDownView
        allowLinks
        className="prose dark:prose-invert max-w-none w-full break-words"
        markdown={markdownFile}
      />
    </div >
  );
}

