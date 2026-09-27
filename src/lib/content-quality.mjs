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

/**
 * 2026-09 편집 기준(docs/editorial-standard.md)의 기계 검사.
 * 대량 생산 흔적(정형 제목, 편집자 메모, 가상 사례 표기)을 막는다. 품질 보증이 아니다.
 */
export function editorialIssues(title, content) {
  const issues = [];
  if (/3040\s*(남성|아빠)을?\s*위한/.test(title)) issues.push({ code: "template_title_audience", line: 0 });
  if (/(\d|다섯|세|네)\s*가지\s*(기준|판단|방법)?\s*$/.test(title.trim())) issues.push({ code: "template_title_count", line: 0 });
  const rules = [
    ["hypothetical_label", /가상\s*(사례|조합|예시|코디)/],
    ["editor_note", /편집\s*(제안|예시|사례)|리서치 시점 고지|발행\s*(전|직전)/],
    ["seller_disclaimer", /MAGMA가[^.\n]{0,40}(판매|출시)한다는 뜻/],
  ];
  for (const [index, text] of content.split(/\r?\n/).entries()) {
    const normalized = text.replace(/\*\*|__/g, "");
    for (const [code, pattern] of rules) {
      if (pattern.test(normalized)) issues.push({ code, line: index + 1 });
    }
  }
  const numbered = content.match(/^##\s+[1-9]\.\s/gm)?.length ?? 0;
  if (numbered >= 5) issues.push({ code: "template_numbered_sections", line: 0 });
  return issues;
}
