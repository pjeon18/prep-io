import { AnimatePresence, motion } from "framer-motion";
import { springs } from "../../lib/motion";
import { resolveTheme, usePrepStore } from "../../store/usePrepStore";
import { Pressable } from "./Pressable";

/* Theme toggle: the sun/moon swap rotates and scales through each other
 * rather than cross-fading, so the control reads as one object changing
 * state instead of two icons trading places. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = usePrepStore((s) => s.theme);
  const toggleTheme = usePrepStore((s) => s.toggleTheme);
  const dark = resolveTheme(theme) === "dark";

  return (
    <Pressable
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
      className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ color: "var(--prep-text-2)" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ rotate: -75, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 75, scale: 0.4, opacity: 0 }}
          transition={springs.snap}
          className="absolute inline-flex"
        >
          {dark ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      </AnimatePresence>
    </Pressable>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function SunIcon() {
  return (
    <svg width={19} height={19} viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v2.2M12 18.8V21M4.5 4.5l1.6 1.6M17.9 17.9l1.6 1.6M3 12h2.2M18.8 12H21M4.5 19.5l1.6-1.6M17.9 6.1l1.6-1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width={19} height={19} viewBox="0 0 24 24" {...stroke}>
      <path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z" />
    </svg>
  );
}
