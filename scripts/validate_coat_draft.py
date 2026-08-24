from pathlib import Path

path = Path("content-pipeline/drafts/mens-coat-fabric-selection-guide-draft.md")
text = path.read_text(encoding="utf-8")
headings = [
    "## 1. 코트보다 먼저 오늘의 출근 장면을 적는다",
    "## 2. 소재명보다 라벨과 제품 구성을 먼저 읽는다",
    "## 3. 울과 혼방은 사양표 위에서 비교한다",
    "## 4. 촉감은 이너와 움직임을 함께 두고 확인한다",
    "## 5. 이동과 도착 뒤까지 본 뒤 다음 행동을 정한다",
]
checks = {
    "five_distinct_core_sections": all(text.count(heading) == 1 for heading in headings),
    "image_placeholders": text.count("[이미지 자리표시자") == 6,
    "image_alt_drafts": text.count("- alt 초안:") == 6,
    "forbidden_ad_terms": all(term not in text for term in ["즉시", "무조건", "완벽한", "확실히", "인생 코디"]),
    "no_exclamation_marks": "!" not in text,
    "source_links": text.count("https://") >= 11,
    "required_metadata": all(label in text for label in ["- 설명문:", "- 추천 태그:", "## 출처 링크"]),
}
for key, value in checks.items():
    print(f"{key}: {'PASS' if value else 'FAIL'}")
if not all(checks.values()):
    raise SystemExit(1)
print("draft-contract: PASS")
