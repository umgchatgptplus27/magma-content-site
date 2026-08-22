# MAGMA 블로그 파이프라인 카드 템플릿

이 문서는 `magma-blog-run1` 보드의 기본 파이프라인 카드 7장(기획·리서치·집필·비주얼·최종 원고 승인·개발 검증·운영 발행)을 다음 글에 재사용하기 위한 템플릿이다.

## 바꿀 값

다음 두 값만 바꾼다.

- 글의 주제: `{{TOPIC}}`
- 주소 이름: `{{SLUG}}`

`{{SLUG}}`는 `^[a-z0-9]+(-[a-z0-9]+)*$` 형식을 사용한다. 제목, 본문, 산출물 경로, 이미지 경로, 개발 상태 기록과 운영 발행 경로는 아래 카드 정의에서 자동으로 `{{SLUG}}`를 사용한다. 임의의 대체 slug나 중복 회피용 slug를 만들지 않는다.

## 등록 순서와 연결

| 순서 | 카드 키 | 담당 | 부모 카드 키 | 전문 스킬 | 초기 상태 | Slack 자동 구독 |
|---:|---|---|---|---|---|---|
| 1 | 기획 | ethan | 없음 | 없음 | scheduled | 없음 |
| 2 | 리서치 | oliver | 기획 | deep-research | todo | 없음 |
| 3 | 집필 | noah | 리서치 | humanize-korean | todo | 없음 |
| 4 | 비주얼 | mia | 집필 | bk-design, baoyu-article-illustrator | todo | 없음 |
| 5 | 최종 원고 승인 | noah | 비주얼 | 없음 | todo | Slack Home |
| 6 | 개발 검증 | noah | 최종 원고 승인 | 없음 | todo | Slack Home |
| 7 | 운영 발행 | noah | 개발 검증 | external-account-write-safety, deploy | todo | Slack Home |

- 작업공간: `/Users/jarvis/.hermes/workspace/magma-content-site`
- 작업공간 종류: `dir`
- 우선순위: `0`
- 첫 기획 카드만 사용자 시작 결정 전까지 scheduled로 둔다.
- 후속 카드는 표의 순서대로 직전 카드 하나만 부모로 연결한다.
- 최종 원고 승인 카드와 운영 발행 카드는 각각 `needs_input` Blocked를 한 번만 사용한다. 개발 검증 카드는 성공 후 두 번째 Blocked로 가지 않고 완료한다.
- 카드 7장 모두 생성 즉시 Ethan 프로필의 Slack Home 채널에 알림을 구독한다. 같은 7카드 세트의 일곱 구독은 slug·주제·루트 카드 ID를 표시한 하나의 세트 전용 Slack 스레드를 공유하고, 다른 7카드 세트는 새 최상위 메시지와 별도 스레드를 사용한다. 구독은 `claimed`, `status`, `blocked`, `unblocked`, `completed`, `gave_up`, `crashed`, `timed_out`처럼 사람이 확인할 주요 생명주기 이벤트를 전달하고 heartbeat·spawn 내부 로그는 제외한다. 구독은 카드 작업을 시작하거나 승인하지 않는다.
- 운영 대상·범위 감사는 운영 발행 카드의 승인 전 읽기 전용 단계에 포함하며 별도 카드로 만들지 않는다.
- 실행 중 자동 분해로 생긴 보조 카드는 이 기본 템플릿에 포함하지 않는다.
- 등록·디스패치 전 각 담당 프로필에서 표의 강제 스킬이 실제로 로드되는지 확인한다. 누락되면 실행하지 않고 Blocked로 보고한다.

---

## 카드 1 — 기획

### 메타데이터

- 카드 키: `기획`
- 제목: `기획 — {{SLUG}} 콘텐츠 브리프 수립`
- 담당: `ethan`
- 부모: 없음
- 전문 스킬: 없음
- 초기 상태: `scheduled`
- Slack 알림: Slack Home

### 카드 본문

[역할]
MAGMA 콘텐츠 기획자로서 블로그 글의 독자, 목적, 핵심 메시지, 핵심 구성 선정 기준과 전체 구조를 결정한다. 이후 리서치·집필·비주얼·발행 단계가 같은 방향으로 움직일 수 있는 기준 문서를 만든다.

[근거]
작업 시작과 동시에 `~/.hermes/company/README.md`를 가장 먼저 읽는다. 이어서 회사 지식베이스의 타깃·브랜드 방향·디자인·보이스 관련 정본을 확인한다. 최소 검토 문서는 `00-회사개요.md`, `04-디자인시스템.md`, `05-네이밍-브랜드보이스.md`, `20-런칭-전략-요약.md`다. 확정되지 않은 내용은 확정된 브랜드 기준처럼 사용하지 않는다.

[작업]
주제는 `{{TOPIC}}`, slug는 `{{SLUG}}`로 고정한다. 3040 남성 독자가 이 주제에서 겪는 구체적인 고민을 정의하고 글이 제공할 실용적 효용을 한 문장으로 정리한다. 글의 핵심 구성 5개가 서로 겹치지 않도록 선정 기준과 각 방향을 제안한다. 도입부, 핵심 섹션 1~5, 마무리로 이어지는 목차와 각 섹션에서 반드시 답해야 할 질문을 작성한다. Oliver가 검증해야 할 조사 질문과 Mia가 시각화해야 할 장면을 구분한다.

