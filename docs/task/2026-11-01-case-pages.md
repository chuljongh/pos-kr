# 식수장부 도입 사례 3개 제작·검토

- 기록 시각: 2026-11-01 01:44:57 KST
- 위치: D:/aaa/pos-kr, main, 기준 d624b006b1a4e2c4687697d98be79a01f606443d.
- 요청: 운영사가 제공한 세 현장 설명과 기존 사진·영상으로 독립 웹페이지를 제작. 사용자 지정대로 실제 제작은 Gemini 4.0, Codex는 지시·검토·재작업·검증을 담당. 기존 작업 전후 Claude 의견 및 배포 승인 유지.

## 산출물과 내용

- /cases : 세 현장의 차이와 비교, 상세 사례 목록.
- /cases/cheongunjae : 한전 청운재 구내식당. 기숙사생 조·중·석식 자동 배포, 협력업체 선불, 태블릿 QR, 위탁운영사 전용 엑셀 양식.
- /cases/kcci-gwangju : 대한상공회의소 광주인력개발원. 자체·위탁 교육과정 및 기숙·통학 구분, 다음 주 끼니별 사전 신청, 메뉴·발주 준비, 끼니별 이용권 활성화와 QR 기록.
- /cases/durimiga : 두리미가 솥밥. 회사 후불 문자QR·개인 선불, 1층 태블릿/2층 스마트폰, 초기 병행 운영 및 월초 수기 장부 대조 개선.
- 각 페이지에 실제 사진, 사용자/관리자 흐름, HTML FAQ, 기존 공개 YouTube 영상, 관련 가이드·요금·상담 연결. 메인과 가이드에서 발견할 수 있게 연결.
- 주 브랜드 식수장부/보조 기프트코인 식수장부/제공 기프트코인/운영 블루칩스 유지. 출처는 운영사 현장 설명(2026-11-01)으로 표시. 확인되지 않은 수치·후기·피크 성능·노쇼 과금·식대·시작일은 만들지 않음.

## 실제 담당 모델과 검토

- 제작: agy의 실제 gemini-4-argon-high. conversation f5d6a4e8-1855-43ae-b6c7-81e8d04e0c8b. 자료 조사 후 명령 승인 없는 편집 전용 방식으로 본문·HTML/CSS/JS·사진 변환 코드·SEO 검사 확장을 실제 작성.
- 제한 수정: gemini-4-argon-medium, conversation f192a657-3271-4bc8-838e-3a283f501f40. 같은 Gemini4 모델군으로 장부 발췌 좌표·검사 오탐·마지막 문장 수정.
- Codex는 페이지 코드를 대신 작성하지 않았으며, 사실/사진 선택·지시서·결과 검토·Gemini 작성 코드의 실행·브라우저/SEO 검증을 수행.
- 실제 Claude Opus5.5 제작 전 검토(agy), 사후 검토·재작업본 최종 검토(Claude CLI) 완료. 사진 전체 원본 및 공개 결과는 Codex 육안 확인.
- 첫 Gemini run_command는 비대화형 승인창 부재로 자동 거절. 그 명령은 재시도하지 않았고 네이티브 편집만 수행. 명령·검증은 Codex가 분담. 빈 응답 SUCCESS를 제작 완료로 취급하지 않음.
- 사전 Claude CLI는 사용 한도로 검토가 실행되지 않아 사용 가능한 실제 Claude 모델 경로에서 사전 의견을 받았으며, 이후 CLI 한도 해제 후 실제 사후/최종 의견을 받음.

## 주요 재작업과 판단

