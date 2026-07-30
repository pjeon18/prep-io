import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";
import { springs } from "../../lib/motion";
import { Glass } from "./Glass";
import { Pressable } from "./Pressable";

/* ------------------------------------------------------------------ */
/* Dock — a floating glass navigation bar.                             */
/*                                                                     */
/* Two mechanisms, both cheap:                                          */
/*                                                                     */
/*  1. Magnification. Each item measures its distance from the pointer  */
/*     along one axis and scales on a falloff curve, so the row swells  */
/*     under the cursor and the neighbours taper. One shared motion     */
/*     value drives every item; there is no per-item listener.          */
/*     Pointer-only — on touch the dock is a plain tab bar, which is    */
/*     correct, because a finger has no hover to anticipate.            */
/*                                                                     */
/*  2. A single active pill with a `layoutId`, so switching tabs slides */
/*     the indicator across rather than fading one in.                  */
/* ------------------------------------------------------------------ */

export interface DockItem {
  key: string;
  label: string;
  icon: (p: { size?: number; strokeWidth?: number }) => ReactNode;
  active: boolean;
  onClick: () => void;
}

const MAX_SCALE = 1.32;
const FALLOFF = 110; // px of influence either side of the pointer

export function Dock({ items, className = "" }: { items: DockItem[]; className?: string }) {
  const pointerX = useMotionValue(Infinity);

  return (
    <Glass
      as="nav"
      variant="dock"
      className={`flex items-end gap-1 px-2.5 py-2 ${className}`}
      onPointerMove={(e: React.PointerEvent) => pointerX.set(e.clientX)}
      onPointerLeave={() => pointerX.set(Infinity)}
    >
      {items.map((it) => (
        <DockButton key={it.key} item={it} pointerX={pointerX} />
      ))}
    </Glass>
  );
}

function DockButton({ item, pointerX }: { item: DockItem; pointerX: MotionValue<number> }) {
  // The ref lives on a plain wrapper, not on <Pressable> — Pressable is a
  // function component and doesn't forward refs, and a dropped ref here
  // fails silently as "magnification never happens".
  const ref = useRef<HTMLDivElement | null>(null);

  // distance from pointer to this item's center → scale on a falloff curve
  const distance = useTransform(pointerX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box || x === Infinity) return FALLOFF;
    return Math.abs(x - (box.left + box.width / 2));
  });
  const rawScale = useTransform(distance, [0, FALLOFF], [MAX_SCALE, 1], {
    clamp: true,
  });
  const scale = useSpring(rawScale, springs.standard as never);

  const Icon = item.icon;

  return (
    <div ref={ref} className="flex">
      <Pressable
        aria-label={item.label}
        aria-current={item.active ? "page" : undefined}
        onClick={item.onClick}
        className="relative flex flex-col items-center gap-1 rounded-pill px-3.5 py-2"
        style={{ color: item.active ? "var(--prep-text)" : "var(--prep-text-3)" }}
      >
        <motion.span style={{ scale }} className="inline-flex flex-col items-center gap-1">
          <Icon size={21} strokeWidth={item.active ? 2.1 : 1.7} />
          <span className="text-[10.5px] font-medium leading-none">{item.label}</span>
        </motion.span>
        {item.active && (
          <motion.span
            layoutId="dock-active"
            transition={springs.standard}
            className="absolute inset-0 rounded-pill"
            style={{ background: "rgb(from var(--prep-text) r g b / 0.07)", zIndex: -1 }}
          />
        )}
      </Pressable>
    </div>
  );
}
