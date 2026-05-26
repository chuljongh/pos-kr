# PAYCO 기업복지 — Design System

> 출처: **bizplus.payco.com** 라이브 CSS(`payco_point.css` 외 19만 자) 정밀 추출 + **PAYCO 기업복지 서비스 소개서 PDF**(43p) 시각 분석.
> 구현 토큰은 같은 폴더의 [`design-tokens.css`](./design-tokens.css) 참조.

값 신뢰도 표기 — `[추출]` 실제 서빙 CSS에서 그대로 / `[정리]` 추출값을 스케일로 정규화 / `[추정]` 시각·PDF 보강.

---

## 1. 디자인 원칙

PAYCO 기업복지의 비주얼은 한 문장으로 **"화이트 캔버스 + 1포인트 레드"** 입니다.

- **레드를 아껴 쓴다.** 빨강은 CTA·핵심 수치·브랜드 마크에만. 면적의 90%는 화이트/그레이.
- **B2B 신뢰 톤.** HR·경영진 대상. 장식 최소, 정보 위계와 가독성 우선.
- **카드 + 아이콘 + 굵은 수치**의 반복. 스캔 가능한 모듈로 정보를 분해.
- **제품 모킹업 일관성.** 빨간 식권 카드 UI를 전 매체에서 동일하게 노출해 인지 강화.

---

## 2. 색상 (Color)

### 2.1 Brand
| 토큰 | 값 | 용도 |
|---|---|---|
| `--payco-red` | `#FF2233` `[추출 x55]` | 주 브랜드색 · CTA · 강조 수치 · 로고 |
| `--payco-red-strong` | `#E51E2E` `[추정]` | hover/pressed |

> PDF 클로징 페이지는 렌더링/압축으로 `#F92828`로 보였으나, **정본 토큰은 웹 CSS의 `#FF2233`** 입니다.

### 2.2 Accent (보조 — 링크/정보/세컨더리)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--accent-blue` | `#00AAFF` `[추출]` | 인라인 링크 강조 |
| `--accent-blue-btn` | `#328CFF` `[추출]` | 아웃라인 버튼 |
| `--accent-blue-point` | `#4A88FF` `[추출]` | 포인트 텍스트 |
| `--accent-blue-hover` | `#3D89E2` `[추출]` | 링크 hover |

### 2.3 Text · Surface · Border (그레이 램프)
| 역할 | 토큰 | 값 |
|---|---|---|
| 제목/강조 | `--text-primary` | `#111111` `[추출]` |
| 본문 | `--text-body` | `#4C4C4C` `[추출 x29]` |
| 보조 | `--text-secondary` | `#666666` `[추출]` |
| 비활성/플레이스홀더 | `--text-muted` | `#999999` `[추출]` |
| 페이지 배경 | `--surface-page` | `#FFFFFF` |
| 옅은 카드 배경 | `--surface-subtle` | `#FAFAFA` `[추출 x21]` |
| 구분 배경 | `--surface-muted` | `#F2F2F2` `[추출]` |
| 다크 섹션 | `--surface-dark` | `#262626` `[추출]` |
| 기본 보더 | `--border-default` | `#DADADA` `[추출 x15]` |
| 옅은 구분선 | `--border-light` | `#EEEEEE` `[추출]` |

> 그레이는 거의 무채색(warm 미세 톤 `#666463` 포함). 정보 종류 구분은 **색이 아니라 아이콘**에 의존 — 색상 코딩은 없음.

---

## 3. 타이포그래피 (Typography)

### 3.1 Font family
```
현행 (legacy)
  -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo",
  "Noto Sans KR"(noto/notoB/notoM), dotum, sans-serif   [추출]

신규 도입 중 — 향후 표준 권장
  "Pretendard", "Noto Sans KR", sans-serif               [추출]
```
- `noto` = Noto Sans KR Regular, `notoB` = Bold(700), `notoM` = Medium(500).
- 신규 섹션은 **Pretendard**로 이행 중. 신규 작업은 `--font-sans-modern` 권장.

### 3.2 Type scale `[추출]`
| 토큰 | px | 역할 |
|---|---|---|
| `--fs-display` | 60 | 히어로 타이틀 |
| `--fs-h1` | 30 | 페이지 제목 |
| `--fs-h2` | 24 | 섹션 제목 |
| `--fs-h3` | 20 | 서브 제목 |
| `--fs-lg` | 18 | 강조 본문 |
| `--fs-md` | 16 | 큰 본문 |
| `--fs-base` | 14 | **본문 기준** |
| `--fs-sm` | 13 | 보조 |
| `--fs-xs` | 12 | 캡션/모바일 본문 `[최다 사용]` |
| `--fs-2xs` | 11 | 미세 텍스트 |

