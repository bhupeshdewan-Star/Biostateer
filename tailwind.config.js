/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f5f7ff",
          100: "#ebf0ff",
          200: "#d6e0ff",
          300: "#b3c7ff",
          400: "#80a2ff",
          500: "#4d75ff",
          600: "#1a40e6",
          700: "#0f2cb3",
          800: "#0b2080",
          900: "#07134d",
        }
      }
    },
  },
  plugins: [],
}
