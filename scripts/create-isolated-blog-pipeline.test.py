#!/usr/bin/env python3
"""Focused no-network tests for isolated development credential linking."""
from __future__ import annotations

import importlib.util
import os
import tempfile
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("create-isolated-blog-pipeline.py")
spec = importlib.util.spec_from_file_location("isolated_pipeline", MODULE_PATH)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


with tempfile.TemporaryDirectory(prefix="magma-pipeline-env-test-") as raw:
    root = Path(raw)
    canonical = root / "canonical.env"
    canonical.write_text("PUBLISH_API_KEY=test-only-key\n", encoding="utf-8")
    os.chmod(canonical, 0o600)
    workspace = root / "run"
    workspace.mkdir()

    validated = module.validate_development_env_file(canonical)
    assert validated == canonical.resolve()
    module.provision_development_env(workspace, validated)
    linked = workspace / ".env.local"
    assert linked.is_symlink()
    assert linked.resolve() == canonical.resolve()
    module.verify_development_env_link(workspace, validated)

    insecure = root / "insecure.env"
    insecure.write_text("PUBLISH_API_KEY=test-only-key\n", encoding="utf-8")
    os.chmod(insecure, 0o644)
    try:
        module.validate_development_env_file(insecure)
    except RuntimeError as error:
        assert str(error) == "development_env_file_permissions_must_be_600"
    else:
        raise AssertionError("insecure env file should be rejected")

print("create-isolated-blog-pipeline env-link tests: PASS")
