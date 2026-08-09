import assert from "node:assert/strict";
import fs from "node:fs";
import matter from "gray-matter";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import ts from "typescript";

function loadBuildMarkdown() {
  const sourcePath = new URL("../src/lib/publish.ts", import.meta.url);
  const source = fs
    .readFileSync(sourcePath, "utf8")
    .replace('from "@/lib/content"', 'from "./content-test-stub.cjs"')
    .replace("function buildMarkdown(", "exports.buildMarkdown = function buildMarkdown(");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "magma-publish-frontmatter-"));
  const modulePath = path.join(root, "publish.cjs");
  fs.writeFileSync(
    path.join(root, "content-test-stub.cjs"),
    'exports.COLLECTIONS = ["posts", "reports"]; exports.contentHref = (collection, slug) => `/${collection}/${slug}`;\n',
    "utf8",
  );
  fs.writeFileSync(modulePath, compiled, "utf8");
  return createRequire(pathToFileURL(modulePath))(modulePath).buildMarkdown;
}

test("serializes explicit draft false in published post frontmatter", () => {
  const buildMarkdown = loadBuildMarkdown();
  assert.equal(typeof buildMarkdown, "function");

  const markdown = buildMarkdown({
    collection: "posts",
    title: "Fixture post",
    description: "Fixture description",
    content: "Fixture content.",
    tags: ["fixture"],
    thumbnail: "/images/fixture.webp",
    draft: false,
    date: "2026-08-10",
  });
  const parsed = matter(markdown);

  assert.equal(parsed.data.draft, false);
  assert.match(markdown, /^draft: false$/m);
});
