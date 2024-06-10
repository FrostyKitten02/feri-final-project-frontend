/** @type {{plugin(): {handler: () => void}; content({base}?: Content): string}} */

const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        bg_placeholder1: '#CEEAF7',
        bg_placeholder2: '#A288E3',
        primary: '#1A426B',
        secondary: '#EF476F',
        light_pink: '#fca5a5',
        yellow: '#FFD166',
        green: '#06D6A0',
        border: '',
        placeholder: '#a0aec0',
        muted: '#718096'
      },
      fontFamily: {

      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}

