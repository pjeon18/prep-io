/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "prep-bg": "var(--prep-bg)",
        "prep-surface": "var(--prep-surface)",
        "prep-surface-2": "var(--prep-surface-2)",
        "prep-line": "var(--prep-line)",
        "prep-text": "var(--prep-text)",
        "prep-text-2": "var(--prep-text-2)",
        "prep-text-3": "var(--prep-text-3)",
        "prep-live": "var(--prep-live)",
        "prep-verified": "var(--prep-verified)",
        "prep-danger": "var(--prep-danger)",
      },
      fontFamily: {
        display: ["Newsreader", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        tile: "10px",
        pill: "99px",
      },
    },
  },
  plugins: [],
};
