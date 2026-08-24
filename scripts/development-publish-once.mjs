#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256_RE = /^[a-f0-9]{64}$/;
// Port 3000 is a read-only local mirror of production. Development validation
// must use a separately provisioned per-run preview on 3001 or higher.
const DEVELOPMENT_PORT_MIN = 3001;
const DEVELOPMENT_PORT_MAX = 3499;

export class DevelopmentPublishError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = "DevelopmentPublishError";
    this.code = code;
  }
}

export function validateDevelopmentEndpoint(value) {
  const endpoint = requireString(value, "development_endpoint_required");
  let url;
  try {
    url = new URL(endpoint);
  } catch {
    throw new DevelopmentPublishError("development_endpoint_invalid");
  }
  const port = Number(url.port);
  const allowedHost = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (
    url.protocol !== "http:" ||
    !allowedHost ||
    !Number.isInteger(port) ||
    port < DEVELOPMENT_PORT_MIN ||
    port > DEVELOPMENT_PORT_MAX ||
    url.pathname !== "/api/posts" ||
    url.search ||
    url.hash
  ) {
    throw new DevelopmentPublishError("development_endpoint_not_isolated_local_preview");
  }
  return url.toString();
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function requireString(value, code) {
  if (typeof value !== "string" || !value.trim()) {
    throw new DevelopmentPublishError(code);
  }
  return value.trim();
}

export function normalizePublishDate(value) {
  let normalized;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    normalized = value.toISOString().slice(0, 10);
  } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    normalized = value.trim();
  } else {
    throw new DevelopmentPublishError("date_must_be_yyyy_mm_dd");
  }

  const [year, month, day] = normalized.split("-").map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    throw new DevelopmentPublishError("date_is_not_a_calendar_day");
  }
  return normalized;
}

function resolveWorkspacePath(root, relativePath) {
  const workspace = path.resolve(root);
  const resolved = path.resolve(workspace, relativePath);
  if (resolved !== workspace && !resolved.startsWith(`${workspace}${path.sep}`)) {
    throw new DevelopmentPublishError("path_outside_workspace");
  }
  return resolved;
}

function approvedAssetPaths(root, parsed) {
  const thumbnail = requireString(parsed.data.thumbnail, "thumbnail_missing");
  const bodyImages = [...parsed.content.matchAll(/!\[[^\]]*\]\((\/images\/[^)]+)\)/g)].map(
    (match) => match[1],
  );
  const assets = [thumbnail, ...bodyImages];
  if (bodyImages.length !== 5 || new Set(assets).size !== 6) {
    throw new DevelopmentPublishError("approved_image_manifest_must_have_six_unique_assets");
  }
  for (const asset of assets) {
    if (!asset.startsWith("/images/") || asset.includes("..")) {
      throw new DevelopmentPublishError("approved_asset_path_invalid");
    }
    const filePath = resolveWorkspacePath(root, path.join("public", asset.slice(1)));
    if (!fs.existsSync(filePath)) {
      throw new DevelopmentPublishError("approved_asset_missing");
    }
  }
  return assets;
}

