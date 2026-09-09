import test from "node:test";
import assert from "node:assert/strict";

const base = process.env.EDITORIAL_QA_BASE_URL;
const key = process.env.EDITORIAL_QA_KEY;
const enabled = Boolean(base && key);

// Read-only outcomes: the known existing slug forces 409 on valid inputs.
// Never use an unknown slug here: that would create a post.
test("local publication gate rejects public artifacts before writes; draft and clean input retain duplicate protection", { skip: !enabled }, async () => {
  const url = new URL(base);
  assert.ok(["localhost", "127.0.0.1"].includes(url.hostname), "local QA only");
  const slug = "mens-tshirt-neckline-care-guide";
  const page = await fetch(new URL(`/blog/${slug}`, base));
  assert.equal(page.status, 200, "duplicate fixture must already exist");
  for (const [content, draft, expected, code] of [
    ["Mia 참고 이미지 장면: 테이블", false, 422, "publication_quality_failed"],
    ["Mia 참고 이미지 장면: 테이블", true, 409, undefined],
    ["제품별 케어라벨을 확인하세요.", false, 409, undefined],
  ]) {
    const response = await fetch(new URL("/api/posts", base), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ collection: "posts", slug, title: "Local gate fixture", description: "No write expected", content, draft }),
    });
    const result = await response.json();
    assert.equal(response.status, expected);
    assert.equal(result.code, code);
  }
});
