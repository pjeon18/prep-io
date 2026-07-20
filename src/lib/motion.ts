import type { Transition } from "framer-motion";

/* Motion tokens — all animation uses these named presets, no ad-hoc easing.
 * Loud thresholds (hot-seat promotion, going live), calm baseline. */

export const springs: Record<string, Transition> = {
  snap: { type: "spring", stiffness: 500, damping: 32 },
  standard: { type: "spring", stiffness: 300, damping: 28 },
  calm: { type: "spring", stiffness: 180, damping: 24 },
  gentle: { type: "spring", stiffness: 110, damping: 20 },
};

export const durations = {
  fast: 0.14,
  base: 0.24,
  slow: 0.5,
  arrival: 0.8,
};

export const press = { scale: 0.97 };

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const stagger = (i: number, step = 0.05) => ({ delay: i * step });
