/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pulled from the crimson of the hero video so the accent ties back to it.
        accent: {
          DEFAULT: "#e02435",
          soft: "#ff5566",
        },
      },
      fontFamily: {
        podium: ['"FSP DEMO - PODIUM Sharp 4.11"', "Impact", '"Arial Black"', "sans-serif"],
        inter: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
