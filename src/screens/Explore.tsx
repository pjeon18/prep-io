import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Thumb } from "../components/Thumb";
import { AppShell } from "../components/AppShell";
import { IconEye, IconTicket } from "../components/icons";
import { CLIPS, COMPANIES, HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import type { SectionId } from "../lib/types";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/* Explore — recommendations WITHOUT a feed (D10). You state your goals
 * (sections + target companies); everything below is a finite, transparent
 * match against them. No engagement loop, no infinite scroll, and every
 * shelf says why it's there. */

export default function Explore() {
  const nav = useNavigate();
  const goals = usePrepStore((s) => s.goals);
  const setGoals = usePrepStore((s) => s.setGoals);
  const floorCounts = usePrepStore((s) => s.floorCounts);
  const initFloor = usePrepStore((s) => s.initFloor);
  const driftFloor = usePrepStore((s) => s.driftFloor);
  const follows = usePrepStore((s) => s.follows);
  const premium = usePrepStore((s) => s.premium);

  useEffect(() => {
    initFloor();
    const t = setInterval(driftFloor, 3000);
    return () => clearInterval(t);
  }, [initFloor, driftFloor]);

  const hasGoals = goals.sections.length > 0 || goals.companyIds.length > 0;

  const goalHostIds = new Set(
    HOSTS.filter(
      (h) =>
        goals.sections.includes(h.sectionId) ||
        (h.companyId && goals.companyIds.includes(h.companyId)),
    ).map((h) => h.id),
  );

  const matches = (hostId: string, sectionId: SectionId) =>
    goalHostIds.has(hostId) || goals.sections.includes(sectionId);

  const liveForYou = SESSIONS.filter(
    (x) => x.kind === "live" && matches(x.hostId, x.sectionId),
  );
  const upcomingForYou = SESSIONS.filter(
    (x) => x.kind === "scheduled" && matches(x.hostId, x.sectionId),
  ).slice(0, 5);
  const channelsForYou = HOSTS.filter(
    (h) => goalHostIds.has(h.id) && !follows.hosts.includes(h.id),
  ).slice(0, 5);
  const recordingsForYou = SESSIONS.filter(
    (x) => x.kind === "vod" && matches(x.hostId, x.sectionId),
  ).slice(0, 4);
  const clipsForYou = (hasGoals
    ? CLIPS.filter((c) => goalHostIds.has(c.hostId))
    : CLIPS
  ).slice(0, 8);

  const whyLabel = [
    ...goals.sections.map((s) => SECTIONS.find((x) => x.id === s)?.name),
    ...goals.companyIds.map((c) => COMPANIES.find((x) => x.id === c)?.name),
  ]
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[1440px] lg:px-8">
        <h1 className="mt-9 font-display text-[32px]" style={{ fontWeight: 500 }}>
          Explore
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          Tell it where you're headed. Everything below matches your goals —
          stated by you, not inferred. No feed.
        </p>

        {/* goals */}
        <div className="overline mt-7">Your target fields</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {SECTIONS.map((s) => {
            const on = goals.sections.includes(s.id);
            return (
              <button
                key={s.id}
                className={`chip ${on ? "chip-active" : ""}`}
                onClick={() =>
                  setGoals({
                    sections: on
                      ? goals.sections.filter((x) => x !== s.id)
                      : [...goals.sections, s.id],
                  })
                }
              >
                {s.name}
              </button>
            );
          })}
        </div>
        <div className="overline mt-6">Your target companies</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {COMPANIES.map((c) => {
            const on = goals.companyIds.includes(c.id);
            return (
              <button
                key={c.id}
                className={`chip ${on ? "chip-active" : ""}`}
                onClick={() =>
                  setGoals({
                    companyIds: on
                      ? goals.companyIds.filter((x) => x !== c.id)
                      : [...goals.companyIds, c.id],
                  })
                }
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {!hasGoals ? (
          <div className="card mt-8 p-6 text-center text-[14.5px]" style={{ color: "var(--prep-text-3)" }}>
            Pick a field or a company and this page builds itself around it.
          </div>
        ) : (
          <>
            {liveForYou.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-[22px]" style={{ fontWeight: 500 }}>
                  Live for your goals
                </h2>
                <div className="text-[12.5px]" style={{ color: "var(--prep-text-3)" }}>
                  because you're targeting {whyLabel}
                </div>
                <div className="lg:mt-4 lg:grid lg:grid-cols-3 lg:gap-5 lg:[&>button]:mt-0 xl:grid-cols-4">
                {liveForYou.map((sesh) => {
                  const host = HOSTS.find((h) => h.id === sesh.hostId)!;
                  return (
                    <button key={sesh.id} className="card mt-3 w-full p-3 text-left" onClick={() => nav(`/room/${sesh.id}`)}>
                      <Thumb hue={host.hue} initials={host.initials} live video={sesh.video} height={150} />
                      <div className="mt-2.5 px-1">
                        <div className="text-[15px] font-medium leading-snug">{sesh.title}</div>
                        <div className="mt-1 flex items-center gap-1.5 text-[12.5px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                          {host.name} <Badge state={host.badge} compact />
                          <span className="inline-flex items-center gap-1">
                            · <IconEye size={12} /> {fmtCount(floorCounts[sesh.id] ?? 0)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
                </div>
              </>
            )}

            {upcomingForYou.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-[22px]" style={{ fontWeight: 500 }}>
                  Worth your calendar
                </h2>
                {upcomingForYou.map((sesh) => {
                  const host = HOSTS.find((h) => h.id === sesh.hostId)!;
                  const to = sesh.ticket ? `/event/${sesh.id}` : `/profile/${host.id}`;
                  return (
                    <button key={sesh.id} className="card mt-3 flex w-full items-center gap-4 p-4 text-left" onClick={() => nav(to)}>
                      <div className="overline w-[76px] shrink-0 !leading-snug">{sesh.when}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium leading-snug">{sesh.title}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
                          {host.name}
                          {sesh.ticket && (
                            <span className="inline-flex items-center gap-1" style={{ color: "var(--prep-text-3)" }}>
                              · <IconTicket size={12} /> {sesh.ticket.capacity - sesh.ticket.seedTaken} seats left
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {channelsForYou.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-[22px]" style={{ fontWeight: 500 }}>
                  Channels to know
                </h2>
                {channelsForYou.map((host) => (
                  <Link key={host.id} to={`/profile/${host.id}`} className="card mt-3 flex items-center gap-3.5 p-4">
                    <Avatar hue={host.hue} initials={host.initials} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[15px] font-medium">
                        {host.name} <Badge state={host.badge} compact />
                      </div>
                      <div className="mt-0.5 truncate text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                        {host.headline}
                      </div>
                    </div>
                  </Link>
                ))}
              </>
            )}

            {recordingsForYou.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-[22px]" style={{ fontWeight: 500 }}>
                  From the library
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {recordingsForYou.map((sesh) => {
                    const host = HOSTS.find((h) => h.id === sesh.hostId)!;
                    return (
                      <button key={sesh.id} className="text-left" onClick={() => nav(`/vod/${sesh.id}`)}>
                        <Thumb
                          hue={host.hue}
                          initials={host.initials}
                          duration={sesh.vod!.durationLabel}
                          locked={!!sesh.vod!.premium && !premium}
                          height={92}
                        />
                        <div className="mt-1.5 line-clamp-2 text-[13px] font-medium leading-snug">{sesh.title}</div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {clipsForYou.length > 0 && (
          <>
            <h2 className="mt-10 font-display text-[22px]" style={{ fontWeight: 500 }}>
              Shorts
            </h2>
            <div className="rail -mx-5 mt-3 flex gap-3 overflow-x-auto px-5">
              {clipsForYou.map((clip) => {
                const host = HOSTS.find((h) => h.id === clip.hostId)!;
                return (
                  <button key={clip.id} className="w-[120px] shrink-0 text-left" onClick={() => nav(`/shorts/${clip.id}`)}>
                    <Thumb hue={clip.hue} initials={host.initials} duration={clip.durationLabel} height={180} />
                    <div className="mt-1.5 line-clamp-2 text-[12.5px] font-medium leading-snug">{clip.title}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}
