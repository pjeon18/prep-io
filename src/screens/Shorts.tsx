import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Waveform } from "../components/LiveStage";
import { Sheet } from "../components/Sheet";
import { IconArrowLeft, IconHeart, IconList, IconPlus } from "../components/icons";
import { CLIPS, HOSTS } from "../data/seedData";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/** Shorts player — one clip at a time with previous/next. Browsable, finite,
 *  never an infinite feed: it ends when the channel's clips end. */
export default function Shorts() {
  const { clipId } = useParams();
  const nav = useNavigate();
  const idx = Math.max(0, CLIPS.findIndex((c) => c.id === clipId));
  const clip = CLIPS[idx];
  const likes = usePrepStore((s) => s.likes);
  const toggleLike = usePrepStore((s) => s.toggleLike);
  const recordHistory = usePrepStore((s) => s.recordHistory);
  const premium = usePrepStore((s) => s.premium);
  const playlists = usePrepStore((s) => s.playlists);
  const addToPlaylist = usePrepStore((s) => s.addToPlaylist);
  const toast = usePrepStore((s) => s.toast);
  const [plSheet, setPlSheet] = useState(false);

  useEffect(() => {
    if (clip) {
      recordHistory({ id: clip.id, kind: "clip", title: clip.title, hostId: clip.hostId });
    }
  }, [clip?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!clip) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div style={{ color: "var(--prep-text-2)" }}>That short doesn't exist.</div>
        <Link to="/explore" className="mt-4 text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
          Explore
        </Link>
      </div>
    );
  }

  const host = HOSTS.find((h) => h.id === clip.hostId)!;
  const liked = likes.clips.includes(clip.id);

  return (
    <div className="theater">
      <div className="mx-auto flex h-dvh max-w-md flex-col px-5 py-4">
        <div className="flex items-center justify-between">
          <button
            aria-label="Back"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav(-1)}
          >
            <IconArrowLeft size={20} />
          </button>
          <span className="overline">
            Short {idx + 1} / {CLIPS.length}
          </span>
        </div>

        {/* the "video" */}
        <div
          className="relative mt-3 flex flex-1 flex-col items-center justify-center overflow-hidden rounded-card"
          style={{
            background: `linear-gradient(160deg, hsl(${clip.hue} 18% 18%), #131210 75%)`,
          }}
        >
          <Avatar hue={clip.hue} initials={host.initials} size={92} />
          <div className="mt-5 px-8 text-center font-display text-[22px] leading-snug" style={{ fontWeight: 500 }}>
            {clip.title}
          </div>
          <div className="mt-4">
            <Waveform active color="var(--prep-text-2)" />
          </div>
          <span
            className="absolute bottom-3 right-3 rounded px-1.5 py-0.5 text-[11px] font-medium tabular-nums"
            style={{ background: "rgba(15,13,10,0.7)", color: "#f3f0e9" }}
          >
            {clip.durationLabel}
          </span>
        </div>

        {/* meta + actions */}
        <div className="mt-4 flex items-center gap-3">
          <Link to={`/profile/${host.id}`} className="flex min-w-0 flex-1 items-center gap-2.5">
            <Avatar hue={host.hue} initials={host.initials} size={32} />
            <div className="min-w-0">
              <div className="truncate text-[13.5px] font-medium">{host.name}</div>
              <div className="text-[12px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                {fmtCount(clip.views)} views
              </div>
            </div>
          </Link>
          <button
            aria-label="Like"
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ color: liked ? "var(--prep-live)" : "var(--prep-text-2)" }}
            onClick={() => toggleLike("clips", clip.id)}
          >
            <IconHeart size={20} filled={liked} />
          </button>
          {premium && (
            <button
              aria-label="Add to playlist"
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ color: "var(--prep-text-2)" }}
              onClick={() => setPlSheet(true)}
            >
              <IconList size={20} />
            </button>
          )}
        </div>

        {/* prev / next */}
        <div className="mt-3 flex gap-2 pb-2">
          <button
            className="btn btn-ghost flex-1"
            disabled={idx === 0}
            onClick={() => nav(`/shorts/${CLIPS[idx - 1].id}`, { replace: true })}
          >
            Previous
          </button>
          <button
            className="btn btn-primary flex-1"
            disabled={idx === CLIPS.length - 1}
            onClick={() => nav(`/shorts/${CLIPS[idx + 1].id}`, { replace: true })}
          >
            Next
          </button>
        </div>
      </div>

      <Sheet open={plSheet} onClose={() => setPlSheet(false)}>
        <h3 className="font-display text-[22px]" style={{ fontWeight: 500 }}>
          Add to playlist
        </h3>
        {playlists.length === 0 ? (
          <p className="mt-2 text-[14px]" style={{ color: "var(--prep-text-2)" }}>
            No playlists yet — create one in your Library.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {playlists.map((p) => (
              <button
                key={p.id}
                className="card flex items-center gap-3 p-3.5 text-left"
                onClick={() => {
                  addToPlaylist(p.id, clip.id);
                  setPlSheet(false);
                  toast(`Added to “${p.name}”`);
                }}
              >
                <IconPlus size={15} />
                <span className="text-[14px] font-medium">{p.name}</span>
                <span className="ml-auto text-[12px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                  {p.items.length}
                </span>
              </button>
            ))}
          </div>
        )}
      </Sheet>
    </div>
  );
}
