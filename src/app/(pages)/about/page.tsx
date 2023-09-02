import { Metadata } from "next";
import React, { useEffect, useState } from 'react'
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
    <>
      <h1 className="text-4xl text-center font-bold">About Us</h1>
        <MarkDownView
              className="prose dark:prose-invert max-w-none w-full break-words"
              markdown={markdownFile}
            />
    </>
  
);
}

