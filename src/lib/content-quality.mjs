/** Deterministic publication hygiene, not an AdSense approval score. */
export function publicationIssues(content) {
  const rules = [
    ["production_metadata", /^(?:[-*>#]\s*)*(?:설명문|추천 태그|고정 slug|이미지 프롬프트)\s*[:：]/i],
    ["image_brief", /Mia 참고 이미지 장면|이미지 생성 프롬프트|이미지 제작 지시/],
    ["unfinished_generation", /생성 API.{0,30}복구|재생성[·\s/]*정밀 검수|검수\s*대기|\[SKILL_PRUNED\]/i],
    ["unreadable_example", /무문자|읽을 수 없는 (?:케어)?라벨|읽을 수 없는 메모/],
  ];
  const issues = [];
  for (const [index, text] of content.split(/\r?\n/).entries()) {
    const normalized = text.replace(/\*\*|__/g, "").trim();
    for (const [code, pattern] of rules) {
      if (pattern.test(normalized)) issues.push({ code, line: index + 1 });
    }
  }
  return issues;
}
