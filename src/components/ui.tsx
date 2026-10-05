import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform, type HTMLMotionProps } from "framer-motion";
import { forwardRef, useCallback, useEffect, useRef, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { spring, ease } from "../lib/motion";
import { VerifiedBadge } from "./icons";
import type { Host } from "../data/seed";

/* ------------------------------------------------------------------ */
/* V6 kit. Everything that moves takes its physics from lib/motion.     */
/* ------------------------------------------------------------------ */

type BtnProps = HTMLMotionProps<"button"> & { variant?: "primary" | "quiet" | "outline" | "danger" | "bare"; size?: "md" | "lg" };

const variants = {
  primary: "bg-brand text-white hover:bg-brand-ink",
  quiet: "text-ink hover:bg-ink/[0.06]",
  outline: "border-[1.5px] border-line bg-white text-ink hover:border-ink/40",
  danger: "border-[1.5px] border-live/40 bg-white text-live hover:border-live",
  bare: "",
};
const sizes = { md: "h-11 px-5 text-[16px] gap-2", lg: "h-14 px-7 text-[18px] gap-2.5" };

/** Tap physics live here: a quick press-in and a spring back out. */
export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button({ variant = "bare", size = "md", className = "", ...p }, ref) {
  const shaped = variant === "bare" ? "" : `inline-flex items-center justify-center rounded-full font-semibold transition-colors ${sizes[size]}`;
  return <motion.button ref={ref} whileTap={{ scale: 0.95 }} transition={spring.snap} className={`${shaped} ${variants[variant]} disabled:pointer-events-none disabled:opacity-40 ${className}`} {...p} />;
});

export function LiveBadge({ small }: { small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-live font-bold tracking-[0.02em] text-white ${small ? "h-6 px-2.5 text-[12px]" : "h-7 px-3 text-[13px]"}`}>
      <span className="live-dot" style={{ width: 6, height: 6 }} />
      LIVE
    </span>
  );
}

export function Name({ host, className = "", size = 18 }: { host: Host; className?: string; size?: number }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {host.name}
      {host.verified && <VerifiedBadge size={size} />}
    </span>
  );
}

/** A number that rolls to its new value instead of jumping. */
export function Count({ value, className = "" }: { value: number; className?: string }) {
  const mv = useMotionValue(value);
  const shown = useTransform(mv, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    const c = animate(mv, value, { type: "spring", stiffness: 120, damping: 22 });
    return c.stop;
  }, [value, mv]);
  return <motion.span className={`tabular-nums ${className}`}>{shown}</motion.span>;
}

/** Words that rise into place. Change `k` to replay with new words. */
export function Words({ text, k, className = "", delay = 0, as = "h1" }: { text: string; k?: string | number; className?: string; delay?: number; as?: "h1" | "h2" | "p" | "span" }) {
  const Tag = motion[as];
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <Tag key={k ?? text} className={className} initial="h" animate="v" exit="x" variants={{ v: { transition: { staggerChildren: 0.035, delayChildren: delay } }, x: { opacity: 0, transition: { duration: 0.18 } } }}>
        {text.split(" ").map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" style={{ marginRight: "0.25em" }}>
            <motion.span className="inline-block" variants={{ h: { y: "105%" }, v: { y: 0, transition: { duration: 0.7, ease: ease.out } } }}>{w}</motion.span>
          </span>
        ))}
      </Tag>
    </AnimatePresence>
  );
}

/** Rises in the first time it scrolls into view. */
export function Reveal({ children, className = "", delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: ease.out, delay }}>
      {children}
    </motion.div>
  );
}

/** Segmented control. The highlight slides between options on a spring. */
export function Segmented<T extends string>({ value, options, onChange, id, className = "" }: { value: T; options: { id: T; label: ReactNode }[]; onChange: (v: T) => void; id: string; className?: string }) {
  return (
    <div className={`inline-flex rounded-full bg-ink/[0.06] p-1 ${className}`} role="tablist">
      {options.map((o) => (
        <button key={o.id} role="tab" aria-selected={value === o.id} onClick={() => onChange(o.id)} className="relative h-10 rounded-full px-5 text-[16px] font-semibold">
          {value === o.id && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-full bg-white shadow-lift" transition={spring.ui} />}
          <span className={`relative transition-colors ${value === o.id ? "text-ink" : "text-ink-2 hover:text-ink"}`}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Text tabs with an underline that slides. */
export function Tabs<T extends string>({ value, options, onChange, id }: { value: T; options: { id: T; label: string; count?: number }[]; onChange: (v: T) => void; id: string }) {
  return (
    <div className="flex gap-8 border-b border-line">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className="relative pb-4 text-[18px] font-semibold">
          <span className={value === o.id ? "text-ink" : "text-ink-3 transition-colors hover:text-ink"}>
            {o.label}
            {!!o.count && <span className="ml-2 text-ink-3">{o.count}</span>}
          </span>
          {value === o.id && <motion.span layoutId={`tab-${id}`} className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-brand" transition={spring.ui} />}
        </button>
      ))}
    </div>
  );
}

/** Navigate so the clicked picture becomes the next page's stage. */
export function useStageNav() {
  const navigate = useNavigate();
  return useCallback(
    (href: string, el?: HTMLElement | null) => {
      const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!doc.startViewTransition || reduced) return navigate(href);
      if (el) el.style.viewTransitionName = "stage";
      const t = doc.startViewTransition(() => flushSync(() => navigate(href)));
      t.finished.finally(() => el && (el.style.viewTransitionName = ""));
    },
    [navigate],
  );
}

export function SectionHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <h2 className="t-h2 text-ink">{title}</h2>
      {action}
    </div>
  );
}
