#!/bin/bash
# 2026-09 통합 개편 단계 배포 — crontab 에서 하루 한 번 실행한다.
# 예정일(docs/release-waves.json 의 date, KST)이 지났는데 아직 스테이징에 남은 가장 이른 차수 1개만 배포한다.
# 순서: 깨끗한 main 확인 → origin 과 동기화 → release-wave → 테스트·lint·빌드 → 커밋·푸시 → 로컬 미러 동기화.
# 어느 단계든 실패하면 푸시하지 않고 로그만 남긴다(작업 폴더는 사람이 확인할 수 있게 그대로 둔다).
set -uo pipefail

export PATH="/usr/local/bin:/usr/bin:/bin"
REPO="/Users/jarvis/.hermes/workspace/magma-content-site"
MIRROR="/Users/jarvis/.hermes/workspace/magma-content-site-production-mirror"
LOG="/Users/jarvis/.hermes/logs/magma-release.log"
TODAY="$(TZ=Asia/Seoul date +%F)"
LAST_FILE="/Users/jarvis/.hermes/state/magma-release-last-date"

log() { echo "[$(TZ=Asia/Seoul date '+%F %T')] $*" >> "$LOG"; }
fail() { log "FAIL: $*"; exit 1; }

cd "$REPO" || fail "repo 없음"

WAVE="$(node -e '
const fs = require("fs");
const { waves } = JSON.parse(fs.readFileSync("docs/release-waves.json", "utf8"));
const today = process.argv[1];
const due = waves
  .filter((w) => w.date <= today)
  .filter((w) => w.pillars.some((p) => fs.existsSync(`content-staging/posts/${p}.md`)))
  .sort((a, b) => a.wave - b.wave)[0];
if (due) console.log(due.wave);
' "$TODAY")"
if [ -z "$WAVE" ]; then
  log "run: 예정 차수 없음"
  exit 0
fi
# 날짜가 한날에 몰리지 않도록 하루에 한 차수만 배포한다(밀린 차수는 다음 날로 넘긴다).
if [ "$(cat "$LAST_FILE" 2>/dev/null)" = "$TODAY" ]; then
  log "run: 오늘 이미 배포함 — wave $WAVE 는 다음 실행으로 넘김"
  exit 0
fi

log "start wave $WAVE ($TODAY)"
[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] || fail "main 브랜치가 아님"
[ -z "$(git status --porcelain)" ] || fail "작업 폴더에 커밋되지 않은 변경이 있음"
git pull --ff-only -q origin main >> "$LOG" 2>&1 || fail "origin/main 동기화 실패"

node scripts/release-wave.mjs "$WAVE" --date "$TODAY" >> "$LOG" 2>&1 || fail "release-wave 실패"
npm run test:editorial >> "$LOG" 2>&1 || fail "test:editorial 실패"
npm run lint >> "$LOG" 2>&1 || fail "lint 실패"
npm run build >> "$LOG" 2>&1 || fail "build 실패 (check:publication 포함)"

git add -A content content-staging || fail "git add 실패"
git commit -q -m "content: release consolidation wave $WAVE ($TODAY)

scripts/scheduled-release.sh 자동 배포. docs/release-waves.json 참조." || fail "commit 실패"
git push -q origin main >> "$LOG" 2>&1 || fail "push 실패"
log "pushed $(git rev-parse --short HEAD)"
echo "$TODAY" > "$LAST_FILE"

# 로컬 미러(localhost:3000)도 운영과 같게 맞춘다. 미러에 변경이 있으면 건드리지 않는다.
if [ -d "$MIRROR" ] && [ -z "$(git -C "$MIRROR" status --porcelain)" ]; then
  git -C "$MIRROR" merge --ff-only -q main >> "$LOG" 2>&1 && log "mirror synced" || log "WARN: mirror 동기화 실패"
else
  log "WARN: mirror 에 로컬 변경이 있어 동기화하지 않음"
fi
log "done wave $WAVE"
