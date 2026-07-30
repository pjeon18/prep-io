import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { ElementType, PointerEvent, ReactNode } from "react";
import { press, pressLarge, springs } from "../../lib/motion";

/* ------------------------------------------------------------------ */
/* Pressable — the one place tap physics lives.                        */
/*                                                                     */
/* Every clickable thing in the app wraps in this, which is the only    */
/* reason 40+ screens feel like one product: a single spring, a single  */
/* dip depth, a single hover lift. Styling a bespoke :active transform  */
/* on a component is an audit failure.                                 */
/*                                                                     */
/* Three optional layers on top of the dip:                            */
/*   lift      — pointer-device hover elevation (skip on tiles in a     */
/*               dense grid; it turns a calm page into popcorn)         */
/*   magnetic  — the surface leans toward the cursor. Reserve for hero  */
/*               CTAs; on everything at once it reads as a gimmick.     */
/*   ripple    — touch-origin ink, for large tap targets               */
/* ------------------------------------------------------------------ */

const TAGS: Record<string, ElementType> = {
  button: motion.button,
  div: motion.div,
  a: motion.a,
  li: motion.li,
};

export function Pressable({
  as = "button",
  large = false,
  lift = false,
  magnetic = false,
  ripple = false,
  disabled = false,
  className = "",
  style,
  children,
  ...rest
}: {
  as?: "button" | "div" | "a" | "li";
  /** large surfaces need a shallower dip — 0.965 looks broken on a card */
  large?: boolean;
  lift?: boolean;
  magnetic?: boolean;
  ripple?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const Tag = TAGS[as] ?? motion.button;
  const ref = useRef<HTMLElement | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // magnetic lean: raw pointer offset → spring → small translation
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, springs.standard as never);
  const sy = useSpring(my, springs.standard as never);
  const tx = useTransform(sx, (v) => v * 0.14);
  const ty = useTransform(sy, (v) => v * 0.14);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!magnetic || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - (r.left + r.width / 2));
    my.set(e.clientY - (r.top + r.height / 2));
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!ripple || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 520);
  };

  return (
    <Tag
      ref={ref as never}
      disabled={as === "button" ? disabled : undefined}
      className={className}
      style={{
        ...style,
        ...(magnetic ? { x: tx, y: ty } : null),
        ...(ripple ? { position: "relative", overflow: "hidden" } : null),
      }}
      whileTap={disabled ? undefined : large ? pressLarge : press}
      whileHover={disabled ? undefined : lift ? { y: -3 } : undefined}
      transition={springs.snap}
      onPointerMove={magnetic ? onPointerMove : undefined}
      onPointerLeave={magnetic ? reset : undefined}
      onPointerDown={ripple ? onPointerDown : undefined}
      {...rest}
    >
      {children}
      {ripple &&
        ripples.map((r) => (
          <motion.span
            key={r.id}
            aria-hidden
            initial={{ opacity: 0.28, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: 320,
              height: 320,
              marginLeft: -160,
              marginTop: -160,
              borderRadius: "50%",
              background: "currentColor",
              pointerEvents: "none",
            }}
          />
        ))}
    </Tag>
  );
}

/** Circular icon control. The 40px box is the tap-target floor; the icon
 *  inside can be any size. */
export function IconButton({
  label,
  onClick,
  children,
  className = "",
  active = false,
}: {
  label: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <Pressable
      aria-label={label}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-full ${className}`}
      style={{ color: active ? "var(--prep-text)" : "var(--prep-text-2)" }}
    >
      {children}
    </Pressable>
  );
}
