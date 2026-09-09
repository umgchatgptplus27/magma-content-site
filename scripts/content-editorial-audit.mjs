import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { publicationIssues } from "../src/lib/content-quality.mjs";

// Read-only content inventory; writes generated reports, never articles.
const base = process.argv[2] ?? "03c2d9b360148ea647b0a9c6eb8c57be4d39122d";
const root = process.cwd();
const dir = path.join(root, "content/posts");
const output = path.join(root, "docs");
fs.mkdirSync(output, { recursive: true });
const files = fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort();
const baseFiles = execFileSync("git", ["ls-tree", "--name-only", base, "content/posts/"], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
const sourceUrls = text => new Set([...text.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(m => m[1]));
const imageCount = text => [...text.matchAll(/!\[[^\]]*\]\(/g)].length;
const grams = title => {
  const s = title.replace(/3040|남성을?\s*위한|5가지|기준|가이드|[\s:·]/g, "");
  return new Set(Array.from({ length: Math.max(0, s.length - 1) }, (_, i) => s.slice(i, i + 2)));
};
const entries = files.map(file => {
  const relative = `content/posts/${file}`;
  const after = fs.readFileSync(path.join(dir, file), "utf8");
  const before = execFileSync("git", ["show", `${base}:${relative}`], { encoding: "utf8" });
  const old = matter(before), current = matter(after);
  const a = current.data, b = old.data;
  const originalUrls = sourceUrls(old.content), currentUrls = sourceUrls(current.content);
  const invariant = ["date", "draft", "thumbnail", "tags"].every(key => JSON.stringify(a[key]) === JSON.stringify(b[key]));
  if (!invariant) throw new Error(`Protected metadata changed: ${relative}`);
  const reworked = ["mens-tshirt-neckline-care-guide.md", "mens-autumn-minimal-office-set-up-guide.md"].includes(file);
  return {
    slug: file.slice(0, -3), title: a.title, published: a.draft !== true,
    changed: before !== after, rewritten: reworked,
    beforeIssues: publicationIssues(old.content), afterIssues: publicationIssues(current.content),
    removedBodyImages: imageCount(old.content) - imageCount(current.content),
    lostSourceUrls: [...originalUrls].filter(url => !currentUrls.has(url)),
    preservedMetadata: invariant, titleTemplate: /5가지/.test(a.title),
    action: reworked ? "유지(범위 조정 재작성)" : "보강 검토",
    reason: reworked ? "자료 기반 관찰표와 가상 예시로 재작성; 실제 제품 경험은 미확보" : "기계 점검만 완료; 독창성·실제 사례·제목의 질문 충족 여부는 편집 검토 필요",
  };
});
for (const entry of entries) {
  const tokens = grams(entry.title);
  const candidates = entries.filter(other => other.slug !== entry.slug).map(other => {
    const otherTokens = grams(other.title);
    const shared = [...tokens].filter(t => otherTokens.has(t)).length;
    const union = new Set([...tokens, ...otherTokens]).size;
    return { slug: other.slug, similarity: union ? Number((shared / union).toFixed(3)) : 0 };
  }).sort((a, b) => b.similarity - a.similarity);
  entry.nearestTitle = candidates[0];
  if (!entry.rewritten && entry.nearestTitle?.similarity >= 0.5) {
    entry.action = "통합 검토";
    entry.reason = "제목 2-gram Jaccard 유사도 ≥ 0.5. 중복 확정 아님; 본문·검색 의도·유입 확인 뒤 결정";
  }
}
const summary = {
  base, method: "휴리스틱 전수 인벤토리. Google 판정·승인 점수·전체 수동 품질검토 아님.",
  total: entries.length, baseTotal: baseFiles.length, published: entries.filter(e => e.published).length,
  changed: entries.filter(e => e.changed).length, rewritten: entries.filter(e => e.rewritten).length,
  removedBodyImages: entries.reduce((n,e) => n + e.removedBodyImages, 0),
  remainingMechanicalIssues: entries.reduce((n,e) => n + e.afterIssues.length, 0),
  lostSourceUrls: entries.filter(e => e.lostSourceUrls.length).map(e => ({ slug:e.slug, urls:e.lostSourceUrls })),
  actions: entries.reduce((acc,e) => { acc[e.action] = (acc[e.action] ?? 0) + 1; return acc; }, {}),
};
if (summary.total !== summary.baseTotal) throw new Error("Article count changed");
fs.writeFileSync(path.join(output, "content-cleanup-audit.json"), JSON.stringify({ summary, entries }, null, 2) + "\n");
const fields = ["slug", "title", "published", "changed", "rewritten", "action", "reason", "removedBodyImages"];
const csv = value => `"${String(value).replaceAll('"', '""')}"`;
fs.writeFileSync(path.join(output, "content-cleanup-audit.csv"), fields.join(",") + "\n" + entries.map(e => fields.map(f => csv(e[f])).join(",")).join("\n") + "\n");
console.log(JSON.stringify(summary, null, 2));
