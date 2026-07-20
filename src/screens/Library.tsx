import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Thumb } from "../components/Thumb";
import { AppShell } from "../components/AppShell";
import {
  IconClock,
  IconGear,
  IconHeart,
  IconList,
  IconPlus,
  IconStar,
  IconTicket,
} from "../components/icons";
import { CLIPS, HOSTS, SESSIONS } from "../data/seedData";
import { usePrepStore } from "../store/usePrepStore";

/* The Library — everything that's yours: watch history, likes, tickets,
 * subscriptions, and (premium) playlists. Private, local, chronological.
 * Not a feed; a shelf. */

type Tab = "history" | "liked" | "tickets" | "playlists" | "subs";

export default function Library() {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("history");
  const history = usePrepStore((s) => s.history);
  const clearHistory = usePrepStore((s) => s.clearHistory);
  const likes = usePrepStore((s) => s.likes);
  const tickets = usePrepStore((s) => s.tickets);
  const releaseTicket = usePrepStore((s) => s.releaseTicket);
  const playlists = usePrepStore((s) => s.playlists);
  const createPlaylist = usePrepStore((s) => s.createPlaylist);
  const premium = usePrepStore((s) => s.premium);
  const follows = usePrepStore((s) => s.follows);
  const memberships = usePrepStore((s) => s.memberships);
  const userVods = usePrepStore((s) => s.userVods);
  const [newName, setNewName] = useState("");

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "history", label: "History", icon: IconClock },
    { id: "liked", label: "Liked", icon: IconHeart },
    { id: "tickets", label: "Tickets", icon: IconTicket },
    { id: "playlists", label: "Playlists", icon: IconList },
    { id: "subs", label: "Subs", icon: IconStar },
  ];

  const allVods = [...SESSIONS.filter((x) => x.kind === "vod"), ...userVods];
  const likedSessions = SESSIONS.filter(
    (x) => likes.sessions.includes(x.id) || (x.kind === "vod" && likes.sessions.includes(x.id)),
  );
  const likedClips = CLIPS.filter((c) => likes.clips.includes(c.id));
  const ticketList = Object.values(tickets)
    .map((t) => ({ t, sesh: SESSIONS.find((x) => x.id === t.sessionId) }))
    .filter((x) => x.sesh);
  const subbedHosts = HOSTS.filter((h) => follows.hosts.includes(h.id));

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[760px] lg:px-8">
        <div className="mt-9 flex items-center justify-between">
          <h1 className="font-display text-[32px]" style={{ fontWeight: 500 }}>
            Library
          </h1>
          <button
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav("/settings")}
          >
            <IconGear size={19} />
          </button>
        </div>

        <div className="rail -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`chip shrink-0 ${tab === t.id ? "chip-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {/* ---------- History ---------- */}
        {tab === "history" && (
          <>
            {history.length === 0 ? (
              <Empty text="Rooms and recordings you open show up here. Only you can see it." />
            ) : (
              <>
                {history.map((h) => {
                  const host = HOSTS.find((x) => x.id === h.hostId);
                  const to =
                    h.kind === "live"
                      ? `/room/${h.id}`
                      : h.kind === "vod"
                        ? `/vod/${h.id}`
                        : `/shorts/${h.id}`;
                  return (
                    <button key={h.id} className="card mt-3 flex w-full items-center gap-3.5 p-4 text-left" onClick={() => nav(to)}>
                      {host ? (
                        <Avatar hue={host.hue} initials={host.initials} size={36} />
                      ) : (
                        <Avatar hue={36} initials="Y" size={36} />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-medium">{h.title}</div>
                        <div className="mt-0.5 text-[12.5px]" style={{ color: "var(--prep-text-3)" }}>
                          {h.kind === "live" ? "Live room" : h.kind === "vod" ? "Recording" : "Short"} · {h.when}
                        </div>
                      </div>
                    </button>
                  );
                })}
                <button className="btn btn-ghost mt-5 w-full !py-2.5 text-[13.5px]" onClick={clearHistory}>
                  Clear history
                </button>
              </>
            )}
          </>
        )}

        {/* ---------- Liked ---------- */}
        {tab === "liked" && (
          <>
            {likedSessions.length + likedClips.length === 0 ? (
              <Empty text="Tap the heart on a stream, recording, or short to keep it here." />
            ) : (
              <>
                {likedSessions.map((sesh) => {
                  const host = HOSTS.find((h) => h.id === sesh.hostId)!;
                  const to = sesh.kind === "live" ? `/room/${sesh.id}` : `/vod/${sesh.id}`;
                  return (
                    <button key={sesh.id} className="card mt-3 flex w-full items-center gap-3 p-3 text-left" onClick={() => nav(to)}>
                      <div className="w-[110px] shrink-0">
                        <Thumb hue={host.hue} initials={host.initials} live={sesh.kind === "live"} duration={sesh.vod?.durationLabel} height={62} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-[13.5px] font-medium leading-snug">{sesh.title}</div>
                        <div className="mt-0.5 text-[12px]" style={{ color: "var(--prep-text-3)" }}>{host.name}</div>
                      </div>
                    </button>
                  );
                })}
                {likedClips.map((clip) => {
                  const host = HOSTS.find((h) => h.id === clip.hostId)!;
                  return (
                    <button key={clip.id} className="card mt-3 flex w-full items-center gap-3 p-3 text-left" onClick={() => nav(`/shorts/${clip.id}`)}>
                      <div className="w-[110px] shrink-0">
                        <Thumb hue={clip.hue} initials={host.initials} duration={clip.durationLabel} height={62} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-[13.5px] font-medium leading-snug">{clip.title}</div>
                        <div className="mt-0.5 text-[12px]" style={{ color: "var(--prep-text-3)" }}>Short · {host.name}</div>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </>
        )}

        {/* ---------- Tickets ---------- */}
        {tab === "tickets" && (
          <>
            {ticketList.length === 0 ? (
              <Empty text="Seats you reserve at capacity-limited events live here." />
            ) : (
              ticketList.map(({ t, sesh }) => {
                const host = HOSTS.find((h) => h.id === sesh!.hostId)!;
                return (
                  <div key={t.sessionId} className="card mt-3 p-4">
                    <div className="flex items-center gap-4">
                      <div className="overline w-[76px] shrink-0 !leading-snug">{sesh!.when}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-medium leading-snug">{sesh!.title}</div>
                        <div className="mt-0.5 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>{host.name}</div>
                      </div>
                    </div>
                    <div
                      className="mt-3 flex items-center justify-between border-t pt-3 text-[12.5px]"
                      style={{ borderColor: "var(--prep-line)", color: "var(--prep-text-3)" }}
                    >
                      <span>
                        {t.paid === 1
                          ? "$1 commitment — refunded when you attend"
                          : t.paid > 0
                            ? `Paid $${t.paid}`
                            : "Free seat"}
                      </span>
                      <button
                        className="underline"
                        onClick={() => releaseTicket(t.sessionId)}
                      >
                        Give up seat
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ---------- Playlists (premium) ---------- */}
        {tab === "playlists" && (
          <>
            {!premium ? (
              <div className="card mt-5 p-6 text-center">
                <div className="font-display text-[20px]" style={{ fontWeight: 500 }}>
                  Build your own course
                </div>
                <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
                  Playlists are a Premium tool — string recordings and shorts
                  into an ordered mini-course.
                </p>
                <Link to="/premium" className="btn btn-primary mt-4">
                  See Premium
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-4 flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="New playlist — e.g. IB prep in 5 sessions"
                    value={newName}
                    maxLength={50}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <button
                    className="btn btn-primary !px-4"
                    disabled={!newName.trim()}
                    onClick={() => {
                      const id = createPlaylist(newName);
                      if (id) setNewName("");
                    }}
                    aria-label="Create playlist"
                  >
                    <IconPlus size={17} />
                  </button>
                </div>
                {playlists.length === 0 ? (
                  <Empty text="Add recordings and shorts from their pages, or start one here." />
                ) : (
                  playlists.map((p) => (
                    <button key={p.id} className="card mt-3 flex w-full items-center gap-3.5 p-4 text-left" onClick={() => nav(`/playlist/${p.id}`)}>
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tile"
                        style={{ background: "var(--prep-surface-2)", color: "var(--prep-text-2)" }}
                      >
                        <IconList size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[15px] font-medium">{p.name}</div>
                        <div className="mt-0.5 text-[12.5px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                          {p.items.length} {p.items.length === 1 ? "item" : "items"}
                        </div>
                      </div>
                    </button>
                  ))
                )}
                {allVods.length > 0 && playlists.length > 0 && (
                  <div className="mt-3 text-[12.5px]" style={{ color: "var(--prep-text-3)" }}>
                    Add items from any recording or short page.
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ---------- Subscriptions ---------- */}
        {tab === "subs" && (
          <>
            {subbedHosts.length === 0 ? (
              <Empty text="Subscribe to channels to get go-live alerts. Paid tiers unlock member perks." />
            ) : (
              subbedHosts.map((host) => {
                const tierId = memberships[host.id];
                const tier = host.tiers?.find((t) => t.id === tierId);
                return (
                  <Link key={host.id} to={`/profile/${host.id}`} className="card mt-3 flex items-center gap-3.5 p-4">
                    <Avatar hue={host.hue} initials={host.initials} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[15px] font-medium">
                        {host.name} <Badge state={host.badge} compact />
                      </div>
                      <div className="mt-0.5 text-[12.5px]" style={{ color: tier ? "var(--prep-verified)" : "var(--prep-text-3)" }}>
                        {tier ? `${tier.name} member · $${tier.price}/mo` : "Free subscriber"}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </>
        )}
      </main>
    </AppShell>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="card mt-5 p-6 text-center text-[14px] leading-relaxed" style={{ color: "var(--prep-text-3)" }}>
      {text}
    </div>
  );
}
