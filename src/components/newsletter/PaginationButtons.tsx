import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationButtonsProps {
    currentPage: number;
    totalPages: number;
}

function PaginationButtons({ currentPage, totalPages }: PaginationButtonsProps) {
    return (
        <div className="flex justify-center gap-2">
            {currentPage > 1 ? (
                <Button asChild size="icon">
                    <Link href={`/newsletter?page=1`}>
                        <ChevronsLeft />
                    </Link>
                </Button>
            ) :
                <Button disabled size="icon"><ChevronsLeft /></Button>
            }
            {currentPage > 1 ? (
                <Button asChild size="icon">
                    <Link href={`/newsletter?page=${currentPage - 1}`}>
                        <ChevronLeft />
                    </Link>
                </Button>
            ) :
                <Button disabled size="icon"><ChevronLeft /></Button>
            }
            {currentPage < totalPages ? (
                <Button asChild size="icon">
                    <Link href={`/newsletter?page=${currentPage + 1}`}>
                        <ChevronRight />
                    </Link>
                </Button>
            ) : (
                <Button disabled size="icon"><ChevronRight /></Button>
            )}
            {currentPage < totalPages ? (
                <Button asChild size="icon">
                    <Link href={`/newsletter?page=${totalPages}`}>
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