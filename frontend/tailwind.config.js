/** @type {import('tailwindcss').Config} */
module.exports = {
  // Configured content paths to match our source structure inside src/
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF7A00",
          dark: "#E06B00",
        },
        secondary: {
          DEFAULT: "#1F0F08",
          dark: "#0F0704",
        },
        cream: "#FAF8F5",
        success: {
          bg: "#E8F5E9",
          text: "#2E7D32",
          border: "#4CAF50",
        },
        danger: {
          bg: "#FFEBEE",
          text: "#C62828",
          border: "#E53935",
        },
        warning: {
          bg: "#FFFDE7",
          text: "#F57F17",
          border: "#FBC02D",
        },
        occupy: "#B0BEC5",
        special: {
          bg: "#E1F5FE",
          text: "#0288D1",
          border: "#29B6F6",
        },
        neon: {
          bg: "#FCE4EC",
          text: "#C2185B",
          border: "#E040FB",
        }
      }
    },
  },
  plugins: [],
}
