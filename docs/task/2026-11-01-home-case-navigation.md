# 홈페이지 사례 선택·광주 쇼츠 개선

- 시작 2026-11-01 09:23:15 KST, D:/aaa/pos-kr main 기준883c52f0c26cd0e5a975bdcc826018bbe1e06d6b.
- 사용자 요청: 메인 본문 중후반에서 목적에 맞는 세 사례를 버튼으로 선택, 사례 모음으로도 이동, 광주 사례 세로 쇼츠의 표시 비율 수정. Gemini 실제 수정·검증, Codex 감독 및 배포까지 명시 승인.
- 실제 제작은 Gemini4 Medium, Codex는 지시·검토·검증 담당. Claude 사전/사후 의견 절차 유지.
- 작업 전 추적·스테이지 변경없음. 기존 미추적8개 보존/커밋 제외.

## 사전 확인

- 실제 Claude CLI claude-opus-5-5 사전 검토 완료(exec45980 종료0), P0없음·진행가능. 접근성/버튼/추적/영상 비율 권고를 지시서에 반영. 카페 도메인에 사례까지 복제하라는 권고는 별개 서비스 구조와 무관해 미적용.
- 기존 메인의 사례 상세 링크는 긴9:16 영상 그리드 아래 작은 글씨로 배치되어 발견이 어려움. 영상보다 앞에 목적별 선택 영역을 둔다.
- 기존 광주 상세의 wide-poster/landscape 클래스가16:9를 적용하고 있었음. 기존 일반 .video-frame은9:16·340px이며 iframe은 컨테이너를 채우므로 재사용한다.
- 공개 YouTube aqZwgKgywVY를 쿠키·로그인·영상 다운로드 없이 yt-dlp 메타데이터로 확인: width1080/height1920/aspect_ratio0.56/duration36초, 동일 광주 구내식당 제목. 따라서 실제 세로 영상임을 독립 확인. 가로 텍스트 포스터는 기존 현장 세로 사진으로 대체하고 원본 영상의 확대·크롭은 하지 않는다.
- 기존 js/ga.js는 자식 클릭 보완 로직이 이미 있음. Claude가 말한 GTM 자체 제약은 실제 주석과 일치하나 추가 추적 코드를 만들 필요 없음. CTA는 앵커 본체에 cta_click 이벤트를 두는 단순 형식으로 지시.

## 실행 중

- Gemini4 Medium conversation10d8719d-be4a-496c-a00a-39c8ad444e5a, exec3467/PID29660, 실제 init model gemini-4-argon-medium 확인. 명령 없이 네이티브 읽기/편집만 허용. 로그 D:/tmp/pos-kr-home-cases-20261101/gemini-r1.jsonl.
- 미리보기 exec43830/PID26928, http://127.0.0.1:52614. 이번 임시 폴더 D:/tmp/pos-kr-home-cases-20261101. 완료 후 소유·Git 상태 확인하여 정리한다.
- 아직 커밋·push·배포 미실행. 상세 지시서 2026-11-01-home-case-navigation-brief.md, 실제 사전 의견 2026-11-01-home-case-navigation-claude-pre.md.

## 1차 구현과 실제 검증

- Gemini r1 종료0, index.html +80줄 및 광주 HTML3개 표시 속성 수정. 전용 선택카드 CSS는 index 내 기존style에만 추가하여 배포된 정적 Tailwind CSS 재생성/의존성 없이 동작. 공통CSS/JS·기존 영상3개·schema/가격/문의폼 보존.
- 실제 브라우저 검사 exec5331 종료0: 360/390/768/1440에서 카드3/모음버튼1·올바른열수·사진decode·버튼44px이상·가로넘침0·JS오류0. 키보드Enter로3상세와모음 정확히 이동. JS없는환경에서도 사례 이동·직접영상링크 제공.
- 광주 클릭 전후9:16, iframe이프레임을채움. 폭은360화면290px/390화면320px/768·1440화면340px, 영상주소youtube-nocookie.com/embed/aqZwgKgywVY. 실제 공개원본1080x1920 확인과 맞음. 테스트 중 외부 iframe 네트워크는 차단해 실제 끝까지 시청한 검사와 구분함.
- SEO16표준라이브러리 및 Pillow선택검사·diff검사통과. 두 변경HTML의 schema/title/meta/canonical/form이 기준과동일함을실제파싱대조. 공통CSS/JS/요금/다른사례보존확인.
- 실제 Claude 사후검토 exec55855 종료0. P0없음, 청운재전용배지정정과카드내용원문대조요구. Codex가 세 상세의 원문을 대조해 지역/결제/끼니/구분집계정산/엑셀 사실을확인했으므로 원문대조조건은해소.
- Codex가 실제PC/모바일스크린샷과원본을육안확인. 모바일에서현재가운데정렬포스터가양끝태블릿을부분절단하는것을발견하여오른쪽태블릿을온전히보여주는right center정렬지시. 리드의내부탐색이유문구·청운재전용배지까지세가지최종재작업을실제Gemini4에지시.
- Gemini r2 exec83444/PID28864, 동일conversation10d8719d-be4a-496c-a00a-39c8ad444e5a, actualinit gemini-4-argon-medium 확인. 최종파일자체검토도요청. 아직커밋/push/배포없음.

