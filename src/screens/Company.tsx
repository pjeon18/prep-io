import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Thumb } from "../components/Thumb";
import { AppShell } from "../components/AppShell";
import { IconArrowLeft, IconEye, IconTicket } from "../components/icons";
import { COMPANIES, SECTIONS } from "../data/seedData";
import { companyHosts, companySessions } from "../lib/search";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/** A company page: its people on Prep.io, their live rooms, events, and
 *  recordings. The B2B story ("Goldman office hours week") lives here. */
export default function Company() {
  const { id } = useParams();
  const nav = useNavigate();
  const company = COMPANIES.find((c) => c.id === id);
  const floorCounts = usePrepStore((s) => s.floorCounts);
  const initFloor = usePrepStore((s) => s.initFloor);
  const premium = usePrepStore((s) => s.premium);
  const goals = usePrepStore((s) => s.goals);
  const setGoals = usePrepStore((s) => s.setGoals);

  useEffect(() => initFloor(), [initFloor]);

  if (!company) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div style={{ color: "var(--prep-text-2)" }}>Company not found.</div>
        <Link to="/search" className="mt-4 text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
          Back to search
        </Link>
      </div>
    );
  }

  const hosts = companyHosts(company.id);
  const sessions = companySessions(company.id);
  const live = sessions.filter((x) => x.kind === "live");
  const events = sessions.filter((x) => x.kind === "scheduled" && x.ticket);
  const scheduled = sessions.filter((x) => x.kind === "scheduled" && !x.ticket);
  const vods = sessions.filter((x) => x.kind === "vod");
  const targeted = goals.companyIds.includes(company.id);

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[760px] lg:px-8">
        <button
          aria-label="Back"
          className="-ml-2 mt-5 flex h-10 w-10 items-center justify-center rounded-full"
          style={{ color: "var(--prep-text-2)" }}
          onClick={() => nav(-1)}
        >
          <IconArrowLeft size={20} />
        </button>

        <div className="mt-3 flex items-start gap-4">
          <Avatar hue={company.hue} initials={company.initials} size={64} />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[30px] leading-tight" style={{ fontWeight: 500 }}>
              {company.name}
            </h1>
            <div className="mt-1 text-[14px]" style={{ color: "var(--prep-text-3)" }}>
              {company.blurb} ·{" "}
              {company.sectionIds
                .map((sid) => SECTIONS.find((s) => s.id === sid)?.name)
                .join(" · ")}
            </div>
          </div>
        </div>

        <button
          className={`chip mt-4 ${targeted ? "chip-active" : ""}`}
          onClick={() =>
            setGoals({
              companyIds: targeted
                ? goals.companyIds.filter((x) => x !== company.id)
                : [...goals.companyIds, company.id],
            })
          }
        >
          {targeted ? "In your goals" : "Add to career goals"}
        </button>

        {hosts.length === 0 && (
          <div className="card mt-6 p-6 text-center text-[14.5px]" style={{ color: "var(--prep-text-2)" }}>
            No one from {company.name} hosts here yet.
          </div>
        )}

        {live.length > 0 && (
          <>
            <h2 className="mt-9 font-display text-[22px]" style={{ fontWeight: 500 }}>Live now</h2>
            {live.map((sesh) => {
              const host = hosts.find((h) => h.id === sesh.hostId)!;
              return (
                <button key={sesh.id} className="card mt-3 flex w-full items-center gap-3 p-3 text-left" onClick={() => nav(`/room/${sesh.id}`)}>
                  <div className="w-[124px] shrink-0">
                    <Thumb hue={host.hue} initials={host.initials} live height={70} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-[14px] font-medium leading-snug">{sesh.title}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[12.5px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                      <IconEye size={12} /> {fmtCount(floorCounts[sesh.id] ?? 0)} · {host.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </>
        )}

        {events.length > 0 && (
          <>
            <h2 className="mt-9 font-display text-[22px]" style={{ fontWeight: 500 }}>Events</h2>
            {events.map((sesh) => (
              <button key={sesh.id} className="card mt-3 flex w-full items-center gap-4 p-4 text-left" onClick={() => nav(`/event/${sesh.id}`)}>
                <div className="overline w-[76px] shrink-0 !leading-snug">{sesh.when}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-medium leading-snug">{sesh.title}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-[12.5px]" style={{ color: "var(--prep-text-3)" }}>
                    <IconTicket size={12} />
                    {sesh.ticket!.capacity - sesh.ticket!.seedTaken} of {sesh.ticket!.capacity} seats left
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {scheduled.length > 0 && (
          <>
            <h2 className="mt-9 font-display text-[22px]" style={{ fontWeight: 500 }}>Scheduled</h2>
            {scheduled.map((sesh) => {
              const host = hosts.find((h) => h.id === sesh.hostId)!;
              return (
                <div key={sesh.id} className="card mt-3 flex items-center gap-4 p-4">
                  <div className="overline w-[76px] shrink-0 !leading-snug">{sesh.when}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-medium">{sesh.title}</div>
                    <div className="mt-0.5 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>{host.name}</div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {hosts.length > 0 && (
          <>
            <h2 className="mt-9 font-display text-[22px]" style={{ fontWeight: 500 }}>
              People at {company.name}
            </h2>
            {hosts.map((host) => (
              <Link key={host.id} to={`/profile/${host.id}`} className="card mt-3 flex items-center gap-3.5 p-4">
                <Avatar hue={host.hue} initials={host.initials} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[15px] font-medium">
                    {host.name} <Badge state={host.badge} />
                  </div>
                  <div className="mt-0.5 truncate text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.headline}
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}

        {vods.length > 0 && (
          <>
            <h2 className="mt-9 font-display text-[22px]" style={{ fontWeight: 500 }}>Recordings</h2>
            {vods.map((sesh) => {
              const host = hosts.find((h) => h.id === sesh.hostId)!;
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
      </main>
    </AppShell>
  );
}
