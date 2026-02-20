/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aetheris-gold': '#C9A050',
        'aetheris-night': '#0A1321',
        'aetheris-navy': '#193452',
        'aetheris-steel': '#2F6792',
        'aetheris-emerald': '#0E765E',
        'aetheris-crimson': '#AF2D2D',
        'aetheris-slate': '#B8C1CC',
      },
    },
  },
  plugins: [],
}
