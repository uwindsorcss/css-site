import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./button";

interface BackButtonProps {
  href: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

function BackButton({ href, searchParams }: BackButtonProps) {
  const params = new URLSearchParams(searchParams as Record<string, string>);
  const queryStr = params.toString() ? `?${params}` : "";

  return (
    <Link href={`${href}${queryStr}`} className={buttonVariants()}>
      <ChevronLeft />
    </Link>
  );
}

export default BackButton;
