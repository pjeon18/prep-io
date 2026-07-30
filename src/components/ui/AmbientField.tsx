import { motion } from "framer-motion";
import { prefersReducedMotion } from "../../lib/motion";

/* ------------------------------------------------------------------ */
/* AmbientField — the thing the glass refracts.                        */
/*                                                                     */
/* Glass over a flat fill renders as nothing: no color variation behind */
/* it means the blur has nothing to blur. Over thumbnails and the       */
/* theater there's plenty to work with, but the browse pages are a      */
/* white sheet, so this supplies a few very slow drifting blobs.        */
/*                                                                     */
/* Calibration note: in light mode these are 4-7% alpha — essentially   */
/* invisible as color, detectable only as the faint life it gives the   */
/* chrome. Dark mode can afford roughly double. If you can point at a   */
/* blob and name its color, it's too strong.                            */
/* ------------------------------------------------------------------ */

const BLOBS = [
  { key: "a", color: "var(--prep-amb-1)", size: 620, x: "-12%", y: "-16%", dur: 34, dx: 60, dy: 40 },
  { key: "b", color: "var(--prep-amb-2)", size: 520, x: "68%", y: "8%", dur: 42, dx: -50, dy: 56 },
  { key: "c", color: "var(--prep-amb-3)", size: 700, x: "24%", y: "62%", dur: 50, dx: 44, dy: -46 },
];

export function AmbientField() {
  const still = prefersReducedMotion();
  return (
    <div className="ambient" aria-hidden>
      {BLOBS.map((b) => (
        <motion.div
          key={b.key}
          className="ambient-blob"
          style={{
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            background: b.color,
          }}
          animate={still ? undefined : { x: [0, b.dx, 0], y: [0, b.dy, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