[제약]
제품 출시, 소재 성능, 시장 수치 등 확인되지 않은 내용을 사실로 단정하지 않는다. 유행어, 과장 표현, 억지로 젊어 보이게 하는 접근을 피한다. 본문은 `# 제목` H1으로 시작하지 않는다. 제목은 frontmatter `title`로만 관리하고, 페이지 컴포넌트가 이미 `<h1>`으로 렌더하므로 본문 선두 H1이 있으면 이중 H1이 된다. 주제와 slug를 임의로 변경하지 않는다. 근거 문서는 읽기 전용으로 다루며 원본 산출물은 지정된 콘텐츠 파이프라인 경로에 둔다.

[출력]
`content-pipeline/briefs/{{SLUG}}-brief.md`

문서에는 독자 정의, 콘텐츠 목적, 핵심 메시지, 선정 기준, 핵심 방향 5개, 목차, 조사 질문, 비주얼 요구사항, 단계별 인계 조건을 포함한다.

[합격 기준]
브리프만 읽어도 Oliver가 조사 범위를 정하고 Noah가 글의 구조를 이해할 수 있어야 한다. 핵심 구성 5개가 용도나 관점 면에서 구분되어야 한다. 브랜드 정본과 충돌하는 표현이 없어야 한다. 확인된 기준과 기획자의 제안이 명확히 구분되어야 한다. `npm run lint`와 `npm run build`가 통과해야 한다.

---

## 카드 2 — 리서치

### 메타데이터

- 카드 키: `리서치`
- 제목: `리서치 — {{TOPIC}} 근거 조사`
- 담당: `oliver`
- 부모: `기획`
- 전문 스킬: `deep-research`
- 초기 상태: `todo`
- Slack 알림: Slack Home

### 카드 본문

[역할]
MAGMA 리서처로서 기획 브리프의 조사 질문을 검증하고 `{{TOPIC}}`을 뒷받침할 신뢰 가능한 자료를 수집한다. 집필자가 사실과 편집적 해석, 스타일 제안을 구분해 사용할 수 있도록 근거를 구조화한다.

[근거]
`content-pipeline/briefs/{{SLUG}}-brief.md`를 기준으로 조사한다. 최신성, 출처의 전문성, 원문 접근 가능성을 기준으로 공식 자료, 패션 산업 매체, 신뢰할 수 있는 편집 매체와 브랜드 자료를 우선한다. 과거 자료를 사용할 때는 현재 글에 적용할 수 있는 이유를 별도로 설명한다.

[작업]
브리프의 핵심 구성 5개를 각각 검증하고, 더 타당한 대안이 있으면 교체 제안과 이유를 적는다. 모든 사실 주장과 트렌드 판단에 원문 출처 URL을 붙인다. 각 근거를 `주장 / 핵심 인용 또는 요약 / 출처명 / URL / 게시일 또는 확인일 / 근거 강도` 형식으로 정리한다. 스타일링 제안과 검증 가능한 사실을 분리한다. 주제에 따라 필요한 실루엣, 소재, 색상, 레이어링, 신발, 액세서리, 사용 장면과 주의점을 조사한다.

[제약]
URL이 없는 근거는 채택하지 않는다. 출처가 불명확하거나 단일 사례만으로 일반화하기 어려운 내용은 반드시 `근거 부족`이라고 표시한다. 검색 결과 제목이나 AI 요약만을 근거로 사용하지 말고 원문을 확인한다. 수치, 소재 기능, 기후 적합성, 트렌드의 유행 정도를 임의로 만들지 않는다. 협찬성 콘텐츠는 이해관계를 표시한다.

[출력]
`content-pipeline/research/{{SLUG}}-research.md`

문서에는 핵심 결론, 구성별 근거표 5개, 공통 스타일링 근거, 반대 근거 또는 주의점, `근거 부족` 목록, Noah가 인용 가능한 문장, 전체 출처 URL 목록을 포함한다.

[합격 기준]
본문의 모든 사실 주장에 확인 가능한 URL이 연결되어야 한다. 핵심 구성 5개 각각에 최소 하나 이상의 유효한 근거와 적용 해석이 있어야 한다. 사실, 편집적 해석, 스타일링 제안이 구분되어야 한다. 근거가 약한 항목을 숨기지 않고 `근거 부족`으로 표시해야 한다. Noah가 추가 조사 없이 초안을 작성할 수 있는 수준이어야 한다. `npm run lint`와 `npm run build`가 통과해야 한다.

---

## 카드 3 — 집필

### 메타데이터

- 카드 키: `집필`
- 제목: `집필 — {{SLUG}} 블로그 초안 작성 및 윤문`
- 담당: `noah`
- 부모: `리서치`
- 전문 스킬: `humanize-korean`
- 초기 상태: `todo`
- Slack 알림: Slack Home

### 카드 본문

[역할]
MAGMA 카피라이터로서 기획 브리프와 Oliver의 검증 자료를 바탕으로 3040 남성이 실제 상황에서 활용할 수 있는 블로그 글을 작성한다. 초고 작성에 그치지 않고 사실 확인, 문장 정리, 중복 제거와 윤문까지 완료한다.

[근거]
다음 문서를 함께 사용한다.

- `content-pipeline/briefs/{{SLUG}}-brief.md`
- `content-pipeline/research/{{SLUG}}-research.md`
- `~/.hermes/company/05-네이밍-브랜드보이스.md`

시장·트렌드·소재 관련 사실은 Oliver의 URL 근거가 있는 항목만 사용한다. `근거 부족`으로 표시된 내용은 사실처럼 쓰지 않거나 불확실성을 명시한다.

