# pos.kr Design Guide — PAYCO 기업복지 디자인 차용판

> **목적**: PAYCO 기업복지(bizplus.payco.com + 소개서 PDF)의 검증된 디자인 시스템을 **pos.kr(모바일 QR 식수관리)**에 적용하기 위한 가이드.
> **브랜드 결정**: 브랜드색을 **PAYCO 레드 `#FF2233`로 채택**.
> 토큰 원본 분석은 [`DESIGN.md`](./DESIGN.md), 드롭인 테마는 [`tailwind.theme.cjs`](./tailwind.theme.cjs), 적용 데모는 [`sample-hero.html`](./sample-hero.html).

> ⚠️ **유의**: PAYCO와 동일 식권/식수관리 도메인에서 동일 브랜드 레드를 쓰면 비주얼이 유사해집니다. "PAYCO 대안" 포지셔닝 의도라면 적합하나, 차별화가 필요해지면 브랜드 레드만 교체하고 나머지 시스템은 유지하세요.

---

## 1. 현재 → 목표 매핑

| 항목 | 현재 pos.kr | 목표 (PAYCO 차용) |
|---|---|---|
| 브랜드색 | `primary` = blue `#2563EB` | `primary` = **red `#FF2233`** |
| 보조색 | `accent` = emerald `#10B981` | `accent` = info blue `#00AAFF` |
| 강조 하이라이트 | `text-blue-400`, `text-yellow-300` (하드코딩) | `text-primary` (red) 로 통일 |
| 배경 톤 | 다크 그레이(gray-800/900) 비중 큼 | **화이트 캔버스 + 레드 1포인트** 비중↑ |
| 폰트 | Pretendard 로드되나 Tailwind 미연결 | `fontFamily.sans = Pretendard` 고정 |
| 그림자 | `shadow-lg/xl/2xl` (강한 그림자) | `shadow-card` (부드러운 큰 blur) |

> 핵심 이점: pos.kr 마크업이 이미 `primary`/`accent` 테마 토큰을 사용 → **config 값만 바꾸고 재빌드하면 전역 전환**.

---

## 2. 디자인 원칙 (PAYCO에서 차용)

1. **화이트 캔버스 + 1포인트 레드.** 빨강은 CTA·핵심 수치·브랜드 마크에만. 면적의 대부분은 화이트/연그레이.
   - pos.kr은 현재 다크 섹션이 많음 → 핵심 정보 섹션(특징/혜택/수치)은 화이트 배경으로 전환 권장.
2. **B2B 신뢰 톤.** 장식 최소, 정보 위계·가독성 우선.
3. **카드 + 아이콘 + 굵은 수치** 모듈 반복으로 스캔성 확보.
4. **레드 stat 카드** = 가장 강한 시그니처. "0원 / 0% / 1분" 같은 핵심 수치를 레드 카드 위 흰 대형 숫자로.

---

## 3. 색상 토큰

### 3.1 Brand / Accent
| 토큰 (Tailwind) | 값 | 용도 |
|---|---|---|
| `primary` | `#FF2233` | CTA·강조·핵심 수치·브랜드 |
| `primary-darker` | `#E01E2C` | hover/pressed |
| `primary-light` | `#FFF0F1` | 옅은 레드 배경(뱃지/하이라이트) |
| `accent` | `#00AAFF` | 인라인 링크·정보 |
| `accent-btn` | `#328CFF` | 아웃라인 보조 버튼 |

### 3.2 중립 (의미 토큰)
| 토큰 | 값 | 용도 |
|---|---|---|
| `ink` | `#111111` | 제목/강조 |
| `ink-body` | `#4C4C4C` | 본문 |
| `ink-soft` | `#666666` | 보조 |
| `ink-muted` | `#999999` | 비활성 |
| `surface` | `#FFFFFF` | 페이지 |
| `surface-subtle` | `#FAFAFA` | 옅은 카드 |
| `surface-muted` | `#F2F2F2` | 구분 배경 |
| `surface-dark` | `#262626` | 다크 섹션 |
| `line` | `#DADADA` | 보더 |

---

