/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00F6FF",
        secondary: "#FF2BC4",
        accent: "#2BFF88",
        neutral: "#F3F4F6",
        "base-100": "#FFFFFF",
        "base-content": "#1A1A1A",
        info: "#2B94FF",
        success: "#2BFF88",
        warning: "#F8FF2B",
        error: "#FF2B2B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
