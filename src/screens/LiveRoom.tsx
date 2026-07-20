import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
import { LivePill, LiveStage, Waveform } from "../components/LiveStage";
import { Sheet } from "../components/Sheet";
import {
  IconArrowLeft,
  IconBolt,
  IconEye,
  IconHand,
  IconHeart,
  IconPlay,
  IconVideo,
  IconX,
} from "../components/icons";
import { HOSTS, SESSIONS } from "../data/seedData";
import { startCrowd, stopCrowd } from "../lib/crowd/engine";
import { springs } from "../lib/motion";
import { fmtClock, fmtCount, usePrepStore } from "../store/usePrepStore";

/* The Live Room (viewer) — the funnel's free layer, and the app's one dark
 * surface: the theater. Lurking needs nothing; the hand raise is the
 * explicit consent that makes the hot seat possible. Boosts raise a
 * question's visibility to the host — they never buy the stage (D9). */

const BOOST_STEPS = [50, 100, 200];

export default function LiveRoom() {
  const { sessionId } = useParams();
  const nav = useNavigate();
  const room = usePrepStore((s) => s.room);
  const joinRoom = usePrepStore((s) => s.joinRoom);
  const leaveRoom = usePrepStore((s) => s.leaveRoom);
  const likes = usePrepStore((s) => s.likes);
  const toggleLike = usePrepStore((s) => s.toggleLike);
  const follows = usePrepStore((s) => s.follows);
  const toggleFollowHost = usePrepStore((s) => s.toggleFollowHost);
  const points = usePrepStore((s) => s.points);

  const sesh = SESSIONS.find((x) => x.id === sessionId);
  const host = sesh ? HOSTS.find((h) => h.id === sesh.hostId) : undefined;

  const [handSheet, setHandSheet] = useState(false);
  const [question, setQuestion] = useState("");
  const [boostPick, setBoostPick] = useState(0);
  const [pointsSheet, setPointsSheet] = useState(false);

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
  const liked = likes.sessions.includes(sesh.id);
  const subscribed = follows.hosts.includes(host.id);

  return (
    <div className="theater">
      {/* desktop: the Twitch split — stage left, chat right */}
      <div className="mx-auto flex h-dvh max-w-md flex-col lg:max-w-[1360px] lg:flex-row">
        <div className="flex min-h-0 flex-col lg:min-w-0 lg:flex-1 lg:overflow-y-auto lg:pb-8">
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
          <button
            aria-label="Like this stream"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ color: liked ? "var(--prep-live)" : "var(--prep-text-2)" }}
            onClick={() => toggleLike("sessions", sesh.id)}
          >
            <IconHeart size={19} filled={liked} />
          </button>
        </header>

        {/* stage — video or audio treatment */}
        <div className="px-4">
          {room.video ? (
            <div
              className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-card"
              style={{
                background: `radial-gradient(110% 130% at 50% 0%, hsl(${host.hue} 18% 18%) 0%, #141414 70%)`,
              }}
            >
              <Avatar hue={host.hue} initials={host.initials} size={64} />
              <div className="mt-2.5 font-display text-[17px]" style={{ fontWeight: 500 }}>
                {host.name}
              </div>
              <div className="mt-1.5">
                <Waveform active={room.hostAnswering || !room.hotSeat} bars={20} height={16} />
              </div>
              <span
                className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10.5px] font-medium"
                style={{ background: "rgba(0,0,0,0.7)", color: "var(--prep-text-2)" }}
              >
                <IconVideo size={11} /> camera mocked
              </span>
              <div className="absolute bottom-2.5 right-2.5">
                <Badge state={host.badge} compact />
              </div>
            </div>
          ) : (
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
          )}
        </div>

        {/* channel row: subscribe + points */}
        <div className="mx-4 mt-2.5 flex items-center gap-2.5">
          <Link to={`/profile/${host.id}`} className="flex min-w-0 flex-1 items-center gap-2">
            <Avatar hue={host.hue} initials={host.initials} size={26} />
            <span className="truncate text-[13px]" style={{ color: "var(--prep-text-2)" }}>
              {host.headline}
            </span>
          </Link>
          <button
            className={`chip !py-1.5 text-[12.5px] ${subscribed ? "chip-active" : ""}`}
            onClick={() => toggleFollowHost(host.id)}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
          <button
            className="chip !py-1.5 text-[12.5px] tabular-nums"
            onClick={() => setPointsSheet(true)}
            title="Your points"
          >
            <IconBolt size={12} /> {fmtCount(points)}
          </button>
        </div>

        {/* hot seat banner */}
        <AnimatePresence>
          {room.hotSeat && (
            <motion.div
              className="mx-4 mt-2.5 rounded-tile border p-4"
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
                <span className="overline" style={{ color: "var(--prep-live)" }}>
                  {youOnStage ? "You have the floor" : `${room.hotSeat.name} has the floor`}
                </span>
                {room.hotSeat.boost ? (
                  <span className="ml-auto inline-flex items-center gap-1 text-[11.5px] font-semibold tabular-nums" style={{ color: "var(--prep-live)" }}>
                    <IconBolt size={11} /> {room.hotSeat.boost}
                  </span>
                ) : null}
              </div>
              <div className="mt-2.5 font-display text-[17px] leading-snug" style={{ fontWeight: 500 }}>
                “{room.hotSeat.question}”
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* queue strip */}
        {room.queue.length > 0 && (
          <div className="mx-4 mt-2.5 flex items-center gap-2.5 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
            <IconHand size={14} />
            <span className="tabular-nums">
              {room.queue.length} in queue
              {yourHand && yourPos >= 0 && (
                <span style={{ color: "var(--prep-text)" }}>
                  {" "}· you're #{yourPos + 1}
                  {yourHand.boost ? (
                    <span style={{ color: "var(--prep-live)" }}> · boosted {yourHand.boost}</span>
                  ) : null}
                </span>
              )}
            </span>
            <div className="flex -space-x-1.5">
              {room.queue.slice(0, 5).map((h) => (
                <Avatar key={h.id} hue={h.hue} initials={h.name.slice(0, 2).toUpperCase()} size={20} />
              ))}
            </div>
            {yourHand && yourPos >= 0 && (
              <button
                className="ml-auto inline-flex shrink-0 items-center gap-1 text-[12px] font-medium underline"
                style={{ color: "var(--prep-text-2)" }}
                onClick={() => {
                  const st = usePrepStore.getState();
                  if (st.points < 50) setPointsSheet(true);
                  else st.boostYourHand(50);
                }}
              >
                <IconBolt size={12} /> Boost +50
              </button>
            )}
          </div>
        )}

        </div>

        {/* chat column: inline on mobile, right rail on desktop */}
        <div
          className="flex min-h-0 flex-1 flex-col lg:h-dvh lg:w-[360px] lg:flex-none lg:border-l"
          style={{ borderColor: "var(--prep-line)" }}
        >
          <div
            className="overline hidden border-b px-5 pb-3 pt-4 lg:block"
            style={{ borderColor: "var(--prep-line)" }}
          >
            Chat
          </div>
          <ChatLog />
          <Composer
            onRaise={() => setHandSheet(true)}
            handState={youOnStage ? "stage" : yourHand ? "queued" : "none"}
            onNeedPoints={() => setPointsSheet(true)}
          />
        </div>

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
          <div className="mt-3.5 flex items-center gap-2">
            <span className="text-[12.5px]" style={{ color: "var(--prep-text-3)" }}>
              Boost
            </span>
            {[0, ...BOOST_STEPS].map((b) => (
              <button
                key={b}
                className={`chip !px-3 !py-1.5 text-[12.5px] tabular-nums ${boostPick === b ? "chip-active" : ""}`}
                onClick={() => setBoostPick(b)}
              >
                {b === 0 ? "none" : b}
              </button>
            ))}
          </div>
          <div className="mt-1.5 text-[11.5px] leading-relaxed" style={{ color: "var(--prep-text-3)" }}>
            A boost pins your question higher in the host's view and supports
            them. It never buys the stage — the host still chooses.
            {boostPick > points && (
              <button className="ml-1 underline" onClick={() => setPointsSheet(true)}>
                You have {points} points — get more
              </button>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn btn-ghost flex-1" onClick={() => setHandSheet(false)}>
              Not yet
            </button>
            <button
              className="btn btn-primary flex-1"
              disabled={!question.trim() || boostPick > points}
              onClick={() => {
                if (usePrepStore.getState().raiseHand(question, boostPick)) {
                  setHandSheet(false);
                  setQuestion("");
                  setBoostPick(0);
                }
              }}
            >
              <IconHand size={16} /> Raise it
            </button>
          </div>
        </Sheet>

        <PointsSheet open={pointsSheet} onClose={() => setPointsSheet(false)} />
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
    <div ref={ref} className="rail mt-2.5 flex-1 overflow-y-auto px-5 py-1">
      {chat?.map((m) => (
        <div key={m.id} className="py-[5px] text-[14px] leading-snug">
          {m.isSystem ? (
            <span className="text-[12.5px] italic" style={{ color: "var(--prep-text-3)" }}>
              — {m.text}
            </span>
          ) : m.boost ? (
            <span
              className="inline-block rounded-tile border px-2.5 py-1.5"
              style={{ borderColor: "var(--prep-live)", background: "var(--prep-live-tint)" }}
            >
              <span className="mr-2 inline-flex items-center gap-1 text-[11.5px] font-semibold tabular-nums" style={{ color: "var(--prep-live)" }}>
                <IconBolt size={11} /> {m.boost}
              </span>
              <span className="mr-2 font-semibold">{m.author}</span>
              <span style={{ color: "var(--prep-text-2)" }}>{m.text}</span>
            </span>
          ) : (
            <>
              <span
                className="mr-2 font-semibold"
                style={{
                  color: m.isHost || m.isYou
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
  onNeedPoints,
}: {
  onRaise: () => void;
  handState: "none" | "queued" | "stage";
  onNeedPoints: () => void;
}) {
  const [text, setText] = useState("");
  const sendChat = usePrepStore((s) => s.sendChat);
  const lowerHand = usePrepStore((s) => s.lowerHand);
  const send = (boost?: number) => {
    if (!text.trim()) return;
    if (boost && usePrepStore.getState().points < boost) {
      onNeedPoints();
      return;
    }
    sendChat(text, boost);
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
        <button
          aria-label="Send with 100 points"
          title="Send highlighted (100 points)"
          className="btn btn-ghost !px-3.5 !py-3"
          disabled={!text.trim()}
          onClick={() => send(100)}
        >
          <IconBolt size={16} />
        </button>
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
            style={{ background: "var(--prep-live)", color: "#ffffff" }}
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

/** Buy points — stubbed. Points highlight chat and boost questions; they
 *  support hosts and never purchase stage time (D9). */
function PointsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const points = usePrepStore((s) => s.points);
  const buyPoints = usePrepStore((s) => s.buyPoints);
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="overline">Points</div>
      <h3 className="mt-2 font-display text-[24px]" style={{ fontWeight: 500 }}>
        You have {points}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
        Points highlight your chat and pin your question higher in the host's
        view. They pay the host — they never buy the stage.
      </p>
      <div className="mt-4 flex gap-2">
        {[500, 1200, 3000].map((n, i) => (
          <button
            key={n}
            className="card flex-1 p-4 text-center"
            onClick={() => {
              buyPoints(n);
              onClose();
            }}
          >
            <div className="font-display text-[18px] tabular-nums" style={{ fontWeight: 500 }}>{n}</div>
            <div className="mt-0.5 text-[12px]" style={{ color: "var(--prep-text-3)" }}>
              ${[5, 10, 20][i]}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-3 text-center text-[11.5px]" style={{ color: "var(--prep-text-3)" }}>
        Prototype — no real billing.
      </div>
    </Sheet>
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
            style={{ background: "rgba(0, 0, 0, 0.9)" }}
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
              style={{ fontSize: 44, fontWeight: 500, color: "#ffffff", letterSpacing: "-0.01em" }}
            >
              You're up.
            </div>
            <div className="mt-3 text-[15px]" style={{ color: "#b3b3b3" }}>
              The room is yours for a minute.
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
