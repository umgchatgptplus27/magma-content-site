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
DEFAULT_DEVELOPMENT_ENV_FILE = (
    Path.home() / ".hermes" / "profiles" / "ethan" / "secrets" / "magma-content-site-development.env"
)
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


def validate_development_env_file(value: Path) -> Path:
    source = value.expanduser().resolve()
    if not source.is_file():
        raise RuntimeError(f"development_env_file_missing:{source}")
    if source.stat().st_mode & 0o077:
        raise RuntimeError("development_env_file_permissions_must_be_600")
    lines = source.read_text(encoding="utf-8").splitlines()
    publish_keys = [line for line in lines if line.startswith("PUBLISH_API_KEY=") and line != "PUBLISH_API_KEY="]
    if len(publish_keys) != 1:
        raise RuntimeError("development_env_publish_api_key_invalid")
    return source


def provision_development_env(workspace: Path, source: Path) -> None:
    target = workspace / ".env.local"
    if target.is_symlink():
        if target.resolve() == source:
            return
        raise RuntimeError(f"development_env_link_targets_other_file:{target}")
    if target.exists():
        raise RuntimeError(f"development_env_target_exists_not_symlink:{target}")
    target.symlink_to(source)


def verify_development_env_link(workspace: Path, source: Path) -> None:
    target = workspace / ".env.local"
    if not target.is_symlink() or target.resolve() != source:
        raise RuntimeError(f"development_env_link_missing_or_wrong:{target}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-repo", required=True, type=Path)
    parser.add_argument("--runs-root", required=True, type=Path)
    parser.add_argument("--topic", required=True)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--board", required=True)
    parser.add_argument("--creator", required=True, type=Path)
    parser.add_argument("--development-env-file", type=Path, default=DEFAULT_DEVELOPMENT_ENV_FILE)
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
    development_env_file = validate_development_env_file(args.development_env_file)
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
            "development_env_file": str(development_env_file),
        }
        context_path.write_text(json.dumps(context, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        copy_system_files(source, workspace)
        provision_development_env(workspace, development_env_file)

    if context.get("topic") != args.topic:
        raise RuntimeError("existing_pipeline_workspace_topic_mismatch")
    recorded_env_file = context.get("development_env_file")
    if recorded_env_file and Path(recorded_env_file).expanduser().resolve() != development_env_file:
        raise RuntimeError("existing_pipeline_workspace_development_env_mismatch")
    if args.verify_only:
        verify_development_env_link(workspace, development_env_file)
    else:
        provision_development_env(workspace, development_env_file)
        if not recorded_env_file:
            context["development_env_file"] = str(development_env_file)
            context_path.write_text(json.dumps(context, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
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