- 사진으로 확인한 청운재 표기 유지. 음성의2026-09-31은 달력에 없으므로 도입일은 공개 페이지에서 생략. 실제 장부의 날짜별 행도 공개 이미지에서 제외하고 항목 구성만 발췌.
- 발췌 최초 지시에서 Codex가 뷰어 축소 크기를 원본으로 오인함(실제2390x755). 잘린 열을 확인하고 Gemini에 전체폭2048x647 축소 후 상단340px 발췌로 수정 지시. 원본/수치를 변경하지 않고 전체 헤더를 보존함.
- 하루400명을 동시 처리 인원으로 확장하는 FAQ, 설치 총대수, 대기 성능, 미확인 청구주기·촬영 끼니, 가상 설정 화면 단정을 제거.
- 광주 최종 효과 문장은 확인된 발주·조리 준비 흐름으로 정리. schema 조건은 root #giftcoin/#website/#organization 실제 정의 및 name/url/영상 메타 일치로 확인.
- 모바일에서 대표사진을 긴 요약보다 먼저 표시, 가로넘침을 숨기는 overflow-x:clip 제거, 표 가로스크롤 안내, 영상 수정 클릭의 기본 동작 유지.
- 표준라이브러리 SEO 검사 기본 동작을 유지하고 Pillow는 --check-images 옵션에서만 사용. 실제 월1만원 부가요금을 오탐하던 광범위 금칙어·문구 일치 검사를 단순화.

## 검증

- 기존12+신규4페이지 SEO 구조 검사 통과. python -S scripts/check-seo.py로 외부 패키지 없는 기본 검사 통과, --check-images로 이미지 실제 치수/EXIF 검사 통과. git diff --check 통과.
- 실제 격리 브라우저에서 목록/상세3 1440px·360px: HTTP200, H1각1개, 가로넘침0·본문요소넘침0·이미지누락0·JS오류0. 실제 스크롤 후 lazy 이미지 decode를 기다려 확인.
- 상세3 모두 일반클릭 전 iframe0·클릭 후 정확한 youtube-nocookie 영상1개. Ctrl 등 수정클릭은 가로채지 않음. JS 없는 환경에서도 본문·HTML FAQ·직접영상링크·상담 링크 제공. 다크모드 모바일 레이아웃 확인.
- 메인/가이드도1440/360 확인. 메인의 기존 비교표 내부 가로스크롤은 유지. 태그/문의 폼/가격 일치 검사 통과. root Article 관련 서비스·조직 ID와 영상 메타 일치 확인.
- price/proposal/hamba/cafe/약관/개인정보/vercel설정/기존5개가이드 원문은 기준커밋과 동일.
- 승인된 현장 사진8개만 변환, 공개용WebP8·OG JPG4 생성. 원본 사진·영상·문서 보존. KCCI 개인정보 문서·CSV/DB 및 Gmail 앱 비밀번호 미열람. YouTube/블로그/계정/외부 발송 변경 없음.

## 커밋·배포·정리

- 검증된 이번 파일만 명시적으로 커밋·푸시하여 기존 Vercel 자동 배포 절차로 반영하고 공개 응답을 대조한다. 배포 실제 결과는 후속 기록으로 확정한다.
- 원본8개 미추적 자료는 보존하고 커밋에서 제외. 새 운영 이미지와 검토/작업 문서는 보존.
- 임시 미리보기 서버, 격리 검증 브라우저, 이번 Orca 탭, 임시 스크린샷·Gemini 실행 로그·일회용 변환 스크립트는 완료 후 확인해 정리한다.
- 새 페이지의 실제 검색 색인·AI 추천 반영은 이번 제작/게시 검증과 별개이며 아직 확인하지 않음. 청운재 시작일은 사용자 확인 후 추가할 수 있음.

## 관련 기록

- 2026-11-01-case-pages-brief.md : 운영사 제공 사실과 제작 지시.
- 2026-11-01-case-pages-claude-pre.md / claude-post.md / claude-final.md : 실제 Claude 의견.
- 2026-11-01-case-pages-codex-review.md / rework.md / final-corrections.md : 감독 검토와 Gemini 재작업 지시.

## 최종 로컬 검사·게시 착수 (2026-11-01 01:51:42 KST)