[작업]
제목은 `{{TOPIC}}`으로 작성한다. 도입부에서 독자의 상황과 글의 효용을 간결하게 제시한다. 핵심 구성 1~5를 독립된 섹션으로 만들고 각 섹션에 구체적인 조합, 어울리는 장면, 선택 이유, 색상·소재·신발 또는 액세서리 팁을 포함한다. 확인 가능한 사실에는 출처 링크를 자연스럽게 연결한다. 각 섹션에 Mia가 참고할 이미지 장면 설명과 최종 이미지 경로 자리표시자를 넣는다. 초고 완성 후 제목·도입·소제목·문장 리듬·중복·맞춤법·근거 일치 여부를 다시 검토하고 윤문한다.

[제약]
브랜드 보이스에 따라 과장, 허세 어휘, 유행어 남용과 느낌표를 사용하지 않는다. `즉시`, `무조건`, `완벽한`, `확실히`, `인생 코디`와 같은 단정적 광고 표현을 피한다. 출처에 없는 수치나 효능을 추가하지 않는다. MAGMA 제품이 실제 출시되었거나 특정 기능을 제공하는 것처럼 쓰지 않는다. 이미지가 제작되기 전에는 존재하지 않는 이미지 파일을 완성본처럼 주장하지 않는다.

[출력]
`content-pipeline/drafts/{{SLUG}}-draft.md`

초안에는 제목, 설명문, 추천 태그, 도입부, 핵심 섹션 5개, 마무리, 출처 링크, 섹션별 이미지 장면 설명, 이미지 자리표시자와 alt 문구 초안을 포함한다.

[합격 기준]
핵심 섹션이 정확히 5개이고 서로 구분되어야 한다. 각 섹션이 독자에게 실행 가능한 조합을 제공해야 한다. 사실 주장은 Oliver의 조사 문서와 일치해야 한다. 과장 및 느낌표가 없어야 한다. 맞춤법, 문장 호흡, 중복 표현과 출처 연결을 점검한 윤문 완료본이어야 한다. Mia가 추가 질의 없이 6장의 이미지를 제작할 수 있어야 한다. `npm run lint`와 `npm run build`가 통과해야 한다.

---

## 카드 4 — 비주얼

### 메타데이터

- 카드 키: `비주얼`
- 제목: `비주얼 — {{SLUG}} 썸네일·본문 이미지 제작`
- 담당: `mia`
- 부모: `집필`
- 전문 스킬: `bk-design`, `baoyu-article-illustrator`
- 초기 상태: `todo`
- Slack 알림: Slack Home

### 카드 본문

[역할]
MAGMA 디자이너로서 글의 내용과 장면을 시각화한다. 대표 썸네일 1장과 핵심 섹션별 이미지 5장을 하나의 일관된 시리즈로 제작한다.

[근거]
`content-pipeline/drafts/{{SLUG}}-draft.md`의 구성, 장면 설명과 alt 문구를 기준으로 한다. 작업 전 BlueKiwi에서 `MAGMA Design System`의 현재 활성 버전을 조회하고 컬러, 무드, 이미지 사용 규칙을 확인한다. 회사 정본 `~/.hermes/company/04-디자인시스템.md`도 함께 대조한다.

[작업]
따뜻한 자연 톤, 차분한 깊이, 절제된 강조라는 MAGMA 무드를 유지한다. 썸네일은 `{{TOPIC}}`의 전체 분위기와 3040 남성 타깃을 대표하도록 구성한다. 본문 이미지 5장은 각 섹션의 의류 조합, 색상, 신발, 액세서리와 장소가 구분되도록 제작한다. 6장 전체의 인물 연령대, 색보정, 광원, 여백과 스타일을 일관되게 맞춘다. 이미지별 파일명, 대응 섹션, 장면 설명과 최종 alt 문구를 목록으로 남긴다.

[제약]
이미지 안에 제목, 설명, 캡션 등 어떤 글자도 넣지 않는다. MAGMA를 포함한 로고, 워터마크, 가독 가능한 브랜드 마크를 넣지 않는다. 네온, 요란한 그라데이션, 차가운 순백 중심의 화면, 과도하게 젊은 스트리트 연출을 피한다. 글의 구성과 다른 의상이나 장면으로 임의 변경하지 않는다. BlueKiwi 기준과 회사 디자인 정본이 충돌하면 작업을 멈추고 차이를 보고한다.

[출력]
다음 6개 파일을 `public/images/`에 저장한다.

- `{{SLUG}}-thumbnail.webp`
- `{{SLUG}}-look-1.webp`
- `{{SLUG}}-look-2.webp`
- `{{SLUG}}-look-3.webp`
- `{{SLUG}}-look-4.webp`
- `{{SLUG}}-look-5.webp`

이미지 대응표와 alt 문구는 `content-pipeline/drafts/{{SLUG}}-visual-handoff.md`에 정리한다.

[합격 기준]
썸네일 1장과 본문 이미지 5장, 총 6장이 모두 존재해야 한다. 각 본문 이미지가 초안의 해당 섹션과 시각적으로 일치해야 한다. 이미지 안에 글자·로고·워터마크가 없어야 한다. 6장을 함께 보았을 때 동일한 브랜드 시리즈로 인식되어야 한다. BlueKiwi의 MAGMA Design System과 회사 디자인 정본을 모두 충족해야 한다. 6개 WebP가 정상적으로 열리고 파일명과 alt 문구가 일대일로 대응해야 한다. `npm run lint`와 `npm run build`가 통과해야 한다.

---

## 카드 5 — 최종 원고 승인

### 메타데이터

- 카드 키: `최종 원고 승인`
- 제목: `최종 원고 승인 — {{SLUG}} 원고·이미지 검토`
- 담당: `noah`
- 부모: `비주얼`
- 전문 스킬: 없음
- 초기 상태: `todo`
- Slack 알림: `Slack Home`

### 카드 본문

