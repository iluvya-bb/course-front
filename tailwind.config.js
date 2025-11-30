import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // In Tailwind v4, theme customization is done in CSS using @theme
  // This config file is mainly for content paths and plugins
  plugins: [typography],
};
