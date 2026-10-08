#!/usr/bin/env python3
"""운영(또는 로컬) 사이트 점검 — 2026-09 통합 개편 이후 상태를 확인한다.

사용: python3 scripts/verify-live-site.py [BASE_URL]   (기본 https://www.eurachoachoa.com)

- 개편 전 218개 글 주소(커밋 eda6a86 기준)가 모두 200이거나 한 번의 301/308로 200에 도달하는지
- 사이트맵 URL 전부 200, 내부 링크 404 없음, 제목 중복 없음, 이미지 누락 없음
- 사이트맵 페이지의 noindex, 메타 설명 길이(80자 초과 목록), ads.txt·AdSense 스크립트
실패 항목이 있으면 종료 코드 1.
"""
import collections
import html
import re
import subprocess
import sys
import urllib.error
import urllib.request

BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://www.eurachoachoa.com").rstrip("/")
PRE_CONSOLIDATION_COMMIT = "eda6a86"
PUB_ID = "pub-9723123826200643"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


opener = urllib.request.build_opener(NoRedirect)


def get(path):
    try:
        r = opener.open(BASE + path, timeout=30)
        return r.status, r.headers.get("Location"), r.read().decode("utf8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Location"), ""


failures = []

# 1) 개편 전 글 주소
old = subprocess.run(
    ["git", "ls-tree", "--name-only", PRE_CONSOLIDATION_COMMIT, "content/posts/"],
    capture_output=True, text=True, check=True,
).stdout.split()
stat = collections.Counter()
for f in old:
    path = "/blog/" + f.split("/")[-1][:-3]
    code, loc, _ = get(path)
    hops = 0
    while code in (301, 302, 307, 308) and hops < 3:
        path = loc.replace(BASE, "") if loc.startswith("http") else loc
        code, loc, _ = get(path)
        hops += 1
    stat[f"{hops}hop→{code}"] += 1
    if code != 200 or hops > 1:
        failures.append(f"old url {f}: {hops} hops → {code}")
print("개편 전 주소:", dict(stat))

# 2) 사이트맵 페이지
sitemap = get("/sitemap.xml")[2]
urls = [re.sub(r"^https?://[^/]+", "", u) or "/" for u in re.findall(r"<loc>([^<]+)</loc>", sitemap)]
links = collections.defaultdict(set)
titles, images, long_desc = {}, set(), []
for u in urls:
    code, _, page = get(u)
    if code != 200:
        failures.append(f"sitemap {u}: {code}")
        continue
    if re.search(r'<meta name="robots" content="[^"]*noindex', page):
        failures.append(f"noindex in sitemap page {u}")
    t = re.search(r"<title>(.*?)</title>", page)
    titles[u] = t.group(1) if t else None
    d = re.search(r'<meta name="description" content="([^"]*)"', page)
    if d and len(html.unescape(d.group(1))) > 80 and not u.startswith("/blog/"):
        long_desc.append((u, len(html.unescape(d.group(1)))))
    for h in re.findall(r'href="(/[^"#?]*)', page):
        if not h.startswith(("/_next", "/images")):
            links[h].add(u)
    images.update(re.findall(r"(/images/[^\"&?]+\.(?:webp|png|jpg))", page))
print("사이트맵 URL:", len(urls))

broken = [(h, get(h)[0]) for h in links]
broken = [b for b in broken if b[1] != 200]
failures += [f"broken link {h} ({c})" for h, c in broken]
print("내부 링크 대상:", len(links), "오류:", len(broken))

dups = [t for t, c in collections.Counter(titles.values()).items() if c > 1]
failures += [f"duplicate title {t}" for t in dups]
print("제목 중복:", len(dups))

missing = [i for i in images if get(i)[0] != 200]
failures += [f"missing image {i}" for i in missing]
print("이미지:", len(images), "누락:", len(missing))

if long_desc:
    print("80자 넘는 비글 페이지 설명(네이버 권장 위반):", long_desc)
    failures += [f"long description {u}" for u, _ in long_desc]

# 3) 광고
ads = get("/ads.txt")[2]
home = get("/")[2]
if PUB_ID not in ads:
    failures.append("ads.txt missing publisher id")
if f"ca-{PUB_ID}" not in home:
    failures.append("AdSense script missing on home")
print("ads.txt·AdSense 스크립트:", "OK" if PUB_ID in ads and f"ca-{PUB_ID}" in home else "확인 필요")

print("\n결과:", "통과" if not failures else f"실패 {len(failures)}건")
for f in failures[:30]:
    print(" -", f)
sys.exit(1 if failures else 0)
