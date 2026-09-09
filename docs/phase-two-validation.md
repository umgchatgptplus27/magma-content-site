# 2차 정비 검증 기록

공개 기능 변경 커밋: `8479ed95ecab1d7cbe8f202c7946f33cb08f47b4`.
대상: https://www.eurachoachoa.com

## 확인 결과

- `npm run test:editorial`: 7개 통과. 표 의미 구조·가로 스크롤 컨테이너·raw script/event handler 차단 회귀 포함.
- `npm run lint`, `npm run build`, `git diff --check`: 통과.
- 공개 글 218개: HTTP 200, 제목, canonical 확인. 목록 10페이지에서 218개가 누락·중복 없이 연결되고 사이트맵 누락 없음.
- Chrome 모바일 viewport 320px: 운영 공개 글 218개 모두 문서 너비, 이미지 로딩, 헤더 링크 노출, 표 스크롤 컨테이너 검사 통과.
- 대표 7경로 × 320/390/768px = 21 화면 검사 통과. 표 ArrowRight 스크롤 4회, 상단 메뉴 실제 클릭 6회 통과.
- 운영 CSV 두 파일과 로컬 원본의 바이트 일치, 해당 대표 글의 다운로드 링크 확인.
- 운영 테이블과 목록 스크린샷 시각 확인. 물리적 iPhone/Android 기기를 테스트한 것은 아니며 성능·전체 접근성 인증도 아니다.

## 실행 증거

- `/tmp/magma-phase-two-production-http.json`
- `/tmp/magma-mobile-all-production/results.json`
- `/tmp/magma-mobile-final-production/results.json`
- `/tmp/magma-mobile-final-production/320-_blog_mens-autumn-minimal-office-set-up-guide-table.png`

임시 디렉터리의 증거는 OS 정리 대상이므로 영구 보관이 필요하면 별도 복사한다.

## QA 드라이버 주의

`mobile-editorial-qa.mjs`는 localhost:9399의 작업 전용 Chrome CDP 페이지에 연결한다. 별도 임시 프로필로 Chrome을 띄우며 개인 브라우저를 재사용하지 않는다. Node의 전역 WebSocket을 지원하는 런타임이 필요하다. 이 작업은 Node 26에서 실행했다.

백그라운드 탭의 requestAnimationFrame 대기는 실제 운영 확인에서 멈출 수 있어 제거했다. 실제 키 입력 검증에는 Page.bringToFront와 포커스 에뮬레이션을 사용했다. 첫 시도의 타임아웃/포커스 실패를 통과로 처리하지 않고 드라이버 수정 후 다시 실행했다.

## 완료로 표시하지 않은 항목

실제 사진·실측 사례, 통합 후보의 유입 데이터 검토와 최종 병합, 모든 글의 사실·독창성 정독 검수, 자동 발행 운영 정책 조정, 애드센스 재심사와 색인 요청.

통합 검토: `content-overlap-review.md`.
실물 자료 전달 기준: `field-evidence-kit.md`.
