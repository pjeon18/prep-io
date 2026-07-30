import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import { pressLarge, springs } from "../../lib/motion";

/* ------------------------------------------------------------------ */
/* SpotlightCard — pointer-tracking light, optional 3D tilt.           */
/*                                                                     */
/* The mechanism: track the pointer in element space, feed a radial     */
/* gradient's center from it, and (optionally) rotate the card a couple */
/* of degrees away from the cursor. Both come off the same listener.     */
/*                                                                     */
/* Restraint matters. Tilt caps at 5° and the spotlight is ~7% ink —    */
/* enough that a card feels lit and physical as you approach, not       */
/* enough to read as a toy. Touch devices never fire either (no hover), */
/* so it degrades to a plain card for free.                             */
/*                                                                     */
/* Note the hooks are all unconditional and the tilt transforms resolve */
/* to 0 when disabled — an earlier version branched on `tilt` inside    */
/* the style object, which is a conditional hook call.                  */
/* ------------------------------------------------------------------ */

const TILT_DEG = 5;

export function SpotlightCard({
  tilt = false,
  spotlight = true,
  className = "",
  style,
  onClick,
  children,
  ...rest
}: {
  tilt?: boolean;
  spotlight?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // pointer position in element space (px) — the spotlight center
  const px = useMotionValue(-9999);
  const py = useMotionValue(-9999);
  // normalized -0.5..0.5 — the tilt driver
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, springs.standard as never);
  const sy = useSpring(ny, springs.standard as never);
  const rotateY = useTransform(sx, (v) => (tilt ? v * TILT_DEG * 2 : 0));
  const rotateX = useTransform(sy, (v) => (tilt ? -v * TILT_DEG * 2 : 0));
  const glow = useMotionValue(0);

  const spot =
    useMotionTemplate`radial-gradient(220px circle at ${px}px ${py}px, rgb(from var(--prep-text) r g b / 0.07), transparent 70%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
    nx.set((e.clientX - (r.left + r.width / 2)) / r.width);
    ny.set((e.clientY - (r.top + r.height / 2)) / r.height);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerEnter={() => glow.set(1)}
      onPointerLeave={() => {
        glow.set(0);
        nx.set(0);
        ny.set(0);
      }}
      whileTap={onClick ? pressLarge : undefined}
      transition={springs.snap}
      className={className}
      style={{
        ...style,
        position: "relative",
        transformStyle: tilt ? "preserve-3d" : undefined,
        rotateX,
        rotateY,
      }}
      {...rest}
    >
      {children}
      {spotlight && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: spot,
            opacity: glow,
            pointerEvents: "none",
            transition: "opacity 220ms ease",
          }}
        />
      )}
    </motion.div>
  );
}
