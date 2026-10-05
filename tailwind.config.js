// Absolute globs: Tailwind resolves content relative to the process cwd otherwise.
const dir = decodeURIComponent(new URL(".", import.meta.url).pathname);

/** @type {import('tailwindcss').Config} */
export default {
  content: [`${dir}index.html`, `${dir}launch/**/*.{html,ts,tsx}`, `${dir}src/**/*.{ts,tsx}`],
  theme: {
    extend: {
      colors: {
        page: "#f4f2ee",
        line: "#e3e0da",
        ink: { DEFAULT: "#1d1d1f", 2: "#56565a", 3: "#8a8a8e" },
        brand: { DEFAULT: "#1f5bff", ink: "#1748d1", soft: "#e9efff" },
        sun: "#ffb61e",
        live: "#e5484d",
        ok: "#12a06a",
      },
      fontFamily: {
        sans: ['"Figtree Variable"', "-apple-system", '"Segoe UI"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        lift: "0 1px 2px rgba(0,0,0,.04), 0 8px 24px -8px rgba(0,0,0,.12)",
      },
    },
  },
  plugins: [],
};
