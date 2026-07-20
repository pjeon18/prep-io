import { Link, useLocation } from "react-router-dom";
import { HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import { usePrepStore } from "../store/usePrepStore";
import { Avatar } from "./Avatar";
import { BottomNav } from "./BottomNav";
import { TopNav } from "./TopNav";
import {
  IconCalendar,
  IconCompass,
  IconGear,
  IconHome,
  IconLibrary,
  IconMic,
  IconStar,
} from "./icons";

/* The browse shell. Mobile: top bar + bottom tabs. Desktop (lg+): the
 * YouTube/Twitch chrome — a fixed left sidebar with nav, your
 * subscriptions, and the booths; content flows in a wide grid beside it. */

function SideLink({
  to,
  icon,
  label,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3.5 rounded-tile px-3.5 py-2.5 text-[14px]"
      style={{
        background: active ? "var(--prep-surface-2)" : "transparent",
        fontWeight: active ? 600 : 400,
      }}
    >
      {icon}
      {label}
    </Link>
  );
}

function Sidebar() {
  const { pathname } = useLocation();
  const follows = usePrepStore((s) => s.follows);
  const premium = usePrepStore((s) => s.premium);
  const subbed = HOSTS.filter((h) => follows.hosts.includes(h.id));
  const liveHostIds = new Set(
    SESSIONS.filter((x) => x.kind === "live").map((x) => x.hostId),
  );

  const sectionLabel = "overline px-3.5 pb-2 pt-6";

  return (
    <aside
      className="sticky top-[60px] hidden h-[calc(100dvh-60px)] w-[232px] shrink-0 flex-col overflow-y-auto border-r px-3 pb-6 pt-4 lg:flex"
      style={{ borderColor: "var(--prep-line)" }}
    >
      <nav className="flex flex-col gap-0.5">
        <SideLink to="/fair" icon={<IconHome size={19} />} label="Home" active={pathname.startsWith("/fair") || pathname.startsWith("/section")} />
        <SideLink to="/explore" icon={<IconCompass size={19} />} label="Explore" active={pathname.startsWith("/explore")} />
        <SideLink to="/library" icon={<IconLibrary size={19} />} label="Library" active={pathname.startsWith("/library") || pathname.startsWith("/playlist")} />
        <SideLink to="/follows" icon={<IconCalendar size={19} />} label="Calendar" active={pathname.startsWith("/follows")} />
        <SideLink to="/host" icon={<IconMic size={19} />} label="Host" active={pathname.startsWith("/host")} />
      </nav>

      <div className={sectionLabel}>Subscriptions</div>
      {subbed.length === 0 ? (
        <div className="px-3.5 text-[12.5px] leading-relaxed" style={{ color: "var(--prep-text-3)" }}>
          Channels you subscribe to live here.
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {subbed.map((h) => (
            <Link
              key={h.id}
              to={`/profile/${h.id}`}
              className="flex items-center gap-2.5 rounded-tile px-3.5 py-1.5 text-[13.5px]"
            >
              <Avatar hue={h.hue} initials={h.initials} size={24} />
              <span className="min-w-0 flex-1 truncate">{h.name}</span>
              {liveHostIds.has(h.id) && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--prep-live)" }} />
              )}
            </Link>
          ))}
        </div>
      )}

      <div className={sectionLabel}>The floor</div>
      <div className="flex flex-col gap-0.5">
        {SECTIONS.map((s) => {
          const live = SESSIONS.some((x) => x.sectionId === s.id && x.kind === "live");
          return (
            <Link
              key={s.id}
              to={`/section/${s.id}`}
              className="flex items-center gap-2.5 rounded-tile px-3.5 py-1.5 text-[13.5px]"
              style={{
                background: pathname === `/section/${s.id}` ? "var(--prep-surface-2)" : "transparent",
              }}
            >
              <span className="min-w-0 flex-1 truncate">{s.name}</span>
              {live && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--prep-live)" }} />
              )}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-0.5 pt-6">
        {!premium && (
          <SideLink to="/premium" icon={<IconStar size={18} />} label="Premium" active={pathname.startsWith("/premium")} />
        )}
        <SideLink to="/settings" icon={<IconGear size={18} />} label="Settings" active={pathname.startsWith("/settings")} />
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh pb-24 lg:pb-0">
      <TopNav />
      <div className="lg:flex">
        <Sidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}
