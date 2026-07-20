import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { LivePill } from "../components/LiveStage";
import { TopNav } from "../components/TopNav";
import { IconEye } from "../components/icons";
import { HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import { fadeUp, springs, stagger } from "../lib/motion";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/* The Fair — discovery is the floor + the calendar, nothing else.
 * No feed, no ranking of people, no algorithmic ordering (Principle 3):
 * live rooms sort by section order, booths are the fixed floor plan. */

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
  const scheduled = SESSIONS.filter((s) => s.kind === "scheduled");

  return (
    <div className="min-h-dvh pb-20">
      <TopNav />
      <main className="mx-auto max-w-md px-5">
        {/* ---- Live now ---- */}
        <h2 className="mt-9 font-display text-[28px]" style={{ fontWeight: 500 }}>
          Live now
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {liveSessions.map((sesh, i) => {
            const host = HOSTS.find((h) => h.id === sesh.hostId)!;
            const count = floorCounts[sesh.id];
            return (
              <motion.button
                key={sesh.id}
                className="card w-full p-5 text-left"
                {...fadeUp}
                transition={{ ...springs.standard, ...stagger(i) }}
                onClick={() => nav(`/room/${sesh.id}`)}
              >
                <div className="flex items-center justify-between">
                  <LivePill />
                  <span
                    className="inline-flex items-center gap-1.5 text-[13px] tabular-nums"
                    style={{ color: "var(--prep-text-2)" }}
                  >
                    <IconEye size={14} />
                    {count !== undefined ? fmtCount(count) : "…"}
                  </span>
                </div>
                <div className="mt-3 font-display text-[19px] leading-snug" style={{ fontWeight: 500 }}>
                  {sesh.title}
                </div>
                <div className="mt-3 flex items-center gap-2.5">
                  <Avatar hue={host.hue} initials={host.initials} size={26} />
                  <span className="text-[14px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.name}
                  </span>
                  <Badge state={host.badge} />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ---- Calendar rail: co-equal with live-now (D2) ---- */}
        <h2 className="mt-12 font-display text-[28px]" style={{ fontWeight: 500 }}>
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
                <Link
                  to={`/profile/${host.id}`}
                  className="mt-3 flex items-center gap-2"
                >
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

        {/* ---- The floor ---- */}
        <h2 className="mt-12 font-display text-[28px]" style={{ fontWeight: 500 }}>
          The floor
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
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
    </div>
  );
}
