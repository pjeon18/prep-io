import type { Transition, Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Motion tokens (D16)                                                 */
/*                                                                     */
/* Every animation in the app comes from a named preset here. Ad-hoc    */
/* easing is an audit failure: 40+ screens can only feel like one       */
/* product if they share one physics.                                   */
/*                                                                     */
/* The rule of thumb: SPRINGS for anything the user caused (taps,       */
/* drags, opens) so it carries velocity and settles; DURATIONS only for */
/* ambient things nobody triggered (fades, shimmer, drifts).           */
/* ------------------------------------------------------------------ */

export const springs = {
  /** taps and toggles — quick, almost no overshoot */
  snap: { type: "spring", stiffness: 520, damping: 34, mass: 0.7 },
  /** the default: cards, sheets, layout shifts */
  standard: { type: "spring", stiffness: 320, damping: 30, mass: 0.9 },
  /** arrivals and hero entrances — slower, visibly settles */
  calm: { type: "spring", stiffness: 180, damping: 24 },
  /** big soft movement (page/stage transitions) */
  gentle: { type: "spring", stiffness: 110, damping: 20 },
  /** playful overshoot — use sparingly, it reads as personality */
  bouncy: { type: "spring", stiffness: 420, damping: 17, mass: 0.8 },
  /** for values dragged by a pointer: follows the finger, then settles */
  drag: { type: "spring", stiffness: 700, damping: 42, mass: 0.6 },
} satisfies Record<string, Transition>;

export const durations = {
  fast: 0.14,
  base: 0.24,
  slow: 0.46,
  arrival: 0.8,
} as const;

/** cubic-beziers for the few non-spring cases */
export const easings = {
  /** decelerate hard — good for reveals */
  out: [0.22, 1, 0.36, 1] as const,
  /** symmetric */
  inOut: [0.42, 0, 0.58, 1] as const,
};

/* ---------------- press physics ---------------- */

/** the universal tap dip. Applied by <Pressable>, not by hand. */
export const press = { scale: 0.965 };
/** a lighter dip for large surfaces (cards, tiles) — 0.965 looks broken at size */
export const pressLarge = { scale: 0.985 };
/** hover lift for pointer devices */
export const hoverLift = { y: -3 };

/* ---------------- entrance variants ---------------- */

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
};

/** sheets rise from the bottom edge */
export const sheetUp: Variants = {
  initial: { y: 64, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 44, opacity: 0 },
};

/* ---------------- stagger ---------------- */

/** per-item delay for a list entrance. Cap it: 20 items × 50ms = a full
 *  second of the user waiting on choreography. */
export const stagger = (i: number, step = 0.045, cap = 8) => ({
  delay: Math.min(i, cap) * step,
});

/** container-level stagger for framer's built-in orchestration */
export const staggerContainer = (step = 0.045): Variants => ({
  animate: { transition: { staggerChildren: step } },
});

/* ---------------- reduced motion ---------------- */

/** True when the user asked for less motion. Read at call time, not at
 *  module load, so a mid-session OS change is honored. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
