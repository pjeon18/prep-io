import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { spring } from "../lib/motion";
import { VerifiedBadge } from "./icons";
import type { Host } from "../data/seed";

type BtnProps = HTMLMotionProps<"button"> & { variant?: "primary" | "outline" | "ghost" | "soft" | "bare"; size?: "sm" | "md" | "lg" };

const variants = {
  primary: "bg-brand text-white hover:bg-brand-ink",
  outline: "border border-brand text-brand hover:bg-brand-soft",
  soft: "bg-brand-soft text-brand hover:bg-[#dce6ff]",
  ghost: "text-ink-2 hover:bg-black/[0.05] hover:text-ink",
  bare: "",
};
const sizes = { sm: "h-8 px-3.5 text-[14px] gap-1.5", md: "h-10 px-5 text-[15px] gap-2", lg: "h-12 px-6 text-[16px] gap-2" };

/** The one place tap physics lives. */
export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button({ variant = "bare", size = "md", className = "", ...p }, ref) {
  const shaped = variant === "bare" ? "" : `inline-flex items-center justify-center rounded-full font-semibold transition-colors ${sizes[size]}`;
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      transition={spring.snap}
      className={`${shaped} ${variants[variant]} disabled:pointer-events-none disabled:opacity-40 ${className}`}
      {...p}
    />
  );
});

export function A({ className = "", ...p }: LinkProps & { className?: string }) {
  return <Link className={className} {...p} />;
}

export function Card({ children, className = "", pad = true }: { children: ReactNode; className?: string; pad?: boolean }) {
  return <section className={`card ${pad ? "p-5" : ""} ${className}`}>{children}</section>;
}

export function Name({ host, className = "" }: { host: Host; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {host.name}
      {host.verified && <VerifiedBadge size={16} />}
    </span>
  );
}

export function LiveBadge({ small }: { small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[6px] bg-live font-bold text-white ${small ? "px-1.5 py-[2px] text-[11px]" : "px-2 py-1 text-[12px]"}`}>
      <span className="live-dot" style={{ width: small ? 5 : 6, height: small ? 5 : 6 }} />
      LIVE
    </span>
  );
}

export function Chip({ on, children, onClick }: { on?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full border px-4 text-[14px] font-semibold transition-colors ${on ? "border-brand bg-brand text-white" : "border-[#b9b5ad] bg-white text-ink-2 hover:border-ink-2 hover:text-ink"}`}
    >
      {children}
    </Button>
  );
}

export function Tabs<T extends string>({ value, options, onChange, id }: { value: T; options: { id: T; label: string; count?: number }[]; onChange: (v: T) => void; id: string }) {
  return (
    <div className="flex border-b border-line">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className="relative px-4 py-3 text-[15px] font-semibold">
          <span className={value === o.id ? "text-brand" : "text-ink-2 hover:text-ink"}>
            {o.label}
            {!!o.count && <span className="ml-1.5 text-ink-3">{o.count}</span>}
          </span>
          {value === o.id && <motion.span layoutId={`tab-${id}`} className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-brand" transition={spring.ui} />}
        </button>
      ))}
    </div>
  );
}
