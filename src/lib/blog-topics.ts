import type { ContentMeta } from "@/lib/content";

export type BlogTopic = {
  slug: string;
  label: string;
  description: string;
  /** 허브 상단 소개 문단 — 이 주제를 어떤 순서로 읽으면 좋은지 안내한다. */
  intro: string[];
  /** 읽는 순서대로 배정한 대표 글 slug. 한 글은 한 허브에만 속한다. */
  posts: string[];
  /** 명시 배정이 없는 새 글을 분류할 때만 쓰는 보조 규칙. */
  pattern: RegExp;
};

/**
 * 독자 문제 중심의 탐색 주제. 대표 글은 posts 로 명시 배정하고(중복 없음),
 * 배정되지 않은 새 글만 pattern 으로 첫 번째 일치 허브에 넣는다.
 */
export const BLOG_TOPICS: BlogTopic[] = [
  {
    slug: "fit-and-basics",
    label: "핏과 기본 아이템",
    description: "셔츠·바지·재킷·코트·니트의 치수와 핏을 판단하는 기준, 온라인 구매 전 실측 비교법을 모았습니다.",
    intro: [
      "옷이 비싸 보이는지 아닌지는 브랜드보다 핏에서 먼저 갈립니다. 어깨선이 제자리에 있고, 소매와 기장이 몸에 맞으면 평범한 셔츠와 바지도 단정해 보입니다.",
      "처음이라면 셔츠 핏과 바지 핏부터 읽고, 재킷과 코트로 넓혀 가세요. 온라인으로 자주 산다면 실측 비교 가이드를 먼저 보고 가진 옷의 치수를 한 번 재 두면 이후 모든 구매가 쉬워집니다.",
    ],
    posts: [
      "mens-shirt-fit-guide",
      "mens-trouser-fit-guide",
      "mens-jacket-fit-guide",
      "mens-suit-selection-guide",
      "mens-online-clothing-measurement-guide",
      "mens-body-type-outfit-guide",
      "mens-average-body-size-korea-guide",
      "mens-shirt-collar-guide",
      "mens-shirt-fabric-selection-guide",
      "mens-tshirt-fit-guide",
      "mens-polo-shirt-selection-guide",
      "mens-knit-gauge-selection-guide",
      "mens-coat-length-fit-guide",
      "mens-coat-fabric-selection-guide",
    ],
    pattern: /핏|사이즈|치수|실측|셔츠|재킷|코트|니트/i,
  },
  {
    slug: "color-and-styling",
    label: "스타일링과 색 조합",
    description: "블레이저·오버셔츠·니트 레이어링, 치노와 데님, 차분한 색 조합으로 가진 옷을 자연스럽게 연결하는 방법입니다.",
    intro: [
      "옷을 더 사지 않고도 인상이 바뀌는 지점은 조합입니다. 색의 명도 차이, 소재의 질감, 겉옷의 무게감만 맞춰도 같은 옷장이 훨씬 넓게 쓰입니다.",
      "색 조합 가이드로 기준을 잡은 뒤, 블레이저와 오버셔츠처럼 출근과 주말을 잇는 겉옷, 치노와 데님처럼 자주 입는 하의 순서로 읽기를 권합니다.",
    ],
    posts: [
      "mens-muted-color-pairing-guide",
      "mens-blazer-separates-styling-guide",
      "mens-overshirt-styling-guide",
      "mens-knit-layering-guide",
      "mens-chino-styling-guide",
      "mens-smart-denim-styling-guide",
    ],
    pattern: /색|컬러|스타일링|코디|레이어|조합|데님|치노/i,
  },
  {
    slug: "shoes-and-accessories",
    label: "신발과 소품",
    description: "구두·로퍼·부츠와 양말, 벨트·넥타이·시계·안경·모자·머플러를 옷차림에 맞게 고르는 기준입니다.",
    intro: [
      "신발과 소품은 면적은 작지만 전체 인상을 마무리합니다. 구두 끝과 벨트 색, 시계 크기와 소매 폭이 서로 맞으면 옷차림이 한 사람의 것으로 정리돼 보입니다.",
      "구두는 형태(더비·옥스퍼드·로퍼)와 발에 맞는지부터 확인하고, 양말과 벨트로 신발과 옷을 잇는 순서로 읽으면 됩니다. 넥타이·시계·안경은 얼굴과 손목 가까이에서 인상을 좌우하므로 크기와 비례를 중심으로 보세요.",
    ],
    posts: [
      "mens-derby-oxford-shoe-guide",
      "mens-dress-shoe-fit-check-guide",
      "mens-loafer-selection-guide",
      "mens-boot-selection-styling-guide",
      "mens-sock-pairing-guide",
      "mens-belt-selection-guide",
      "mens-necktie-selection-guide",
      "mens-watch-outfit-pairing-guide",
      "mens-eyewear-outfit-guide",
      "mens-hat-selection-guide",
      "mens-scarf-styling-guide",
    ],
    pattern: /구두|로퍼|부츠|양말|벨트|넥타이|시계|안경|모자|머플러/i,
  },
  {
    slug: "work-and-business",
    label: "출근과 비즈니스",
    description: "비즈니스 캐주얼의 단계, 면접과 첫 출근, 비 오는 날 출근, 출근 가방과 스니커즈까지 직장 옷차림을 정리했습니다.",
    intro: [
      "직장 옷차림은 회사마다 다르지만, 포멀과 캐주얼 사이 어느 단계에 있는지만 알면 판단이 쉬워집니다. 먼저 비즈니스 캐주얼 가이드로 우리 회사의 단계를 정하고, 그 안에서 조합을 늘려 가세요.",
      "면접이나 첫 출근처럼 첫인상이 중요한 날, 비와 바람이 있는 출근길, 매일 드는 가방과 신발처럼 반복되는 장면을 차례로 다룹니다.",
    ],
    posts: [
      "mens-business-casual-guide",
      "mens-career-interview-outfit-guide",
      "mens-trench-coat-commute-guide",
      "mens-office-sneaker-styling-guide",
      "mens-work-bag-selection-guide",
    ],
    pattern: /출근|비즈니스|오피스|면접|회의|사무실/i,
  },
  {
    slug: "occasions-and-outings",
    label: "경조사와 외출",
    description: "결혼식 하객, 조문, 상견례, 돌잔치, 드레스코드 초대, 기념일 저녁, 여행·골프·등산까지 상황별 옷차림 기준입니다.",
    intro: [
      "경조사 옷차림에서 가장 중요한 것은 주인공과 자리에 대한 예의입니다. 결혼식에서는 신랑보다 튀지 않게, 조문에서는 어둡고 절제되게, 상견례에서는 단정하되 부담스럽지 않게 입는 것이 기본입니다.",
      "여행과 골프, 등산처럼 활동이 있는 날은 보기 좋은 옷보다 움직이기 편하고 날씨에 대응하는 옷이 먼저입니다. 일정이 정해졌다면 해당 가이드의 준비 목록부터 확인하세요.",
    ],
    posts: [
      "mens-wedding-guest-outfit-guide",
      "mens-funeral-attire-guide",
      "mens-formal-family-meeting-outfit-guide",
      "mens-first-birthday-party-dad-outfit-guide",
      "mens-invitation-dress-code-guide",
      "mens-anniversary-dinner-outfit-guide",
      "mens-travel-outfit-packing-guide",
      "mens-first-golf-round-outfit-guide",
      "mens-first-hiking-outfit-guide",
    ],
    pattern: /결혼|하객|조문|장례|상견례|돌잔치|초대|데이트|여행|골프|등산|캠핑/i,
  },
  {
    slug: "care-and-laundry",
    label: "관리와 옷장 운영",
    description: "세탁 기호, 얼룩 응급 처치, 다림질, 바지·니트·구두 관리, 계절 보관과 수선, 옷장 예산까지 옷을 오래 입는 방법입니다.",
    intro: [
      "좋은 옷을 오래 입는 사람은 관리 순서를 압니다. 세탁 기호를 읽을 줄 알면 줄어들거나 변색되는 사고의 대부분을 피할 수 있고, 얼룩은 처음 10분의 대응이 결과를 좌우합니다.",
      "세탁 기호와 얼룩 대응을 먼저 읽고, 자주 입는 셔츠·바지·니트·구두의 관리법, 계절이 바뀔 때의 보관과 수선 판단, 옷장 예산 순서로 넓혀 가세요.",
    ],
    posts: [
      "mens-garment-care-label-guide",
      "mens-garment-stain-first-aid-guide",
      "mens-shirt-ironing-wrinkle-guide",
      "mens-trouser-care-guide",
      "mens-knit-pilling-care-guide",
      "mens-leather-shoe-care-guide",
      "mens-seasonal-wardrobe-storage-guide",
      "mens-clothing-alteration-guide",
      "mens-wardrobe-budget-guide",
    ],
    pattern: /관리|세탁|보관|수선|얼룩|다림질|보풀|예산/i,
  },
];