[역할]
MAGMA 발행 검토 담당자로서 윤문 원고와 이미지 인계 문서를 하나의 최종 원고로 결합하고 6개 이미지가 모두 보이는 검토 화면을 만든다. 이 카드는 최종 원고 준비와 대표 승인만 담당하며 개발·운영 API, Git push, deploy를 실행하지 않는다.

[근거]
다음 산출물과 프로젝트 계약을 사용한다.

- `content-pipeline/drafts/{{SLUG}}-draft.md`
- `content-pipeline/drafts/{{SLUG}}-visual-handoff.md`
- `public/images/{{SLUG}}-thumbnail.webp`
- `public/images/{{SLUG}}-look-1.webp`부터 `public/images/{{SLUG}}-look-5.webp`까지
- 프로젝트의 frontmatter 규칙

확정된 slug는 `{{SLUG}}`다. slug를 변경하거나 중복 회피용 임의 slug를 만들지 않는다.

[작업]
1. 초안과 이미지 인계서를 결합해 `content-pipeline/drafts/{{SLUG}}-final.md`를 작성한다.
2. 기존 초안·인계서의 썸네일 경로를 대조하고 최종 frontmatter의 `thumbnail`이 `/images/{{SLUG}}-thumbnail.webp`인지 확인한다.
3. 최종 원고의 frontmatter는 `draft: true`로 둔다. 핵심 섹션 1~5에 대응 이미지 Markdown과 확정 alt 문구를 하나씩 삽입한다.
4. 이미지 자리표시자, 이미지 슬롯, TODO, 미확정 alt 문구가 남지 않았는지 검사한다. 하나라도 남으면 승인 요청이나 API 호출 없이 위치를 보고한다. 본문 선두에 `# 제목` H1이 남아 있으면 같은 방식으로 보고한다(페이지 컴포넌트가 frontmatter title을 `<h1>`으로 렌더하므로 이중 H1이 됨).
5. `content-pipeline/drafts/{{SLUG}}-review.html`을 생성한다. 제목·설명·태그·slug·썸네일·전체 본문과 함께 썸네일 1장 및 본문 이미지 5장, 총 6장이 실제로 보이도록 한다.
6. 최종 원고와 검토 HTML의 경로·해시, 게시 예정 정보를 대표에게 제시하고 `needs_input` Blocked로 이동한다. 차단 사유는 `최종 원고 승인 대기 — 개발 API 호출 0회`로 기록한다.
7. Blocked 전 카드 댓글에 다음 안내와 복사 문구를 모두 남긴다. 대표가 검토 HTML과 최종 원고를 확인한 뒤 자연어 승인문을 새 댓글로 그대로 복사할 수 있어야 한다. 실제 SHA-256 값은 안내 댓글에서 각 경로 옆에 함께 제시한다.

   ```text
   카드에 필요한 최종 원고 승인 문구를 구체적으로 남겼습니다.

   확인할 검토 파일:
   - content-pipeline/drafts/{{SLUG}}-review.html — SHA-256: <실제 해시>
   - content-pipeline/drafts/{{SLUG}}-final.md — SHA-256: <실제 해시>

   확인 범위:
   - 최종 문안
   - 썸네일 1장
   - 본문 이미지 5장
   - 개발 서버에만 이 결과물 한 건 발행
   - 운영 서버 발행은 아직 수행하지 않음

   복사해 새 대표 댓글로 남길 문구:
   최종 원고와 검토 HTML을 확인했습니다.
   최종 문안과 썸네일 1장, 본문 이미지 5장을 승인합니다.

   먼저 개발 서버에만 이 결과물 한 건을 발행해 주세요.
   운영 서버에는 아직 발행하지 마세요.
   ```

8. 최종 원고 승인에는 별도 `final` 스킬이나 번호형 세 항목을 요구하지 않는다. 위 복사 문구 또는 동일한 의미가 명확한 자연어 댓글이면 유효하다. 다만 최종 문안과 이미지 6장 승인, 개발 서버 한 건 발행 요청, 운영 서버 미발행 의사가 모두 드러나야 한다.
9. 명시적 승인 후 재개되면 승인 대상 경로와 해시가 변하지 않았는지 확인하고 이 카드를 완료한다. 개발 API 호출은 후속 개발 검증 카드에만 맡긴다.

[제약]
이 카드의 개발 POST, 운영 POST, Git push와 deploy 호출 횟수는 모두 0회다. 사람 승인 대기는 `needs_input` Blocked를 정확히 한 번만 사용한다. `review` Kanban 상태를 승인 대기로 사용하지 않는다. 승인 전후에 API 호출, 임의 slug 변경, 키 출력, 원시 인증 응답 저장을 금지한다.

[출력]
- `content-pipeline/drafts/{{SLUG}}-final.md`
- `content-pipeline/drafts/{{SLUG}}-review.html`
- 제목·설명·태그·slug·썸네일·`draft: true`를 포함한 게시 예정 정보
- 썸네일 1장과 본문 이미지 5장의 검증 결과
- 승인 대상 파일의 SHA-256
- `최종 원고 승인 대기 — 개발 API 호출 0회` Blocked 기록
- “카드에 필요한 최종 원고 승인 문구를 구체적으로 남겼습니다.” 안내와 확인 범위
- 최종 문안·이미지 6장 승인, 개발 서버 한 건 발행, 운영 서버 미발행을 담은 자연어 복사 문구
- 승인 후 최종 원고 승인 근거와 카드 완료 기록

