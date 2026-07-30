import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HOSTS, SECTIONS, SESSIONS } from "../data/seedData";
import { campusLiveNow, myCourses } from "../lib/campus";
import { springs } from "../lib/motion";
import { usePrepStore } from "../store/usePrepStore";
import { Avatar } from "./Avatar";
import { TopNav } from "./TopNav";
import { AmbientField } from "./ui/AmbientField";
import { Dock } from "./ui/Dock";
import type { DockItem } from "./ui/Dock";
import { Pressable } from "./ui/Pressable";
import {
  IconCalendar,
  IconCompass,
  IconGear,
  IconHome,
  IconLibrary,
  IconMic,
  IconStar,
  IconUsers,
} from "./icons";

/* The browse shell.
 *
 * Mobile: glass top bar + a floating glass dock.
 * Desktop (lg+): the YouTube/Twitch chrome — fixed left sidebar, centered
 * search, wide content grid.
 *
 * Both are MODE-AWARE (D17): the sidebar and the dock re-label themselves
 * for Careers or Campus, because the two audiences don't share a mental
 * model — one browses a fair of companies, the other opens their courses. */

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
    <Pressable
      as="div"
      className="relative rounded-tile"
      style={{ cursor: "pointer" }}
    >
      <Link
        to={to}
        className="relative flex items-center gap-3.5 rounded-tile px-3.5 py-2.5 text-[14px]"
        style={{ fontWeight: active ? 600 : 400 }}
      >
        {active && (
          <motion.span
            layoutId="side-active"
            transition={springs.standard}
            className="absolute inset-0 rounded-tile"
            style={{ background: "var(--prep-surface-2)", zIndex: -1 }}
          />
        )}
        {icon}
        {label}
      </Link>
    </Pressable>
  );
}

function Sidebar() {
  const { pathname } = useLocation();
  const mode = usePrepStore((s) => s.mode);
  const follows = usePrepStore((s) => s.follows);
  const premium = usePrepStore((s) => s.premium);

  const sectionLabel = "overline px-3.5 pb-2 pt-6";

  return (
    <aside
      className="sticky top-[60px] hidden h-[calc(100dvh-60px)] w-[236px] shrink-0 flex-col overflow-y-auto border-r px-3 pb-6 pt-4 lg:flex"
      style={{ borderColor: "var(--prep-line)" }}
    >
      {mode === "careers" ? <CareersSidebar pathname={pathname} follows={follows} /> : <CampusSidebar pathname={pathname} />}

      <div className="mt-auto flex flex-col gap-0.5 pt-6">
        {!premium && (
          <SideLink
            to="/premium"
            icon={<IconStar size={18} />}
            label="Premium"
            active={pathname.startsWith("/premium")}
          />
        )}
        <SideLink
          to="/settings"
          icon={<IconGear size={18} />}
          label="Settings"
          active={pathname.startsWith("/settings")}
        />
      </div>
    </aside>
  );
}

function CareersSidebar({
  pathname,
  follows,
}: {
  pathname: string;
  follows: { hosts: string[] };
}) {
  const subbed = HOSTS.filter((h) => follows.hosts.includes(h.id));
  const liveHostIds = new Set(SESSIONS.filter((x) => x.kind === "live").map((x) => x.hostId));
  const sectionLabel = "overline px-3.5 pb-2 pt-6";

  return (
    <>
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
          Channels you subscribe to appear here.
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
              style={{ background: pathname === `/section/${s.id}` ? "var(--prep-surface-2)" : "transparent" }}
            >
              <span className="min-w-0 flex-1 truncate">{s.name}</span>
              {live && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--prep-live)" }} />}
            </Link>
          );
        })}
      </div>
    </>
  );
}

function CampusSidebar({ pathname }: { pathname: string }) {
  const courses = myCourses();
  const liveCourseIds = new Set(campusLiveNow().map((s) => s.courseId));
  const sectionLabel = "overline px-3.5 pb-2 pt-6";

  return (
    <>
      <nav className="flex flex-col gap-0.5">
        <SideLink to="/campus" icon={<IconHome size={19} />} label="My courses" active={pathname === "/campus"} />
        <SideLink to="/library" icon={<IconLibrary size={19} />} label="Library" active={pathname.startsWith("/library") || pathname.startsWith("/playlist")} />
        <SideLink to="/campus/teach" icon={<IconMic size={19} />} label="Teach" active={pathname.startsWith("/campus/teach")} />
      </nav>

      <div className={sectionLabel}>Enrolled</div>
      <div className="flex flex-col gap-0.5">
        {courses.map((c) => (
          <Link
            key={c.id}
            to={`/campus/course/${c.id}`}
            className="flex items-center gap-2.5 rounded-tile px-3.5 py-2 text-[13.5px]"
            style={{
              background: pathname === `/campus/course/${c.id}` ? "var(--prep-surface-2)" : "transparent",
            }}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[9.5px] font-semibold"
              style={{ background: `hsl(${c.hue} 40% 92%)`, color: `hsl(${c.hue} 45% 28%)` }}
            >
              {c.code.replace(/[^A-Z]/g, "").slice(0, 4)}
            </span>
            <span className="min-w-0 flex-1 truncate">{c.code}</span>
            {liveCourseIds.has(c.id) && (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--prep-live)" }} />
            )}
          </Link>
        ))}
      </div>

    </>
  );
}

/** The floating dock (mobile) — mode-aware. */
function ModeDock() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const mode = usePrepStore((s) => s.mode);

  const careers: DockItem[] = [
    { key: "home", label: "Home", icon: IconHome, active: pathname.startsWith("/fair") || pathname.startsWith("/section"), onClick: () => nav("/fair") },
    { key: "explore", label: "Explore", icon: IconCompass, active: pathname.startsWith("/explore"), onClick: () => nav("/explore") },
    { key: "library", label: "Library", icon: IconLibrary, active: pathname.startsWith("/library"), onClick: () => nav("/library") },
    { key: "host", label: "Host", icon: IconMic, active: pathname.startsWith("/host"), onClick: () => nav("/host") },
  ];

  const campus: DockItem[] = [
    { key: "courses", label: "Courses", icon: IconHome, active: pathname === "/campus" || pathname.startsWith("/campus/course"), onClick: () => nav("/campus") },
    { key: "library", label: "Library", icon: IconLibrary, active: pathname.startsWith("/library"), onClick: () => nav("/library") },
    { key: "teach", label: "Teach", icon: IconMic, active: pathname.startsWith("/campus/teach"), onClick: () => nav("/campus/teach") },
    { key: "staff", label: "Staff", icon: IconUsers, active: pathname.startsWith("/profile/s-"), onClick: () => nav("/campus") },
  ];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-3 lg:hidden"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="pointer-events-auto">
        <Dock items={mode === "careers" ? careers : campus} />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh pb-28 lg:pb-0">
      {/* the light the glass chrome refracts */}
      <AmbientField />
      <div className="relative z-10">
        <TopNav />
        <div className="lg:flex">
          <Sidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
      <ModeDock />
    </div>
  );
}
