
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0052CC",
        secondary: "#172B4D",

        todo: "#94A3B8",
        inprogress: "#3B82F6",
        review: "#F59E0B",
        done: "#22C55E",
        blocked: "#EF4444",

        mainBg: "#F8FAFC",
        cardBg: "#FFFFFF",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },

  plugins: [],
};
