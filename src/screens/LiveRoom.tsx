import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { LivePill, LiveStage } from "../components/LiveStage";
import { Sheet } from "../components/Sheet";
import {
  IconArrowLeft,
  IconEye,
  IconHand,
  IconPlay,
  IconX,
} from "../components/icons";
import { HOSTS, SESSIONS } from "../data/seedData";
import { startCrowd, stopCrowd } from "../lib/crowd/engine";
import { springs } from "../lib/motion";
import { fmtClock, fmtCount, usePrepStore } from "../store/usePrepStore";

/* The Live Room (viewer) — the funnel's free layer, and the app's one dark
 * surface: the theater. Lurking needs nothing; the hand raise is the
 * explicit consent that makes the hot seat possible. */

export default function LiveRoom() {
  const { sessionId } = useParams();
  const nav = useNavigate();
  const room = usePrepStore((s) => s.room);
  const joinRoom = usePrepStore((s) => s.joinRoom);
  const leaveRoom = usePrepStore((s) => s.leaveRoom);

  const sesh = SESSIONS.find((x) => x.id === sessionId);
  const host = sesh ? HOSTS.find((h) => h.id === sesh.hostId) : undefined;

  const [handSheet, setHandSheet] = useState(false);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (!sessionId || !sesh || sesh.kind !== "live") return;
    const ok = joinRoom(sessionId);
    if (ok) startCrowd("viewer");
    return () => {
      stopCrowd();
      leaveRoom();
    };
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Honest liveness: a non-live session never renders as a room (Principle 5).
  if (!sesh || !host) {
    return <DeadEnd text="That room doesn't exist." />;
  }
  if (sesh.kind !== "live") {
    return (
      <DeadEnd text="This session isn't live.">
        {sesh.kind === "vod" ? (
          <Link to={`/vod/${sesh.id}`} className="btn btn-primary mt-5">
            <IconPlay size={16} /> Watch the recording
          </Link>
        ) : (
          <div className="mt-2 text-[14px]" style={{ color: "var(--prep-text-3)" }}>
            Scheduled for {sesh.when}
          </div>
        )}
      </DeadEnd>
    );
  }
  if (!room || room.sessionId !== sessionId) {
    return <DeadEnd text="Joining…" />;
  }

  const yourHand =
    room.queue.find((h) => h.who === "you") ??
    (room.hotSeat?.who === "you" ? room.hotSeat : undefined);
  const yourPos = room.queue.findIndex((h) => h.who === "you");
  const youOnStage = room.hotSeat?.who === "you";

  return (
    <div className="theater">
      <div className="mx-auto flex h-dvh max-w-md flex-col">
        {/* header */}
        <header className="flex items-center gap-2 px-3 py-3">
          <button
            aria-label="Leave room"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ color: "var(--prep-text-2)" }}
            onClick={() => nav(-1)}
          >
            <IconArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14.5px] font-medium leading-tight">
              {sesh.title}
            </div>
            <div className="mt-1 flex items-center gap-2.5 text-[12.5px] tabular-nums" style={{ color: "var(--prep-text-2)" }}>
              <LivePill />
              <span className="inline-flex items-center gap-1">
                <IconEye size={13} /> {fmtCount(room.viewers)}
              </span>
              <span style={{ color: "var(--prep-text-3)" }}>{fmtClock(room.elapsedSec)}</span>
            </div>
          </div>
        </header>

        {/* stage */}
        <div className="px-4">
          <LiveStage
            hue={host.hue}
            initials={host.initials}
            name={host.name}
            headline={host.headline}
            speaking={room.hostAnswering || !room.hotSeat}
          >
            <div className="mt-3">
              <Badge state={host.badge} />
            </div>
          </LiveStage>
        </div>

        {/* hot seat banner */}
        <AnimatePresence>
          {room.hotSeat && (
            <motion.div
              className="mx-4 mt-3 rounded-tile border p-4"
              style={{
                borderColor: "var(--prep-live)",
                background: "var(--prep-live-tint)",
              }}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={springs.standard}
            >
              <div className="flex items-center gap-2.5">
                <Avatar
                  hue={room.hotSeat.hue}
                  initials={room.hotSeat.name.slice(0, 2).toUpperCase()}
                  size={26}
                  ring
                />
                <span
                  className="overline"
                  style={{ color: "var(--prep-live)" }}
                >
                  {youOnStage ? "You have the floor" : `${room.hotSeat.name} has the floor`}
                </span>
              </div>
              <div className="mt-2.5 font-display text-[17px] leading-snug" style={{ fontWeight: 500 }}>
                “{room.hotSeat.question}”
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* queue strip */}
        {room.queue.length > 0 && (
          <div className="mx-4 mt-3 flex items-center gap-2.5 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
            <IconHand size={14} />
            <span className="tabular-nums">
              {room.queue.length} in queue
              {yourHand && yourPos >= 0 && (
                <span style={{ color: "var(--prep-text)" }}> · you're #{yourPos + 1}</span>
              )}
            </span>
            <div className="flex -space-x-1.5">
              {room.queue.slice(0, 5).map((h) => (
                <Avatar key={h.id} hue={h.hue} initials={h.name.slice(0, 2).toUpperCase()} size={20} />
              ))}
            </div>
          </div>
        )}

        {/* chat */}
        <ChatLog />

        {/* composer + hand */}
        <Composer
          onRaise={() => setHandSheet(true)}
          handState={youOnStage ? "stage" : yourHand ? "queued" : "none"}
        />

        {/* raise-hand sheet — the consent moment, made explicit */}
        <Sheet open={handSheet} onClose={() => setHandSheet(false)}>
          <h3 className="font-display text-[24px]" style={{ fontWeight: 500 }}>
            Raise your hand
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
            Your question joins a visible queue. If {host.name.split(" ")[0]} calls
            on you, it's asked and answered in front of the room.
          </p>
          <textarea
            className="input mt-4 h-24 resize-none"
            placeholder="One clear question"
            maxLength={140}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="mt-4 flex gap-2">
            <button className="btn btn-ghost flex-1" onClick={() => setHandSheet(false)}>
              Not yet
            </button>
            <button
              className="btn btn-primary flex-1"
              disabled={!question.trim()}
              onClick={() => {
                if (usePrepStore.getState().raiseHand(question)) {
                  setHandSheet(false);
                  setQuestion("");
                }
              }}
            >
              <IconHand size={16} /> Raise it
            </button>
          </div>
        </Sheet>

        <HotSeatMoment />
        <BreakoutOfferSheet hostName={host.name} />
      </div>
    </div>
  );
}

