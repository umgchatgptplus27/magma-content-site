import Link from "next/link";
import { siteConfig } from "@config";

const policyLinks = [
  { href: "/about", label: "소개 및 문의" },
  { href: "/privacy-policy", label: "개인정보처리방침" },
  { href: "/disclaimer", label: "면책조항" },
  { href: "/terms", label: "이용약관" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-page py-10 text-xs text-ink-muted">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display tracking-[0.18em] text-ink-sub">{siteConfig.company.name}</p>
            <p className="mt-2 leading-relaxed">3040 남성을 위한 패션 정보와 의류 선택·관리 가이드</p>
          </div>
          <nav aria-label="정책 및 안내" className="flex max-w-md flex-wrap gap-x-4 gap-y-3">
            {policyLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8">© {new Date().getFullYear()} {siteConfig.company.name}</p>
      </div>
    </footer>
  );
}
