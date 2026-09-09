import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

// Use the existing TypeScript dependency so this test also works on Node 20.
const root = fileURLToPath(new URL('../', import.meta.url));
const temp = await fs.mkdtemp(path.join(root, '.responsive-table-test-'));
let renderMarkdown;
try {
  const source = await fs.readFile(path.join(root, 'src/lib/content.ts'), 'utf8');
  const output = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  const file = path.join(temp, 'content.mjs');
  await fs.writeFile(file, output);
  ({renderMarkdown} = await import(pathToFileURL(file).href));
} finally {
  await fs.rm(temp, {recursive:true,force:true});
}

test("GFM tables retain semantics inside a keyboard-focusable scroll region", async () => {
  const html = await renderMarkdown("# Title\n\n| A | B |\n| --- | --- |\n| one | two |\n");
  assert.match(html, /class="table-scroll" role="region" aria-label="[^"]+" tabindex="0"><table>/);
  assert.match(html, /<thead>/);
  assert.match(html, /<td>one<\/td>/);
  assert.match(html, /<\/table><\/div>/);
  assert.doesNotMatch(html, /<h1>/);
});

test("raw scripts and event handlers are not restored by the table wrapper", async () => {
  const html = await renderMarkdown('<script>alert(1)</script>\n\n<img src="x" onerror="alert(2)">\n\n| A |\n| --- |\n| <b>value</b> |');
  assert.doesNotMatch(html, /<script|onerror=/);
  assert.equal((html.match(/class="table-scroll"/g) ?? []).length, 1);
});