[합격 기준]
초안과 이미지 인계서가 최종 원고 하나로 결합되고 검토 HTML에서 이미지 6장이 보인다. 썸네일 경로와 `draft: true`가 정확하며 슬롯·TODO·미확정 alt가 남지 않는다. API 호출 없이 한 번의 `needs_input` Blocked 댓글에서 검토 파일 경로·해시, 확인 범위와 자연어 승인 복사 문구를 제공한다. 대표가 검토 화면을 확인하고 최종 문안·이미지 6장 승인, 개발 서버 한 건 발행 요청, 운영 서버 미발행 의사가 명확한 댓글을 남긴 뒤 승인 대상의 무결성을 확인해 완료한다.

- 카드 6·7의 개발 발행 대상은 격리 개발 모드를 따른다. 3000은 최신 운영 `main`의 읽기 전용 미러이며 개발 POST·미리보기에 사용하지 않는다. slug별 Git worktree와 `3001~3499` 범위의 임시 포트로 기동한 `http://127.0.0.1:<port>`만 사용하고, helper에는 `--endpoint http://127.0.0.1:<port>/api/posts`를 명시한다(3000 endpoint는 거부). `<port>`는 카드 실행 시 lease에서 확보한 실제 포트로 치환한다.

---

## 카드 6 — 개발 검증

### 메타데이터

- 카드 키: `개발 검증`
- 제목: `개발 검증 — {{SLUG}} API 단일 발행`
- 담당: `noah`
- 부모: `최종 원고 승인`
- 전문 스킬: 없음
- 초기 상태: `todo`
- 최대 재시도: `1`
- Slack 알림: `Slack Home`

### 카드 본문

[역할]
MAGMA 개발 발행 검증 담당자로서 승인된 최종 원고를 로컬 개발 API에 정확히 한 번 전송하고 결과를 읽기 전용으로 검증한다. 성공 후 운영 승인 대기로 다시 Blocked하지 않고 이 카드를 완료해 운영 발행 카드로 인계한다.

[근거]
다음 기록과 프로젝트 계약을 사용한다.

- 부모 카드의 최종 원고 승인 댓글·완료 결과
- `content-pipeline/drafts/{{SLUG}}-final.md`
- `content-pipeline/.state/{{SLUG}}-development.json`
- `scripts/development-publish-once.mjs`
- `POST http://127.0.0.1:<port>/api/posts` 계약

[작업]
1. 부모 카드가 완료됐고 대표의 명시적 최종 원고 승인, 승인 파일 경로와 해시가 기록됐는지 확인한다.
2. `development_send_started`, 이전 개발 호출, 대상 파일 또는 성공 기록이 이미 있으면 POST하지 않고 기존 결과를 읽기 전용으로 조정·확인한다.
3. 외부 쓰기와 상태 원장 변경 없이 다음 명령을 먼저 실행한다. 이 preflight는 해당 `{{SLUG}}`의 승인 원고 한 개만 읽어 승인 SHA-256, slug, `draft: true`, 이미지 6장과 필수 메타데이터를 확인하고, YAML Date 객체 또는 정확한 날짜 문자열을 `YYYY-MM-DD`로 정규화한 뒤 실제 달력 날짜인지 검증해야 한다.

   ```bash
   node scripts/development-publish-once.mjs \
     --slug "{{SLUG}}" \
     --task-id "<현재 카드 ID>" \
     --expected-source-sha256 "<부모 승인 댓글의 실제 SHA-256>" \
     --preflight-only
   ```

4. preflight가 통과한 경우에만 아래 helper를 한 번 실행한다. helper는 모든 로컬 검증을 마친 동일 payload를 사용하고, 첫 개발 POST 직전에 `content-pipeline/.state/{{SLUG}}-development.json`에 `development_send_started: true`와 `requests_started: 1`을 원자적으로 기록한 뒤 `POST http://127.0.0.1:<port>/api/posts`를 정확히 1회 호출한다. 직접 curl·fetch 또는 임시 발행 스크립트를 만들지 않는다.

   ```bash
   node --env-file=.env.local scripts/development-publish-once.mjs \
     --slug "{{SLUG}}" \
     --task-id "<현재 카드 ID>" \
     --expected-source-sha256 "<부모 승인 댓글의 실제 SHA-256>"
   ```

5. 페이로드에는 `collection: "posts"`, `slug: "{{SLUG}}"`, 확정된 `title`, `description`, 정규화·검증된 `date: "YYYY-MM-DD"`, `content`, `tags`, `thumbnail`, `draft: false`만 포함한다. 개발 서버에서 렌더링된 결과를 보고 운영 발행 여부를 판단할 수 있도록 이 단계에서만 로컬 공개 상태로 만든다.
6. `.env.local`의 `PUBLISH_API_KEY`는 환경에서만 읽고 값, Authorization 헤더, 원시 인증 응답 또는 비밀값이 포함된 예외를 출력·기록하지 않는다.
7. 기존 상태 원장에 `development_send_started: true`, `requests_started >= 1` 또는 기존 HTTP 결과가 있으면 일반 unblock이나 재시도 승인 댓글이 있어도 helper가 POST 전에 거부해야 한다. 성공·실패·타임아웃·응답 불명확 여부와 관계없이 개발 POST를 추가 호출하지 않는다.
8. 성공하면 응답과 생성 Markdown을 읽기 전용으로 검증한다. 상세 `http://127.0.0.1:<port>/blog/{{SLUG}}`에서 HTTP 200·승인된 제목·본문·본문 이미지 5장을 확인하고, `http://127.0.0.1:<port>/blog` 목록에서 해당 글 링크와 승인된 썸네일 1장을 확인한다. 썸네일 1장과 본문 이미지 5장, 전체 이미지 파일 6장이 모두 HTTP 200인지 확인한 뒤 호출 횟수 1회, 개발 미리보기 URL, 결과와 해시를 기록하고 카드를 완료한다. 운영 승인 대기는 후속 운영 발행 카드가 담당한다.
9. preflight 오류, HTTP 오류, 409, 타임아웃, 연결 끊김, 파싱 실패 또는 불명확한 결과면 재시도하지 않고 비밀값을 제거해 보고한 뒤 수동 조정이 필요한 `capability` Blocked로 전환한다.

