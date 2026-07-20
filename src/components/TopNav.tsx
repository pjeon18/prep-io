import { Link, useNavigate } from "react-router-dom";
import { usePrepStore } from "../store/usePrepStore";
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

/** Top chrome for browse surfaces. Discovery = fair + calendar + search;
 *  there is no feed icon because there is no feed (Principle 3). */
export function TopNav() {
  const nav = useNavigate();
  const notifications = usePrepStore((s) => s.notifications);
  const premium = usePrepStore((s) => s.premium);
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
        <Link to="/fair" aria-label="Prep.io home" className="flex items-center gap-2">
          <Wordmark />
          {premium && (
            <span
              className="rounded-pill px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.06em]"
              style={{ background: "var(--prep-text)", color: "var(--prep-bg)" }}
            >
              PREMIUM
            </span>
          )}
        </Link>
        <div className="flex items-center gap-0.5">
          <button
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav("/search")}
          >
            <IconSearch size={19} />
          </button>
          <button
            aria-label="Alerts"
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
          {!premium && (
            <button
              aria-label="Premium"
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ color: "var(--prep-text-2)" }}
              onClick={() => nav("/premium")}
            >
              <IconStar size={19} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
