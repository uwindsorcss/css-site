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
        const page = searchParams.get("page");
        if (page) router.replace(`${href}?page=${page}`);
        else router.replace(href);
    };

    return (
        <div className="flex justify-center md:justify-start w-full mt-10">
            <Button onClick={() => goBack()}>
                <ChevronLeft />
            </Button>
        </div>
    )
}

export default BackButton