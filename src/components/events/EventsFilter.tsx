"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";

function EventsFilter({ filter }: { filter?: string }) {
    const router = useRouter();

    const handleFilterChange = (value: string) => {
        router.replace(`/events?page=1${value !== "All" ? `&filter=${value}` : ""}`);
    }

    return (
        <Select onValueChange={(value) => handleFilterChange(value)} value={filter ?? "All"}>
            <SelectTrigger className="w-full text-center mt-2">
                <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="w-full">
                <SelectGroup>
                    <SelectLabel>Filter</SelectLabel>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Past">Past</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select >
    )
}

export default EventsFilter