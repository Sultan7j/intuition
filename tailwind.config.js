/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E26",
        panel: "#161A3E",
        panelSoft: "#1C2150",
        brandGold: "#FFD56B",
        team1: "#FF8A3D",
        team2: "#36D6F2",
      },
      fontFamily: {
        display: ["Changa", "sans-serif"],
        body: ["Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
};
