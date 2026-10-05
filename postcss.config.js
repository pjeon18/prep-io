import { fileURLToPath } from "node:url";

// Explicit config path so Tailwind works no matter which directory the dev server is started from.
export default {
  plugins: {
    tailwindcss: { config: fileURLToPath(new URL("./tailwind.config.js", import.meta.url)) },
    autoprefixer: {},
  },
};
