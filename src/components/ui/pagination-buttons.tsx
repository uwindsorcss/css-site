import Link from "next/link";
import { Button } from "./button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationButtonsProps {
    href: string;
    currentPage: number;
    totalPages: number;
}

function PaginationButtons({ href, currentPage, totalPages }: PaginationButtonsProps) {
    return (
        <div className="flex justify-center gap-2">
            {currentPage > 1 ? (
                <Button asChild size="icon">
                    <Link href={`${href}?page=1`}>
                        <ChevronsLeft />
                    </Link>
                </Button>
            ) :
                <Button disabled size="icon"><ChevronsLeft /></Button>
            }
            {currentPage > 1 ? (
                <Button asChild size="icon">
                    <Link href={`${href}?page=${currentPage - 1}`}>
                        <ChevronLeft />
                    </Link>
                </Button>
            ) :
                <Button disabled size="icon"><ChevronLeft /></Button>
            }
            {currentPage < totalPages ? (
                <Button asChild size="icon">
                    <Link href={`${href}?page=${currentPage + 1}`}>
                        <ChevronRight />
                    </Link>
                </Button>
            ) : (
                <Button disabled size="icon"><ChevronRight /></Button>
            )}
            {currentPage < totalPages ? (
                <Button asChild size="icon">
                    <Link href={`${href}?page=${totalPages}`}>
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