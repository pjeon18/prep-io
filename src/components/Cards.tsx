import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { companyOf, findHost, type Session } from "../data/seed";
import { useStore, type Caption } from "../store/useStore";
import { readMs } from "../lib/sim";
import { duration, when } from "../lib/format";
import { spring } from "../lib/motion";
import { Stage } from "./Stage";
import { Button, Name, useStageNav } from "./ui";
import { hrefFor } from "./Nav";
import { Bell, BellFill, Check, Plus } from "./icons";

/** Cycles a live session's host lines for a stage you have not joined. */
export function useCaptionLoop(session: Session | undefined, on = true) {
  const [caption, setCaption] = useState<Caption | null>(null);
  useEffect(() => {
    setCaption(null);
    if (!session || !on || !session.captions.length) return;
    let i = Math.floor(Math.random() * session.captions.length);
    let key = 1;
    let t: ReturnType<typeof setTimeout>;
    const next = () => {
      const text = session.captions[i++ % session.captions.length];
      setCaption({ key: key++, text });
      t = setTimeout(next, readMs(text));
    };
    t = setTimeout(next, 500);
    return () => clearTimeout(t);
  }, [session, on]);
  return caption;
}

/** Host and employer as one plain line, like a person would say it. */
export function hostLine(s: Session) {
  const h = findHost(s.hostId);
  return `${h.name}, ${h.title.split(",")[0]} at ${companyOf(s).name}`;
}

/** A session picture. Hovering a live one brings the room to life. */
export function Thumb({ s, hover, when: showWhen = true }: { s: Session; hover?: boolean; when?: boolean }) {
  const viewers = useStore((x) => x.viewers[s.id]);
  const caption = useCaptionLoop(s, !!hover && s.status === "live");
  return (
    <div className="relative">
      <motion.div animate={{ scale: hover ? 1.025 : 1 }} transition={spring.glide} className="origin-center">
        <Stage session={s} viewers={viewers} caption={hover ? caption : undefined} animate={!!hover} />
      </motion.div>
      {s.status === "recorded" && (
        <span className="absolute bottom-[6%] right-[4%] rounded-full bg-ink/70 px-3 py-1 text-[14px] font-semibold text-white backdrop-blur-md">{duration(s.durationMin)}</span>
      )}
      {s.status === "scheduled" && showWhen && (
        <span className="absolute bottom-[6%] left-[4%] rounded-full bg-white/95 px-3.5 py-1.5 text-[14px] font-semibold text-ink shadow-lift">{when(s)}</span>
      )}
    </div>
  );
}

/** Clicking anywhere on it opens the session, and the picture becomes the stage. */
export function SessionCard({ s, size = "md" }: { s: Session; size?: "md" | "lg" }) {
  const [hover, setHover] = useState(false);
  const go = useStageNav();
  const pic = useRef<HTMLDivElement>(null);
  const host = findHost(s.hostId);
  return (
    <a
      href={hrefFor(s)}
      onClick={(e) => (e.preventDefault(), go(hrefFor(s), pic.current))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group block"
    >
      <div ref={pic} className="overflow-hidden rounded-stage">
        <Thumb s={s} hover={hover} />
      </div>
      <div className="mt-5">
        <h3 className={`${size === "lg" ? "t-h2" : "t-h3"} text-ink transition-colors group-hover:text-brand`}>{s.title}</h3>
        <p className="t-meta mt-2"><Name host={host} className="font-semibold text-ink" size={17} /> <span>{host.title.split(",")[0]} at {companyOf(s).name}</span></p>
        {s.status === "recorded" && <p className="t-meta mt-1">{s.chapters?.length ?? 0} questions answered</p>}
      </div>
    </a>
  );
}

export function FollowButton({ id, size = "md" }: { id: string; size?: "md" | "lg" }) {
  const on = useStore((x) => x.following.includes(id));
  const toggle = useStore((x) => x.toggleFollow);
  return (
    <Button variant={on ? "outline" : "primary"} size={size} onClick={(e) => (e.preventDefault(), e.stopPropagation(), toggle(id))} className="min-w-[124px] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={on ? "on" : "off"} className="inline-flex items-center gap-2" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={spring.snap}>
          {on ? <Check size={18} /> : <Plus size={18} />} {on ? "Following" : "Follow"}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

export function RemindButton({ id, size = "md" }: { id: string; size?: "md" | "lg" }) {
  const on = useStore((x) => x.reminders.includes(id));
  const toggle = useStore((x) => x.toggleReminder);
  return (
    <Button variant={on ? "outline" : "primary"} size={size} onClick={(e) => (e.preventDefault(), e.stopPropagation(), toggle(id))} className="min-w-[150px] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={on ? "on" : "off"} className="inline-flex items-center gap-2" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={spring.snap}>
          {on ? <BellFill size={18} /> : <Bell size={18} />} {on ? "Reminder set" : "Remind me"}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
