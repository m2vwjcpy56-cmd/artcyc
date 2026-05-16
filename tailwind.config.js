/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Folgt automatisch der System-Einstellung (prefers-color-scheme).
  // Dark-Mode-Styling läuft primär über index.css mit
  // @media (prefers-color-scheme: dark) Overrides der Tailwind-Klassen.
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
};
