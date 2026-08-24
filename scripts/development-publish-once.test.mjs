import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  DevelopmentPublishError,
  executeDevelopmentPublish,
  normalizePublishDate,
  prepareDevelopmentPublish,
} from "./development-publish-once.mjs";

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function fixture(dateLine = "date: 2026-07-25") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "magma-development-publish-"));
  const slug = "fixture-post";
  const sourceDir = path.join(root, "content-pipeline", "drafts");
  const imageDir = path.join(root, "public", "images");
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.mkdirSync(imageDir, { recursive: true });
  const images = [
    `${slug}-thumbnail.webp`,
    ...Array.from({ length: 5 }, (_, index) => `${slug}-look-${index + 1}.webp`),
  ];
  for (const image of images) fs.writeFileSync(path.join(imageDir, image), "fixture");
  const bodyImages = images
    .slice(1)
    .map((image, index) => `![look ${index + 1}](/images/${image})`)
    .join("\n");
  const source = `---
title: "Fixture post"
description: "Fixture description"
${dateLine}
slug: "${slug}"
tags: ["fixture"]
thumbnail: "/images/${images[0]}"
draft: true
---

Fixture content.

${bodyImages}
`;
  const sourcePath = path.join(sourceDir, `${slug}-final.md`);
  fs.writeFileSync(sourcePath, source, "utf8");
  return { root, slug, source, sourcePath };
}

function isCode(code) {
  return (error) => error instanceof DevelopmentPublishError && error.code === code;
}

test("normalizes a YAML Date object to YYYY-MM-DD", () => {
  assert.equal(normalizePublishDate(new Date("2026-07-25T00:00:00.000Z")), "2026-07-25");
  assert.equal(normalizePublishDate("2026-07-25"), "2026-07-25");
  assert.throws(() => normalizePublishDate("2026-02-30"), isCode("date_is_not_a_calendar_day"));
});

test("preflight scopes the payload to one slug and does not write state", () => {
  const item = fixture();
  const prepared = prepareDevelopmentPublish({
    root: item.root,
    slug: item.slug,
    taskId: "t_fixture",
    expectedSourceSha256: sha256(item.source),
    endpoint: "http://127.0.0.1:3001/api/posts",
  });
  assert.equal(prepared.payload.slug, item.slug);
  assert.equal(prepared.payload.date, "2026-07-25");
  assert.equal(prepared.payload.draft, false);
  assert.equal(prepared.assets.length, 6);
  assert.equal(fs.existsSync(prepared.statePath), false);
});

test("preflight rejects missing slug and a thumbnail duplicated in body", () => {
  const missingSlug = fixture();
  const withoutSlug = missingSlug.source.replace(`slug: "${missingSlug.slug}"\n`, "");
  fs.writeFileSync(missingSlug.sourcePath, withoutSlug, "utf8");
  assert.throws(
    () =>
      prepareDevelopmentPublish({
        root: missingSlug.root,
        slug: missingSlug.slug,
        taskId: "t_fixture",
        expectedSourceSha256: sha256(withoutSlug),
        endpoint: "http://127.0.0.1:3001/api/posts",
      }),
    isCode("source_slug_missing"),
  );

  const duplicatedThumbnail = fixture();
  const withDuplicate = `${duplicatedThumbnail.source}\n![thumbnail](/images/${duplicatedThumbnail.slug}-thumbnail.webp)\n`;
  fs.writeFileSync(duplicatedThumbnail.sourcePath, withDuplicate, "utf8");
  assert.throws(
    () =>
      prepareDevelopmentPublish({
        root: duplicatedThumbnail.root,
        slug: duplicatedThumbnail.slug,
        taskId: "t_fixture",
        expectedSourceSha256: sha256(withDuplicate),
        endpoint: "http://127.0.0.1:3001/api/posts",
      }),
    isCode("approved_image_manifest_must_have_six_unique_assets"),
  );
});

test("rejects an invalid date before a request can start", () => {
  const item = fixture("date: 2026/07/25");
  assert.throws(
    () =>
      prepareDevelopmentPublish({
        root: item.root,
        slug: item.slug,
        taskId: "t_fixture",
        expectedSourceSha256: sha256(item.source),
        endpoint: "http://127.0.0.1:3001/api/posts",
      }),
    isCode("date_must_be_yyyy_mm_dd"),
  );
  const statePath = path.join(
    item.root,
    "content-pipeline",
    ".state",
    `${item.slug}-development.json`,
  );
  assert.equal(fs.existsSync(statePath), false);
});

