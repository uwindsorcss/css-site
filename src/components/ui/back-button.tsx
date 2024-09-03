import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./button";

interface BackButtonProps {
  href: string;
  searchParams: Record<string, string>;
}

function BackButton({ href, searchParams }: BackButtonProps) {
  const queryStr = new URLSearchParams(searchParams).toString();
  const url = queryStr ? `${href}?${queryStr}` : href;

  return (
    <Link href={url} className={buttonVariants()}>
      <ChevronLeft />
    </Link>
  );
}

export default BackButton;
