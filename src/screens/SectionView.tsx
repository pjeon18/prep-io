import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { LivePill } from "../components/LiveStage";
import { AppShell } from "../components/AppShell";
import { IconArrowLeft, IconBell, IconEye, IconPlay } from "../components/icons";
import { HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import { fadeUp, springs, stagger } from "../lib/motion";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/** One booth: its live rooms, its calendar, its library, its hosts.
 *  A sparse booth is honest, not broken — that's the cold-start story. */
export default function SectionView() {
  const { id } = useParams();
  const nav = useNavigate();
  const section = SECTIONS.find((s) => s.id === id);
  const floorCounts = usePrepStore((s) => s.floorCounts);
  const initFloor = usePrepStore((s) => s.initFloor);
  const driftFloor = usePrepStore((s) => s.driftFloor);
  const follows = usePrepStore((s) => s.follows);
  const toggleFollowSection = usePrepStore((s) => s.toggleFollowSection);

  useEffect(() => {
    initFloor();
    const t = setInterval(driftFloor, 3000);
    return () => clearInterval(t);
  }, [initFloor, driftFloor]);

  if (!section) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--prep-text-2)" }}>
        That booth doesn't exist. <Link to="/fair" className="underline">Back to the fair</Link>
      </div>
    );
  }

  const live = SESSIONS.filter((x) => x.sectionId === section.id && x.kind === "live");
  const scheduled = SESSIONS.filter((x) => x.sectionId === section.id && x.kind === "scheduled");
  const vods = SESSIONS.filter((x) => x.sectionId === section.id && x.kind === "vod");
  const hosts = HOSTS.filter((h) => h.sectionId === section.id);
  const following = follows.sections.includes(section.id);

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[760px] lg:px-8">
        <div className="mt-6 flex items-start gap-1">
          <button
            aria-label="Back to the fair"
            className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav("/fair")}
          >
            <IconArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1 pt-0.5">
            <h1 className="font-display text-[32px] leading-tight" style={{ fontWeight: 500 }}>
              {section.name}
            </h1>
            <div className="mt-1 text-[14px]" style={{ color: "var(--prep-text-3)" }}>
              {section.blurb}
            </div>
          </div>
          <button
            className={`chip mt-1 ${following ? "chip-active" : ""}`}
            onClick={() => toggleFollowSection(section.id)}
          >
            <IconBell size={13} />
            {following ? "Following" : "Follow"}
          </button>
        </div>

        {live.length === 0 && (
          <div className="card mt-6 p-6 text-center text-[15px]" style={{ color: "var(--prep-text-2)" }}>
            Nobody's live at this booth right now.
            {scheduled.length > 0 && (
              <div className="mt-1.5 text-[14px]" style={{ color: "var(--prep-text-3)" }}>
                Next session {scheduled[0].when}
              </div>
            )}
          </div>
        )}

        {live.map((sesh, i) => {
          const host = HOSTS.find((h) => h.id === sesh.hostId)!;
          return (
            <motion.button
              key={sesh.id}
              className="card mt-5 w-full p-5 text-left"
              {...fadeUp}
              transition={{ ...springs.standard, ...stagger(i) }}
              onClick={() => nav(`/room/${sesh.id}`)}
            >
              <div className="flex items-center justify-between">
                <LivePill />
                <span className="inline-flex items-center gap-1.5 text-[13px] tabular-nums" style={{ color: "var(--prep-text-2)" }}>
                  <IconEye size={14} />
                  {fmtCount(floorCounts[sesh.id] ?? 0)}
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

        {scheduled.length > 0 && (
          <>
            <h2 className="mt-11 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Scheduled
            </h2>
            {scheduled.map((sesh) => {
              const host = HOSTS.find((h) => h.id === sesh.hostId)!;
              return (
                <div key={sesh.id} className="card mt-3 flex items-center gap-4 p-4">
                  <div className="overline w-[76px] shrink-0 !leading-snug">
                    {sesh.when}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-medium">{sesh.title}</div>
                    <Link to={`/profile/${host.id}`} className="mt-1 flex items-center gap-1.5 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                      {host.name} <Badge state={host.badge} compact />
                    </Link>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {vods.length > 0 && (
          <>
            <h2 className="mt-11 font-display text-[24px]" style={{ fontWeight: 500 }}>
              The library
            </h2>
            <div className="mt-1 text-[13.5px]" style={{ color: "var(--prep-text-3)" }}>
              Past sessions, chaptered by question
            </div>
            {vods.map((sesh) => {
              return (
                <button
                  key={sesh.id}
                  className="card mt-3 flex w-full items-center gap-3.5 p-4 text-left"
                  onClick={() => nav(`/vod/${sesh.id}`)}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
                    style={{ borderColor: "var(--prep-line)", color: "var(--prep-text-2)" }}
                  >
                    <IconPlay size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-medium">{sesh.title}</div>
                    <div className="mt-1 text-[13px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                      Recorded · {sesh.vod!.durationLabel} · {sesh.vod!.chapters.length} questions ·{" "}
                      {fmtCount(sesh.vod!.views)} views
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        )}

        {hosts.length > 0 && (
          <>
            <h2 className="mt-11 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Hosts at this booth
            </h2>
            {hosts.map((host) => (
              <Link key={host.id} to={`/profile/${host.id}`} className="card mt-3 flex items-center gap-3.5 p-4">
                <Avatar hue={host.hue} initials={host.initials} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[15px] font-medium">
                    {host.name} <Badge state={host.badge} />
                  </div>
                  <div className="mt-0.5 truncate text-[13.5px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.headline}
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </main>
    </AppShell>
  );
}