const ASSIGNED = new Map(BLOG_TOPICS.flatMap((topic) => topic.posts.map((slug) => [slug, topic.slug] as const)));

export function getBlogTopic(slug: string): BlogTopic | undefined {
  return BLOG_TOPICS.find((topic) => topic.slug === slug);
}

/** 글이 속한 허브 — 명시 배정 우선, 없으면 제목·태그로 첫 번째 일치 허브. */
export function topicOfPost(post: ContentMeta): BlogTopic | undefined {
  const assigned = ASSIGNED.get(post.slug);
  if (assigned) return getBlogTopic(assigned);
  return BLOG_TOPICS.find((topic) => topic.pattern.test(`${post.title} ${post.tags.join(" ")}`));
}

/** 허브 글 목록 — 배정 순서(읽는 순서) 먼저, 이어서 규칙으로 분류된 새 글을 최신순으로. */
export function getPostsForTopic(posts: ContentMeta[], topic: BlogTopic): ContentMeta[] {
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const ordered = topic.posts.map((slug) => bySlug.get(slug)).filter((post): post is ContentMeta => Boolean(post));
  const extra = posts.filter((post) => !ASSIGNED.has(post.slug) && topicOfPost(post)?.slug === topic.slug);
  return [...ordered, ...extra];
}
