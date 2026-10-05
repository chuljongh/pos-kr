# 3D 오브젝트 카탈로그 — 삼성월렛 이벤트 페이지

원본: `samsung.zip / 삼성월릿/*.jpg` 18장 (1.jpg~17.jpg, list.jpg)
참고 crop: `refs/obj-*.png`, `refs/scene-*.png`

> 색 근거: 코인 골드 `#E6A91A`와 아이소메트릭 블록 바이올렛 `#7F46F1`만 픽셀로 측정한 값이고, 이 표의 나머지 HEX는 눈으로 본 근사값 [추정]이다.

모든 오브젝트의 공통 문법: **둥근 모서리 + 두께감 있는 3D 렌더 + 부드러운 그림자 + 파스텔/브랜드색 배경 위에 떠 있음.** 평면 아이콘은 정보 영역(체크, 숫자 배지)에만 쓴다.

---

## 1. 반복 오브젝트 (재사용 우선순위 순)

| # | 오브젝트 | 형태·재질 | 색 | 등장 | crop |
|---|---|---|---|---|---|
| 1 | **P 포인트 코인** | 두꺼운 금화, 가장자리 홈 없음, 볼록한 **P 각인**(둥근 고딕), 테두리 링 | 골드 `#E6A91A` 하이라이트 `#FFD86A` | 거의 전 페이지 | `obj-card-coins-plus3.png` |
| 2 | **코인 탑** | P 코인 4~6개 적층, 앞에 1개 기울여 세움 | 골드 | 1, 16, 17 | 같음 |
| 3 | **머니·포인트 카드** | 두께 있는 둥근 사각 카드, 흰→노랑→블루→네이비 **세로 줄무늬 그라데이션**, 좌상단 "Samsung Wallet Money·Points" | 흰/`#F5C842`/`#3B5BFF`/`#0B1A3A` | 1, 16, 17 | 같음 |
| 4 | **입체 숫자/% 텍스트** | 압출된 두꺼운 숫자, 옆면 진한 색 | 노랑 면 + 오렌지 옆면(1), 블루 젤리(5), 크롬 핑크/퍼플(13) | 1, 5, 13 | 같음 |
| 5 | **스크래치 복권 티켓** | 크림색 둥근 티켓, 양옆 반원 노치, 회색 은박 긁힌 자국 사이로 P 코인 | 베이지 `#E8D3B8` 은박 `#8E8A88` | 6, list | `obj-scratch-ticket-hand.png` |
| 6 | **3D 손** | 짧고 통통한 손가락, 매트 피부, 손톱 표현 없음 | 피부 `#F6D3B8` | 6, 2(휴대폰 쥔 손) | 같음 |
| 7 | **물음표 + 이모지 코인** | 두꺼운 네이비 물음표, 웃는/우는 얼굴 코인(골드·실버) | 네이비 `#2A3A66` | 4 | `obj-question-coins.png` |
| 8 | **글로시 앱 아이콘 타일** | 둥근 사각 쿠션, 젤리·유리 광택, 기울어져 떠 있음 | 월렛 `#5B3DF5` 파트너 브랜드색 | 7, 12, list | `obj-app-icons-glossy.png` |
| 9 | **쿠폰 티켓** | 양옆 반원 노치 + 가운데 점선 분할 | 그라데이션(퍼플→하늘 / 핑크→레드) | 7, 11, 12, 13 | — |
| 10 | **열기구 + 선물상자** | 줄무늬 열기구에 리본 상자 매달림 | 핑크·파스텔 / 금색 리본 | 3, 13, list | — |
| 11 | **선물상자** | 크래프트·핑크·그린, 큰 리본 | 리본 레드/골드 | 13, 14 | — |
| 12 | **스마트폰 목업** | 갤럭시 실기기, 화면에 실제 월렛 UI | 실버/블랙 | 2, 10, 16, 17 | — |
| 13 | **아이소메트릭 블록 길** | 흰 상판 + 컬러 옆면, 옆면에 라벨 텍스트 | 바이올렛/마젠타/옐로 | 1 | `scene-hero-isometric.png` |
| 14 | **이동수단 미니어처** | KTX, 파란 시내버스 — 장난감 같은 축소 모델 | 실제 브랜드색 | 2, 17 | — |
| 15 | **컨페티** | 둥근 사각 조각 + 흰 점, 살짝 블러 | 파스텔 레드/블루/옐로/오렌지 | 1, 4, 13 | — |
| 16 | **반짝이(✦)** | 4각 별, 흰색 또는 브랜드색, 그림자 없음 | 흰/`#7F46F1` | 1, 5, 7, 12 | — |
| 17 | **STEP 스탬프 원** | 점선 원 테두리 + 둘레 텍스트 "SAMSUNG Wallet" + 안에 라인 아이콘 | 시안→블루→퍼플→핑크 순차 | 16 | — |

## 2. 계절·테마 배경 [관찰]

| 테마 | 구성 | 예 |
|---|---|---|
| 가을 | 단풍(빨강·주황·노랑)·은행잎, 펠트/양모 질감 잎 | 3, 6, 14 |
| 서울 | 남산타워·롯데타워·한옥 + 단풍 언덕 + 흰 길 | 3 |
| 여름 | 해변·야자수·서핑보드·튜브·파라솔 (실사 합성) | 16 |
| 축하 | 한복 문양 쿠션, 매듭 장식, 백자, 리본 배너 | 8 |
| 우주/프리미엄 | 보라 성운, 행성, 퍼플 P 코인 | 15 |

## 3. 정보 영역의 평면 요소 [관찰]

- **체크 원 아이콘**: 채운 원 + 흰 체크. 행 색과 맞춤(블루 / 레드-오렌지 / 그린) — 3.jpg
- **번호 원**: 검정 채운 원 + 흰 숫자(9.jpg), 또는 블루/시안 채운 원(2.jpg)
- **알약 배지**: `혜택 1`, `이벤트 기간` 등 — 채운 알약(브랜드색) 또는 외곽선 알약
- **잘린 모서리 탭 라벨**: 검정 사다리꼴 `혜택 1` (7.jpg)

## 4. 신규 오브젝트 생성 프롬프트 템플릿

```
3D rendered icon of {OBJECT}, soft rounded edges, thick extruded form,
matte-to-satin plastic material, soft studio lighting from top-left,
subtle contact shadow, floating slightly tilted, pastel {BG_COLOR} background,
Korean fintech app promotion style, clean, high detail, no text
```

pos.kr용 예시 `{OBJECT}`:
- `a white tablet POS terminal on a small stand with a receipt printer`
- `a gold coin with an embossed letter P, stacked in a small tower of five`
- `a meal ticket coupon with semicircle notches on both sides and dashed divider`
- `a kiosk with a large touchscreen, rounded toy-like proportions`
- `a smartphone showing a QR code, held by a chubby 3D cartoon hand`
