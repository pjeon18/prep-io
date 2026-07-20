import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { TopNav } from "../components/TopNav";
import { Waveform } from "../components/LiveStage";
import { IconArrowLeft, IconPlay } from "../components/icons";
import { HOSTS, SESSIONS } from "../data/seedData";
import { fadeUp, springs, stagger } from "../lib/motion";
import { fmtCount, usePrepStore } from "../store/usePrepStore";

/** The compounding layer: a past session, CLEARLY an archive (never fake-live),
 *  chaptered by hot-seat question so the library is searchable (D3). */
export default function VodPlayer() {
  const { vodId } = useParams();
  const nav = useNavigate();
  const userVods = usePrepStore((s) => s.userVods);
  const sesh =
    SESSIONS.find((x) => x.id === vodId && x.kind === "vod") ??
    userVods.find((x) => x.id === vodId);
  const host = sesh ? HOSTS.find((h) => h.id === sesh.hostId) : undefined;
  const isYours = sesh?.hostId === "you";
  const [activeChapter, setActiveChapter] = useState(0);
  const [playing, setPlaying] = useState(false);

  if (!sesh || !sesh.vod) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <div style={{ color: "var(--prep-text-2)" }}>That recording doesn't exist.</div>
        <Link to="/fair" className="mt-3 text-[13px] underline" style={{ color: "var(--prep-text-3)" }}>
          Back to the fair
        </Link>
      </div>
    );
  }

  const chapters = sesh.vod.chapters;

  return (
    <div className="min-h-dvh pb-16">
      <TopNav />
      <main className="mx-auto max-w-md px-4">
        <div className="mt-4 flex items-center gap-2">
          <button
            aria-label="Back"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav(-1)}
          >
            <IconArrowLeft size={20} />
          </button>
          <span
            className="rounded-pill border px-2.5 py-1 font-display text-[11px] font-bold tracking-wider"
            style={{ color: "var(--prep-text-3)", borderColor: "var(--prep-line)" }}
          >
            ARCHIVE · {sesh.vod.recordedOn}
          </span>
        </div>

        {/* mock player */}
        <motion.div
          className="card mt-4 overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.calm}
        >
          <div
            className="relative flex flex-col items-center px-4 pb-5 pt-7"
            style={{
              background: `radial-gradient(120% 90% at 50% 0%, hsl(${host?.hue ?? 220} 30% 20%) 0%, var(--prep-surface) 75%)`,
            }}
          >
            {host ? (
              <Avatar hue={host.hue} initials={host.initials} size={72} />
            ) : (
              <Avatar hue={36} initials="Y" size={72} />
            )}
            <button
              className="btn btn-primary mt-4 !px-5 !py-2.5 text-[13px]"
              onClick={() => setPlaying((p) => !p)}
            >
              <IconPlay size={15} /> {playing ? "Playing chapter…" : "Play"}
            </button>
            <div className="mt-3">
              <Waveform active={playing} color="var(--prep-text-3)" height={20} />
            </div>
            {playing && (
              <div className="mt-2 text-[12px]" style={{ color: "var(--prep-text-3)" }}>
                mock playback — from {chapters[activeChapter]?.t ?? "00:00"}
              </div>
            )}
          </div>
        </motion.div>

        <h1 className="mt-4 font-display text-[18px] font-semibold leading-snug">{sesh.title}</h1>
        <div className="mt-1.5 flex items-center gap-2 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
          {isYours ? (
            <span>Hosted by you</span>
          ) : (
            host && (
              <Link to={`/profile/${host.id}`} className="flex items-center gap-2">
                {host.name} <Badge state={host.badge} />
              </Link>
            )
          )}
          <span style={{ color: "var(--prep-text-3)" }}>
            {sesh.vod.durationLabel} · {fmtCount(sesh.vod.views)} views
          </span>
        </div>

        <h2 className="mt-6 font-display text-[15px] font-semibold">
          Questions answered ({chapters.length})
        </h2>
        <div className="mt-1 text-[12px]" style={{ color: "var(--prep-text-3)" }}>
          Every hot seat becomes a chapter — jump straight to yours
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {chapters.map((ch, i) => (
            <motion.button
              key={i}
              className="card flex w-full items-start gap-3 p-3.5 text-left"
              style={
                activeChapter === i && playing
                  ? { borderColor: "var(--prep-amber)" }
                  : undefined
              }
              {...fadeUp}
              transition={{ ...springs.standard, ...stagger(i, 0.04) }}
              onClick={() => {
                setActiveChapter(i);
                setPlaying(true);
              }}
            >
              <span
                className="mt-0.5 shrink-0 font-display text-[12px] font-semibold"
                style={{ color: "var(--prep-amber)" }}
              >
                {ch.t}
              </span>
              <span className="flex-1">
                <span className="block text-[13.5px] leading-snug">“{ch.question}”</span>
                <span className="mt-0.5 block text-[12px]" style={{ color: "var(--prep-text-3)" }}>
                  asked by {ch.askedBy}
                </span>
              </span>
            </motion.button>
          ))}
          {chapters.length === 0 && (
            <div className="card p-4 text-[13px]" style={{ color: "var(--prep-text-3)" }}>
              No questions were answered in this session.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
