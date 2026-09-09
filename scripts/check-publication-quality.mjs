import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { publicationIssues } from "../src/lib/content-quality.mjs";

const root = path.resolve(process.argv[2] ?? process.cwd());
const failures = [];
let checked = 0;
for (const collection of ["posts", "reports"]) {
  const dir = path.join(root, "content", collection);
  if (!fs.existsSync(dir)) continue;
  for (const filename of fs.readdirSync(dir).filter((name) => name.endsWith(".md")).sort()) {
    const relative = `content/${collection}/${filename}`;
    try {
      const { data, content } = matter(fs.readFileSync(path.join(dir, filename), "utf8"));
      if (data.draft === true) continue;
      checked += 1;
      const issues = publicationIssues(`${data.title ?? ""}\n${data.description ?? ""}\n${content}`);
      for (const issue of issues) failures.push({ file: relative, ...issue });
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
