"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { searchGuides } from "@/lib/guide-search.mjs";

type Guide = { href: string; title: string; description: string; tags: string[] };

export default function GuideSearch({ guides, children }: { guides: Guide[]; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;
  const results = useMemo(() => searchGuides(guides, query), [guides, query]);

  return (
    <>
      <div role="search" aria-label="전체 가이드 찾기" className="my-8 rounded-card border border-line bg-card p-5">
        <label htmlFor="guide-search" className="block font-semibold text-primary">어떤 도움이 필요한가요?</label>
        <p id="guide-search-help" className="mt-2 text-sm leading-relaxed text-ink-sub">전체 {guides.length}개 글의 제목·설명·주제에서 찾습니다. 여러 단어는 띄어 써 보세요.</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            id="guide-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-describedby="guide-search-help"
            aria-controls="guide-search-results"
            placeholder="예: 셔츠 핏, 보풀, 면접"
            className="min-w-0 flex-1 rounded-ui border border-line bg-canvas px-3 py-3 text-base text-ink outline-none focus:border-primary"
          />
          {searching && (
            <button type="button" onClick={() => setQuery("")} className="min-h-11 text-sm text-primary underline underline-offset-4">검색 지우기</button>
          )}
        </div>
      </div>
      <div id="guide-search-results">
        {searching ? (
          <section aria-label="가이드 검색 결과">
            <p role="status" className="mb-5 text-sm text-ink-sub">검색 결과 {results.length}개</p>
            {results.length === 0 ? (
              <p className="rounded-card border border-line p-5 leading-relaxed text-ink-sub">일치하는 글이 없습니다. 단어 수를 줄이거나 ‘바지’, ‘세탁’, ‘구두’처럼 다른 표현으로 찾아보세요. 검색을 지우면 주제별 메뉴와 전체 목록을 볼 수 있습니다.</p>
            ) : (
              <ul className="space-y-3">
                {results.map((guide: Guide) => (
                  <li key={guide.href}>
                    <Link href={guide.href} className="block rounded-card border border-line bg-card p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                      <h2 className="font-display text-lg font-bold text-primary">{guide.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-ink-sub">{guide.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : children}
      </div>
    </>
  );
}
