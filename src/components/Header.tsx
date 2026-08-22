import Link from "next/link";
import { siteConfig } from "@config";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-[0.18em] text-primary">
          {siteConfig.company.name}
        </Link>
        <nav className="flex gap-6 text-sm text-ink-sub">
          <Link href="/about" className="hover:text-primary">회사소개</Link>
          <Link href="/blog" className="hover:text-primary">블로그</Link>
        </nav>
      </div>
    </header>
  );
}
