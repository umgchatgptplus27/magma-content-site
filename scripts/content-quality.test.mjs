import test from "node:test";
import assert from "node:assert/strict";
import { publicationIssues } from "../src/lib/content-quality.mjs";

test("rejects leaked production metadata and unfinished work", () => {
  for (const body of [
    "- 설명문: 내부 요약", "- 추천 태그: 옷", "- 고정 slug: sample",
    "Mia 참고 이미지 장면: 로고를 넣지 않습니다.",
    "본문 5장은 생성 API 복구 후 재생성·정밀 검수가 필요합니다.",
    "이미지 프롬프트: a man at a desk",
    "![무문자 케어라벨을 읽는 손](/images/a.webp)",
  ]) assert.ok(publicationIssues(body).length > 0, body);
});

test("accepts useful source limitations and transparent AI disclosure", () => {
  assert.deepEqual(publicationIssues("## 라벨 확인\n제품별 지침을 따르세요.\nAI로 제작한 스타일 예시이며 실제 제품 시험 자료가 아닙니다.\n[출처](https://example.com)"), []);
});

test("normalizes markdown formatting and returns locations, not full prose", () => {
  const issues = publicationIssues("안내\n\n**추천 태그:** 패션\r\n");
  assert.equal(issues[0].line, 3);
  assert.equal(issues[0].code, "production_metadata");
  assert.equal("text" in issues[0], false);
});
