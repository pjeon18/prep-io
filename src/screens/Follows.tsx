import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { TopNav } from "../components/TopNav";
import { IconX } from "../components/icons";
import { HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import { usePrepStore } from "../store/usePrepStore";

/** Follows produce a CALENDAR and notifications — never a feed (Principle 3).
 *  This screen is a schedule, not a scroll. */
export default function Follows() {
  const nav = useNavigate();
  const follows = usePrepStore((s) => s.follows);
  const notifications = usePrepStore((s) => s.notifications);
  const clearNotification = usePrepStore((s) => s.clearNotification);
  const toggleFollowHost = usePrepStore((s) => s.toggleFollowHost);

  const followedHosts = HOSTS.filter((h) => follows.hosts.includes(h.id));
  const calendar = SESSIONS.filter(
    (x) =>
      x.kind === "scheduled" &&
      (follows.hosts.includes(x.hostId) ||
        follows.sections.includes(x.sectionId)),
  );

  return (
    <div className="min-h-dvh pb-20">
      <TopNav />
      <main className="mx-auto max-w-md px-5">
        <h1 className="mt-9 font-display text-[32px]" style={{ fontWeight: 500 }}>
          Follows
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: "var(--prep-text-2)" }}>
          Follows become a calendar and go-live alerts. No feed.
        </p>

        {notifications.length > 0 && (
          <>
            <h2 className="mt-9 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Alerts
            </h2>
            {notifications.map((n) => (
              <div key={n.id} className="card mt-3 flex items-center gap-3 p-4">
                <button className="min-w-0 flex-1 text-left text-[14px] leading-snug" onClick={() => nav(n.to)}>
                  {n.text}
                </button>
                <button
                  aria-label="Dismiss"
                  className="shrink-0"
                  style={{ color: "var(--prep-text-3)" }}
                  onClick={() => clearNotification(n.id)}
                >
                  <IconX size={15} />
                </button>
              </div>
            ))}
          </>
        )}

        <h2 className="mt-9 font-display text-[24px]" style={{ fontWeight: 500 }}>
          Your calendar
        </h2>
        {calendar.length === 0 ? (
          <div className="card mt-3 p-6 text-center text-[14.5px]" style={{ color: "var(--prep-text-3)" }}>
            Follow a host or a booth and their scheduled sessions land here.
            <div className="mt-4">
              <Link to="/fair" className="btn btn-ghost !py-2.5 text-[14px]">
                Walk the fair
              </Link>
            </div>
          </div>
        ) : (
          calendar.map((sesh) => {
            const host = HOSTS.find((h) => h.id === sesh.hostId)!;
            return (
              <div key={sesh.id} className="card mt-3 flex items-center gap-4 p-4">
                <div className="overline w-[76px] shrink-0 !leading-snug">{sesh.when}</div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium">{sesh.title}</div>
                  <Link to={`/profile/${host.id}`} className="mt-1 flex items-center gap-1.5 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.name} <Badge state={host.badge} compact />
                  </Link>
                </div>
              </div>
            );
          })
        )}

        {followedHosts.length > 0 && (
          <>
            <h2 className="mt-9 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Hosts you follow
            </h2>
            {followedHosts.map((host) => (
              <div key={host.id} className="card mt-3 flex items-center gap-3.5 p-4">
                <Avatar hue={host.hue} initials={host.initials} size={36} />
                <Link to={`/profile/${host.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[15px] font-medium">
                    {host.name} <Badge state={host.badge} compact />
                  </div>
                  <div className="mt-0.5 truncate text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.headline}
                  </div>
                </Link>
                <button className="chip !py-1.5 text-[13px]" onClick={() => toggleFollowHost(host.id)}>
                  Unfollow
                </button>
              </div>
            ))}
          </>
        )}

        {follows.sections.length > 0 && (
          <>
            <h2 className="mt-9 font-display text-[24px]" style={{ fontWeight: 500 }}>
              Booths you follow
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {follows.sections.map((id) => (
                <Link key={id} to={`/section/${id}`} className="chip chip-active">
                  {SECTIONS.find((s) => s.id === id)?.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
