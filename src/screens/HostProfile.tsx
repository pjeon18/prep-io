import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { LivePill } from "../components/LiveStage";
import { Thumb } from "../components/Thumb";
import { AppShell } from "../components/AppShell";
import { IconArrowLeft, IconBell, IconCheck, IconEye } from "../components/icons";
import { CLIPS, COMPANIES, HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/* A channel: credentials (or their absence), live/upcoming, recordings,
 * shorts, and membership tiers. Follower counts describe reach, they never
 * rank — hosts are listed by booth, not by score. */

type Tab = "home" | "videos" | "shorts" | "membership";

export default function HostProfile() {
  const { hostId } = useParams();
  const nav = useNavigate();
  const host = HOSTS.find((h) => h.id === hostId);
  const [tab, setTab] = useState<Tab>("home");
  const follows = usePrepStore((s) => s.follows);
  const toggleFollowHost = usePrepStore((s) => s.toggleFollowHost);
  const floorCounts = usePrepStore((s) => s.floorCounts);
  const initFloor = usePrepStore((s) => s.initFloor);
  const premium = usePrepStore((s) => s.premium);
  const memberships = usePrepStore((s) => s.memberships);
  const joinMembership = usePrepStore((s) => s.joinMembership);
  const leaveMembership = usePrepStore((s) => s.leaveMembership);

  useEffect(() => initFloor(), [initFloor]);

  if (!host) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div style={{ color: "var(--prep-text-2)" }}>Channel not found.</div>
        <Link to="/fair" className="mt-4 text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
          Back to the fair
        </Link>
      </div>
    );
  }

  const live = SESSIONS.filter((x) => x.hostId === host.id && x.kind === "live");
  const scheduled = SESSIONS.filter((x) => x.hostId === host.id && x.kind === "scheduled");
  const vods = SESSIONS.filter((x) => x.hostId === host.id && x.kind === "vod");
  const clips = CLIPS.filter((c) => c.hostId === host.id);
  const subscribed = follows.hosts.includes(host.id);
  const section = SECTIONS.find((s) => s.id === host.sectionId);
  const company = COMPANIES.find((c) => c.id === host.companyId);
  const memberTierId = memberships[host.id];

  const tabs: { id: Tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "videos", label: "Videos" },
    { id: "shorts", label: "Shorts" },
    ...(host.tiers ? [{ id: "membership" as Tab, label: "Membership" }] : []),
  ];

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[1100px] lg:px-8">
        <button
          aria-label="Back"
          className="-ml-2 mt-5 flex h-10 w-10 items-center justify-center rounded-full"
          style={{ color: "var(--prep-text-2)" }}
          onClick={() => nav(-1)}
        >
          <IconArrowLeft size={20} />
        </button>

        <div className="mt-3 flex items-start gap-4">
          <Avatar hue={host.hue} initials={host.initials} size={72} />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[27px] leading-tight" style={{ fontWeight: 500 }}>
              {host.name}
            </h1>
            <div className="mt-1 text-[14.5px]" style={{ color: "var(--prep-text-2)" }}>
              {host.headline}
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Badge state={host.badge} />
              {company && (
                <Link to={`/company/${company.id}`} className="chip !py-1 text-[12.5px]">
                  {company.name}
                </Link>
              )}
              <Link to={`/section/${host.sectionId}`} className="chip !py-1 text-[12.5px]">
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

        <div className="mt-5 flex items-center gap-4">
          <button
            className={`btn flex-1 ${subscribed ? "btn-ghost" : "btn-primary"}`}
            onClick={() => toggleFollowHost(host.id)}
          >
            <IconBell size={16} />
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
          <span className="text-[14px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
            {fmtCount(host.followers + (subscribed ? 1 : 0))} subscribers
          </span>
        </div>
        <div className="mt-2 text-center text-[12px]" style={{ color: "var(--prep-text-3)" }}>
          Subscribing means go-live alerts. No feed, no DMs.
        </div>

        {/* tabs */}
        <div className="rail -mx-5 mt-6 flex gap-2 overflow-x-auto border-b px-5 pb-3" style={{ borderColor: "var(--prep-line)" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`chip shrink-0 ${tab === t.id ? "chip-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ---- Home ---- */}
        {tab === "home" && (
          <>
            <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              {host.bio}
            </p>

            {live.map((sesh) => (
              <button
                key={sesh.id}
                className="card mt-5 flex w-full items-center gap-3 p-3 text-left"
                style={{ borderColor: "var(--prep-live)" }}
                onClick={() => nav(`/room/${sesh.id}`)}
              >
                <div className="w-[124px] shrink-0">
                  <Thumb hue={host.hue} initials={host.initials} live height={70} />
                </div>
                <div className="min-w-0 flex-1">
                  <LivePill />
                  <div className="mt-1 line-clamp-2 text-[13.5px] font-medium leading-snug">{sesh.title}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[12px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                    <IconEye size={12} /> {fmtCount(floorCounts[sesh.id] ?? 0)}
                  </div>
                </div>
              </button>
            ))}

            {scheduled.length > 0 && (
              <>
                <h2 className="mt-8 font-display text-[21px]" style={{ fontWeight: 500 }}>Upcoming</h2>
                {scheduled.map((sesh) => (
                  <button
                    key={sesh.id}
                    className="card mt-3 flex w-full items-center gap-4 p-4 text-left"
                    onClick={() => sesh.ticket && nav(`/event/${sesh.id}`)}
                  >
                    <div className="overline w-[76px] shrink-0 !leading-snug">{sesh.when}</div>
                    <div className="min-w-0 flex-1 truncate text-[14px] font-medium">{sesh.title}</div>
                    {sesh.ticket && (
                      <span className="chip shrink-0 !py-1 text-[11.5px]">ticketed</span>
                    )}
                  </button>
                ))}
              </>
            )}
          </>
        )}

        {/* ---- Videos ---- */}
        {tab === "videos" && (
          <>
            {vods.length === 0 && (
              <div className="card mt-5 p-6 text-center text-[14px]" style={{ color: "var(--prep-text-3)" }}>
                No recordings yet.
              </div>
            )}
            <div className="lg:mt-5 lg:grid lg:grid-cols-3 lg:items-start lg:gap-5 lg:[&>button]:mt-0">
            {vods.map((sesh) => (
              <button key={sesh.id} className="mt-5 w-full text-left" onClick={() => nav(`/vod/${sesh.id}`)}>
                <Thumb
                  hue={host.hue}
                  initials={host.initials}
                  duration={sesh.vod!.durationLabel}
                  locked={!!sesh.vod!.premium && !premium && !memberTierId}
                  height={150}
                />
                <div className="mt-2 text-[14.5px] font-medium leading-snug">{sesh.title}</div>
                <div className="mt-0.5 text-[12.5px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                  {sesh.vod!.premium ? "Members & Premium · " : ""}
                  {fmtCount(sesh.vod!.views)} views · {sesh.vod!.recordedOn}
                </div>
              </button>
            ))}
            </div>
          </>
        )}

        {/* ---- Shorts ---- */}
        {tab === "shorts" && (
          <>
            {clips.length === 0 ? (
              <div className="card mt-5 p-6 text-center text-[14px]" style={{ color: "var(--prep-text-3)" }}>
                No shorts yet.
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-3 items-start gap-2.5 lg:grid-cols-6">
                {clips.map((clip) => (
                  <button key={clip.id} className="text-left" onClick={() => nav(`/shorts/${clip.id}`)}>
                    <Thumb hue={clip.hue} initials={host.initials} duration={clip.durationLabel} height={150} />
                    <div className="mt-1.5 line-clamp-2 text-[12px] font-medium leading-snug">{clip.title}</div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ---- Membership ---- */}
        {tab === "membership" && host.tiers && (
          <>
            <p className="mt-5 text-[14.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
              Membership pays for {host.name.split(" ")[0]}'s time and tools —
              resources, members-only recordings, and 1:1 access. Never for
              placement.
            </p>
            {host.tiers.map((tier) => {
              const isMember = memberTierId === tier.id;
              return (
                <div
                  key={tier.id}
                  className="card mt-4 p-5"
                  style={isMember ? { borderColor: "var(--prep-verified)" } : undefined}
                >
                  <div className="flex items-baseline justify-between">
                    <div className="font-display text-[20px]" style={{ fontWeight: 500 }}>
                      {tier.name}
                    </div>
                    <div className="text-[15px] font-medium tabular-nums">
                      ${tier.price}
                      <span className="text-[12px]" style={{ color: "var(--prep-text-3)" }}> /mo</span>
                    </div>
                  </div>
                  <ul className="mt-3 flex flex-col gap-2">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-[13.5px]" style={{ color: "var(--prep-text-2)" }}>
                        <span className="mt-0.5 shrink-0" style={{ color: "var(--prep-verified)" }}>
                          <IconCheck size={14} />
                        </span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                  {isMember ? (
                    <button className="btn btn-ghost mt-4 w-full !py-2.5 text-[13.5px]" onClick={() => leaveMembership(host.id)}>
                      Cancel membership
                    </button>
                  ) : (
                    <button className="btn btn-primary mt-4 w-full !py-2.5 text-[13.5px]" onClick={() => joinMembership(host.id, tier.id)}>
                      Join {tier.name}
                    </button>
                  )}
                </div>
              );
            })}
            <div className="mt-3 text-center text-[11.5px]" style={{ color: "var(--prep-text-3)" }}>
              Prototype — no real billing.
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}