### 3.3 Weight / Line-height / Letter-spacing
- Weight: `300 / 400 / 500 / 700` `[추출]`. 제목·핵심 수치는 700.
- Line-height: 제목 `1.2`, 본문 `1.5`(14→20, 16→24 패턴) `[추출]`.
- Letter-spacing: **음수 자간** — 제목 `-0.04em`, 본문 `~-0.025em` `[추출]`. 한국어 웹 가독 관행.

---

## 4. 간격 · 모서리 · 그림자

### 4.1 Spacing `[정리]`
원본은 **10px 중심**(10/20/30/40)이 가장 많음. 일관성을 위해 4px 그리드로 정리하되 원본 최빈값을 포함.
```
4 · 8 · 10 · 16 · 20 · 24 · 30 · 40 · 60 (px)
--space-1 … --space-10
```
카드 패딩 `40px`, 섹션 내 gap `30px`가 대표값.

### 4.2 Radius `[추출]`
| 토큰 | px | 용도 |
|---|---|---|
| `--radius-sm` | 4 | 버튼 · 인풋 |
| `--radius-md` | 8 | 카드 |
| `--radius-lg` | 12 | 큰 카드 · 모달 |
| `--radius-pill` | 40 | 알약형 버튼/뱃지 |
| `--radius-full` | 50% | 원형(아이콘 배경 등) |

### 4.3 Shadow `[추출]`
| 토큰 | 값 |
|---|---|
| `--shadow-sm` | `0 1px 1px 0 rgba(0,0,0,.05)` |
| `--shadow-card` | `0 16px 12px 0 rgba(0,0,0,.08)` |
| `--shadow-lg` | `0 30px 20px 0 rgba(0,0,0,.08)` |

> 큰 blur + 낮은 알파의 **부드러운 그림자**. 경계가 강한 그림자는 쓰지 않음.

---

## 5. 컴포넌트 (Component specs)

### 5.1 Primary CTA `.payco-btn-primary` `[추정]`
레드 채움 + 흰 굵은 텍스트. height 48, radius 4, padding 좌우 24.
사이트의 주요 행동 유도(소개서 보기/문의하기) 기준.

### 5.2 Secondary button `.payco-btn-secondary` `[추출]`
사이트 `.btn_blue` 그대로: `border:1px solid #328CFF · background:rgba(50,140,255,.08) · color:#328CFF · font-weight:700`.

### 5.3 Card `.payco-card`
- 기본형: `bg #FFF · radius 8 · shadow-card · padding 40`.
- 옅은형 `--subtle`: `bg #FAFAFA · border 1px #DADADA · 그림자 없음`.

### 5.4 Stat block `.payco-stat` (시그니처 패턴)
**레드 카드 위 흰색 대형 수치** — PDF 도입부(2,500개 / 410,000명 / 9,100억)와 웹 소셜프루프에서 반복되는 가장 강한 비주얼 시그니처. value는 `fs-h1 / 700 / 음수 자간`.

### 5.5 Inline link point `.payco-link-point` `[추출]`
`.txt_point2`: 블루 밑줄 + `#00AAFF` + 700. hover 시 `#3D89E2`.

---

## 6. 매체 간 일관성 (Web ↔ PDF)

웹사이트는 사실상 **PDF 소개서의 인터랙티브 버전**입니다.

| 항목 | 웹 | PDF | 일치 |
|---|---|---|---|
| 브랜드 레드 | `#FF2233` | 동일 계열(렌더 `#F92828`) | ✅ |
| 1포인트 레드 전략 | ✅ | ✅ | ✅ |
| 카드+아이콘+굵은수치 | ✅ | ✅ | ✅ |
| 콘텐츠 순서 | 식권→포인트→상품권 | 동일 | ✅ |
| 제품 모킹업 | 빨간 식권 카드 | 동일 UI | ✅ |
| 폰트 | Noto/Pretendard | Noto 계열 | ✅ |

---

## 7. 관찰 / 개선 여지

- **색상 코딩 부재**: 식권/포인트/상품권 구분이 아이콘에만 의존. 서비스별 보조 색을 도입하면 스캔성↑ (단, 1포인트 전략과 트레이드오프).
- **폰트 이행 중**: 레거시(Noto) + 신규(Pretendard) 혼재. 신규 작업은 Pretendard로 통일 권장.
- **간격 불규칙**: 10/13/23px 등 비그리드 값 산재. 4px 그리드로 수렴 권장(본 토큰이 그 출발점).

---

### 토큰 빠른 적용
```html
<link rel="stylesheet" href="payco-design-system/design-tokens.css">
<button class="payco-btn-primary">소개서 보기</button>
<div class="payco-card"> … </div>
```
