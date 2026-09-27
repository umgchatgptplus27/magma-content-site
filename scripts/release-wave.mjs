/**
 * 2026-09 통합 개편 단계 배포.
 * content-staging/posts 의 재작성 대표 글을 content/posts 로 옮기고(updated = 배포일),
 * 그 대표 글에 흡수된 원본 글을 지운 뒤 content/redirects.json 에 301 을 추가한다.
 * 1차(direct: true)에는 흡수할 내용 없이 바로 이동하는 글도 함께 처리한다.
 *
 *   node scripts/release-wave.mjs <차수> --date YYYY-MM-DD [--dry-run]
 *
 * 멱등: 이미 처리된 항목은 건너뛴다. 커밋·푸시는 하지 않는다.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const waveNo = Number(args[0]);
const date = args[args.indexOf("--date") + 1];
const dryRun = args.includes("--dry-run");
if (!waveNo || args.indexOf("--date") < 0 || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
  console.error("사용법: node scripts/release-wave.mjs <차수> --date YYYY-MM-DD [--dry-run]");
  process.exit(2);
}

const { waves } = JSON.parse(fs.readFileSync(path.join(root, "docs/release-waves.json"), "utf8"));
const wave = waves.find((w) => w.wave === waveNo);
if (!wave) throw new Error(`차수 ${waveNo} 없음`);

const map = fs.readFileSync(path.join(root, "docs/adsense-consolidation-map.csv"), "utf8")
  .trim().split("\n").slice(1).map((line) => {
    const [slug, action, target] = line.split(",");
    return { slug, action, target };
  });

const postsDir = path.join(root, "content/posts");
const stagingDir = path.join(root, "content-staging/posts");
const redirectsPath = path.join(root, "content/redirects.json");
const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));
const known = new Set(redirects.map((r) => r.source));
const log = [];

function addRedirect(slug, destination) {
  const source = `/blog/${slug}`;
  if (!known.has(source)) {
    redirects.push({ source, destination });
    known.add(source);
    log.push(`301 ${source} → ${destination}`);
  }
  const file = path.join(postsDir, `${slug}.md`);
  if (fs.existsSync(file)) {
    if (!dryRun) fs.rmSync(file);
    log.push(`삭제 content/posts/${slug}.md`);
  }
}

for (const pillar of wave.pillars) {
  const staged = path.join(stagingDir, `${pillar}.md`);
  if (fs.existsSync(staged)) {
    const text = fs.readFileSync(staged, "utf8").replace(/^updated:.*$/m, `updated: ${date}`);
    if (!/^updated:/m.test(text)) throw new Error(`${pillar}: updated 필드 없음`);
    if (!dryRun) {
      fs.writeFileSync(path.join(postsDir, `${pillar}.md`), text);
      fs.rmSync(staged);
    }
    log.push(`공개 content/posts/${pillar}.md (updated ${date})`);
  } else if (!fs.existsSync(path.join(postsDir, `${pillar}.md`))) {
    throw new Error(`${pillar}: 스테이징에도 공개 폴더에도 없음`);
  }
  for (const row of map.filter((r) => r.action === "merge" && r.target === pillar)) addRedirect(row.slug, `/blog/${pillar}`);
}
if (wave.direct) {
  for (const row of map.filter((r) => r.action === "redirect")) addRedirect(row.slug, row.target);
}

if (!dryRun) fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2) + "\n");
console.log(`${dryRun ? "[dry-run] " : ""}${waveNo}차 배포 준비 (${date})\n` + log.join("\n"));
console.log(`\n다음: npm run build → 확인 → git commit → push`);
