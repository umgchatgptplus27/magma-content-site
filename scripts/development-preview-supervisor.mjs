#!/usr/bin/env node

/**
 * Run-scoped, detached supervisor for the isolated MAGMA development preview.
 *
 * A Kanban worker can exit between cards 6 and 7. This helper records the
 * preview lease in the worktree rather than in the worker's process registry,
 * proves HTTP readiness before handoff, and only kills a process whose command
 * is anchored in the same worktree.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DEVELOPMENT_PORT_MIN = 3001;
const DEVELOPMENT_PORT_MAX = 3499;
const DEFAULT_READY_TIMEOUT_MS = 90_000;
const DEFAULT_REQUEST_TIMEOUT_MS = 5_000;
const LOCK_WAIT_TIMEOUT_MS = 10_000;
const STALE_LOCK_AGE_MS = 5_000;

export class PreviewSupervisorError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = "PreviewSupervisorError";
    this.code = code;
  }
}

function requireString(value, code) {
  if (typeof value !== "string" || !value.trim()) {
    throw new PreviewSupervisorError(code);
  }
  return value.trim();
}

function resolveWorkspacePath(root, relativePath) {
  const workspace = path.resolve(root);
  const resolved = path.resolve(workspace, relativePath);
  if (resolved !== workspace && !resolved.startsWith(`${workspace}${path.sep}`)) {
    throw new PreviewSupervisorError("path_outside_workspace");
  }
  return resolved;
}

export function validatePreviewTarget({ root = process.cwd(), slug, baseUrl }) {
  const normalizedSlug = requireString(slug, "preview_slug_required");
  if (!SLUG_RE.test(normalizedSlug)) {
    throw new PreviewSupervisorError("preview_slug_invalid");
  }
  let url;
  try {
    url = new URL(requireString(baseUrl, "preview_base_url_required"));
  } catch {
    throw new PreviewSupervisorError("preview_base_url_invalid");
  }
  const port = Number(url.port);
  if (
    url.protocol !== "http:" ||
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    !Number.isInteger(port) ||
    port < DEVELOPMENT_PORT_MIN ||
    port > DEVELOPMENT_PORT_MAX ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new PreviewSupervisorError("preview_target_not_isolated_local");
  }
  const workspace = path.resolve(root);
  const nextBin = resolveWorkspacePath(workspace, "node_modules/next/dist/bin/next");
  const leasePath = resolveWorkspacePath(
    workspace,
    `content-pipeline/.state/${normalizedSlug}-preview.json`,
  );
  const lockPath = resolveWorkspacePath(
    workspace,
    `content-pipeline/.state/${normalizedSlug}-preview.lock`,
  );
  const logPath = resolveWorkspacePath(
    workspace,
    `.magma-pipeline/preview/${normalizedSlug}.log`,
  );
  return {
    workspace,
    slug: normalizedSlug,
    baseUrl: url.toString().replace(/\/$/, ""),
    port,
    nextBin,
    leasePath,
    lockPath,
    logPath,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT") return null;
    throw new PreviewSupervisorError("preview_lease_invalid");
  }
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, filePath);
}

function isProcessAlive(pid) {
  if (!Number.isInteger(pid) || pid < 2) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error && error.code === "EPERM";
  }
}

function processCommand(pid) {
  const result = spawnSync("ps", ["-ww", "-p", String(pid), "-o", "command="], {
    encoding: "utf8",
  });
  return result.status === 0 ? result.stdout.trim() : "";
}

function isOwnedLease(target, lease) {
  return Boolean(
    lease &&
      path.resolve(String(lease.workspace || "")) === target.workspace &&
      lease.slug === target.slug &&
      lease.base_url === target.baseUrl &&
      lease.port === target.port &&
      lease.process_signature === target.nextBin &&
      isProcessAlive(lease.pid) &&
      processCommand(lease.pid).includes(target.nextBin),
  );
}

async function requestStatus(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { redirect: "error", signal: controller.signal });
    await response.body?.cancel();
    return { url, status: response.status, ok: response.status === 200 };
  } catch (error) {
    return {
      url,
      status: null,
      ok: false,
      error: error?.name === "AbortError" ? "timeout" : "request_failed",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function probePreview(target, { requestTimeoutMs = DEFAULT_REQUEST_TIMEOUT_MS } = {}) {
  const root = await requestStatus(`${target.baseUrl}/`, requestTimeoutMs);
  if (!root.ok) return { ok: false, surfaces: [root] };
  const blog = await requestStatus(`${target.baseUrl}/blog`, requestTimeoutMs);
  return { ok: root.ok && blog.ok, surfaces: [root, blog] };
}

async function waitForReady(target, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastProbe = null;
  while (Date.now() < deadline) {
    lastProbe = await probePreview(target);
    if (lastProbe.ok) return lastProbe;
    await sleep(750);
  }
  throw new PreviewSupervisorError(
    "preview_http_readiness_timeout",
    JSON.stringify({ base_url: target.baseUrl, surfaces: lastProbe?.surfaces || [] }),
  );
}

function startDetachedPreview(target, previousLease) {
  if (!fs.existsSync(target.nextBin)) {
    throw new PreviewSupervisorError(`preview_next_binary_missing:${target.nextBin}`);
  }
  fs.mkdirSync(path.dirname(target.logPath), { recursive: true });
  const logFd = fs.openSync(target.logPath, "a", 0o600);
  const child = spawn(
    process.execPath,
    [target.nextBin, "dev", "--hostname", "127.0.0.1", "--port", String(target.port)],
    {
      cwd: target.workspace,
      detached: true,
      stdio: ["ignore", logFd, logFd],
    },
  );
  child.unref();
  fs.closeSync(logFd);
  const starts = Array.isArray(previousLease?.starts) ? previousLease.starts.slice(-4) : [];
  starts.push({ pid: child.pid, started_at: new Date().toISOString() });
  const lease = {
    version: 1,
    workspace: target.workspace,
    slug: target.slug,
    base_url: target.baseUrl,
    port: target.port,
    pid: child.pid,
    process_signature: target.nextBin,
    command: [process.execPath, target.nextBin, "dev", "--hostname", "127.0.0.1", "--port", String(target.port)],
    log_path: target.logPath,
    started_at: new Date().toISOString(),
    starts,
  };
  try {
    atomicWriteJson(target.leasePath, lease);
  } catch (error) {
    // The child was started by this invocation. It is therefore safe to clean
    // it up even if a lease could not be persisted for ownership verification.
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      try {
        process.kill(child.pid, "SIGTERM");
      } catch {
        // Preserve the original lease-persistence error.
      }
    }
    throw error;
  }
  return lease;
}

export async function stopPreview(target, lease = readJson(target.leasePath)) {
  if (!lease) return { stopped: false, reason: "lease_missing" };
  if (!isOwnedLease(target, lease)) {
    // Never signal a process we cannot prove belongs to this exact worktree.
    // A dead/stale lease is local metadata, so remove it to make recovery
    // idempotent instead of requiring a manual filesystem intervention.
    fs.rmSync(target.leasePath, { force: true });
    return { stopped: false, reason: "stale_lease_removed" };
  }
  try {
    process.kill(-lease.pid, "SIGTERM");
  } catch {
    process.kill(lease.pid, "SIGTERM");
  }
  const deadline = Date.now() + 5_000;
  while (isProcessAlive(lease.pid) && Date.now() < deadline) await sleep(100);
  if (isProcessAlive(lease.pid)) {
    try {
      process.kill(-lease.pid, "SIGKILL");
    } catch {
      process.kill(lease.pid, "SIGKILL");
    }
  }
  fs.rmSync(target.leasePath, { force: true });
  return { stopped: true, pid: lease.pid };
}

function reclaimStaleLock(lockPath) {
  let raw;
  let stat;
  try {
    raw = fs.readFileSync(lockPath, "utf8").trim();
    stat = fs.statSync(lockPath);
  } catch (error) {
    if (error?.code === "ENOENT") return true;
    return false;
  }
  const ownerPid = Number(raw);
  const ownerIsDead = Number.isInteger(ownerPid) && ownerPid >= 2 && !isProcessAlive(ownerPid);
  const incompleteAndOld = (!Number.isInteger(ownerPid) || ownerPid < 2)
    && Date.now() - stat.mtimeMs >= STALE_LOCK_AGE_MS;
  if (!ownerIsDead && !incompleteAndOld) return false;
  try {
    fs.rmSync(lockPath, { force: true });
    return true;
  } catch {
    return false;
  }
}

async function withLeaseLock(target, operation) {
  const deadline = Date.now() + LOCK_WAIT_TIMEOUT_MS;
  let descriptor;
  while (Date.now() < deadline) {
    try {
      fs.mkdirSync(path.dirname(target.lockPath), { recursive: true });
      descriptor = fs.openSync(target.lockPath, "wx", 0o600);
      break;
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      if (reclaimStaleLock(target.lockPath)) continue;
      await sleep(100);
    }
  }
  if (descriptor === undefined) throw new PreviewSupervisorError("preview_lease_lock_timeout");
  try {
    fs.writeFileSync(descriptor, `${process.pid}\n`);
    return await operation();
  } finally {
    fs.closeSync(descriptor);
    fs.rmSync(target.lockPath, { force: true });
  }
}

export async function ensurePreview(target, { readyTimeoutMs = DEFAULT_READY_TIMEOUT_MS } = {}) {
  return withLeaseLock(target, async () => {
    const existing = readJson(target.leasePath);
    if (isOwnedLease(target, existing)) {
      const readiness = await probePreview(target);
      if (readiness.ok) return { action: "reused", lease: existing, readiness };
      await stopPreview(target, existing);
    } else if (existing) {
      fs.rmSync(target.leasePath, { force: true });
    }
    let lease;
    try {
      lease = startDetachedPreview(target, existing);
      const readiness = await waitForReady(target, readyTimeoutMs);
      return { action: "started", lease, readiness };
    } catch (error) {
      if (lease && isOwnedLease(target, lease)) {
        await stopPreview(target, lease);
      } else if (lease) {
        fs.rmSync(target.leasePath, { force: true });
      }
      throw error;
    }
  });
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const values = {};
  for (let index = 0; index < rest.length; index += 1) {
    const option = rest[index];
    if (!option.startsWith("--")) throw new PreviewSupervisorError("preview_cli_argument_invalid");
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) throw new PreviewSupervisorError(`preview_cli_value_missing:${option}`);
    values[option.slice(2)] = value;
    index += 1;
  }
  if (!["ensure", "status", "stop"].includes(command)) {
    throw new PreviewSupervisorError("preview_cli_command_invalid");
  }
  return { command, values };
}

export async function main(argv = process.argv.slice(2)) {
  const { command, values } = parseArgs(argv);
  const target = validatePreviewTarget({ slug: values.slug, baseUrl: values["base-url"] });
  if (command === "ensure") {
    const result = await ensurePreview(target);
    console.log(JSON.stringify({ ok: true, command, ...result }, null, 2));
    return 0;
  }
  if (command === "status") {
    const lease = readJson(target.leasePath);
    const owned = isOwnedLease(target, lease);
    const readiness = owned ? await probePreview(target) : { ok: false, surfaces: [] };
    console.log(JSON.stringify({ ok: owned && readiness.ok, command, lease, owned, readiness }, null, 2));
    return owned && readiness.ok ? 0 : 1;
  }
  const result = await withLeaseLock(target, () => stopPreview(target));
  console.log(JSON.stringify({ ok: true, command, ...result }, null, 2));
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    const code = error instanceof PreviewSupervisorError ? error.code : "preview_supervisor_unexpected_error";
    console.error(JSON.stringify({ ok: false, code, message: error.message }));
    process.exitCode = 1;
  });
}
