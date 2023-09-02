"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";

function BackButton() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goBack = () => {
        const page = searchParams.get("page");
        if (page) router.replace("/newsletter?page=" + page);
        else router.replace("/newsletter");
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