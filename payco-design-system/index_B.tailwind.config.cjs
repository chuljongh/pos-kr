/* index_B.html 전용 빌드 config — PAYCO 레드 차용판.
   실행(레포 루트에서):
     cafe/node_modules/.bin/tailwindcss \
       -c payco-design-system/index_B.tailwind.config.cjs \
       -i payco-design-system/index_B.input.css \
       -o css/index_B.css --minify
*/
module.exports = {
  content: ['./index.html', './js/main.js'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF2233', darker: '#E01E2C', light: '#FFF0F1' }, // blue → PAYCO red
        accent: '#10B981',  // 기존 emerald 유지 (대량 변경 회피)
        ink:     { DEFAULT: '#111111', body: '#4C4C4C', soft: '#666666', muted: '#999999' },
        surface: { DEFAULT: '#FFFFFF', subtle: '#FAFAFA', muted: '#F2F2F2', dark: '#262626' },
        line:    { DEFAULT: '#DADADA', light: '#EEEEEE' },
      },
      fontFamily: { sans: ['Pretendard', '"Noto Sans KR"', 'system-ui', 'sans-serif'] },
      letterSpacing: { tightk: '-0.04em', basek: '-0.025em' },
      borderRadius: { card: '12px', btn: '4px' },
      boxShadow: { card: '0 16px 12px 0 rgba(0,0,0,0.08)', 'card-lg': '0 30px 20px 0 rgba(0,0,0,0.08)' },
    },
  },
  plugins: [],
};
