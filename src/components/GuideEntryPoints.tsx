import Link from "next/link";

const entries = [
  { href: "/tools/size-compare", question: "온라인 옷 사이즈가 헷갈려요", detail: "가진 옷과 구매할 옷의 실측 차이 비교" },
  { href: "/blog/mens-business-casual-guide", question: "출근할 때 무엇을 입을까요?", detail: "회사 분위기에 맞는 비즈니스 캐주얼" },
  { href: "/blog/mens-wedding-guest-outfit-guide", question: "결혼식 하객 옷차림이 고민돼요", detail: "정장과 캐주얼 사이에서 조합 고르기" },
  { href: "/blog/mens-garment-stain-first-aid-guide", question: "옷에 얼룩이 묻었어요", detail: "얼룩 종류와 케어라벨에 따라 대응하기" },
  { href: "/blog/mens-knit-pilling-care-guide", question: "니트에 보풀이 생겼어요", detail: "보풀과 올 걸림을 구분하고 관리하기" },
  { href: "/blog/mens-clothing-alteration-guide", question: "안 맞는 옷, 수선할 수 있을까요?", detail: "수선 범위와 상담 때 확인할 내용" },
];

export default function GuideEntryPoints() {
  return (
    <nav aria-label="고민별 가이드 바로가기" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map(({ href, question, detail }) => (
        <Link key={href} href={href} className="rounded-card border border-line bg-card p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <span className="block font-bold text-primary">{question}</span>
          <span className="mt-2 block text-sm leading-relaxed text-ink-sub">{detail}</span>
        </Link>
      ))}
    </nav>
  );
}
