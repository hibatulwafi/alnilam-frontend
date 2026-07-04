/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EEF4FA',
          100: '#D4E3F2',
          200: '#A9C7E5',
          300: '#7EABD8',
          400: '#548FCB',
          500: '#2973BE',
          600: '#155A9C',
          700: '#0F4C81',
          800: '#0A3E66',
          900: '#062E4B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
