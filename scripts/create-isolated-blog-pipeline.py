#!/usr/bin/env python3
"""Provision one isolated MAGMA blog pipeline worktree, then register its seven cards."""
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import socket
import subprocess
import sys
from pathlib import Path

SLUG_RE = __import__("re").compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
SYSTEM_FILES = (
    "cards/blog-pipeline-template.md",
    "scripts/development-publish-once.mjs",
    "scripts/development-publish-once.test.mjs",
    "scripts/verify-development-seo.mjs",
)


def run(args: list[str], cwd: Path | None = None) -> str:
    result = subprocess.run(args, cwd=cwd, text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError((result.stderr or result.stdout).strip() or "command_failed")
    return result.stdout


def free_port(slug: str) -> int:
    start = 3001 + (int(hashlib.sha256(slug.encode()).hexdigest()[:8], 16) % 399)
    for offset in range(399):
        port = 3001 + ((start - 3001 + offset) % 399)
        probe = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            if probe.connect_ex(("127.0.0.1", port)) != 0:
                return port
        finally:
            probe.close()
    raise RuntimeError("no_free_isolated_preview_port")


def copy_system_files(source: Path, workspace: Path) -> None:
    for relative in SYSTEM_FILES:
        src = source / relative
        dst = workspace / relative
        if not src.is_file():
            raise RuntimeError(f"pipeline_system_file_missing:{src}")
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-repo", required=True, type=Path)
    parser.add_argument("--runs-root", required=True, type=Path)
    parser.add_argument("--topic", required=True)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--board", required=True)
    parser.add_argument("--creator", required=True, type=Path)
    parser.add_argument("--slack-notifier-profile", default="ethan")
    parser.add_argument("--verify-only", action="store_true")
    args = parser.parse_args()
    if not SLUG_RE.fullmatch(args.slug):
        raise RuntimeError("slug_invalid")

    source = args.source_repo.expanduser().resolve()
    runs_root = args.runs_root.expanduser().resolve()
    workspace = runs_root / args.slug
    branch = f"pipeline/{args.slug}"
    context_path = workspace / ".magma-pipeline-run.json"
    run(["git", "fetch", "origin", "main", "--quiet"], source)
    baseline = run(["git", "rev-parse", "origin/main"], source).strip()

    if workspace.exists():
        if not context_path.is_file():
            raise RuntimeError(f"existing_workspace_without_pipeline_context:{workspace}")
        context = json.loads(context_path.read_text(encoding="utf-8"))
        if context.get("slug") != args.slug:
            raise RuntimeError("existing_pipeline_workspace_slug_mismatch")
    else:
        runs_root.mkdir(parents=True, exist_ok=True)
        run(["git", "worktree", "add", "-b", branch, str(workspace), "origin/main"], source)
        port = free_port(args.slug)
        context = {
            "slug": args.slug,
            "topic": args.topic,
            "baseline_sha": baseline,
            "branch": branch,
            "workspace": str(workspace),
            "development_port": port,
            "development_url": f"http://127.0.0.1:{port}",
        }
        context_path.write_text(json.dumps(context, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        copy_system_files(source, workspace)

    if context.get("topic") != args.topic:
        raise RuntimeError("existing_pipeline_workspace_topic_mismatch")
    template = (workspace / "cards/blog-pipeline-template.md").read_text(encoding="utf-8")
    values = {
        "{{TOPIC}}": args.topic,
        "{{SLUG}}": args.slug,
        "{{BASELINE_SHA}}": context["baseline_sha"],
        "{{WORKSPACE}}": context["workspace"],
        "{{DEV_PORT}}": str(context["development_port"]),
        "{{DEV_URL}}": context["development_url"],
        "{{WORKTREE_BRANCH}}": context["branch"],
    }
    for old, new in values.items():
        template = template.replace(old, new)
    if "{{" in template:
        raise RuntimeError("template_has_unresolved_variables")
    rendered = workspace / "cards" / f"{args.slug}-pipeline-rendered.md"
    rendered.write_text(template, encoding="utf-8")

    command = [
        sys.executable,
        str(args.creator.expanduser().resolve()),
        "--template", str(rendered),
        "--topic", args.topic,
        "--slug", args.slug,
        "--workspace", str(workspace),
        "--board", args.board,
        "--slack-notifier-profile", args.slack_notifier_profile,
    ]
    if args.verify_only:
        command.append("--verify-only")
    output = run(command, workspace)
    result = json.loads(output)
    result["pipeline_context"] = context
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(json.dumps({"ok": False, "error": str(error)}, ensure_ascii=False, indent=2))
        raise SystemExit(1)
