/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0B1220",
          800: "#111C33",
          700: "#1B2B4A",
          600: "#28406B",
        },
        gold: {
          500: "#CA8A04",
          400: "#D9A520",
          300: "#E9C46A",
          100: "#FDF3D9",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};