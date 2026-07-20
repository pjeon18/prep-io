import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { TopNav } from "../components/TopNav";
import { IconBell, IconCalendar, IconX } from "../components/icons";
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
    <div className="min-h-dvh pb-16">
      <TopNav />
      <main className="mx-auto max-w-md px-4">
        <h1 className="mt-5 font-display text-[22px] font-semibold">Follows</h1>
        <p className="mt-1 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
          Your follows become a calendar and go-live alerts. No feed, ever.
        </p>

        {notifications.length > 0 && (
          <>
            <h2 className="mt-6 flex items-center gap-2 font-display text-[15px] font-semibold">
              <IconBell size={15} /> Alerts
            </h2>
            {notifications.map((n) => (
              <div key={n.id} className="card mt-3 flex items-center gap-3 p-3.5">
                <button className="min-w-0 flex-1 text-left text-[13px] leading-snug" onClick={() => nav(n.to)}>
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

        <h2 className="mt-6 flex items-center gap-2 font-display text-[15px] font-semibold">
          <IconCalendar size={15} /> Your calendar
        </h2>
        {calendar.length === 0 ? (
          <div className="card mt-3 p-5 text-center text-[13.5px]" style={{ color: "var(--prep-text-3)" }}>
            Follow a host or a booth and their scheduled sessions land here.
            <div className="mt-3">
              <Link to="/fair" className="btn btn-ghost !py-2 text-[13px]">
                Walk the fair
              </Link>
            </div>
          </div>
        ) : (
          calendar.map((sesh) => {
            const host = HOSTS.find((h) => h.id === sesh.hostId)!;
            return (
              <div key={sesh.id} className="card mt-3 flex items-center gap-3 p-3.5">
                <div className="w-[74px] shrink-0 text-center font-display text-[12px] font-semibold" style={{ color: "var(--prep-amber)" }}>
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
          })
        )}

        {followedHosts.length > 0 && (
          <>
            <h2 className="mt-6 font-display text-[15px] font-semibold">Hosts you follow</h2>
            {followedHosts.map((host) => (
              <div key={host.id} className="card mt-3 flex items-center gap-3 p-3.5">
                <Avatar hue={host.hue} initials={host.initials} size={36} />
                <Link to={`/profile/${host.id}`} className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[13.5px] font-medium">
                    {host.name} <Badge state={host.badge} compact />
                  </div>
                  <div className="truncate text-[12px]" style={{ color: "var(--prep-text-2)" }}>
                    {host.headline}
                  </div>
                </Link>
                <button className="chip !py-1 text-[12px]" onClick={() => toggleFollowHost(host.id)}>
                  Unfollow
                </button>
              </div>
            ))}
          </>
        )}

        {follows.sections.length > 0 && (
          <>
            <h2 className="mt-6 font-display text-[15px] font-semibold">Booths you follow</h2>
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
