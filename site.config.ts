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
}

export const siteConfig: SiteConfig = {
  company: {
    name: "MAGMA",
    tagline: "유행은 지나가도, 기본은 남습니다",
    description:
      "과장보다 단정함을, 유행보다 오래 입을 옷을. 3040 남성을 위해 시간이 지나도 유효한 기본을 만듭니다.",
  },
  links: {
    github: "https://github.com/dandacompany",
  },
  cta: {
    // 6.3 「Bluekiwi 하네스 도구 소개 (SNS발행)」에서 구현·활성화하는 확장 슬롯
    enabled: false,
    label: "",
    href: "",
  },
  hero: {
    // 현재 홈 히어로는 정적 poster만 사용한다. 동영상 재도입은 실제 데스크톱 재생 검증 후 별도 결정한다.
    video: null,
    poster: "/images/magma-hero-poster.png",
  }
};
