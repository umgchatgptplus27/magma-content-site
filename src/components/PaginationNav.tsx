import Link from "next/link";

interface PaginationNavProps {
  page: number;
  pageCount: number;
  getPageHref: (page: number) => string;
  ariaLabel?: string;
}

export default function PaginationNav({
  page,
  pageCount,
  getPageHref,
  ariaLabel = "페이지 목록",
}: PaginationNavProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label={ariaLabel} className="mt-12 flex flex-wrap items-center gap-3">
      {page > 1 && (
        <Link
          href={getPageHref(page - 1)}
          rel="prev"
          className="px-3 py-2 text-primary underline underline-offset-4"
        >
          이전
        </Link>
      )}
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
        <Link
          key={number}
          href={getPageHref(number)}
          aria-label={`${number}페이지`}
          aria-current={number === page ? "page" : undefined}
          className={`rounded-card border px-4 py-2 ${
            number === page
              ? "border-primary text-primary font-semibold"
              : "border-line text-ink-sub hover:text-primary"
          }`}
        >
          {number}
        </Link>
      ))}
      {page < pageCount && (
        <Link
          href={getPageHref(page + 1)}
          rel="next"
          className="px-3 py-2 text-primary underline underline-offset-4"
        >
          다음
        </Link>
      )}
    </nav>
  );
}
