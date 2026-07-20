import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { Sheet } from "../components/Sheet";
import { AppShell } from "../components/AppShell";
import { Waveform } from "../components/LiveStage";
import { IconLock } from "../components/iconsExtra";
import {
  IconArrowLeft,
  IconDownload,
  IconHeart,
  IconList,
  IconPlay,
  IconPlus,
} from "../components/icons";
import { HOSTS, SESSIONS } from "../data/seedData";
import { fadeUp, springs, stagger } from "../lib/motion";
import { downloadTranscript } from "../lib/transcript";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/** A recording — CLEARLY not live, chaptered by hot-seat question so the
 *  library is searchable (D3). Premium recordings gate here (D11): watching
 *  live stays free; the library afterward is the premium product. */
export default function VodPlayer() {
  const { vodId } = useParams();
  const nav = useNavigate();
  const userVods = usePrepStore((s) => s.userVods);
  const premium = usePrepStore((s) => s.premium);
  const memberships = usePrepStore((s) => s.memberships);
  const likes = usePrepStore((s) => s.likes);
  const toggleLike = usePrepStore((s) => s.toggleLike);
  const recordHistory = usePrepStore((s) => s.recordHistory);
  const playlists = usePrepStore((s) => s.playlists);
  const addToPlaylist = usePrepStore((s) => s.addToPlaylist);
  const toast = usePrepStore((s) => s.toast);

  const sesh =
    SESSIONS.find((x) => x.id === vodId && x.kind === "vod") ??
    userVods.find((x) => x.id === vodId);
  const host = sesh ? HOSTS.find((h) => h.id === sesh.hostId) : undefined;
  const isYours = sesh?.hostId === "you";
  const [activeChapter, setActiveChapter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [plSheet, setPlSheet] = useState(false);

  // access: free recordings for everyone; premium recordings for premium
  // accounts, channel members, and the channel itself
  const isMember = sesh ? !!memberships[sesh.hostId] : false;
  const unlocked =
    !sesh?.vod?.premium || premium || isMember || isYours;

  useEffect(() => {
    if (sesh && unlocked) {
      recordHistory({ id: sesh.id, kind: "vod", title: sesh.title, hostId: sesh.hostId });
    }
  }, [sesh?.id, unlocked]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!sesh || !sesh.vod) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div style={{ color: "var(--prep-text-2)" }}>That recording doesn't exist.</div>
        <Link to="/fair" className="mt-4 text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
          Back to the fair
        </Link>
      </div>
    );
  }

  const chapters = sesh.vod.chapters;
  const liked = likes.sessions.includes(sesh.id);

  return (
    <AppShell>
      <main className="mx-auto max-w-md px-5 lg:mx-0 lg:max-w-[1200px] lg:px-8">
        <div className="mt-5 flex items-center gap-2">
          <button
            aria-label="Back"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav(-1)}
          >
            <IconArrowLeft size={20} />
          </button>
          <span className="overline">Recorded {sesh.vod.recordedOn}</span>
          {sesh.vod.premium && (
            <span className="overline ml-auto flex items-center gap-1">
              <IconLock size={11} /> members & premium
            </span>
          )}
        </div>

        {/* desktop: the watch layout — player left, chapters right */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-10">
        <div>

        {/* player — the one dark surface on a light page */}
        <motion.div
          className="theater mt-4 overflow-hidden rounded-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.calm}
        >
          {unlocked ? (
            <div className="relative flex flex-col items-center px-4 pb-6 pt-8">
              {host ? (
                <Avatar hue={host.hue} initials={host.initials} size={72} />
              ) : (
                <Avatar hue={36} initials="Y" size={72} />
              )}
              <button
                className="btn btn-primary mt-5 !px-6 !py-2.5 text-[14px]"
                onClick={() => setPlaying((p) => !p)}
              >
                <IconPlay size={15} /> {playing ? "Playing" : "Play"}
              </button>
              <div className="mt-4">
                <Waveform active={playing} height={20} />
              </div>
              {playing && (
                <div className="mt-2 text-[12.5px] tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                  mock playback from {chapters[activeChapter]?.t ?? "00:00"}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center px-6 pb-8 pt-9 text-center">
              <IconLock size={26} />
              <div className="mt-3 font-display text-[20px]" style={{ fontWeight: 500 }}>
                This recording is in the premium library
              </div>
              <p className="mt-2 max-w-[34ch] text-[13.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
                Live sessions are always free to watch. Recordings afterward
                are for Premium accounts and channel members
                {host ? ` of ${host.name.split(" ")[0]}` : ""}.
              </p>
              <div className="mt-5 flex w-full gap-2">
                <button className="btn btn-primary flex-1" onClick={() => nav("/premium")}>
                  Go Premium
                </button>
                {host?.tiers && (
                  <button className="btn btn-ghost flex-1" onClick={() => nav(`/profile/${host.id}`)}>
                    Join the channel
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-5 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[25px] leading-snug" style={{ fontWeight: 500 }}>
              {sesh.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2.5 text-[14px]" style={{ color: "var(--prep-text-2)" }}>
              {isYours ? (
                <span>Hosted by you</span>
              ) : (
                host && (
                  <Link to={`/profile/${host.id}`} className="flex items-center gap-2">
                    {host.name} <Badge state={host.badge} />
                  </Link>
                )
              )}
              <span className="tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                {sesh.vod.durationLabel} · {fmtCount(sesh.vod.views)} views
              </span>
            </div>
          </div>
          <button
            aria-label="Like"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ color: liked ? "var(--prep-live)" : "var(--prep-text-2)" }}
            onClick={() => toggleLike("sessions", sesh.id)}
          >
            <IconHeart size={20} filled={liked} />
          </button>
        </div>

        {/* premium tools */}
        {unlocked && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="chip"
              onClick={() => {
                if (!premium) {
                  toast("Transcription is a Premium tool");
                  nav("/premium");
                  return;
                }
                downloadTranscript(sesh);
                toast("Transcript downloaded");
              }}
            >
              <IconDownload size={13} /> AI transcript
            </button>
            <button
              className="chip"
              onClick={() => {
                if (!premium) {
                  toast("Playlists are a Premium tool");
                  nav("/premium");
                  return;
                }
                setPlSheet(true);
              }}
            >
              <IconList size={13} /> Add to playlist
            </button>
          </div>
        )}

        </div>
        <div>
        <h2 className="mt-9 font-display text-[23px] lg:mt-2" style={{ fontWeight: 500 }}>
          Questions answered
        </h2>
        <div className="mt-1 text-[13.5px]" style={{ color: "var(--prep-text-3)" }}>
          Every hot seat becomes a chapter
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {chapters.map((ch, i) => (
            <motion.button
              key={i}
              className="card flex w-full items-start gap-4 p-4 text-left"
              style={
                activeChapter === i && playing
                  ? { borderColor: "var(--prep-text)" }
                  : undefined
              }
              disabled={!unlocked}
              {...fadeUp}
              transition={{ ...springs.standard, ...stagger(i, 0.04) }}
              onClick={() => {
                setActiveChapter(i);
                setPlaying(true);
              }}
            >
              <span className="mt-0.5 shrink-0 text-[13px] font-medium tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                {ch.t}
              </span>
              <span className="flex-1" style={!unlocked ? { opacity: 0.55 } : undefined}>
                <span className="block text-[15px] leading-snug">“{ch.question}”</span>
                <span className="mt-1 block text-[13px]" style={{ color: "var(--prep-text-3)" }}>
                  asked by {ch.askedBy}
                </span>
              </span>
            </motion.button>
          ))}
          {chapters.length === 0 && (
            <div className="card p-5 text-[14px]" style={{ color: "var(--prep-text-3)" }}>
              No questions were answered in this session.
            </div>
          )}
        </div>
        </div>
        </div>
      </main>

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
                  addToPlaylist(p.id, sesh.id);
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
    </AppShell>
  );
}
