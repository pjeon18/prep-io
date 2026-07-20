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

/** The compounding layer: a past session, CLEARLY a recording (never
 *  fake-live), chaptered by hot-seat question so the library is
 *  searchable (D3). The player is the one dark card on the page. */
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
        <Link to="/fair" className="mt-4 text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
          Back to the fair
        </Link>
      </div>
    );
  }

  const chapters = sesh.vod.chapters;

  return (
    <div className="min-h-dvh pb-20">
      <TopNav />
      <main className="mx-auto max-w-md px-5">
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
        </div>

        {/* mock player — the one dark surface on a light page */}
        <motion.div
          className="theater mt-4 overflow-hidden rounded-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.calm}
        >
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
        </motion.div>

        <h1 className="mt-6 font-display text-[26px] leading-snug" style={{ fontWeight: 500 }}>
          {sesh.title}
        </h1>
        <div className="mt-2 flex items-center gap-2.5 text-[14px]" style={{ color: "var(--prep-text-2)" }}>
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

        <h2 className="mt-10 font-display text-[24px]" style={{ fontWeight: 500 }}>
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
              {...fadeUp}
              transition={{ ...springs.standard, ...stagger(i, 0.04) }}
              onClick={() => {
                setActiveChapter(i);
                setPlaying(true);
              }}
            >
              <span
                className="mt-0.5 shrink-0 text-[13px] font-medium tabular-nums"
                style={{ color: "var(--prep-text-3)" }}
              >
                {ch.t}
              </span>
              <span className="flex-1">
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
      </main>
    </div>
  );
}
