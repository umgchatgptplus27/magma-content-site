/** 계절별로 홈에 먼저 보여 줄 대표 글. 재방문 독자가 지금 필요한 글을 바로 찾게 한다. */
export type Season = { label: string; note: string; posts: string[] };

const SEASONS: Record<"spring" | "summer" | "autumn" | "winter", Season> = {
  spring: {
    label: "봄",
    note: "일교차가 큰 봄에는 가벼운 겉옷과 겨울옷 보관이 먼저입니다.",
    posts: ["mens-trench-coat-commute-guide", "mens-blazer-separates-styling-guide", "mens-chino-styling-guide", "mens-seasonal-wardrobe-storage-guide", "mens-wedding-guest-outfit-guide", "mens-loafer-selection-guide"],
  },
  summer: {
    label: "여름",
    note: "땀과 자외선, 잦은 세탁을 견디는 소재와 관리법을 먼저 챙기세요.",
    posts: ["mens-polo-shirt-selection-guide", "mens-tshirt-fit-guide", "mens-shirt-fabric-selection-guide", "mens-garment-stain-first-aid-guide", "mens-travel-outfit-packing-guide", "mens-garment-care-label-guide"],
  },
  autumn: {
    label: "가을",
    note: "겉옷을 꺼내고 결혼식이 몰리는 계절입니다. 레이어링과 코트 선택부터 보세요.",
    posts: ["mens-trench-coat-commute-guide", "mens-knit-layering-guide", "mens-wedding-guest-outfit-guide", "mens-overshirt-styling-guide", "mens-coat-fabric-selection-guide", "mens-first-hiking-outfit-guide"],
  },
  winter: {
    label: "겨울",
    note: "코트 기장과 니트 관리, 머플러와 구두 관리가 겨울 인상을 좌우합니다.",
    posts: ["mens-coat-length-fit-guide", "mens-knit-pilling-care-guide", "mens-scarf-styling-guide", "mens-boot-selection-styling-guide", "mens-leather-shoe-care-guide", "mens-knit-gauge-selection-guide"],
  },
};

export function currentSeason(date = new Date()): Season {
  const month = Number(new Intl.DateTimeFormat("en-US", { month: "numeric", timeZone: "Asia/Seoul" }).format(date));
  if (month >= 3 && month <= 5) return SEASONS.spring;
  if (month >= 6 && month <= 8) return SEASONS.summer;
  if (month >= 9 && month <= 11) return SEASONS.autumn;
  return SEASONS.winter;
}