test("atomically starts one local POST and refuses a concurrent request", async () => {
  const item = fixture();
  const prepared = prepareDevelopmentPublish({
    root: item.root,
    slug: item.slug,
    taskId: "t_fixture",
    expectedSourceSha256: sha256(item.source),
    endpoint: "http://127.0.0.1:3001/api/posts",
  });
  let requests = 0;
  let receivedPayload;
  const server = http.createServer((request, response) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      requests += 1;
      receivedPayload = JSON.parse(body);
      response.writeHead(201, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          collection: "posts",
          slug: item.slug,
          url: `/blog/${item.slug}`,
          mode: "local",
        }),
      );
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.equal(typeof address, "object");
  const endpoint = `http://127.0.0.1:${address.port}/api/posts`;
  prepared.endpoint = endpoint;

  try {
    const firstRequest = executeDevelopmentPublish(prepared, {
      apiKey: "test-only",
      endpoint,
      timeoutMs: 2_000,
    });
    await assert.rejects(
      () =>
        executeDevelopmentPublish(prepared, {
          apiKey: "test-only",
          endpoint,
          timeoutMs: 2_000,
        }),
      isCode("development_intent_already_consumed"),
    );

    const result = await firstRequest;
    assert.equal(result.http_status, 201);
    assert.equal(result.requests_started, 1);
    assert.equal(receivedPayload.slug, item.slug);
    assert.equal(receivedPayload.date, "2026-07-25");
    assert.equal(requests, 1);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("recovery creates a distinct intent ledger and preserves the unclear original ledger", async () => {
  const item = fixture();
  const legacyStatePath = path.join(
    item.root,
    "content-pipeline",
    ".state",
    `${item.slug}-development.json`,
  );
  const originalLedger = {
    task_id: "t_original",
    status: "request_outcome_unclear_no_retry",
    development_send_started: true,
    requests_started: 1,
    automatic_retries: 0,
  };
  fs.mkdirSync(path.dirname(legacyStatePath), { recursive: true });
  fs.writeFileSync(legacyStatePath, `${JSON.stringify(originalLedger)}\n`, "utf8");

  const prepared = prepareDevelopmentPublish({
    root: item.root,
    slug: item.slug,
    taskId: "t_recovery",
    recoveryOfTaskId: "t_original",
    expectedSourceSha256: sha256(item.source),
    endpoint: "http://127.0.0.1:3001/api/posts",
  });
  assert.notEqual(prepared.statePath, legacyStatePath);
  assert.equal(prepared.recoveryOfTaskId, "t_original");
  let requests = 0;
  const server = http.createServer((request, response) => {
    requests += 1;
    request.resume();
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end(
      JSON.stringify({
        collection: "posts",
        slug: item.slug,
        url: `/blog/${item.slug}`,
        mode: "local",
      }),
    );
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.equal(typeof address, "object");
  const endpoint = `http://127.0.0.1:${address.port}/api/posts`;
  prepared.endpoint = endpoint;

  try {
    const result = await executeDevelopmentPublish(prepared, {
      apiKey: "test-key",
      endpoint,
      timeoutMs: 2_000,
    });
    assert.equal(result.http_status, 201);
    assert.equal(requests, 1);
    assert.deepEqual(JSON.parse(fs.readFileSync(legacyStatePath, "utf8")), originalLedger);
    const recoveryLedger = JSON.parse(fs.readFileSync(prepared.statePath, "utf8"));
    assert.equal(recoveryLedger.recovery_of_task_id, "t_original");
    assert.equal(recoveryLedger.requests_started, 1);
    await assert.rejects(
      () =>
        executeDevelopmentPublish(prepared, {
          apiKey: "test-key",
          endpoint,
          timeoutMs: 2_000,
        }),
      isCode("development_intent_already_consumed"),
    );
    assert.equal(requests, 1);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("recovery refuses to start when a target markdown already exists", () => {
  const item = fixture();
  const legacyStatePath = path.join(
    item.root,
    "content-pipeline",
    ".state",
    `${item.slug}-development.json`,
  );
  fs.mkdirSync(path.dirname(legacyStatePath), { recursive: true });
  fs.writeFileSync(
    legacyStatePath,
    JSON.stringify({
      task_id: "t_original",
      status: "request_outcome_unclear_no_retry",
      development_send_started: true,
      requests_started: 1,
      automatic_retries: 0,
    }),
    "utf8",
  );
  fs.mkdirSync(path.join(item.root, "content", "posts"), { recursive: true });
  fs.writeFileSync(path.join(item.root, "content", "posts", `${item.slug}.md`), "existing", "utf8");
  assert.throws(
    () =>
      prepareDevelopmentPublish({
        root: item.root,
        slug: item.slug,
        taskId: "t_recovery",
        recoveryOfTaskId: "t_original",
        expectedSourceSha256: sha256(item.source),
        endpoint: "http://127.0.0.1:3001/api/posts",
      }),
    isCode("target_already_exists_no_post"),
  );
});
