import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { companyOf, findHost, type Session } from "../data/seed";
import { useStore, type Caption } from "../store/useStore";
import { readMs } from "../lib/sim";
import { ago, duration, when } from "../lib/format";
import { Avatar, lookFor, Room } from "./people";
import { LiveBadge, Name } from "./kit";
import { Eye } from "./icons";

/** Cycles a live session's host lines for players that aren't a joined session. */
export function useCaptionLoop(session: Session | undefined, on = true) {
  const [caption, setCaption] = useState<Caption | null>(null);
  useEffect(() => {
    setCaption(null);
    if (!session || !on || !session.captions.length) return;
    let i = 0;
    let key = 1;
    let t: ReturnType<typeof setTimeout>;
    const next = () => {
      const text = session.captions[i++ % session.captions.length];
      setCaption({ key: key++, text });
      t = setTimeout(next, readMs(text));
    };
    t = setTimeout(next, 600);
    return () => clearTimeout(t);
  }, [session, on]);
  return caption;
}

export const hrefFor = (s: Session) => `/session/${s.id}`;

export function Thumb({ s }: { s: Session }) {
  const viewers = useStore((x) => x.viewers[s.id]);
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-[#eef2f8]" style={{ containerType: "inline-size" }}>
      <Room look={lookFor(s.hostId)} />
      <div className="absolute left-2 top-2 flex items-center gap-1.5">
        {s.status === "live" && <LiveBadge small />}
        {s.status === "live" && viewers !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-[5px] bg-black/55 px-1.5 py-[2px] text-[11px] font-semibold text-white">
            <Eye size={12} /> {viewers.toLocaleString()}
          </span>
        )}
      </div>
      {s.status === "recorded" && (
        <span className="absolute bottom-2 right-2 rounded-[5px] bg-black/70 px-1.5 py-[2px] text-[11.5px] font-semibold text-white">{duration(s.durationMin)}</span>
      )}
      {s.status === "scheduled" && (
        <span className="absolute bottom-2 left-2 rounded-[5px] bg-white/95 px-2 py-[3px] text-[12px] font-semibold text-ink">{when(s)}</span>
      )}
    </div>
  );
}

export function SessionCard({ s }: { s: Session }) {
  const host = findHost(s.hostId);
  const c = companyOf(s);
  return (
    <Link to={hrefFor(s)} className="group block">
      <div className="transition-transform duration-300 group-hover:-translate-y-0.5">
        <Thumb s={s} />
      </div>
      <div className="mt-3 flex gap-3">
        <Avatar who={host.id} size={36} />
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15.5px] font-semibold leading-snug text-ink group-hover:text-brand">{s.title}</h3>
          <p className="mt-1 text-[14px] text-ink-2"><Name host={host} /></p>
          <p className="text-[13.5px] text-ink-3">
            {host.title} at {c.name}
            {s.status === "recorded" && `, ${ago(s.daysAgo!)}`}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function SessionRow({ s }: { s: Session }) {
  const host = findHost(s.hostId);
  const c = companyOf(s);
  return (
    <Link to={hrefFor(s)} className="group flex gap-4 py-3">
      <div className="w-[168px] shrink-0"><Thumb s={s} /></div>
      <div className="min-w-0 pt-0.5">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink group-hover:text-brand">{s.title}</h3>
        <p className="mt-1 text-[13.5px] text-ink-2"><Name host={host} /></p>
        <p className="text-[13px] text-ink-3">{host.title} at {c.name}</p>
      </div>
    </Link>
  );
}