/* ---------------- pieces ---------------- */

function DeadEnd({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="text-[16px]" style={{ color: "var(--prep-text-2)" }}>{text}</div>
      {children}
      <Link to="/fair" className="mt-5 text-[14px] underline" style={{ color: "var(--prep-text-3)" }}>
        Back to the fair
      </Link>
    </div>
  );
}

function ChatLog() {
  const chat = usePrepStore((s) => s.room?.chat);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [chat?.length]);
  return (
    <div ref={ref} className="rail mt-3 flex-1 overflow-y-auto px-5 py-1">
      {chat?.map((m) => (
        <div key={m.id} className="py-[5px] text-[14px] leading-snug">
          {m.isSystem ? (
            <span className="text-[12.5px] italic" style={{ color: "var(--prep-text-3)" }}>
              — {m.text}
            </span>
          ) : (
            <>
              <span
                className="mr-2 font-semibold"
                style={{
                  color: m.isHost
                    ? "var(--prep-text)"
                    : m.isYou
                      ? "var(--prep-text)"
                      : `hsl(${m.authorHue} 18% 62%)`,
                }}
              >
                {m.isHost ? `${m.author} · host` : m.author}
              </span>
              <span style={{ color: "var(--prep-text-2)" }}>{m.text}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function Composer({
  onRaise,
  handState,
}: {
  onRaise: () => void;
  handState: "none" | "queued" | "stage";
}) {
  const [text, setText] = useState("");
  const sendChat = usePrepStore((s) => s.sendChat);
  const lowerHand = usePrepStore((s) => s.lowerHand);
  const send = () => {
    sendChat(text);
    setText("");
  };
  return (
    <div className="border-t px-4 py-3" style={{ borderColor: "var(--prep-line)" }}>
      <div className="flex items-center gap-2">
        <input
          className="input flex-1 !py-3"
          placeholder="Say something"
          value={text}
          maxLength={200}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        {handState === "none" && (
          <button className="btn btn-primary !px-4 !py-3" onClick={onRaise} aria-label="Raise hand">
            <IconHand size={18} />
          </button>
        )}
        {handState === "queued" && (
          <button
            className="btn btn-ghost !px-3.5 !py-3 text-[13px]"
            onClick={lowerHand}
            title="Lower your hand"
          >
            <IconHand size={16} />
            <IconX size={13} />
          </button>
        )}
        {handState === "stage" && (
          <span
            className="rounded-pill px-3.5 py-2.5 text-[12px] font-semibold tracking-[0.08em]"
            style={{ background: "var(--prep-live)", color: "#fdfbf7" }}
          >
            ON AIR
          </span>
        )}
      </div>
      <div className="mt-2 text-center text-[11.5px]" style={{ color: "var(--prep-text-3)" }}>
        Slow mode · questions go through the queue, not DMs
      </div>
    </div>
  );
}

/** The signature threshold beat: the room turns toward you for a moment. */
function HotSeatMoment() {
  const isYou = usePrepStore((s) => s.room?.hotSeat?.who === "you");
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (isYou) {
      setShow(true);
      const t = setTimeout(() => setShow(false), 2600);
      return () => clearTimeout(t);
    }
  }, [isYou]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(15, 13, 10, 0.9)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="relative px-8 text-center"
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={springs.calm}
          >
            <div
              className="font-display italic"
              style={{ fontSize: 44, fontWeight: 500, color: "#f3f0e9", letterSpacing: "-0.01em" }}
            >
              You're up.
            </div>
            <div className="mt-3 text-[15px]" style={{ color: "#b5b0a4" }}>
              {`The room is yours for a minute.`}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Breakout offer — the host consented by offering; you consent by accepting. */
function BreakoutOfferSheet({ hostName }: { hostName: string }) {
  const offer = usePrepStore((s) => s.room?.breakoutOffer);
  const acceptBreakout = usePrepStore((s) => s.acceptBreakout);
  const declineBreakout = usePrepStore((s) => s.declineBreakout);
  const nav = useNavigate();
  return (
    <Sheet open={!!offer} onClose={declineBreakout}>
      <div className="overline">Private breakout</div>
      <h3 className="mt-2 font-display text-[24px] leading-snug" style={{ fontWeight: 500 }}>
        {hostName.split(" ")[0]} offered you fifteen minutes, one on one.
      </h3>
      <p className="mt-2.5 text-[14.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
        A private room to go deeper on your question. Optional — declining
        changes nothing.
      </p>
      <div
        className="mt-4 flex items-baseline justify-between rounded-tile border px-4 py-3.5"
        style={{ borderColor: "var(--prep-line)" }}
      >
        <span className="text-[14px]" style={{ color: "var(--prep-text-2)" }}>
          Host's rate
        </span>
        <span className="font-display text-[20px] tabular-nums" style={{ fontWeight: 500 }}>
          ${offer?.rate} <span className="text-[13px]" style={{ color: "var(--prep-text-3)" }}>/ 15 min</span>
        </span>
      </div>
      <div className="mt-4 flex gap-2">
        <button className="btn btn-ghost flex-1" onClick={declineBreakout}>
          No thanks
        </button>
        <button
          className="btn btn-primary flex-1"
          onClick={() => {
            acceptBreakout();
            nav("/breakout");
          }}
        >
          Accept
        </button>
      </div>
    </Sheet>
  );
}
