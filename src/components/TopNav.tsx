import { Link, useNavigate } from "react-router-dom";
import { usePrepStore } from "../store/usePrepStore";
import { IconBell, IconGear, IconMic } from "./icons";

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

/** Top chrome for browse surfaces. Discovery = fair + calendar; there is no
 *  feed icon because there is no feed (Principle 3). */
export function TopNav() {
  const nav = useNavigate();
  const notifications = usePrepStore((s) => s.notifications);
  return (
    <header
      className="sticky top-0 z-30 border-b"
      style={{
        background: "rgba(250, 248, 244, 0.94)",
        borderColor: "var(--prep-line)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="mx-auto flex h-[60px] max-w-md items-center justify-between px-5">
        <Link to="/fair" aria-label="Prep.io fair floor">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-1">
          <button
            className="btn btn-ghost !gap-1.5 !px-3.5 !py-2 text-[14px]"
            onClick={() => nav("/host")}
          >
            <IconMic size={15} />
            Host
          </button>
          <button
            aria-label="Follows and notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav("/follows")}
          >
            <IconBell size={19} />
            {notifications.length > 0 && (
              <span
                className="absolute right-2 top-2 h-2 w-2 rounded-full"
                style={{ background: "var(--prep-live)" }}
              />
            )}
          </button>
          <button
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-full"
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
