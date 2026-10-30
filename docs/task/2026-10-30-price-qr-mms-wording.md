# 요금·안내 문구 정정 — QR 스캐너 플랜 구분 삭제, 키오스크 기종, 그림 문자 비용 (2026-10-30)

- 작업: Claude (세션 9b356c8c), 사용자 지시 "수정해·커밋·배포해"
- 연계: Giftcoin 저장소 신청서·계약서 개정안(`docs/tasks/TASK_20261030_002_...`)과 같은 문구로 맞춤

## 변경

| 커밋 | 파일 | 내용 |
|---|---|---|
| d20a71b | price.html, index.html, llms.txt, guide/compare-systems.html, guide/hamba-meal-count.html, guide/vs-meal-voucher-apps.html | QR 스캐너 안내에서 "Pro·Plus·Enterprise에서는", "Super는 별도 QR 리더 기기가 필요 없는 플랜" 삭제 → "사용하지 않는 스마트폰이나 태블릿을 QR 스캐너로 활용해 보세요."(전 플랜 사용 가능). price 키오스크 주석 "그 외 기종은 연동되지 않습니다" → "순차 확대 예정입니다" |
| f9028d0 | price.html | 그림 문자 비용 Super "—" → "별도"(선불카드 MMS 발송 시 비용 발생, ○는 기능 가능 의미 유지). 주석 "포함(포함)", "별도 청구(별도)" 중복 괄호 삭제 |

## 검증

- 두 커밋 모두 GitHub 상태 Vercel pos-kr·pos-kr-cafe success.
- 공개 price, /, llms.txt, guide 3개를 받아 커밋 원문과 바이트 일치. 옛 문구 공개본 0건.
- 가이드의 "Pro는 MMS 비용 별도"는 그림문자 QR 카드(Pro 이상) 설명이라 유지.
