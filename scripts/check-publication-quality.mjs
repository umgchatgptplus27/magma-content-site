import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { editorialIssues, publicationIssues } from "../src/lib/content-quality.mjs";

const root = path.resolve(process.argv[2] ?? process.cwd());
const failures = [];
let checked = 0;
// content-staging/posts: 단계 배포를 기다리는 재작성 글도 같은 기준으로 미리 검사한다.
for (const collection of ["posts", "reports", "staging"]) {
  const dir = collection === "staging" ? path.join(root, "content-staging", "posts") : path.join(root, "content", collection);
  if (!fs.existsSync(dir)) continue;
  for (const filename of fs.readdirSync(dir).filter((name) => name.endsWith(".md")).sort()) {
    const relative = collection === "staging" ? `content-staging/posts/${filename}` : `content/${collection}/${filename}`;
    try {
      const { data, content } = matter(fs.readFileSync(path.join(dir, filename), "utf8"));
      if (data.draft === true) continue;
      checked += 1;
      const issues = publicationIssues(`${data.title ?? ""}\n${data.description ?? ""}\n${content}`);
      for (const issue of issues) failures.push({ file: relative, ...issue });
      // 2026-09 편집 기준으로 새로 쓴 글(updated 보유)과 새 글에는 정형 틀 검사까지 적용한다.
      if (data.updated) {
        for (const issue of editorialIssues(String(data.title ?? ""), content)) failures.push({ file: relative, ...issue });
      }
      for (const field of ["title", "description", "date"]) {
        if (!data[field]) failures.push({ file: relative, code: `missing_${field}` });
      }
    } catch {
      failures.push({ file: relative, code: "invalid_frontmatter" });
    }
  }
}
console.log(JSON.stringify({ checked, failures }, null, 2));
if (failures.length) process.exitCode = 1;
