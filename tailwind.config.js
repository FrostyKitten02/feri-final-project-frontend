/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg_placeholder1: '#CEEAF7',
        bg_placeholder2: '#A288E3',
      },
    },
  },
  plugins: [],
}

