import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";
import {
  ensurePreview,
  stopPreview,
  validatePreviewTarget,
} from "./development-preview-supervisor.mjs";

const supervisor = path.resolve("scripts/development-preview-supervisor.mjs");

function run(root, ...args) {
  return JSON.parse(
    execFileSync(process.execPath, [supervisor, ...args], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
}

function fakeNextWorkspace({ crash = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "magma-preview-supervisor-"));
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  fs.mkdirSync(path.dirname(nextBin), { recursive: true });
  fs.writeFileSync(
    nextBin,
    crash
      ? "process.exit(1);\n"
      : `import http from "node:http";
const port = Number(process.argv[process.argv.indexOf("--port") + 1]);
http.createServer((_request, response) => { response.writeHead(200); response.end("ok"); }).listen(port, "127.0.0.1");
`,
    "utf8",
  );
  return root;
}

test("ensure records a run-scoped detached lease, reuses it after HTTP readiness, then stops it", (t) => {
  const root = fakeNextWorkspace();
  const slug = "preview-fixture";
  const baseUrl = "http://127.0.0.1:3456";
  t.after(() => {
    try {
      run(root, "stop", "--slug", slug, "--base-url", baseUrl);
    } catch {
      // The explicit assertion path may already have stopped the detached fixture.
    }
    fs.rmSync(root, { recursive: true, force: true });
  });

  const first = run(root, "ensure", "--slug", slug, "--base-url", baseUrl);
  assert.equal(first.ok, true);
  assert.equal(first.action, "started");
  assert.equal(first.readiness.ok, true);
  assert.equal(first.lease.workspace, fs.realpathSync(root));
  assert.equal(first.lease.base_url, baseUrl);
  assert.equal(fs.existsSync(first.lease.log_path), true);

  const second = run(root, "ensure", "--slug", slug, "--base-url", baseUrl);
  assert.equal(second.ok, true);
  assert.equal(second.action, "reused");
  assert.equal(second.lease.pid, first.lease.pid);

  const status = run(root, "status", "--slug", slug, "--base-url", baseUrl);
  assert.equal(status.ok, true);
  assert.equal(status.readiness.surfaces.length, 2);

  const stopped = run(root, "stop", "--slug", slug, "--base-url", baseUrl);
  assert.equal(stopped.ok, true);
  assert.equal(stopped.stopped, true);
  assert.equal(fs.existsSync(path.join(root, "content-pipeline", ".state", `${slug}-preview.json`)), false);
});

test("preview target rejects 3000 and non-loopback destinations", () => {
  const root = fakeNextWorkspace();
  try {
    assert.throws(
      () => run(root, "status", "--slug", "preview-fixture", "--base-url", "http://127.0.0.1:3000"),
      /preview_target_not_isolated_local/,
    );
    assert.throws(
      () => run(root, "status", "--slug", "preview-fixture", "--base-url", "http://example.com:3456"),
      /preview_target_not_isolated_local/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("failed readiness removes its lease after an immediate child crash", async () => {
  const root = fakeNextWorkspace({ crash: true });
  const slug = "crashed-preview";
  const target = validatePreviewTarget({
    root,
    slug,
    baseUrl: "http://127.0.0.1:3457",
  });
  try {
    await assert.rejects(
      () => ensurePreview(target, { readyTimeoutMs: 80 }),
      (error) => error?.code === "preview_http_readiness_timeout",
    );
    assert.equal(fs.existsSync(target.leasePath), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("stop removes a dead lease without signalling an unowned process", async () => {
  const root = fakeNextWorkspace();
  const target = validatePreviewTarget({
    root,
    slug: "stale-preview",
    baseUrl: "http://127.0.0.1:3458",
  });
  try {
    fs.mkdirSync(path.dirname(target.leasePath), { recursive: true });
    fs.writeFileSync(
      target.leasePath,
      JSON.stringify({
        workspace: target.workspace,
        slug: target.slug,
        base_url: target.baseUrl,
        port: target.port,
        pid: 999999,
        process_signature: target.nextBin,
      }),
    );
    const result = await stopPreview(target);
    assert.deepEqual(result, { stopped: false, reason: "stale_lease_removed" });
    assert.equal(fs.existsSync(target.leasePath), false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("ensure reclaims a dead-owner lock before starting the preview", async (t) => {
  const root = fakeNextWorkspace();
  const slug = "stale-lock-preview";
  const target = validatePreviewTarget({
    root,
    slug,
    baseUrl: "http://127.0.0.1:3459",
  });
  t.after(async () => {
    try {
      await stopPreview(target);
    } catch {
      // The fixture may already have been cleaned up by an assertion path.
    }
    fs.rmSync(root, { recursive: true, force: true });
  });
  fs.mkdirSync(path.dirname(target.lockPath), { recursive: true });
  fs.writeFileSync(target.lockPath, "999999\n");
  const result = await ensurePreview(target, { readyTimeoutMs: 2_000 });
  assert.equal(result.action, "started");
  assert.equal(fs.existsSync(target.lockPath), false);
});
