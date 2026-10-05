import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { findHost, type Session } from "../data/seed";
import type { Caption } from "../store/useStore";
import { lookFor, Room } from "./people";
import { LiveBadge } from "./kit";
import { Captions, Expand, Eye, Pause, Play, Volume } from "./icons";
import { ease } from "../lib/motion";

/** Gentle head movement while someone is talking. */
function useBob(on: boolean) {
  const [v, setV] = useState({ bob: 0, sway: 0 });
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      setV({ bob: on ? Math.sin(t * 5.2) * 0.35 + Math.sin(t * 2.1) * 0.2 : 0, sway: Math.sin(t * 0.8) * 2 });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);
  return v;
}

export function CaptionBox({ caption }: { caption: Caption | null }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[14%] flex justify-center px-[6%]">
      <AnimatePresence mode="wait">
        {caption && (
          <motion.div
            key={caption.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: ease.out }}
            className="max-w-[80%] rounded-lg bg-black/70 px-[0.9em] py-[0.45em] text-center leading-snug text-white"
            style={{ fontSize: "clamp(12px, 2.1cqw, 22px)" }}
          >
            {caption.asker && <span className="block pb-0.5 text-[0.78em] font-semibold text-[#ffd479]">{caption.asker === "you" ? "Your question" : `Question from ${caption.asker}`}</span>}
            {caption.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Player({
  session,
  caption,
  viewers,
  overlay,
  controls = true,
  who,
  paused,
  onToggle,
  progress,
  className = "",
}: {
  session: Session;
  caption?: Caption | null;
  viewers?: number;
  overlay?: ReactNode;
  controls?: boolean;
  /** override the person (e.g. your own session) */
  who?: string;
  paused?: boolean;
  onToggle?: () => void;
  /** recorded: 0..1 */
  progress?: number;
  className?: string;
}) {
  const host = findHost(session.hostId);
  const look = lookFor(who ?? host.id);
  const speaking = !!caption && !caption.asker && !paused;
  const { bob, sway } = useBob(speaking);
  const live = session.status === "live";

  return (
    <div className={`group relative aspect-video w-full overflow-hidden bg-[#eef2f8] ${className}`} style={{ containerType: "inline-size" }}>
      <Room look={look} bob={bob} sway={sway} />
      <div className="absolute left-[2.2%] top-[3.5%] flex items-center gap-2">
        {live && <LiveBadge />}
        {live && viewers !== undefined && (
          <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-black/55 px-2 py-1 text-[12px] font-semibold text-white">
            <Eye size={14} /> {viewers.toLocaleString()}
          </span>
        )}
      </div>
      {caption !== undefined && <CaptionBox caption={caption} />}
      {overlay}
      {controls && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-gradient-to-t from-black/45 to-transparent px-[2.2%] pb-[1.8%] pt-[5%] text-white">
          {progress !== undefined && (
            <div className="absolute inset-x-[2.2%] top-[30%] h-[3px] rounded-full bg-white/35">
              <div className="h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
            </div>
          )}
          <button onClick={onToggle} aria-label={paused ? "Play" : "Pause"} className="mt-2">{paused ? <Play size={20} /> : <Pause size={20} />}</button>
          <Volume size={20} className="mt-2" />
          {live && <span className="mt-2 text-[13px] font-semibold">Live</span>}
          <span className="ml-auto mt-2 flex items-center gap-4">
            <Captions size={20} />
            <Expand size={18} />
          </span>
        </div>
      )}
    </div>
  );
}
