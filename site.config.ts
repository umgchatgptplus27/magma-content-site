/**
 * 회사 정체성 단일 진실원천.
 * 6.1 실습: 헤르메스에게 이 파일을 여러분 회사로 바꿔 달라고 요청하는 것부터 시작합니다.
 * 색·글꼴은 이 파일이 아니라 DESIGN.md + src/styles/tokens.css 담당입니다 (6.5).
 */
export interface SiteConfig {
  company: { name: string; tagline: string; description: string };
  links: Record<string, string>;
  cta: { enabled: boolean; label: string; href: string };
  /** 홈 히어로 배경. video 가 있으면 영상, 없으면(null) poster 이미지로 렌더됩니다. */
  hero: { video: string | null; poster: string };
  /** 글 작성자(운영자). 실제 운영자가 제공한 정보만 넣는다. null 이면 "MAGMA 편집부"로 표시. */
  author: { name: string; role: string; bio: string } | null;
}

export const siteConfig: SiteConfig = {
  company: {
    name: "MAGMA",
    tagline: "유행은 지나가도, 기본은 남습니다",
    description:
      "3040 남성을 위한 패션 정보. 가진 옷의 핏을 살피고, 구매 전 치수를 비교하고, 제품 안내에 맞게 관리하는 방법을 정리합니다.",
  },
  links: {
    github: "https://github.com/dandacompany",
  },
  cta: {
    enabled: true,
    label: "가이드 전체 보기",
    href: "/blog",
  },
  hero: {
    // 현재 홈 히어로는 정적 poster만 사용한다. 동영상 재도입은 실제 데스크톱 재생 검증 후 별도 결정한다.
    video: null,
    poster: "/images/magma-hero-poster.png",
  },
  // 운영자 필명·소개. 경력·경험을 지어내지 않고 사이트의 실제 운영 방식만 적는다.
  author: {
    name: "한결",
    role: "MAGMA 운영자·에디터",
    bio: "MAGMA를 운영하며 셔츠·바지·재킷의 핏 기준, 경조사 옷차림, 의류 관리법을 한 주제 한 편으로 정리합니다. 제조사 치수 안내와 세탁 표준, 공공기관 자료를 확인해 기준을 세우고, 계절이 바뀌거나 자료가 갱신되면 기존 글을 보강합니다. 독자가 지금 가진 옷으로 판단할 수 있는 기준을 쓰는 것을 원칙으로 합니다.",
  },
};
