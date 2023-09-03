import Link from "next/link";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationButtonsProps {
    href: string;
    currentPage: number;
    filter?: string;
    totalPages: number;
}

function PaginationButtons({ href, currentPage, filter, totalPages }: PaginationButtonsProps) {

    const getHref = (newPage: number) => {
        if (filter) return `${href}?page=${newPage}&filter=${filter}`
        return `${href}?page=${newPage}`
    }

    return (
        <div className="flex justify-center gap-2 mt-4">
            {currentPage > 1 ? (
                <Button asChild size="icon">
                    <Link href={getHref(1)}>
                        <ChevronsLeft />
                    </Link>
                </Button>
            ) :
                <Button disabled size="icon"><ChevronsLeft /></Button>
            }
            {currentPage > 1 ? (
                <Button asChild size="icon">
                    <Link href={getHref(currentPage - 1)}>
                        <ChevronLeft />
                    </Link>
                </Button>
            ) :
                <Button disabled size="icon"><ChevronLeft /></Button>
            }
            {currentPage < totalPages ? (
                <Button asChild size="icon">
                    <Link href={getHref(currentPage + 1)}>
                        <ChevronRight />
                    </Link>
                </Button>
            ) : (
                <Button disabled size="icon"><ChevronRight /></Button>
            )}
            {currentPage < totalPages ? (
                <Button asChild size="icon">
                    <Link href={getHref(totalPages)}>
                        <ChevronsRight />
                    </Link>
                </Button>
            ) : (
                <Button disabled size="icon"><ChevronsRight /></Button>
            )}
        </div>
    )
}

export default PaginationButtons