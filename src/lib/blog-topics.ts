import type { ContentMeta } from "@/lib/content";

export type BlogTopic = {
  slug: string;
  label: string;
  description: string;
  pattern: RegExp;
};

/**
 * 태그와 제목에서 독자 문제 중심의 탐색 주제를 판별한다.
 * 원고의 기존 태그를 보존하며, 한 글이 여러 생활 맥락에 연결될 수 있다.
 */
export const BLOG_TOPICS: BlogTopic[] = [
  {
    slug: "care-and-laundry",
    label: "관리와 세탁",
    description: "세탁·건조·보관·수선과 케어라벨을 확인하며 옷을 오래 입기 위한 가이드입니다.",
    pattern: /관리|세탁|보관|수선|케어|얼룩|건조|보풀|구김|오염|젖은|물기|첫 세탁/i,
  },
  {
    slug: "fit-and-basics",
    label: "핏과 기본 아이템",
    description: "셔츠·재킷·팬츠·신발의 비율과 치수를 살피며 기본을 고르는 기준을 모았습니다.",
    pattern: /핏|사이즈|치수|비율|길이|목둘레|어깨|소매|밑위|셔츠|재킷|팬츠|신발|니트|아우터/i,
  },
  {
    slug: "work-and-business",
    label: "출근과 비즈니스",
    description: "출근, 회의, 이동과 퇴근 뒤 일정 사이에서 옷차림을 정리하는 가이드입니다.",
    pattern: /출근|비즈니스|오피스|스마트 캐주얼|통근|회의|업무|사무실/i,
  },
  {
    slug: "occasions-and-outings",
    label: "상황별 옷차림",
    description: "여행·운동·초대·행사처럼 장소와 일정에 따라 달라지는 옷차림의 판단 기준입니다.",
    pattern: /결혼|여행|등산|운동|러닝|필라테스|테니스|골프|콘서트|영화|캠핑|산책|주말|저녁|외식|행사|초대|명절|가족|사진|낚시|시장|도예|서점|기차|비행|집들이|장례/i,
  },
  {
    slug: "color-and-styling",
    label: "색과 스타일링",
    description: "색 조합, 레이어링과 옷장 정리를 통해 가진 옷을 더 자연스럽게 연결하는 방법입니다.",
    pattern: /색|컬러|스타일|코디|레이어|옷장|무드|매치|조합/i,
  },
];

export function getBlogTopic(slug: string): BlogTopic | undefined {
  return BLOG_TOPICS.find((topic) => topic.slug === slug);
}

export function getPostsForTopic(posts: ContentMeta[], topic: BlogTopic): ContentMeta[] {
  return posts.filter((post) => topic.pattern.test(`${post.title} ${post.tags.join(" ")}`));
}
