import type { Transition } from "framer-motion";

/* Named presets only. Springs for what the user caused. */
export const spring = {
  snap: { type: "spring", stiffness: 700, damping: 40, mass: 0.6 },
  ui: { type: "spring", stiffness: 420, damping: 36 },
  glide: { type: "spring", stiffness: 200, damping: 30 },
} satisfies Record<string, Transition>;

export const ease = { out: [0.16, 1, 0.3, 1] as const };
export const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: ease.out, delay: i * 0.04 },
});
