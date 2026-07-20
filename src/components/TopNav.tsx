import { Link, useNavigate } from "react-router-dom";
import { usePrepStore } from "../store/usePrepStore";
import { IconBell, IconGear, IconMic } from "./icons";

export function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <span className="font-display font-bold tracking-tight" style={{ fontSize: size }}>
      prep<span style={{ color: "var(--prep-amber)" }}>.io</span>
    </span>
  );
}

/** Top chrome for browse surfaces. Discovery = fair + calendar; there is no
 *  feed icon because there is no feed (Principle 3). */
export function TopNav() {
  const nav = useNavigate();
  const notifications = usePrepStore((s) => s.notifications);
  return (
    <header className="sticky top-0 z-30 border-b" style={{ background: "rgba(14,22,38,0.92)", borderColor: "var(--prep-line)", backdropFilter: "blur(8px)" }}>
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link to="/fair" aria-label="Prep.io fair floor">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-1.5">
          <button
            className="btn btn-ghost !gap-1.5 !px-3 !py-1.5 text-[13px]"
            onClick={() => nav("/host")}
          >
            <IconMic size={15} />
            Host
          </button>
          <button
            aria-label="Follows and notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav("/follows")}
          >
            <IconBell size={19} />
            {notifications.length > 0 && (
              <span
                className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
                style={{ background: "var(--prep-amber)" }}
              />
            )}
          </button>
          <button
            aria-label="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav("/settings")}
          >
            <IconGear size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}