export function prepareDevelopmentPublish({
  root = process.cwd(),
  slug,
  taskId,
  expectedSourceSha256,
  recoveryOfTaskId,
  endpoint,
}) {
  const normalizedSlug = requireString(slug, "slug_required");
  if (!SLUG_RE.test(normalizedSlug)) {
    throw new DevelopmentPublishError("slug_invalid");
  }
  const normalizedTaskId = requireString(taskId, "task_id_required");
  const normalizedRecoveryOfTaskId =
    recoveryOfTaskId === undefined ? null : requireString(recoveryOfTaskId, "recovery_of_task_id_required");
  const expectedHash = requireString(expectedSourceSha256, "expected_source_sha256_required");
  if (!SHA256_RE.test(expectedHash)) {
    throw new DevelopmentPublishError("expected_source_sha256_invalid");
  }
  const developmentEndpoint = validateDevelopmentEndpoint(endpoint);

  const sourceRelative = `content-pipeline/drafts/${normalizedSlug}-final.md`;
  const legacyStateRelative = `content-pipeline/.state/${normalizedSlug}-development.json`;
  const targetRelative = `content/posts/${normalizedSlug}.md`;
  const sourcePath = resolveWorkspacePath(root, sourceRelative);
  const legacyStatePath = resolveWorkspacePath(root, legacyStateRelative);
  const targetPath = resolveWorkspacePath(root, targetRelative);

  if (!fs.existsSync(sourcePath)) {
    throw new DevelopmentPublishError("approved_source_missing");
  }
  const source = fs.readFileSync(sourcePath, "utf8");
  const sourceSha256 = sha256(source);
  if (sourceSha256 !== expectedHash) {
    throw new DevelopmentPublishError("approved_source_sha256_mismatch");
  }

  const parsed = matter(source);
  const title = requireString(parsed.data.title, "title_missing");
  const description = requireString(parsed.data.description, "description_missing");
  const sourceSlug = requireString(parsed.data.slug, "source_slug_missing");
  if (sourceSlug !== normalizedSlug) {
    throw new DevelopmentPublishError("source_slug_mismatch");
  }
  if (parsed.data.draft !== true) {
    throw new DevelopmentPublishError("approved_source_must_be_draft_true");
  }
  if (!Array.isArray(parsed.data.tags) || parsed.data.tags.some((tag) => typeof tag !== "string")) {
    throw new DevelopmentPublishError("tags_must_be_string_array");
  }
  const content = requireString(parsed.content, "content_missing");
  const date = normalizePublishDate(parsed.data.date);
  const assets = approvedAssetPaths(root, parsed);

  const payload = {
    collection: "posts",
    slug: normalizedSlug,
    title,
    description,
    date,
    content,
    tags: parsed.data.tags.map(String),
    thumbnail: String(parsed.data.thumbnail),
    draft: false,
  };
  const intentId = sha256(
    JSON.stringify(
      normalizedRecoveryOfTaskId
        ? {
            task_id: normalizedTaskId,
            recovery_of_task_id: normalizedRecoveryOfTaskId,
            slug: normalizedSlug,
            source_sha256: sourceSha256,
            endpoint: developmentEndpoint,
          }
        : {
            task_id: normalizedTaskId,
            slug: normalizedSlug,
            source_sha256: sourceSha256,
            endpoint: developmentEndpoint,
          },
    ),
  );
  const stateRelative = normalizedRecoveryOfTaskId
    ? `content-pipeline/.state/${normalizedSlug}-development-recovery-${intentId.slice(0, 16)}.json`
    : legacyStateRelative;
  const statePath = resolveWorkspacePath(root, stateRelative);

  if (normalizedRecoveryOfTaskId) {
    if (!fs.existsSync(legacyStatePath)) {
      throw new DevelopmentPublishError("recovery_source_ledger_missing");
    }
    let legacyState;
    try {
      legacyState = JSON.parse(fs.readFileSync(legacyStatePath, "utf8"));
    } catch {
      throw new DevelopmentPublishError("recovery_source_ledger_invalid");
    }
    if (
      legacyState.task_id !== normalizedRecoveryOfTaskId ||
      legacyState.status !== "request_outcome_unclear_no_retry" ||
      legacyState.development_send_started !== true ||
      legacyState.requests_started !== 1 ||
      legacyState.automatic_retries !== 0
    ) {
      throw new DevelopmentPublishError("recovery_source_ledger_not_eligible");
    }
    if (fs.existsSync(targetPath)) {
      throw new DevelopmentPublishError("target_already_exists_no_post");
    }
  }

  return {
    root: path.resolve(root),
    slug: normalizedSlug,
    taskId: normalizedTaskId,
    endpoint: developmentEndpoint,
    sourceRelative,
    sourcePath,
    sourceSha256,
    legacyStateRelative,
    legacyStatePath,
    stateRelative,
    statePath,
    targetRelative,
    targetPath,
    date,
    assets,
    payload,
    payloadSha256: sha256(JSON.stringify(payload)),
    intentId,
    recoveryOfTaskId: normalizedRecoveryOfTaskId,
  };
}

function writeJsonAtomic(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  fs.renameSync(temporary, filePath);
}

