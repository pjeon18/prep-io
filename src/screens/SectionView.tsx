import { motion } from "framer-motion";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { LivePill } from "../components/LiveStage";
import { TopNav } from "../components/TopNav";
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
      <div className="p-8 text-center text-prep-text-2">
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
    <div className="min-h-dvh pb-16">
      <TopNav />
      <main className="mx-auto max-w-md px-4">
        <div className="mt-4 flex items-center gap-2">
          <button
            aria-label="Back to the fair"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav("/fair")}
          >
            <IconArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-[22px] font-semibold">{section.name}</h1>
            <div className="text-[13px]" style={{ color: "var(--prep-text-3)" }}>
              {section.blurb}
            </div>
          </div>
          <button
            className={`chip ${following ? "chip-active" : ""}`}
            onClick={() => toggleFollowSection(section.id)}
          >
            <IconBell size={13} />
            {following ? "Following" : "Follow"}
          </button>
        </div>

        {live.length === 0 && (
          <div className="card mt-5 p-5 text-center text-[14px]" style={{ color: "var(--prep-text-2)" }}>
            Nobody's live at this booth right now.
            {scheduled.length > 0 && (
              <div className="mt-1 text-[13px]" style={{ color: "var(--prep-text-3)" }}>
                Next session: {scheduled[0].when}
              </div>
            )}
          </div>
        )}

        {live.map((sesh, i) => {
          const host = HOSTS.find((h) => h.id === sesh.hostId)!;
          return (
            <motion.button
              key={sesh.id}
              className="card mt-4 w-full p-4 text-left"
              {...fadeUp}
              transition={{ ...springs.standard, ...stagger(i) }}
              onClick={() => nav(`/room/${sesh.id}`)}
            >
              <div className="flex items-start gap-3">
                <Avatar hue={host.hue} initials={host.initials} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <LivePill />
                    <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: "var(--prep-text-2)" }}>
                      <IconEye size={13} />
                      {fmtCount(floorCounts[sesh.id] ?? 0)} watching
                    </span>
                  </div>
                  <div className="mt-1.5 font-display text-[15px] font-semibold leading-snug">
                    {sesh.title}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[12px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.name}
                    <Badge state={host.badge} />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}

        {scheduled.length > 0 && (
          <>
            <h2 className="mt-7 font-display text-[16px] font-semibold">Scheduled</h2>
            {scheduled.map((sesh) => {
              const host = HOSTS.find((h) => h.id === sesh.hostId)!;
              return (
                <div key={sesh.id} className="card mt-3 flex items-center gap-3 p-3.5">
                  <div
                    className="w-[74px] shrink-0 text-center font-display text-[12px] font-semibold leading-tight"
                    style={{ color: "var(--prep-amber)" }}
                  >
                    {sesh.when}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium">{sesh.title}</div>
                    <Link to={`/profile/${host.id}`} className="mt-0.5 flex items-center gap-1.5 text-[12px]" style={{ color: "var(--prep-text-2)" }}>
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
            <h2 className="mt-7 font-display text-[16px] font-semibold">The library</h2>
            <div className="mt-1 text-[12px]" style={{ color: "var(--prep-text-3)" }}>
              Past sessions — clearly archives, chaptered by question
            </div>
            {vods.map((sesh) => {
              const host = HOSTS.find((h) => h.id === sesh.hostId)!;
              return (
                <button
                  key={sesh.id}
                  className="card mt-3 flex w-full items-center gap-3 p-3.5 text-left"
                  onClick={() => nav(`/vod/${sesh.id}`)}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tile"
                    style={{ background: "var(--prep-surface-2)", color: "var(--prep-text-2)" }}
                  >
                    <IconPlay size={17} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium">{sesh.title}</div>
                    <div className="mt-0.5 text-[12px]" style={{ color: "var(--prep-text-3)" }}>
                      ARCHIVE · {sesh.vod!.durationLabel} · {sesh.vod!.chapters.length} questions ·{" "}
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
            <h2 className="mt-7 font-display text-[16px] font-semibold">Hosts at this booth</h2>
            {hosts.map((host) => (
              <Link key={host.id} to={`/profile/${host.id}`} className="card mt-3 flex items-center gap-3 p-3.5">
                <Avatar hue={host.hue} initials={host.initials} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[14px] font-medium">
                    {host.name} <Badge state={host.badge} />
                  </div>
                  <div className="truncate text-[12px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.headline}
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
