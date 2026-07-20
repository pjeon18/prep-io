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
        "prep-amber": "var(--prep-amber)",
        "prep-amber-soft": "var(--prep-amber-soft)",
        "prep-amber-tint": "var(--prep-amber-tint)",
        "prep-verified": "var(--prep-verified)",
        "prep-danger": "var(--prep-danger)",
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        tile: "14px",
        pill: "99px",
      },
    },
  },
  plugins: [],
};
