import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { findHost, type Session } from "../data/seed";
import type { Caption } from "../store/useStore";
import { lookFor, Room } from "./people";
import { Count, LiveBadge } from "./ui";
import { Eye, Pause, Play } from "./icons";
import { ease } from "../lib/motion";

/* The stage: a host's room standing in for video. It only shows what is
   true (live or not, how many people, what is being said) and has no
   pretend controls. */

/** A small head movement while someone talks, and a slow sway at rest. */
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

export function CaptionLine({ caption }: { caption: Caption | null }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[9%] flex justify-center px-[6%]">
      <AnimatePresence mode="wait">
        {caption && (
          <motion.div
            key={caption.key}
            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.45, ease: ease.out }}
            className="max-w-[86%] rounded-2xl bg-ink/80 px-[1em] py-[0.55em] text-center font-medium leading-snug text-white backdrop-blur-md"
            style={{ fontSize: "clamp(14px, 2.5cqw, 26px)" }}
          >
            {caption.asker && <span className="block pb-1 text-[0.72em] font-semibold text-brand-mint">{caption.asker === "you" ? "Your question" : `${caption.asker} asked`}</span>}
            {caption.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Stage({
  session,
  caption,
  viewers,
  overlay,
  who,
  paused,
  onToggle,
  progress,
  rounded = true,
  animate = true,
  className = "",
  stageRef,
  badges = true,
}: {
  session: Session;
  caption?: Caption | null;
  viewers?: number;
  overlay?: ReactNode;
  who?: string;
  paused?: boolean;
  onToggle?: () => void;
  /** recordings: 0..1 */
  progress?: number;
  rounded?: boolean;
  /** the head bob costs a frame loop, so thumbnails can switch it off */
  animate?: boolean;
  className?: string;
  stageRef?: React.Ref<HTMLDivElement>;
  /** off where the page already says LIVE next to the stage */
  badges?: boolean;
}) {
  const host = findHost(session.hostId);
  const look = lookFor(who ?? host.id);
  const speaking = animate && !!caption && !caption.asker && !paused;
  const { bob, sway } = useBob(speaking);
  const live = session.status === "live";

  return (
    <div
      ref={stageRef}
      className={`relative aspect-video w-full overflow-hidden bg-[#eef2f8] ${rounded ? "rounded-stage" : ""} ${className}`}
      style={{ containerType: "inline-size" }}
    >
      <Room look={look} bob={animate ? bob : 0} sway={animate ? sway : 0} />
      {live && badges && (
        <div className="absolute left-[3%] top-[5%] flex items-center gap-2">
          <LiveBadge />
          {viewers !== undefined && (
            <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-ink/55 px-3 text-[13px] font-semibold text-white backdrop-blur-md">
              <Eye size={15} /> <Count value={viewers} />
            </span>
          )}
        </div>
      )}
      {caption !== undefined && <CaptionLine caption={caption} />}
      {overlay}
      {onToggle && (
        <button
          onClick={onToggle}
          aria-label={paused ? "Play" : "Pause"}
          className="absolute bottom-[5%] left-[3%] grid h-12 w-12 place-items-center rounded-full bg-ink/60 text-white backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
        >
          {paused ? <Play size={20} /> : <Pause size={18} />}
        </button>
      )}
      {progress !== undefined && (
        <div className="absolute inset-x-0 bottom-0 h-[5px] bg-ink/15">
          <motion.div className="h-full bg-brand" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.8, ease: "linear" }} />
        </div>
      )}
    </div>
  );
}
