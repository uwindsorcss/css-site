import { Metadata } from "next";
import MarkDownView from "@/components/views/MarkDownView";
import { promises as fs } from "fs";
import FeedView from "@/components/views/FeedView";
import path from "path";
import Button from '@mui/material/Button';


export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Scavenger Hunt",
};

export default async function HuntPage() {
  const markdownFile = await fs.readFile(
    path.join(process.cwd(), "src", "app", "(pages)", "hunt") + "/content.mdx",
    "utf8"
  );

  return (
    <>
      <FeedView>
        <h1 className="mb-8 text-center text-4xl font-bold">Scavenger Hunt 2026</h1>
        <MarkDownView allowLinks markdown={markdownFile} />
        <div style={{ marginTop: 8 }}>
          <Button variant="contained" color="primary" href="https://forms.cloud.microsoft/r/fy4XwgPmDX">Join The Hunt!</Button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a href="/images/map.svg" target="_blank" rel="noopener noreferrer">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img
             src="/images/map.svg"
             alt="Scavenger hunt campus map"
             className="mt-4 h-auto w-full cursor-zoom-in rounded-lg border"
           />
         </a>
      </FeedView>
    </>
  );
}
