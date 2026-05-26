/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/main.js"],
  theme: {
    extend: {
      colors: {
        // PAYCO 레드 브랜드 (메인 페이지와 동일)
        primary: { DEFAULT: '#FF2233', darker: '#E01E2C', light: '#FFF0F1' },
      },
    },
  },
  plugins: [],
}