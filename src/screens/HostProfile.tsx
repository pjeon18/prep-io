import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { LivePill } from "../components/LiveStage";
import { TopNav } from "../components/TopNav";
import { IconArrowLeft, IconBell, IconEye, IconPlay } from "../components/icons";
import { HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/** A host's public face: credentials (or their absence), what's upcoming,
 *  and their library. Follower counts describe reach, they never rank —
 *  hosts are listed by booth, not by score. */
export default function HostProfile() {
  const { hostId } = useParams();
  const nav = useNavigate();
  const host = HOSTS.find((h) => h.id === hostId);
  const follows = usePrepStore((s) => s.follows);
  const toggleFollowHost = usePrepStore((s) => s.toggleFollowHost);
  const floorCounts = usePrepStore((s) => s.floorCounts);
  const initFloor = usePrepStore((s) => s.initFloor);

  useEffect(() => initFloor(), [initFloor]);

  if (!host) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div style={{ color: "var(--prep-text-2)" }}>Host not found.</div>
        <Link to="/fair" className="mt-4 text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
          Back to the fair
        </Link>
      </div>
    );
  }

  const live = SESSIONS.filter((x) => x.hostId === host.id && x.kind === "live");
  const scheduled = SESSIONS.filter((x) => x.hostId === host.id && x.kind === "scheduled");
  const vods = SESSIONS.filter((x) => x.hostId === host.id && x.kind === "vod");
  const following = follows.hosts.includes(host.id);
  const section = SECTIONS.find((s) => s.id === host.sectionId);

  return (
    <div className="min-h-dvh pb-20">
      <TopNav />
      <main className="mx-auto max-w-md px-5">
        <button
          aria-label="Back"
          className="-ml-2 mt-5 flex h-10 w-10 items-center justify-center rounded-full"
          style={{ color: "var(--prep-text-2)" }}
          onClick={() => nav(-1)}
        >
          <IconArrowLeft size={20} />
        </button>

        <div className="mt-3 flex items-start gap-4">
          <Avatar hue={host.hue} initials={host.initials} size={76} />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[28px] leading-tight" style={{ fontWeight: 500 }}>
              {host.name}
            </h1>
            <div className="mt-1 text-[15px]" style={{ color: "var(--prep-text-2)" }}>
              {host.headline}
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Badge state={host.badge} />
              <Link to={`/section/${host.sectionId}`} className="chip !py-1 text-[13px]">
                {section?.name}
              </Link>
            </div>
          </div>
        </div>

        {host.badge === "unverified" && (
          <div
            className="mt-5 rounded-tile border p-4 text-[13.5px] leading-relaxed"
            style={{ borderColor: "var(--prep-line)", color: "var(--prep-text-2)" }}
          >
            Credentials not verified. Role and employer are self-reported —
            weigh the advice accordingly.
          </div>
        )}

        <p className="mt-5 text-[15.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          {host.bio}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <button
            className={`btn flex-1 ${following ? "btn-ghost" : "btn-primary"}`}
            onClick={() => toggleFollowHost(host.id)}
          >
            <IconBell size={16} />
            {following ? "Following" : "Follow"}
          </button>
          <span className="text-[14px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
            {fmtCount(host.followers + (following ? 1 : 0))} followers
          </span>
        </div>
        <div className="mt-2.5 text-center text-[12.5px]" style={{ color: "var(--prep-text-3)" }}>
          Following means schedule alerts. No feed, no DMs.
        </div>

        {live.length > 0 && (
          <>
            <h2 className="mt-11 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Live right now
            </h2>
            {live.map((sesh) => (
              <button
                key={sesh.id}
                className="card mt-3 flex w-full items-center gap-3 p-4 text-left"
                onClick={() => nav(`/room/${sesh.id}`)}
              >
                <LivePill />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium">{sesh.title}</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] tabular-nums" style={{ color: "var(--prep-text-2)" }}>
                  <IconEye size={13} /> {fmtCount(floorCounts[sesh.id] ?? 0)}
                </span>
              </button>
            ))}
          </>
        )}

        {scheduled.length > 0 && (
          <>
            <h2 className="mt-11 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Upcoming
            </h2>
            {scheduled.map((sesh) => (
              <div key={sesh.id} className="card mt-3 flex items-center gap-4 p-4">
                <div className="overline w-[76px] shrink-0 !leading-snug">{sesh.when}</div>
                <div className="min-w-0 flex-1 truncate text-[15px] font-medium">{sesh.title}</div>
              </div>
            ))}
          </>
        )}

        {vods.length > 0 && (
          <>
            <h2 className="mt-11 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Library
            </h2>
            {vods.map((sesh) => (
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
                    Recorded · {sesh.vod!.durationLabel} · {sesh.vod!.chapters.length} questions
                  </div>
                </div>
              </button>
            ))}
          </>
        )}
      </main>
    </div>
  );
}
