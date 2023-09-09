"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./button";
import { useRouter, useSearchParams } from "next/navigation";

interface BackButtonProps {
  href: string;
}

function BackButton({ href }: BackButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goBack = () => {
    const queryParams = [];
    const page = searchParams.get("page");
    const view = searchParams.get("view");
    const filter = searchParams.get("filter");

    if (view) queryParams.push(`view=${view}`);
    if (page) queryParams.push(`page=${page}`);
    if (filter) queryParams.push(`filter=${filter}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    router.replace(`${href}${queryString}`);
  };

  return (
    <Button onClick={() => goBack()}>
      <ChevronLeft />
    </Button>
  );
}

export default BackButton;