function writeJsonExclusive(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  let descriptor;
  try {
    descriptor = fs.openSync(filePath, "wx", 0o600);
  } catch (error) {
    if (error && typeof error === "object" && error.code === "EEXIST") {
      throw new DevelopmentPublishError("development_intent_already_consumed");
    }
    throw error;
  }
  try {
    fs.writeFileSync(descriptor, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
}

function safeResponseFields(value) {
  const body = value && typeof value === "object" ? value : {};
  return {
    collection: typeof body.collection === "string" ? body.collection : null,
    slug: typeof body.slug === "string" ? body.slug : null,
    url: typeof body.url === "string" ? body.url : null,
    mode: typeof body.mode === "string" ? body.mode : null,
    commitUrl: typeof body.commitUrl === "string" ? body.commitUrl : null,
  };
}

export async function executeDevelopmentPublish(
  prepared,
  {
    apiKey,
    endpoint = prepared.endpoint,
    statePath = prepared.statePath,
    targetPath = prepared.targetPath,
    timeoutMs = 15_000,
    fetchImpl = fetch,
  } = {},
) {
  const key = requireString(apiKey, "publish_api_key_missing");
  if (endpoint !== prepared.endpoint) {
    throw new DevelopmentPublishError("development_endpoint_does_not_match_approved_intent");
  }
  if (fs.existsSync(targetPath)) {
    throw new DevelopmentPublishError("target_already_exists_no_post");
  }

  const startedAt = new Date().toISOString();
  const state = {
    task_id: prepared.taskId,
    intent_id: prepared.intentId,
    recovery_of_task_id: prepared.recoveryOfTaskId,
    endpoint,
    approved_source: prepared.sourceRelative,
    approved_source_sha256: prepared.sourceSha256,
    payload_sha256: prepared.payloadSha256,
    slug: prepared.slug,
    date: prepared.date,
    request_limit: 1,
    requests_started: 1,
    automatic_retries: 0,
    development_send_started: true,
    status: "request_started",
    started_at: startedAt,
    operations_post_requests: 0,
    git_pushes: 0,
    deploy_calls: 0,
  };
  // O_EXCL makes the intent claim atomic: concurrent workers cannot both start a POST.
  writeJsonExclusive(statePath, state);

  let response;
  let responseBody;
  try {
    response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prepared.payload),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const responseText = await response.text();
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = null;
    }
  } catch {
    const failed = {
      ...state,
      status: "request_outcome_unclear_no_retry",
      http_status: null,
      error_classification: "network_or_timeout_outcome_unclear_no_retry",
      response: safeResponseFields(null),
      response_recorded_at: new Date().toISOString(),
    };
    writeJsonAtomic(statePath, failed);
    throw new DevelopmentPublishError("development_request_outcome_unclear_no_retry");
  }

  const safeResponse = safeResponseFields(responseBody);
  const responseRecordedAt = new Date().toISOString();
  const success =
    response.status === 201 &&
    safeResponse.collection === "posts" &&
    safeResponse.slug === prepared.slug &&
    safeResponse.url === `/blog/${prepared.slug}` &&
    safeResponse.mode === "local";
  const completed = {
    ...state,
    status: success ? "published_pending_verification" : "request_failed_no_retry",
    http_status: response.status,
    error_classification: success ? null : `http_${response.status}_or_invalid_response_no_retry`,
    response: safeResponse,
    response_recorded_at: responseRecordedAt,
  };
  writeJsonAtomic(statePath, completed);

  if (!success) {
    throw new DevelopmentPublishError("development_request_failed_no_retry");
  }
  return completed;
}

function parseArgs(argv) {
  const values = { preflightOnly: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--preflight-only") {
      values.preflightOnly = true;
      continue;
    }
    const key = {
      "--slug": "slug",
      "--task-id": "taskId",
      "--expected-source-sha256": "expectedSourceSha256",
      "--recovery-of-task-id": "recoveryOfTaskId",
      "--endpoint": "endpoint",
    }[arg];
    if (!key || index + 1 >= argv.length) {
      throw new DevelopmentPublishError("invalid_cli_arguments");
    }
    values[key] = argv[index + 1];
    index += 1;
  }
  return values;
}

function publicPreflight(prepared) {
  return {
    ok: true,
    mode: "preflight",
    slug: prepared.slug,
    date: prepared.date,
    source: prepared.sourceRelative,
    source_sha256: prepared.sourceSha256,
    payload_sha256: prepared.payloadSha256,
    intent_id: prepared.intentId,
    recovery_of_task_id: prepared.recoveryOfTaskId,
    approved_assets: prepared.assets,
    request_started: false,
  };
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const prepared = prepareDevelopmentPublish(args);
    if (args.preflightOnly) {
      console.log(JSON.stringify(publicPreflight(prepared), null, 2));
      return;
    }
    const result = await executeDevelopmentPublish(prepared, {
      apiKey: process.env.PUBLISH_API_KEY,
      endpoint: prepared.endpoint,
    });
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: "published_pending_verification",
          slug: prepared.slug,
          date: prepared.date,
          http_status: result.http_status,
          response: result.response,
          requests_started: result.requests_started,
          automatic_retries: result.automatic_retries,
          state: prepared.stateRelative,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    const code = error instanceof DevelopmentPublishError ? error.code : "unexpected_error";
    console.error(JSON.stringify({ ok: false, error: code }, null, 2));
    process.exitCode = 1;
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) await main();