## 최종 수정·검증·게시 착수 (2026-11-01 09:36:09 KST)

- Gemini r2 종료0 확인. 운영 목적 중심 리드/협력업체 포함 청운재 배지/광주 포스터 오른쪽 정렬3건을 실제 편집하고 파일 읽기 자체 검토 완료. 실제 Gemini 응답을 2026-11-01-home-case-navigation-gemini-review.md에 보존. Codex는 사이트 소스를 대필하지 않음.
- 실제 Claude 사후의 배지/원문 대조 조건을 Codex가 해소 확인. 실제 파일 대조와 최종 화면 육안 확인 완료. 오른쪽 태블릿은 세로 포스터 안에 전체 표시됨.
- 최종 브라우저 exec72561 종료0: 360px 휴대폰 터치 환경에서 세 상세·모음 네 버튼 실제 탭 모두 정확한 URL로 이동. 360/1440 최종 리드·배지·사진·가로넘침0·JS0, 포스터/클릭후iframe9:16 및 정확한 영상ID 재확인. 작은 문구/포스터 정렬 수정 영향만 검증했고, 390/768 레이아웃은 앞서 통과한 그대로임.
- 최종 SEO16표준라이브러리/Pillow 이미지 검사 및 diff --check 통과. 공통CSS/JS·요금·다른 두 사례·llms·sitemap 변경없음. 모든 메타/영상/구조화데이터가 기존 서비스 관계를 유지함.
- /simplify 스킬 미제공으로 직접 대체 검토: UI용26줄CSS·반복3개기사카드·기존일반세로플레이어클래스재사용, 추가JS/의존성/테스트코드없음. 단순한앵커와기존자산으로구성, 추가코드정리불필요.
- 다음 실행 의도: 이번9개 파일(소스2/기록6/기존IMPROVEMENTS)만 명시 stage·새커밋·push, 기존Vercel두프로젝트 자동배포/공개응답 확인. 확인전배포완료라하지않음. 기존미추적8개는보존/제외.

## 운영 배포·공개 검증·정리 완료 (2026-11-01 09:40:41 KST)

- 소스9개 새커밋 a0be9b00fe08ad727ca54287886fab5ae506f402 생성 및 origin/main push 성공. 기존 미추적8개 전부 제외. 리뷰 문서 EOF 여분 빈줄1개를 정리한 뒤 staged diff --check 통과.
- 기존 Vercel 자동배포 양쪽 success: pos-kr Production7466507554 https://pos-dvsgrgjcn-chuljongs-projects.vercel.app, cafe Production7466506807 https://pos-kr-cafe-4t3ucbyd5-chuljongs-projects.vercel.app. 카페코드수정없음.
- 공개 https://pos.kr/#case-studies 에 운영목적별3카드/개별사례보기3버튼/모든도입사례보기1버튼 반영. 기존영상그리드보다먼저노출됨. 광주 https://pos.kr/cases/kcci-gwangju 는세로9:16프레임과오른쪽태블릿을보여주는세로사진포스터로표시됨.
- 공개11개(홈·세사례·목록HTML5, CSS2, JS1, 사진3) HTTP200/리다이렉트없음/소스커밋바이트전부일치. cafe.pos.kr HTTP200 확인.
- 공개 실제브라우저360/1440에서홈카드·버튼·그리드/가로넘침0/JS0 및광주클릭전후9:16 재확인. 외부계정/영상설명/업로드/문의제출/사람에게발송은하지않음. 검증시GTM/GA와영상iframe외부요청을차단해실제영상전체시청검증과구분.
- 정리: 절대경로·파일목록10개·Git추적변경없음·원격미반영커밋0 확인 후 D:/tmp/pos-kr-home-cases-20261101의이번스크린샷8개/Gemini로그2개와폴더삭제, 부재확인. 포트52614소유PID26928을대조해이번로컬미리보기종료,리스너없음확인. 격리검증브라우저는정상종료했고영구프로필/새Orca탭/임시워크트리/DB/별도원격시험서버/일회용파일스크립트는만들지않음.
- 보존: 모든고객원본사진·영상·운영이미지(기존가로포스터포함),실제Gemini/Claude검토응답과업무기록,기존미추적8개(.claude/settings.json/HANDOFF.md/21인치PSD/GEO문서2개/이전작업기록3개). 남길진행중임시자료가없어cleanup/protected.txt등록대상없음.
- 요청한두UI개선/검토/검증/운영반영완료. 검색제목·canonical·구조화데이터·기존내용연결보존,새검색순위·AI추천반영을보장하거나이번UI검증으로확인했다고하지않음.
- 실제반영결과를문서전용후속커밋으로보존하고그push의자동배포까지확인한다. 소스추가수정은없음.
