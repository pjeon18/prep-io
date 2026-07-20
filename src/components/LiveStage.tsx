import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";

/**
 * The mocked-video treatment (CONCEPT.md D7): an ambient host portrait with a
 * live audio waveform. No fake video — the stage is honest about being a
 * person talking, not a stream capture. Restraint over glow.
 */

export function Waveform({
  bars = 26,
  height = 26,
  color = "var(--prep-text-3)",
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
            className="w-[2.5px] rounded-full transition-all duration-150"
            style={{
              height: `${Math.max(8, h * 100)}%`,
              background: color,
              opacity: 0.35 + h * 0.55,
            }}
          />
        );
      })}
    </div>
  );
}

export function LivePill({ label = "LIVE" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.08em]"
      style={{ background: "var(--prep-live)", color: "#ffffff" }}
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "#ffffff" }}
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
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
      style={{ borderColor: "var(--prep-line)", background: "var(--prep-surface)" }}
    >
      <div className="relative flex flex-col items-center px-4 pb-6 pt-8">
        <motion.div
          animate={speaking ? { scale: [1, 1.015, 1] } : { scale: 1 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Avatar hue={hue} initials={initials} size={88} />
        </motion.div>
        <div className="mt-4 font-display text-[20px]" style={{ fontWeight: 500 }}>
          {name}
        </div>
        <div className="mt-0.5 text-[14px]" style={{ color: "var(--prep-text-2)" }}>
          {headline}
        </div>
        <div className="mt-4">
          <Waveform active={speaking} />
        </div>
        {children}
      </div>
    </div>
  );
}
