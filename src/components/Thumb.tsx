import { Avatar } from "./Avatar";
import { LivePill } from "./LiveStage";
import { IconLock } from "./iconsExtra";
import { IconPlay, IconVideo } from "./icons";

/**
 * 16:9 mock thumbnail — the streaming-product card language (no real video
 * in the prototype, so the thumb is an honest composed still: dark stage,
 * host avatar, duration/live chips).
 */
export function Thumb({
  hue,
  initials,
  live,
  video,
  duration,
  locked,
  height = 96,
}: {
  hue: number;
  initials: string;
  live?: boolean;
  video?: boolean;
  duration?: string;
  locked?: boolean;
  height?: number;
}) {
  return (
    <div
      className="relative w-full shrink-0 overflow-hidden rounded-tile"
      style={{
        height,
        background: `linear-gradient(150deg, hsl(${hue} 16% 16%), #171512 70%)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Avatar hue={hue} initials={initials} size={Math.round(height * 0.42)} />
      </div>
      {live && (
        <div className="absolute left-2 top-2">
          <LivePill />
        </div>
      )}
      {video && !live && (
        <div className="absolute left-2 top-2" style={{ color: "rgba(243,240,233,0.8)" }}>
          <IconVideo size={14} />
        </div>
      )}
      {duration && (
        <span
          className="absolute bottom-1.5 right-1.5 rounded px-1.5 py-0.5 text-[11px] font-medium tabular-nums"
          style={{ background: "rgba(15,13,10,0.8)", color: "#f3f0e9" }}
        >
          {duration}
        </span>
      )}
      {locked && (
        <div
          className="absolute inset-0 flex items-center justify-center gap-1.5 text-[12px] font-medium"
          style={{ background: "rgba(15,13,10,0.62)", color: "#f3f0e9" }}
        >
          <IconLock size={13} /> Premium
        </div>
      )}
      {!live && !locked && (
        <div
          className="absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full"
          style={{ background: "rgba(15,13,10,0.65)", color: "#f3f0e9" }}
        >
          <IconPlay size={12} />
        </div>
      )}
    </div>
  );
}
