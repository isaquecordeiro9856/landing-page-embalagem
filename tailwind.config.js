/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kraft: {
          50: '#f7f1e6',
          100: '#efe3cc',
          200: '#ddc79c',
          300: '#c7a86c',
        },
        ink: {
          900: '#141210',
          800: '#1d1a17',
          700: '#2a2622',
        },
        stamp: {
          DEFAULT: '#c8401d',
          light: '#e05a34',
        },
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
