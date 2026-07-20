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

/* The Live Room (viewer) — the funnel's free layer. Lurking needs nothing;
 * the hand raise is the explicit consent that makes the hot seat possible. */

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
          <Link to={`/vod/${sesh.id}`} className="btn btn-primary mt-4">
            <IconPlay size={16} /> Watch the archive
          </Link>
        ) : (
          <div className="mt-2 text-[13px]" style={{ color: "var(--prep-text-3)" }}>
            Scheduled for {sesh.when}
          </div>
        )}
      </DeadEnd>
    );
  }
  if (!room || room.sessionId !== sessionId) {
    // brief mount gap, or you're in another room (the store won't double-join)
    return <DeadEnd text="Joining…" />;
  }

  const yourHand =
    room.queue.find((h) => h.who === "you") ??
    (room.hotSeat?.who === "you" ? room.hotSeat : undefined);
  const yourPos = room.queue.findIndex((h) => h.who === "you");
  const youOnStage = room.hotSeat?.who === "you";

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col">
      {/* header */}
      <header className="flex items-center gap-2 px-3 py-2.5">
        <button
          aria-label="Leave room"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ color: "var(--prep-text-2)" }}
          onClick={() => nav(-1)}
        >
          <IconArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[14px] font-semibold leading-tight">
            {sesh.title}
          </div>
          <div className="flex items-center gap-2 text-[11.5px]" style={{ color: "var(--prep-text-2)" }}>
            <LivePill />
            <span className="inline-flex items-center gap-1">
              <IconEye size={12} /> {fmtCount(room.viewers)}
            </span>
            <span style={{ color: "var(--prep-text-3)" }}>{fmtClock(room.elapsedSec)}</span>
          </div>
        </div>
      </header>

      {/* stage */}
      <div className="px-3">
        <LiveStage
          hue={host.hue}
          initials={host.initials}
          name={host.name}
          headline={host.headline}
          speaking={room.hostAnswering || !room.hotSeat}
        >
          <div className="mt-2">
            <Badge state={host.badge} />
          </div>
        </LiveStage>
      </div>

      {/* hot seat banner */}
      <AnimatePresence>
        {room.hotSeat && (
          <motion.div
            className="mx-3 mt-2 rounded-tile border p-3"
            style={{
              borderColor: "var(--prep-amber)",
              background: "var(--prep-amber-tint)",
            }}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={springs.standard}
          >
            <div
              className="font-display text-[11px] font-bold tracking-wider"
              style={{ color: "var(--prep-amber)" }}
            >
              {youOnStage ? "YOU'RE ON THE HOT SEAT" : "ON THE HOT SEAT"}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Avatar hue={room.hotSeat.hue} initials={room.hotSeat.name.slice(0, 2).toUpperCase()} size={26} ring />
              <span className="text-[13px] font-medium">{room.hotSeat.name}</span>
            </div>
            <div className="mt-1.5 text-[13.5px] leading-snug">
              “{room.hotSeat.question}”
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* queue strip */}
      {room.queue.length > 0 && (
        <div className="mx-3 mt-2 flex items-center gap-2 text-[12px]" style={{ color: "var(--prep-text-2)" }}>
          <IconHand size={14} />
          <span>
            {room.queue.length} in queue
            {yourHand && yourPos >= 0 && (
              <span style={{ color: "var(--prep-amber)" }}> · you're #{yourPos + 1}</span>
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
        <h3 className="font-display text-[17px] font-semibold">Raise your hand</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          Your question joins a visible queue. If {host.name.split(" ")[0]} calls
          on you, you take the hot seat and it's answered in front of the room —
          that's the deal, and it's why everyone learns.
        </p>
        <textarea
          className="input mt-3 h-20 resize-none"
          placeholder="One clear question…"
          maxLength={140}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="mt-3 flex gap-2">
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
  );
}

/* ---------------- pieces ---------------- */

function DeadEnd({ text, children }: { text: string; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="text-[15px]" style={{ color: "var(--prep-text-2)" }}>{text}</div>
      {children}
      <Link to="/fair" className="mt-4 text-[13px] underline" style={{ color: "var(--prep-text-3)" }}>
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
    <div ref={ref} className="rail mt-2 flex-1 overflow-y-auto px-4 py-1">
      {chat?.map((m) => (
        <div key={m.id} className="py-1 text-[13.5px] leading-snug">
          {m.isSystem ? (
            <span className="text-[12px] italic" style={{ color: "var(--prep-text-3)" }}>
              — {m.text}
            </span>
          ) : (
            <>
              <span
                className="mr-1.5 font-semibold"
                style={{
                  color: m.isHost
                    ? "var(--prep-amber)"
                    : m.isYou
                      ? "var(--prep-text)"
                      : `hsl(${m.authorHue} 45% 68%)`,
                }}
              >
                {m.isHost ? `${m.author} (host)` : m.author}
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
    <div className="border-t px-3 py-2.5" style={{ borderColor: "var(--prep-line)" }}>
      <div className="flex items-center gap-2">
        <input
          className="input flex-1 !py-2.5"
          placeholder="Say something…"
          value={text}
          maxLength={200}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        {handState === "none" && (
          <button className="btn btn-primary !px-4 !py-2.5" onClick={onRaise} aria-label="Raise hand">
            <IconHand size={18} />
          </button>
        )}
        {handState === "queued" && (
          <button
            className="btn btn-ghost !px-3 !py-2.5 text-[12px]"
            onClick={lowerHand}
            title="Lower your hand"
          >
            <IconHand size={16} className="text-prep-amber" />
            <IconX size={13} />
          </button>
        )}
        {handState === "stage" && (
          <span
            className="rounded-pill px-3 py-2 font-display text-[12px] font-bold"
            style={{ background: "var(--prep-amber)", color: "#201302" }}
          >
            ON AIR
          </span>
        )}
      </div>
      <div className="mt-1.5 text-center text-[11px]" style={{ color: "var(--prep-text-3)" }}>
        slow mode · be a good guest · no DMs on prep.io, ask in the open
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
            style={{
              background:
                "radial-gradient(80% 60% at 50% 50%, rgba(255,181,71,0.28) 0%, rgba(14,22,38,0.88) 75%)",
            }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="relative text-center"
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={springs.calm}
          >
            <div
              className="font-display text-[26px] font-bold"
              style={{ color: "var(--prep-amber)" }}
            >
              You're up.
            </div>
            <div className="mt-1 text-[14px]" style={{ color: "var(--prep-text)" }}>
              The room is listening — ask it like you mean it.
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
      <h3 className="font-display text-[17px] font-semibold">
        {hostName.split(" ")[0]} offered you a private breakout
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
        A 15-minute 1:1 room, right now, to go deeper on your question. Totally
        optional — declining changes nothing about being here.
      </p>
      <div
        className="mt-3 rounded-tile p-3 text-center font-display text-[15px] font-semibold"
        style={{ background: "var(--prep-surface-2)" }}
      >
        ${offer?.rate} · 15 min
      </div>
      <div className="mt-3 flex gap-2">
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
          Accept · ${offer?.rate}
        </button>
      </div>
    </Sheet>
  );
}
