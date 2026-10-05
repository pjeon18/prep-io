// Absolute globs: Tailwind resolves content relative to the process cwd otherwise.
const dir = decodeURIComponent(new URL(".", import.meta.url).pathname);

/** @type {import('tailwindcss').Config} */
export default {
  content: [`${dir}index.html`, `${dir}launch/**/*.{html,ts,tsx}`, `${dir}src/**/*.{ts,tsx}`],
  theme: {
    extend: {
      colors: {
        page: "#fbfaf6",
        line: "#e8e5dd",
        ink: { DEFAULT: "#0e1c15", 2: "#47544c", 3: "#75807a" },
        brand: { DEFAULT: "#0f5c3b", ink: "#0a4a2f", soft: "#e6f1ea", mint: "#9fd8b5" },
        live: "#e5484d",
        ok: "#0f5c3b",
      },
      fontFamily: {
        sans: ['"Figtree Variable"', "-apple-system", '"Segoe UI"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        lift: "0 1px 2px rgba(14,28,21,.05), 0 12px 32px -12px rgba(14,28,21,.18)",
        stage: "0 30px 60px -30px rgba(14,28,21,.35)",
      },
      borderRadius: { stage: "24px" },
    },
  },
  plugins: [],
};
