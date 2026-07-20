import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";

/**
 * The mocked-video treatment (CONCEPT.md D7): an ambient host portrait over a
 * slow-breathing gradient, with a live audio waveform. No fake video — the
 * stage is honest about being a person talking, not a stream capture.
 */

export function Waveform({
  bars = 24,
  height = 28,
  color = "var(--prep-amber)",
  active = true,
}: {
  bars?: number;
  height?: number;
  color?: string;
  active?: boolean;
}) {
  const [seed, setSeed] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setSeed((s) => s + 1), 180);
    return () => clearInterval(t);
  }, [active]);
  return (
    <div className="flex items-center gap-[3px]" style={{ height }} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const h = active
          ? 0.2 + Math.abs(Math.sin(seed * 0.7 + i * 1.3)) * 0.8 * Math.random()
          : 0.12;
        return (
          <div
            key={i}
            className="w-[3px] rounded-full transition-all duration-150"
            style={{ height: `${Math.max(8, h * 100)}%`, background: color, opacity: 0.4 + h * 0.6 }}
          />
        );
      })}
    </div>
  );
}

export function LivePill({ label = "LIVE" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 font-display text-[11px] font-bold tracking-wide"
      style={{ background: "var(--prep-amber)", color: "#201302" }}
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "#201302" }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {label}
    </span>
  );
}

export function LiveStage({
  hue,
  initials,
  name,
  headline,
  speaking,
  children,
}: {
  hue: number;
  initials: string;
  name: string;
  headline: string;
  speaking: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-card border"
      style={{ borderColor: "var(--prep-line)" }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, hsl(${hue} 45% 24%) 0%, var(--prep-surface) 70%)`,
        }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex flex-col items-center px-4 pb-4 pt-7">
        <motion.div
          animate={speaking ? { scale: [1, 1.02, 1] } : { scale: 1 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Avatar hue={hue} initials={initials} size={84} />
        </motion.div>
        <div className="mt-3 font-display text-[17px] font-semibold">{name}</div>
        <div className="text-[13px]" style={{ color: "var(--prep-text-2)" }}>
          {headline}
        </div>
        <div className="mt-3">
          <Waveform active={speaking} />
        </div>
        {children}
      </div>
    </div>
  );
}
