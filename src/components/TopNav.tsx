import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePrepStore } from "../store/usePrepStore";
import { Glass } from "./ui/Glass";
import { Pressable } from "./ui/Pressable";
import { SegmentedSwitch } from "./ui/SegmentedSwitch";
import { ThemeToggle } from "./ui/ThemeToggle";
import { IconBell, IconSearch, IconStar } from "./icons";

export function Wordmark({ size = 21 }: { size?: number }) {
  return (
    <span
      className="font-display italic"
      style={{ fontSize: size, fontWeight: 500, letterSpacing: "-0.01em" }}
    >
      prep.io
    </span>
  );
}

/* Top chrome — a glass bar over the content.
 *
 * Holds the one control that reframes the whole app: the Careers/Campus
 * mode switch (D17). Switching also routes, because leaving the user on a
 * careers URL with campus navigation is how you get a confusing empty page. */
export function TopNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const notifications = usePrepStore((s) => s.notifications);
  const premium = usePrepStore((s) => s.premium);
  const mode = usePrepStore((s) => s.mode);
  const setMode = usePrepStore((s) => s.setMode);

  const switchMode = (m: "careers" | "campus") => {
    if (m === mode) return;
    setMode(m);
    nav(m === "careers" ? "/fair" : "/campus");
  };

  // the theater owns its own chrome; don't stack a second bar on it
  const inRoom = pathname.startsWith("/room/") || pathname.startsWith("/host/live");
  if (inRoom) return null;

  return (
    <Glass
      as="header"
      variant="bar"
      position="sticky"
      className="top-0 z-30 border-b"
      style={{ borderColor: "var(--prep-line)" }}
    >
      <div className="mx-auto flex h-[60px] max-w-md items-center gap-2 px-5 lg:max-w-none lg:px-6">
        <Link to={mode === "careers" ? "/fair" : "/campus"} aria-label="Prep.io home" className="flex shrink-0 items-center gap-2">
          <Wordmark />
          {premium && (
            <span
              className="rounded-pill px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.06em]"
              style={{ background: "var(--prep-action-bg)", color: "var(--prep-action-fg)" }}
            >
              PREMIUM
            </span>
          )}
        </Link>

        {/* the dual-audience switch */}
        <div className="ml-1 hidden sm:block">
          <SegmentedSwitch
            layoutGroup="app-mode"
            size="sm"
            value={mode}
            onChange={switchMode}
            options={[
              { value: "careers", label: "Careers" },
              { value: "campus", label: "Campus" },
            ]}
          />
        </div>

        {/* desktop: search sits center, YouTube-style */}
        <Pressable
          as="div"
          onClick={() => nav("/search")}
          className="mx-6 hidden h-10 max-w-[460px] flex-1 cursor-pointer items-center gap-3 rounded-pill border px-4 text-left text-[14px] lg:flex"
          style={{ borderColor: "var(--prep-line)", color: "var(--prep-text-3)" }}
        >
          <IconSearch size={16} />
          {mode === "careers" ? "Search companies, people, streams" : "Search courses, staff, recordings"}
        </Pressable>

        <div className="ml-auto flex items-center gap-0.5">
          <Pressable
            aria-label="Search"
            onClick={() => nav("/search")}
            className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
            style={{ color: "var(--prep-text-2)" }}
          >
            <IconSearch size={19} />
          </Pressable>
          <Pressable
            aria-label="Alerts"
            onClick={() => nav("/follows")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
          >
            <IconBell size={19} />
            {notifications.length > 0 && (
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full"
                style={{ background: "var(--prep-live)" }}
              />
            )}
          </Pressable>
          <ThemeToggle />
          {!premium && (
            <Pressable
              aria-label="Premium"
              onClick={() => nav("/premium")}
              className="hidden h-10 w-10 items-center justify-center rounded-full sm:flex"
              style={{ color: "var(--prep-text-2)" }}
            >
              <IconStar size={19} />
            </Pressable>
          )}
        </div>
      </div>

      {/* mobile: the mode switch gets its own row so the bar doesn't crowd */}
      <div className="mx-auto -mt-1 flex max-w-md px-5 pb-2.5 sm:hidden">
        <SegmentedSwitch
          layoutGroup="app-mode-m"
          size="sm"
          value={mode}
          onChange={switchMode}
          options={[
            { value: "careers", label: "Careers" },
            { value: "campus", label: "Campus" },
          ]}
          className="w-full [&>*]:flex-1 [&>*]:justify-center"
        />
      </div>
    </Glass>
  );
}
