import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { LivePill } from "../components/LiveStage";
import { Thumb } from "../components/Thumb";
import { AppShell } from "../components/AppShell";
import { IconBuilding, IconSearch, IconTicket } from "../components/icons";
import { COMPANIES, HOSTS } from "../data/seedData";
import { search } from "../lib/search";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/** Search — user-initiated discovery across companies, people, streams,
 *  events, recordings, and shorts. Type "BCG" and find the booth's people. */
export default function Search() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const floorCounts = usePrepStore((s) => s.floorCounts);
  const initFloor = usePrepStore((s) => s.initFloor);
  const premium = usePrepStore((s) => s.premium);

  useEffect(() => {
    initFloor();
    inputRef.current?.focus();
  }, [initFloor]);

  useEffect(() => {
    const t = setTimeout(() => setParams(q ? { q } : {}, { replace: true }), 250);
    return () => clearTimeout(t);
  }, [q, setParams]);

  const r = search(q);
  const hasResults =
    r.companies.length + r.hosts.length + r.live.length + r.upcoming.length +
    r.recordings.length + r.clips.length > 0;

  const h2 = "mt-8 font-display text-[22px]";

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[760px] lg:px-8">
        <div className="relative mt-6">
          <IconSearch
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          />
          <input
            ref={inputRef}
            className="input !rounded-pill !py-3.5 !pl-11"
            placeholder="Companies, people, streams — try “BCG”"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {q.trim().length < 2 && (
          <>
            <div className="overline mt-8">Browse companies</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {COMPANIES.map((c) => (
                <Link key={c.id} to={`/company/${c.id}`} className="chip">
                  <IconBuilding size={13} /> {c.name}
                </Link>
              ))}
            </div>
          </>
        )}

        {q.trim().length >= 2 && !hasResults && (
          <div className="mt-16 text-center text-[15px]" style={{ color: "var(--prep-text-3)" }}>
            Nothing for “{q}” yet.
          </div>
        )}

        {r.companies.length > 0 && (
          <>
            <h2 className={h2} style={{ fontWeight: 500 }}>Companies</h2>
            {r.companies.map((c) => (
              <Link key={c.id} to={`/company/${c.id}`} className="card mt-3 flex items-center gap-3.5 p-4">
                <Avatar hue={c.hue} initials={c.initials} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium">{c.name}</div>
                  <div className="text-[13px]" style={{ color: "var(--prep-text-3)" }}>{c.blurb}</div>
                </div>
              </Link>
            ))}
          </>
        )}

        {r.hosts.length > 0 && (
          <>
            <h2 className={h2} style={{ fontWeight: 500 }}>People</h2>
            {r.hosts.map((host) => (
              <Link key={host.id} to={`/profile/${host.id}`} className="card mt-3 flex items-center gap-3.5 p-4">
                <Avatar hue={host.hue} initials={host.initials} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[15px] font-medium">
                    {host.name} <Badge state={host.badge} compact />
                  </div>
                  <div className="truncate text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.headline}
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {r.live.length > 0 && (
          <>
            <h2 className={h2} style={{ fontWeight: 500 }}>Live now</h2>
            {r.live.map((sesh) => {
              const host = HOSTS.find((h) => h.id === sesh.hostId)!;
              return (
                <button key={sesh.id} className="card mt-3 flex w-full items-center gap-3 p-3 text-left" onClick={() => nav(`/room/${sesh.id}`)}>
                  <div className="w-[124px] shrink-0">
                    <Thumb hue={host.hue} initials={host.initials} live height={70} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-[14px] font-medium leading-snug">{sesh.title}</div>
                    <div className="mt-1 text-[12.5px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                      {host.name} · {fmtCount(floorCounts[sesh.id] ?? 0)} watching
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        )}

        {r.upcoming.length > 0 && (
          <>
            <h2 className={h2} style={{ fontWeight: 500 }}>Upcoming</h2>
            {r.upcoming.map((sesh) => {
              const host = HOSTS.find((h) => h.id === sesh.hostId)!;
              const to = sesh.ticket ? `/event/${sesh.id}` : `/profile/${host.id}`;
              return (
                <button key={sesh.id} className="card mt-3 flex w-full items-center gap-4 p-4 text-left" onClick={() => nav(to)}>
                  <div className="overline w-[76px] shrink-0 !leading-snug">{sesh.when}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium">{sesh.title}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
                      {host.name}
                      {sesh.ticket && (
                        <span className="inline-flex items-center gap-1" style={{ color: "var(--prep-text-3)" }}>
                          · <IconTicket size={12} /> ticketed
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        )}

        {r.recordings.length > 0 && (
          <>
            <h2 className={h2} style={{ fontWeight: 500 }}>Recordings</h2>
            {r.recordings.map((sesh) => {
              const host = HOSTS.find((h) => h.id === sesh.hostId)!;
              return (
                <button key={sesh.id} className="card mt-3 flex w-full items-center gap-3 p-3 text-left" onClick={() => nav(`/vod/${sesh.id}`)}>
                  <div className="w-[124px] shrink-0">
                    <Thumb
                      hue={host.hue}
                      initials={host.initials}
                      duration={sesh.vod!.durationLabel}
                      locked={!!sesh.vod!.premium && !premium}
                      height={70}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-[14px] font-medium leading-snug">{sesh.title}</div>
                    <div className="mt-1 text-[12.5px]" style={{ color: "var(--prep-text-3)" }}>
                      {host.name} · {fmtCount(sesh.vod!.views)} views
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        )}

        {r.clips.length > 0 && (
          <>
            <h2 className={h2} style={{ fontWeight: 500 }}>Shorts</h2>
            <div className="rail -mx-5 mt-3 flex gap-3 overflow-x-auto px-5">
              {r.clips.map((clip) => {
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
