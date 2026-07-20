import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Thumb } from "../components/Thumb";
import { AppShell } from "../components/AppShell";
import { IconEye, IconTicket } from "../components/icons";
import { CLIPS, HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import { fadeUp, springs, stagger } from "../lib/motion";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/* Home — the fair floor + calendar. Discovery is the floor, the calendar,
 * and search; never a feed (Principle 3). Live rooms sort by section order,
 * booths are the fixed floor plan. */

export default function Fair() {
  const nav = useNavigate();
  const floorCounts = usePrepStore((s) => s.floorCounts);
  const initFloor = usePrepStore((s) => s.initFloor);
  const driftFloor = usePrepStore((s) => s.driftFloor);

  // the floor's liveness is simulated, never static (Principle 5)
  useEffect(() => {
    initFloor();
    const t = setInterval(driftFloor, 3000);
    return () => clearInterval(t);
  }, [initFloor, driftFloor]);

  const liveSessions = SESSIONS.filter((s) => s.kind === "live");
  const events = SESSIONS.filter((s) => s.kind === "scheduled" && s.ticket);
  const scheduled = SESSIONS.filter((s) => s.kind === "scheduled" && !s.ticket);

  const h2 = "mt-11 font-display text-[26px]";

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[1440px] lg:px-8">
        {/* ---- Live now ---- */}
        <h2 className="mt-8 font-display text-[26px]" style={{ fontWeight: 500 }}>
          Live now
        </h2>
        <div className="mt-4 flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-x-5 lg:gap-y-9 xl:grid-cols-4">
          {liveSessions.map((sesh, i) => {
            const host = HOSTS.find((h) => h.id === sesh.hostId)!;
            const count = floorCounts[sesh.id];
            return (
              <motion.button
                key={sesh.id}
                className="w-full text-left"
                {...fadeUp}
                transition={{ ...springs.standard, ...stagger(i) }}
                onClick={() => nav(`/room/${sesh.id}`)}
              >
                <Thumb hue={host.hue} initials={host.initials} live video={sesh.video} height={168} />
                <div className="mt-2.5 flex items-start gap-3">
                  <Avatar hue={host.hue} initials={host.initials} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-[15.5px] font-medium leading-snug">
                      {sesh.title}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] tabular-nums" style={{ color: "var(--prep-text-2)" }}>
                      {host.name}
                      <Badge state={host.badge} compact />
                      <span className="inline-flex items-center gap-1" style={{ color: "var(--prep-text-3)" }}>
                        <IconEye size={13} />
                        {count !== undefined ? fmtCount(count) : "…"}
                      </span>
                      <span style={{ color: "var(--prep-text-3)" }}>
                        {SECTIONS.find((x) => x.id === sesh.sectionId)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ---- Events (capacity-limited) ---- */}
        <h2 className={h2} style={{ fontWeight: 500 }}>
          Events
        </h2>
        <div className="mt-1 text-[13px]" style={{ color: "var(--prep-text-3)" }}>
          Small rooms, real seats — first come, first served
        </div>
        <div className="lg:mt-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:[&>button]:mt-0 xl:grid-cols-3">
        {events.map((sesh) => {
          const host = HOSTS.find((h) => h.id === sesh.hostId)!;
          const left = sesh.ticket!.capacity - sesh.ticket!.seedTaken;
          return (
            <button
              key={sesh.id}
              className="card mt-3 flex w-full items-center gap-4 p-4 text-left"
              onClick={() => nav(`/event/${sesh.id}`)}
            >
              <div className="overline w-[76px] shrink-0 !leading-snug">{sesh.when}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-medium leading-snug">{sesh.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
                  {host.name}
                  <span className="inline-flex items-center gap-1" style={{ color: left <= 5 ? "var(--prep-live)" : "var(--prep-text-3)" }}>
                    · <IconTicket size={12} /> {left} seats left
                  </span>
                  <span style={{ color: "var(--prep-text-3)" }}>
                    · {sesh.ticket!.price ? `$${sesh.ticket!.price}` : "$1 commit"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
        </div>

        {/* ---- Calendar rail: co-equal with live-now (D2) ---- */}
        <h2 className={h2} style={{ fontWeight: 500 }}>
          Coming up
        </h2>
        <div className="rail -mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-1">
          {scheduled.map((sesh, i) => {
            const host = HOSTS.find((h) => h.id === sesh.hostId)!;
            return (
              <motion.div
                key={sesh.id}
                className="card w-[230px] shrink-0 p-4"
                {...fadeUp}
                transition={{ ...springs.standard, ...stagger(i, 0.04) }}
              >
                <div className="overline">{sesh.when}</div>
                <div className="mt-2 line-clamp-2 min-h-[44px] text-[15px] font-medium leading-snug">
                  {sesh.title}
                </div>
                <Link to={`/profile/${host.id}`} className="mt-3 flex items-center gap-2">
                  <Avatar hue={host.hue} initials={host.initials} size={22} />
                  <span className="truncate text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.name}
                  </span>
                  <Badge state={host.badge} compact />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ---- Shorts ---- */}
        <h2 className={h2} style={{ fontWeight: 500 }}>
          Shorts
        </h2>
        <div className="rail -mx-5 mt-4 flex gap-3 overflow-x-auto px-5">
          {CLIPS.slice(0, 6).map((clip) => {
            const host = HOSTS.find((h) => h.id === clip.hostId)!;
            return (
              <button key={clip.id} className="w-[120px] shrink-0 text-left" onClick={() => nav(`/shorts/${clip.id}`)}>
                <Thumb hue={clip.hue} initials={host.initials} duration={clip.durationLabel} height={180} />
                <div className="mt-1.5 line-clamp-2 text-[12.5px] font-medium leading-snug">{clip.title}</div>
              </button>
            );
          })}
        </div>

        {/* ---- The floor ---- */}
        <h2 className={h2} style={{ fontWeight: 500 }}>
          The floor
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {SECTIONS.map((section, i) => {
            const live = SESSIONS.filter(
              (x) => x.sectionId === section.id && x.kind === "live",
            );
            const sched = SESSIONS.filter(
              (x) => x.sectionId === section.id && x.kind === "scheduled",
            );
            const watching = live.reduce(
              (sum, x) => sum + (floorCounts[x.id] ?? 0),
              0,
            );
            return (
              <motion.button
                key={section.id}
                className="card relative p-4 pb-5 text-left"
                {...fadeUp}
                transition={{ ...springs.standard, ...stagger(i, 0.03) }}
                onClick={() => nav(`/section/${section.id}`)}
              >
                {live.length > 0 && (
                  <span
                    className="absolute right-4 top-4 h-2 w-2 rounded-full"
                    style={{ background: "var(--prep-live)" }}
                  />
                )}
                <div className="font-display text-[19px]" style={{ fontWeight: 500 }}>
                  {section.name}
                </div>
                <div className="mt-1 text-[13px] leading-snug" style={{ color: "var(--prep-text-3)" }}>
                  {section.blurb}
                </div>
                <div className="mt-4 text-[13px] tabular-nums" style={{ color: "var(--prep-text-2)" }}>
                  {live.length > 0
                    ? `${live.length} live · ${fmtCount(watching)} watching`
                    : sched.length > 0
                      ? `Next ${sched[0].when}`
                      : "Quiet right now"}
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>
    </AppShell>
  );
}
