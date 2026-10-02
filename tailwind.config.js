/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // dark: folgt der App-Einstellung (html[data-theme], gesetzt aus Hell/Dunkel/
  // Automatisch) — wie index.css. Vorher 'media': mit „Hell" auf einem dunkel
  // eingestellten Gerät griffen die dark:-Klassen trotzdem (verwaschene Karten).
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
};