[제약]
개발 POST 시작 횟수는 최대 1회다. `scripts/development-publish-once.mjs`의 무쓰기 preflight와 단일 실행 경로만 사용하며 직접 curl·fetch와 임시 발행 스크립트를 금지한다. 승인 확인용 시험 POST, 초안 POST, 임의 slug 변경과 재시도를 금지한다. 성공 후 `needs_input` Blocked를 만들지 않고 `done`으로 완료한다. 오류 Blocked를 해제하더라도 기존 결과를 읽기 전용으로 확인할 뿐 개발 POST를 다시 호출하지 않는다. 운영 API, Git push와 deploy 호출 횟수는 0회다.

[출력]
- `content-pipeline/.state/{{SLUG}}-development.json`
- slug `{{SLUG}}` 한 건의 date 정규화 결과와 무쓰기 preflight 통과 기록
- 개발 API HTTP 응답 코드 또는 정제된 오류 분류
- 응답에 존재하는 `collection`, `slug`, `url`, `mode`, `commitUrl`
- 개발 API 시작 횟수 1회 이하와 자동 재시도 0회 확인
- 승인 원고와 `draft: false` 생성 Markdown의 일치 검증
- 상세 `http://127.0.0.1:<port>/blog/{{SLUG}}`의 HTTP 200·승인된 제목·본문·본문 이미지 5장, `http://127.0.0.1:<port>/blog` 목록의 해당 글 링크·승인된 썸네일 1장, 전체 이미지 파일 6장의 HTTP 200 확인
- 성공 시 카드 `done` 및 후속 운영 발행 카드 인계 메타데이터
- 오류·불명확 결과 시 `capability` Blocked와 수동 조정 필요 기록

[합격 기준]
최종 원고 승인과 기존 전송 기록을 먼저 확인한다. `scripts/development-publish-once.mjs`가 해당 slug 한 건의 승인 원고를 무쓰기 preflight하고 date를 `YYYY-MM-DD`로 정규화·달력 검증한 뒤에만 상태 원장을 기록하고 개발 API를 `draft: false`로 정확히 한 번 호출한다. 어떤 결과에서도 재시도하지 않는다. 상세 페이지가 HTTP 200이며 승인된 제목·본문·본문 이미지 5장을 표시하고, 블로그 목록이 해당 글 링크·승인된 썸네일 1장을 표시하며, 전체 이미지 파일 6장이 모두 HTTP 200인지 읽기 전용으로 검증한 뒤 두 번째 승인 Blocked 없이 완료한다. 오류나 불명확한 결과는 비밀값 없이 보고하고 운영 쓰기 0회를 유지한다.

---

## 카드 7 — 운영 발행

### 메타데이터

- 카드 키: `운영 발행`
- 제목: `운영 발행 — {{SLUG}} 별도 승인 및 deploy`
- 담당: `noah`
- 부모: `개발 검증`
- 전문 스킬: `external-account-write-safety`, `deploy`
- 초기 상태: `todo`
- 최대 재시도: `1`
- Slack 알림: `Slack Home`

### 카드 본문

[역할]
MAGMA 운영 발행 담당자로서 개발 검증 결과를 인계받아 운영 대상과 공개 범위를 읽기 전용으로 감사하고, 대표의 별도 운영 승인 후에만 deploy를 단일 시도로 실행한다. 운영 대상 감사와 범위 승인은 이 카드 안에서 수행하되 승인 대기는 `needs_input` Blocked를 한 번만 사용한다.

[근거]
다음 기록과 안전 절차를 사용한다.

- 부모 카드의 개발 API 호출 횟수·성공 검증 메타데이터
- `content-pipeline/drafts/{{SLUG}}-final.md`
- `content-pipeline/.state/{{SLUG}}-development.json`
- `public/images/{{SLUG}}-thumbnail.webp`
- `public/images/{{SLUG}}-look-1.webp`부터 `public/images/{{SLUG}}-look-5.webp`까지
- 운영 쓰기 안전 절차: `external-account-write-safety`
- 운영 배포 절차: `deploy`

