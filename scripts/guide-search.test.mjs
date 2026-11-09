import test from "node:test";
import assert from "node:assert/strict";
import { searchGuides } from "../src/lib/guide-search.mjs";

const guides = [
  { title: "셔츠 핏", description: "어깨와 소매 길이 비교", tags: ["사이즈"] },
  { title: "니트 관리", description: "보풀과 올 걸림 구분", tags: ["세탁"] },
  { title: "온라인 옷 구매", description: "cm와 inch를 비교", tags: ["실측"] },
];

test("finds across title, description and tags with all query terms", () => {
  assert.deepEqual(searchGuides(guides, "셔츠 소매"), [guides[0]]);
  assert.deepEqual(searchGuides(guides, "보풀 세탁"), [guides[1]]);
  assert.deepEqual(searchGuides(guides, "셔츠 보풀"), []);
});

test("normalizes spacing, Latin case and compatibility characters", () => {
  assert.deepEqual(searchGuides(guides, "  셔츠   핏  "), [guides[0]]);
  assert.deepEqual(searchGuides(guides, "ＣＭ INCH"), [guides[2]]);
  assert.deepEqual(searchGuides(guides, " \n "), guides);
});

test("searches guides beyond the first archive page without mutating the list", () => {
  const archive = Array.from({ length: 55 }, (_, index) => ({ title: `문서 ${index}`, description: index === 54 ? "구두 발볼" : "일상", tags: [] }));
  const before = JSON.stringify(archive);
  assert.deepEqual(searchGuides(archive, "구두"), [archive[54]]);
  assert.equal(JSON.stringify(archive), before);
  assert.deepEqual(searchGuides(archive, "없는단어"), []);
});
