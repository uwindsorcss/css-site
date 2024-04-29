import Link from "next/link";
import { Button } from "./button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  href?: string;
  highlight?: boolean;
}

const PaginationButton = ({ disabled, href, children, highlight }: PaginationButtonProps) => {
  return (
    <Button
      disabled={disabled}
      size="icon"
      variant={highlight ? "discord" : "default"}
      asChild={!!href}>
      {href ? <Link href={href}>{children}</Link> : children}
    </Button>
  );
};

interface PaginationProps {
  baseUrl: string;
  currentPage: number;
  totalPages: number;
  filter?: string;
}

const Pagination = ({ baseUrl, currentPage, filter, totalPages }: PaginationProps) => {
  const getHref = (page: number) => `${baseUrl}?page=${page}${filter ? `&filter=${filter}` : ""}`;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const getMiddlePageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const maxPages = 3;
    let start = currentPage - Math.floor(maxPages / 2);
    start = Math.max(start, 1);
    start = Math.min(start, totalPages - maxPages + 1);

    return Array.from({ length: maxPages }, (_, i) => start + i);
  };

  return (
    <div className="flex justify-center gap-2 mt-4">
      <PaginationButton disabled={isFirstPage} href={isFirstPage ? undefined : getHref(1)}>
        <ChevronsLeft />
      </PaginationButton>
      {getMiddlePageNumbers().map((pageNumber) => (
        <PaginationButton
          key={pageNumber}
          highlight={currentPage === pageNumber}
          href={currentPage !== pageNumber ? getHref(pageNumber) : undefined}>
          {pageNumber}
        </PaginationButton>
      ))}
      <PaginationButton disabled={isLastPage} href={isLastPage ? undefined : getHref(totalPages)}>
        <ChevronsRight />
      </PaginationButton>
    </div>
  );
};

export default Pagination;
