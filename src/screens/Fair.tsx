import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { LivePill } from "../components/LiveStage";
import { TopNav } from "../components/TopNav";
import { IconCalendar, IconEye } from "../components/icons";
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
    <div className="min-h-dvh pb-16">
      <TopNav />
      <main className="mx-auto max-w-md px-4">
        {/* ---- Live now ---- */}
        <div className="mt-5 flex items-center justify-between">
          <h2 className="font-display text-[18px] font-semibold">Live now</h2>
          <span className="text-[12px]" style={{ color: "var(--prep-text-3)" }}>
            counts are real people in the room
          </span>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {liveSessions.map((sesh, i) => {
            const host = HOSTS.find((h) => h.id === sesh.hostId)!;
            const count = floorCounts[sesh.id];
            return (
              <motion.button
                key={sesh.id}
                className="card w-full p-4 text-left"
                {...fadeUp}
                transition={{ ...springs.standard, ...stagger(i) }}
                onClick={() => nav(`/room/${sesh.id}`)}
              >
                <div className="flex items-start gap-3">
                  <Avatar hue={host.hue} initials={host.initials} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <LivePill />
                      <span
                        className="inline-flex items-center gap-1 text-[12px]"
                        style={{ color: "var(--prep-text-2)" }}
                      >
                        <IconEye size={13} />
                        {count !== undefined ? fmtCount(count) : "…"} watching
                      </span>
                    </div>
                    <div className="mt-1.5 truncate font-display text-[15px] font-semibold leading-snug">
                      {sesh.title}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px]" style={{ color: "var(--prep-text-2)" }}>
                      <span>{host.name}</span>
                      <Badge state={host.badge} />
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

        {/* ---- Calendar rail: co-equal with live-now (D2) ---- */}
        <div className="mt-7 flex items-center gap-2">
          <IconCalendar size={16} className="text-prep-text-2" />
          <h2 className="font-display text-[18px] font-semibold">Coming up</h2>
        </div>
        <div className="rail -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
          {scheduled.map((sesh, i) => {
            const host = HOSTS.find((h) => h.id === sesh.hostId)!;
            return (
              <motion.div
                key={sesh.id}
                className="card w-[220px] shrink-0 p-3.5"
                {...fadeUp}
                transition={{ ...springs.standard, ...stagger(i, 0.04) }}
              >
                <div
                  className="font-display text-[12px] font-semibold"
                  style={{ color: "var(--prep-amber)" }}
                >
                  {sesh.when}
                </div>
                <div className="mt-1 line-clamp-2 min-h-[38px] text-[13px] font-medium leading-snug">
                  {sesh.title}
                </div>
                <Link
                  to={`/profile/${host.id}`}
                  className="mt-2 flex items-center gap-2"
                >
                  <Avatar hue={host.hue} initials={host.initials} size={24} />
                  <span className="truncate text-[12px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.name}
                  </span>
                  <Badge state={host.badge} compact />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ---- The floor ---- */}
        <h2 className="mt-7 font-display text-[18px] font-semibold">The floor</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
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
                className="card relative overflow-hidden p-4 text-left"
                {...fadeUp}
                transition={{ ...springs.standard, ...stagger(i, 0.03) }}
                onClick={() => nav(`/section/${section.id}`)}
              >
                {live.length > 0 && (
                  <span
                    className="absolute right-3 top-3 h-2 w-2 rounded-full"
                    style={{ background: "var(--prep-amber)" }}
                  />
                )}
                <div className="font-display text-[15px] font-semibold">
                  {section.name}
                </div>
                <div className="mt-0.5 text-[12px] leading-snug" style={{ color: "var(--prep-text-3)" }}>
                  {section.blurb}
                </div>
                <div className="mt-3 text-[12px]" style={{ color: "var(--prep-text-2)" }}>
                  {live.length > 0
                    ? `${live.length} live · ${fmtCount(watching)} watching`
                    : sched.length > 0
                      ? `next: ${sched[0].when}`
                      : "quiet right now"}
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