- Gemini r5 종료0 확인. 광주 변화 문장을 실제 신청수량 확인·발주·조리 준비로 한정하고, 영상의 신청 여부 단정 및 두리미가 금액 캡션 중복을 정리함. 해당 두 파일의 실제 문구를 대조함.
- 실제 Claude 최종 남은 조건: 문장 수정 완료, root 관련 ID/조직/VideoObject 정합성 대조 통과. 청운재 엑셀 발췌는 Codex가 직접 확인했고 날짜별 데이터 없이 전체 항목 헤더가 보임.
- 최종본에서 stdlib SEO16/선택 Pillow 이미지 검사/UTF-8 무결성/git diff --check 재통과. 기존13개 보호 파일이 기준 커밋과 동일함을 재확인. 화면·영상 검사는 앞서 최종 레이아웃 기준 통과했고 이번 변경은 두 페이지의 짧은 문장만 해당.
- /simplify 스킬이 제공되지 않아 CSS 공통화, 작은 이벤트 위임 JS, 검사 코드의 중복·오탐·불필요한 추상화를 직접 검토하는 대체 검토 수행. 재작업 반영 후 추가 코드 수정 불필요.
- 다음 실행: 이번32개 산출물만 명시적으로 stage/commit/push하여 기존 Git 연동 Vercel 운영 자동 배포. 실제 성공 및 공개 응답 확인 전 완료로 보고하지 않음. HANDOFF와 기존 미추적8개 및 일회용 사진 변환 스크립트는 커밋 제외.

## 운영 반영·정리 결과 (2026-11-01 01:58:14 KST)

- 소스 커밋 892228b2b25b5a3e8af87f9a7b8e7555b8987247, main → origin/main push 성공. 다른 작업 변경과 기존8개 미추적 파일 제외, 이번32개만 포함.
- Vercel Production – pos-kr 배포7461525395 success: https://pos-f5y6do8yo-chuljongs-projects.vercel.app (프로젝트 배포 BiRp1wc4DSqGCR1nys49k9gmeXFK).
- 같은 Git 연동의 Production – pos-kr-cafe 배포7461526340 success: https://pos-kr-cafe-qxd01e89a-chuljongs-projects.vercel.app. 카페 서비스 소스 수정 없음.
- 공개22개 응답(신규HTML4, 메인/가이드2, CSS/JS2, llms/sitemap2, 현장 이미지12) HTTP200 및 해당 소스 커밋의 실제 바이트와 전부 일치. 네 사례 URL의 최종 주소·canonical·H1·noindex 없음 확인. cafe.pos.kr HTTP200 확인.
- 공개 주소: https://pos.kr/cases, https://pos.kr/cases/cheongunjae, https://pos.kr/cases/kcci-gwangju, https://pos.kr/cases/durimiga.
- 실제 소유를 확인해 이번 로컬 미리보기 서버PID27712/port62573 종료, 이번 Orca 탭d9a7c8cb-8ce9-471f-9905-a6654890ff5c 닫기 성공.
- 삭제 완료: D:/tmp/pos-kr-cases-20261101 안의 이번 시험 스크린샷22개·Gemini 실행 로그5개 및 폴더, 미추적 일회용 scripts/prepare-case-assets.py. 절대경로·파일 목록·원격에 없는 커밋0·추적 변경없음을 확인한 후 native PowerShell로 삭제, 부재 확인. 배포된 코드·사진·업무 기록은 삭제하지 않음.
- 보존: 바탕화면 실제 원본 사진·영상·원문 엑셀 이미지, 신규 운영 사진12개, 제작/검토/작업 문서, 기존 미추적8개(.claude/settings.json, HANDOFF.md, assets/21인치스탠드.psd, docs/GEO-AEO-AUDIT-2026-09-26.md, docs/GEO-ANALYSIS.md, docs/task/2026-10-27-ai-handoff.md, docs/task/2026-10-28-blog-capture-review.md, docs/task/2026-10-31-search-brand-check.md).
- 별도 원격 시험 서버·시험 DB·임시 워크트리·영구 브라우저 프로필은 생성하지 않음. 남길 진행 중 임시 자료가 없어 cleanup/protected.txt 추가 대상 없음. 과거 PID가 재사용된 다른 프로세스는 건드리지 않음.
- 현재 제작·게시 요청은 완료. 청운재의 정확한 시작일은 확인 전이라 생략했으며, 신규 URL의 Google·네이버 색인 및 AI 추천 반영은 아직 확인하지 않음. 검색 순위·AI 인용을 보장하는 표현은 넣지 않음.
- 이 결과와 IMPROVEMENTS 완료 항목은 문서 전용 후속 커밋으로 보존하며, 해당 push의 자동 배포도 확인한다. 웹 소스는 추가 변경하지 않음.
