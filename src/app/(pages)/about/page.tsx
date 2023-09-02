import { Metadata } from "next";
import React, { useEffect, useState } from 'react'
import MarkDownView from "@/components/MarkDownView";
import { prisma } from "@/lib/db";


export const metadata: Metadata = {
  title: "About",
};


export default function AboutPage() {
  const data = prisma.plainText.findMany({
    where: {id:1}
  })

  return (
    <>
      <h1 className="text-4xl text-center font-bold">About Us</h1>
        <MarkDownView
              className="prose dark:prose-invert max-w-none w-full break-words"
              markdown={data.content}
            />
    </>
  
);
}

