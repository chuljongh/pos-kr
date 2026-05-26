/* ============================================================================
   pos.kr Tailwind 테마 — PAYCO 기업복지 디자인 시스템 차용판
   ----------------------------------------------------------------------------
   브랜드색을 PAYCO 레드(#FF2233)로 채택. 기존 마크업이 쓰는 theme 토큰
   (primary / primary-darker / accent)을 그대로 두고 값만 교체하므로,
   재빌드만 하면 사이트 전체 브랜드색이 한 번에 바뀝니다.

   적용법 (Tailwind v3.4 기준):
   1) cafe/tailwind.config.js (및 hamba 빌드 config)의 theme.extend 를 아래로 교체
   2) 빌드 재실행:  npx tailwindcss -i <input>.css -o <output>.css --minify
      - 루트 사이트는 /hamba/output.css 를 로드하므로 hamba 빌드 산출물 갱신 필요
   3) 하드코딩 블루 클래스 교체 (DESIGN.md "마이그레이션 체크리스트" 참조)
   ============================================================================ */

module.exports = {
  theme: {
    extend: {
      colors: {
        // 브랜드 — PAYCO 레드. 기존 'primary'(blue #2563EB)를 대체.
        primary: {
          DEFAULT: '#FF2233',   // [PAYCO 추출] CTA·강조·핵심 수치·브랜드
          darker: '#E01E2C',    // [추정] hover/pressed
          light: '#FFF0F1',     // [추정] 옅은 레드 배경(뱃지/하이라이트 면)
        },
        // 보조 — PAYCO 인포 블루. 기존 emerald accent 대신 링크/정보용으로 권장.
        accent: {
          DEFAULT: '#00AAFF',   // [PAYCO 추출] 인라인 링크/정보 강조
          btn: '#328CFF',       // [PAYCO 추출] 아웃라인 보조 버튼
        },
        // 중립 그레이 램프 — PAYCO 실측값. 기존 Tailwind gray 위에 의미 토큰으로 추가.
        ink: {
          DEFAULT: '#111111',   // 제목/강조 본문
          body: '#4C4C4C',      // 본문
          soft: '#666666',      // 보조
          muted: '#999999',     // 비활성/플레이스홀더
        },
        surface: {
          DEFAULT: '#FFFFFF',   // 페이지 기본
          subtle: '#FAFAFA',    // 옅은 카드 배경
          muted: '#F2F2F2',     // 구분 배경
          dark: '#262626',      // 다크 섹션
        },
        line: {
          DEFAULT: '#DADADA',   // 기본 보더
          light: '#EEEEEE',     // 옅은 구분선
        },
      },

      // Pretendard 우선. 사이트는 이미 Pretendard CDN을 로드 중이나 Tailwind
      // fontFamily 미설정 상태 → 아래로 본문 폰트를 Pretendard로 고정.
      fontFamily: {
        sans: ['Pretendard', '"Noto Sans KR"', 'system-ui', 'sans-serif'],
      },

      // PAYCO 음수 자간 (한국어 가독 관행)
      letterSpacing: {
        tightk: '-0.04em',   // 제목
        basek: '-0.025em',   // 본문
      },

      // PAYCO radius 스케일
      borderRadius: {
        card: '12px',  // 큰 카드/모달
        btn: '4px',    // 버튼/인풋
      },

      // PAYCO 부드러운 그림자 (큰 blur + 낮은 알파)
      boxShadow: {
        card: '0 16px 12px 0 rgba(0,0,0,0.08)',
        'card-lg': '0 30px 20px 0 rgba(0,0,0,0.08)',
      },
    },
  },
};

/* ----------------------------------------------------------------------------
   최소 변경만 원할 경우 — 기존 config의 colors 에 이 한 줄만 바꿔도 됨:
     primary: { DEFAULT: '#FF2233', darker: '#E01E2C' }
   이러면 text-primary / bg-primary / hover:bg-primary-darker 가 전부 레드로 전환.
   ---------------------------------------------------------------------------- */
