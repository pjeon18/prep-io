import { Link, useNavigate, useParams } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { Thumb } from "../components/Thumb";
import { TopNav } from "../components/TopNav";
import { IconArrowLeft, IconX } from "../components/icons";
import { CLIPS, HOSTS, SESSIONS } from "../data/seedData";
import { usePrepStore } from "../store/usePrepStore";

/** A playlist — the premium mini-course: ordered recordings and shorts. */
export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const nav = useNavigate();
  const playlists = usePrepStore((s) => s.playlists);
  const userVods = usePrepStore((s) => s.userVods);
  const removeFromPlaylist = usePrepStore((s) => s.removeFromPlaylist);
  const deletePlaylist = usePrepStore((s) => s.deletePlaylist);

  const playlist = playlists.find((p) => p.id === playlistId);
  if (!playlist) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div style={{ color: "var(--prep-text-2)" }}>Playlist not found.</div>
        <Link to="/library" className="mt-4 text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
          Back to library
        </Link>
      </div>
    );
  }

  const allVods = [...SESSIONS.filter((x) => x.kind === "vod"), ...userVods];

  const items = playlist.items
    .map((id) => {
      const vod = allVods.find((v) => v.id === id);
      if (vod) {
        const host = HOSTS.find((h) => h.id === vod.hostId);
        return {
          id,
          title: vod.title,
          sub: `Recording · ${vod.vod!.durationLabel}`,
          hue: host?.hue ?? 36,
          initials: host?.initials ?? "Y",
          duration: vod.vod!.durationLabel,
          to: `/vod/${id}`,
        };
      }
      const clip = CLIPS.find((c) => c.id === id);
      if (clip) {
        const host = HOSTS.find((h) => h.id === clip.hostId)!;
        return {
          id,
          title: clip.title,
          sub: `Short · ${clip.durationLabel}`,
          hue: clip.hue,
          initials: host.initials,
          duration: clip.durationLabel,
          to: `/shorts/${id}`,
        };
      }
      return null;
    })
    .filter(Boolean) as {
    id: string;
    title: string;
    sub: string;
    hue: number;
    initials: string;
    duration: string;
    to: string;
  }[];

  return (
    <div className="min-h-dvh pb-28">
      <TopNav />
      <main className="mx-auto max-w-md px-5">
        <button
          aria-label="Back"
          className="-ml-2 mt-5 flex h-10 w-10 items-center justify-center rounded-full"
          style={{ color: "var(--prep-text-2)" }}
          onClick={() => nav("/library")}
        >
          <IconArrowLeft size={20} />
        </button>
        <div className="overline mt-3">Your course</div>
        <h1 className="mt-1 font-display text-[30px] leading-tight" style={{ fontWeight: 500 }}>
          {playlist.name}
        </h1>
        <div className="mt-1.5 text-[13.5px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
          {items.length} {items.length === 1 ? "item" : "items"}, in your order
        </div>

        {items.length === 0 && (
          <div className="card mt-6 p-6 text-center text-[14px] leading-relaxed" style={{ color: "var(--prep-text-3)" }}>
            Empty so far. Open any recording or short and tap “Add to playlist.”
          </div>
        )}

        {items.map((item, i) => (
          <div key={item.id} className="card mt-3 flex items-center gap-3 p-3">
            <span className="w-5 shrink-0 text-center font-display text-[15px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
              {i + 1}
            </span>
            <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => nav(item.to)}>
              <div className="w-[100px] shrink-0">
                <Thumb hue={item.hue} initials={item.initials} duration={item.duration} height={56} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="line-clamp-2 text-[13.5px] font-medium leading-snug">{item.title}</div>
                <div className="mt-0.5 text-[12px]" style={{ color: "var(--prep-text-3)" }}>{item.sub}</div>
              </div>
            </button>
            <button
              aria-label="Remove"
              className="shrink-0 p-1"
              style={{ color: "var(--prep-text-3)" }}
              onClick={() => removeFromPlaylist(playlist.id, item.id)}
            >
              <IconX size={15} />
            </button>
          </div>
        ))}

        <button
          className="btn btn-danger mt-8 w-full"
          onClick={() => {
            deletePlaylist(playlist.id);
            nav("/library");
          }}
        >
          Delete playlist
        </button>
      </main>
      <BottomNav />
    </div>
  );
}