[작업]
1. 개발 API가 `draft: false`로 정확히 1회 시작됐고 성공 결과가 읽기 전용으로 검증됐는지 확인한다. 상세 `http://127.0.0.1:<port>/blog/{{SLUG}}`가 HTTP 200이고 승인된 제목·본문·본문 이미지 5장을 표시하며, `http://127.0.0.1:<port>/blog` 목록이 해당 글 링크·승인된 썸네일 1장을 표시하고, 전체 이미지 파일 6장이 모두 HTTP 200이어야 한다. 오류·불명확 상태나 어느 미리보기 표면이라도 미노출이면 운영 쓰기 없이 Blocked로 보고한다.
2. `external-account-write-safety`와 `deploy`가 실행 담당 프로필에서 로드되는지 확인한다. 하나라도 없으면 운영 쓰기 없이 `capability` Blocked로 보고한다.
3. 첫 실행에서는 GitHub 저장소·브랜치, 운영 호스트 `https://magma-content-site-neon.vercel.app`, 운영 `POST /api/posts`, 기존 동일 slug, 이미지 반영 방식과 격리 작업공간을 읽기 전용으로 감사한다.
4. 개발 미리보기에 사용된 공개 Markdown `content/posts/{{SLUG}}.md`(개발 helper가 정규화한 `draft: false` 버전)를 기준으로 승인 대상 public payload와 manifest를 고정한다. 승인 댓글에는 이 **공개 Markdown 파일의 SHA-256**과 평면 경로 WebP 6개의 해시를 제시한다. 승인용 원본 `content-pipeline/drafts/{{SLUG}}-final.md`의 해시를 public manifest 해시로 대체하지 않는다. `content-pipeline/**`와 다른 미추적 파일은 제외하고 경로·해시·공개 상태를 제시한다. 운영 사전 감사에서는 개발 검증이 만든 파일의 `draft` 값이나 작업공간 파일을 수정하지 않는다.
5. 대상·범위·단일 실행 조건을 대표에게 제시하고 운영 쓰기 없이 `needs_input` Blocked로 이동한다. 차단 사유는 `운영 대상·범위·단일 실행 승인 대기 — 운영 쓰기 0회`로 기록한다. 최종 원고 승인을 운영 승인으로 대신하지 않는다.
6. Blocked 전 카드 댓글에 다음 안내와 slug가 치환된 복사 문구를 모두 남긴다. 대표가 세 승인 의미를 확인한 뒤 마지막 한 줄을 새 댓글로 그대로 복사할 수 있어야 한다.

   ```text
   카드에 필요한 승인 문구를 구체적으로 남겼습니다.

   운영 승인 전 확인할 개발 미리보기: http://127.0.0.1:<port>/blog/{{SLUG}}

   1. 운영 저장소·호스트가 의도한 대상이라는 소유 확인
   2. 개발 미리보기에서 확인한 {{SLUG}} payload와 Markdown 1개·WebP 6개 범위 승인
   3. 이미지 push 최대 1회, 운영 POST 최대 1회, 자동 재시도 0회 실행 승인

   복사해 새 대표 댓글로 남길 문구:
   /deploy 승인 — 1) `umgchatgptplus27/magma-content-site`의 `main`과 `magma-content-site-neon.vercel.app`이 제가 의도한 운영 대상임을 확인합니다. 2) 개발 미리보기 `http://127.0.0.1:<port>/blog/{{SLUG}}`에서 확인한 `{{SLUG}}` public payload와 Markdown 1개·WebP 6개, 총 7개 manifest를 승인합니다. 3) 이미지 push 최대 1회와 운영 POST 최대 1회, 자동 재시도 0회 조건으로 실행을 승인합니다.
   ```

7. `/deploy 승인` 한 댓글은 위 세 항목이 `1)`, `2)`, `3)`으로 각각 명시된 경우에만 유효하다. 일반 `/deploy`, “운영 서버 배포 부탁해” 또는 강제 스킬 지정만으로 승인하지 않는다.
8. 별도 운영 승인 후 재개되면 승인 댓글, 대상, public payload, manifest와 파일 해시가 변하지 않았는지 확인한다. 변경됐거나 승인이 모호하면 운영 쓰기를 수행하지 않고 갱신된 복사 문구를 다시 제공한다.
9. `deploy`의 `production_write_once.py`만 사용한다. 이 helper가 저장소·브랜치 전역 `fcntl.flock`인 `~/.hermes/locks/magma-content-site-main-production.lock`을 획득한 뒤 최신 `origin/main`에서 승인된 slug의 평면 경로 WebP 6개만 커밋·push하고 운영 POST 응답 확인까지 하나의 외부 쓰기 구간으로 직렬화해야 한다. helper는 **정확히 한 번만** 시작하고, lock 대기는 helper의 `--lock-timeout` 안에서 추적된 단일 프로세스로 끝까지 기다린다. lock 대기·무출력을 이유로 helper를 다시 호출하거나 sleep·폴링 루프를 만들어 실행 예산을 소진하지 않는다. lock timeout·하네스 종료·불명확 종료는 쓰기 0회 상태를 확인한 뒤 `capability` Blocked로 끝내며, 재실행에는 새 별도 운영 승인이 필요하다. 직접 `git push`, `ledger.py mark-image-push-started`, `ledger.py mark-image-push-verified`, `post_once.py`를 호출하지 않는다.
10. lock 획득 후 승인 intent·payload·7개 파일 해시와 최신 remote SHA를 다시 확인한다. lock 대기·timeout·remote 선점은 이미지 push 및 운영 POST 시작 횟수를 소비하지 않아야 한다. 현재 작업 폴더를 pull, rebase, reset, clean 또는 stash하지 않으며 Vercel CLI를 사용하지 않는다.
11. helper는 이미지 push와 운영 POST를 각각 시작 전에 원장에 기록하고 단일 시도로 수행한다. 운영 API `https://magma-content-site-neon.vercel.app/api/posts`는 승인된 **공개 Markdown payload**로 정확히 1회 호출해 `draft: false`로 공개한다. HTTP 오류, 409, 타임아웃, 연결 끊김, 리다이렉트 이상, 응답 파싱 실패 또는 결과 불명확 상황에서 재시도하지 않는다. Vercel 공개 polling, lint, build는 전역 lock 해제 후 수행한다.
12. 성공 후 추가 쓰기 없이 GitHub 커밋 범위, 공개 글, 원격 Markdown과 이미지 6장의 HTTP 상태·해시를 검증한다. 이어서 `npm run lint`와 `npm run build`를 실행한다.
13. 성공하면 카드를 완료한다. 오류나 불명확 결과면 비밀값을 제거해 보고하고 자동 재시도 없는 `capability` Blocked로 전환한다.