## 4. 타이포그래피

- **폰트**: `fontFamily.sans = ['Pretendard', '"Noto Sans KR"', ...]` 로 고정. (현재 로드만 되고 적용 안 됨 → config 연결 필요)
- **자간**: 제목 `tracking-tightk`(-0.04em), 본문 `tracking-basek`(-0.025em).
- **타입 스케일**: 기존 Tailwind 스케일(text-5xl 등) 유지. PAYCO도 동일하게 큰 굵은 제목(700/800) + 14px 기준 본문 사용.
- 핵심 수치는 `font-extrabold` + `text-primary`.

---

## 5. 컴포넌트 스펙

### 5.1 Primary CTA (레드 채움)
```html
<a class="inline-flex items-center justify-center px-8 py-4 rounded-btn
          bg-primary hover:bg-primary-darker text-white font-bold
          tracking-basek transition-colors">상담 신청</a>
```

### 5.2 Secondary 버튼 (블루 아웃라인) — PAYCO `.btn_blue`
```html
<a class="inline-flex items-center px-6 py-3 rounded-btn font-bold
          border border-accent-btn text-accent-btn bg-[rgba(50,140,255,0.08)]">
  자세히 보기</a>
```

### 5.3 Card
```html
<div class="bg-surface rounded-card shadow-card p-8"> … </div>
<!-- 옅은형 -->
<div class="bg-surface-subtle border border-line rounded-card p-8"> … </div>
```

### 5.4 Stat block (시그니처 — 레드 카드 위 흰 수치)
```html
<div class="bg-primary rounded-card px-8 py-7 text-white text-center">
  <div class="text-5xl font-extrabold tracking-tightk leading-none">0<span class="text-3xl">원</span></div>
  <p class="mt-2 text-sm opacity-90">카드·리더기·PC 구입비</p>
</div>
```
> pos.kr의 "0원 / 0% / 1분" 섹션이 이 패턴의 최적 적용처.

### 5.5 Inline link point (블루 밑줄) — PAYCO `.txt_point2`
```html
<a class="border-b border-accent text-accent font-bold hover:border-accent-hover hover:text-accent-hover">…</a>
```

---

## 6. 마이그레이션 체크리스트 (index.html)

config 교체·재빌드 후, **하드코딩된 색 클래스**만 아래로 치환:

| 찾기 | 바꾸기 | 위치 예 |
|---|---|---|
| `text-blue-400` | `text-primary` | 히어로 `식수관리시스템` 강조 (L135) |
| `hover:bg-blue-800` | `hover:bg-primary-darker` | CTA 버튼 |
| `focus:ring-blue-300` | `focus:ring-primary/40` | 폼/버튼 포커스 |
| `text-yellow-300` | `text-primary` | 고통지점 강조 (L151) |
| `bg-blue-100` / `border-blue-200` | `bg-primary-light` / `border-primary/20` | 뱃지 |
| `bg-accent`(emerald) | 유지 또는 `bg-primary` | 보조 CTA 검토 |

추가 권장:
- `shadow-lg/xl` → `shadow-card` (정보 카드에 한해 부드럽게)
- 핵심 수치 섹션(L173~196)을 **레드 stat 카드**로 승격 → §5.4

---

## 7. 단계별 적용 순서

1. `tailwind.theme.cjs`의 `theme.extend`를 빌드 config에 반영 → **재빌드**. ✅ 검증: `text-primary`가 레드로 렌더.
2. §6 표대로 하드코딩 블루/옐로 치환. ✅ 검증: 페이지에 블루 잔여 없음(폼 포커스 포함).
3. 핵심 수치 섹션을 레드 stat 카드로 교체. ✅ 검증: 시그니처 패턴 노출.
4. (선택) 정보 섹션 다크→화이트 캔버스 전환으로 1포인트 레드 대비 강화.

> 데모: [`sample-hero.html`](./sample-hero.html) 을 브라우저로 열면 실제 히어로+수치 섹션의 **Before/After**를 즉시 확인할 수 있습니다(Tailwind CDN으로 즉시 렌더, 재빌드 불필요).