[제약]
별도 운영 승인 전 운영 쓰기 호출 횟수는 0회이며 작업공간 파일 변경도 0회다. 승인 대기는 `needs_input` Blocked를 정확히 한 번만 사용하며 `review` Kanban 상태를 사용하지 않는다. 운영 승인 후에도 이미지 push와 운영 API POST를 재시도하지 않는다. 모든 운영 외부 쓰기는 저장소·브랜치 전역 lock을 보유한 `production_write_once.py` 안에서만 수행한다. 최종 원고 승인, 개발 성공, 강제 스킬 지정 또는 일반 `/deploy` 요청만으로 운영 승인을 대신하지 않는다. 키, Authorization 헤더, 원시 인증 응답, Vercel CLI 사용, 현재 작업 폴더의 승인 전 변경과 승인 범위 밖 파일 반영을 금지한다.

[출력]
- 읽기 전용 운영 대상 감사 결과
- 운영 승인 전 개발 미리보기 `http://127.0.0.1:<port>/blog/{{SLUG}}` HTTP 200 및 콘텐츠·이미지 검증 결과
- 승인 대상 Markdown 1개·WebP 6개 manifest와 해시
- `운영 대상·범위·단일 실행 승인 대기 — 운영 쓰기 0회` Blocked 기록
- “카드에 필요한 승인 문구를 구체적으로 남겼습니다.” 안내와 세 승인 항목
- slug가 치환된 한 줄 `/deploy 승인 — 1) ... 2) ... 3) ...` 복사 문구
- 별도 운영 승인 근거
- 전역 production write lock 대기 시간과 획득 결과
- 이미지 push 시작 횟수와 운영 POST 시작 횟수
- 응답 코드, `mode`, 공개 글 주소, `commitUrl`
- GitHub 커밋 범위, 원격 Markdown과 이미지 6장 검증 결과
- Vercel Ready, lint와 build 결과
- 비밀값을 제외한 최종 상태

[합격 기준]
`draft: false` 개발 성공과 미리보기 HTTP 200을 확인한 뒤 작업공간을 변경하지 않고 운영 대상과 정확한 공개 범위를 읽기 전용으로 감사한다. 한 번의 `needs_input` Blocked 댓글에서 개발 미리보기 URL, 세 승인 의미와 slug별 `/deploy 승인` 복사 문구를 함께 제공한다. 대표가 개발 화면을 검토하고 번호형 한 줄 승인문을 새 댓글로 남긴 뒤에만 승인된 manifest를 deploy한다. 저장소·브랜치 전역 lock을 획득한 `production_write_once.py`가 최신 main 재확인부터 이미지 push·운영 POST 응답 확인까지 직렬화해야 한다. 이미지 push와 운영 POST는 각각 단일 시도이며 어떤 오류나 불명확한 결과에서도 재시도하지 않는다. 성공 후 lock을 해제하고 공개 글과 이미지 6장, 커밋 범위, lint와 build를 읽기 전용으로 검증한다.

---

## 등록 후 검증 체크리스트

- 변수 표기가 `{{TOPIC}}`, `{{SLUG}}` 두 종류뿐인지 확인한다.
- 카드가 `기획 → 리서치 → 집필 → 비주얼 → 최종 원고 승인 → 개발 검증 → 운영 발행` 순서로 연결되었는지 확인한다.
- 담당이 `ethan → oliver → noah → mia → noah → noah → noah`인지 확인한다.
- 전문 스킬이 표와 일치하고 각 담당 프로필에서 로드 가능한지 확인한다.
- 모든 본문이 `[역할] → [근거] → [작업] → [제약] → [출력] → [합격 기준]` 순서를 유지하는지 확인한다.
- 모든 콘텐츠·상태·이미지 경로가 `{{SLUG}}`에서 파생되는지 확인한다.
- 첫 기획 카드만 scheduled이고 나머지 여섯 카드는 todo인지 확인한다.
- 카드 7장 모두 Ethan 프로필의 Slack Home 채널에 구독되고, 일곱 카드의 `thread_id`가 동일한 세트 전용 값이며 다른 slug 세트의 `thread_id`와 다른지 확인한다. Slack에는 시작·상태 변경·차단·재개·완료·오류가 기록되고 heartbeat·spawn 내부 로그는 제외되는지 확인한다.
- 최종 원고 승인 카드가 API 쓰기 없이 `needs_input` Blocked를 한 번만 사용하고, 댓글에 검토 파일·해시·확인 범위와 자연어 승인 복사 문구를 남기는지 확인한다.
- 개발 검증 카드가 `scripts/development-publish-once.mjs`로 해당 slug 한 건의 승인 원고·SHA-256·date `YYYY-MM-DD`·이미지 6장을 무쓰기 preflight하고, 같은 helper로 개발 API를 `draft: false`로 최대 1회 시작하며, 기존 시작 원장이 있으면 재호출을 거부하는지 확인한다. 이어서 상세 페이지의 승인 콘텐츠·본문 이미지 5장, 블로그 목록의 해당 글 링크·승인 썸네일 1장, 전체 이미지 파일 6장의 HTTP 200을 검증한 뒤 Blocked가 아닌 `done`으로 완료되는지 확인한다.
- 운영 발행 카드가 개발 미리보기를 먼저 확인하고 대상·범위를 작업공간 무변경으로 감사하며, Blocked 댓글에 미리보기 URL·세 승인 항목·slug별 `/deploy 승인` 복사 문구를 남기고 번호형 별도 운영 승인을 받은 뒤 저장소·브랜치 전역 lock의 `production_write_once.py`로만 deploy하는지 확인한다.
- 개발·운영 오류와 불명확 결과에서 자동 재시도하지 않고 `capability` Blocked로 보고하는지 확인한다.
