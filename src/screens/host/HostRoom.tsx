import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { Badge } from "../../components/Badge";
import { LivePill, Waveform } from "../../components/LiveStage";
import { IconCheck, IconEye, IconHand, IconX } from "../../components/icons";
import { startCrowd, stopCrowd } from "../../lib/crowd/engine";
import { springs } from "../../lib/motion";
import { fmtClock, fmtCount, usePrepStore } from "../../store/usePrepStore";

/* Your live room, host side. The queue is the room's contract: you can only
 * bring up someone who raised a hand (the store enforces it), and you can
 * end cleanly any time — the session becomes an archive, never a ghost. */

export default function HostRoom() {
  const nav = useNavigate();
  const room = usePrepStore((s) => s.room);
  const verification = usePrepStore((s) => s.verification);
  const promoteHand = usePrepStore((s) => s.promoteHand);
  const dismissHand = usePrepStore((s) => s.dismissHand);
  const finishHotSeat = usePrepStore((s) => s.finishHotSeat);
  const endRoom = usePrepStore((s) => s.endRoom);
  const simPushChat = usePrepStore((s) => s.simPushChat);

  const isHosting = room?.role === "host";

  useEffect(() => {
    if (!isHosting) return;
    startCrowd("host");
    return () => stopCrowd();
  }, [isHosting]);

  if (!room || !isHosting) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div style={{ color: "var(--prep-text-2)" }}>You're not hosting right now.</div>
        <button className="btn btn-primary mt-4" onClick={() => nav("/host/golive")}>
          Set up a session
        </button>
      </div>
    );
  }

  const badge =
    verification.state === "verified-role" || verification.state === "verified-school"
      ? verification.state
      : "unverified";

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col">
      {/* header */}
      <header className="flex items-center gap-2 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[14px] font-semibold">{room.title}</div>
          <div className="mt-0.5 flex items-center gap-2 text-[11.5px]" style={{ color: "var(--prep-text-2)" }}>
            <LivePill label="YOU'RE LIVE" />
            <span className="inline-flex items-center gap-1">
              <IconEye size={12} /> {fmtCount(room.viewers)}
            </span>
            <span style={{ color: "var(--prep-text-3)" }}>{fmtClock(room.elapsedSec)}</span>
            <Badge state={badge} compact />
          </div>
        </div>
        <button
          className="btn btn-danger !px-3.5 !py-2 text-[13px]"
          onClick={() => {
            endRoom();
            nav("/host/recap");
          }}
        >
          End
        </button>
      </header>

      {/* your stage */}
      <div className="mx-4">
        <div
          className="card flex items-center gap-3 p-3.5"
          style={room.hotSeat ? { borderColor: "var(--prep-amber)" } : undefined}
        >
          <Avatar hue={36} initials="Y" size={44} ring={!!room.hotSeat} />
          <div className="min-w-0 flex-1">
            {room.hotSeat ? (
              <>
                <div className="font-display text-[11px] font-bold tracking-wider" style={{ color: "var(--prep-amber)" }}>
                  ANSWERING {room.hotSeat.name.toUpperCase()}
                </div>
                <div className="mt-0.5 text-[13px] leading-snug">“{room.hotSeat.question}”</div>
              </>
            ) : (
              <div className="text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                You're on — talk to the room, take hands when you're ready.
              </div>
            )}
            <div className="mt-1.5">
              <Waveform active bars={18} height={16} />
            </div>
          </div>
          {room.hotSeat && (
            <button
              className="btn btn-primary shrink-0 !px-3.5 !py-2 text-[12.5px]"
              onClick={() => {
                const name = room.hotSeat!.name;
                finishHotSeat();
                simPushChat({
                  author: "prep.io",
                  authorHue: 36,
                  text: `${name} steps down — thanks for asking`,
                  isSystem: true,
                });
              }}
            >
              <IconCheck size={15} /> Done
            </button>
          )}
        </div>
      </div>

      {/* the queue — your control surface */}
      <div className="mx-4 mt-3">
        <div className="flex items-center gap-2 text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
          <IconHand size={14} />
          {room.queue.length === 0 ? "No hands up yet" : `${room.queue.length} hands raised`}
        </div>
        <AnimatePresence>
          {room.queue.map((h) => (
            <motion.div
              key={h.id}
              className="card mt-2 flex items-center gap-2.5 p-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={springs.standard}
            >
              <Avatar hue={h.hue} initials={h.name.slice(0, 2).toUpperCase()} size={30} />
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold">{h.name}</div>
                <div className="truncate text-[12.5px]" style={{ color: "var(--prep-text-2)" }}>
                  “{h.question}”
                </div>
              </div>
              <button
                className="btn btn-primary shrink-0 !px-3 !py-1.5 text-[12px]"
                disabled={!!room.hotSeat}
                onClick={() => {
                  if (promoteHand(h.id)) {
                    simPushChat({
                      author: "prep.io",
                      authorHue: 36,
                      text: `${h.name} is on the hot seat`,
                      isSystem: true,
                    });
                  }
                }}
              >
                Bring up
              </button>
              <button
                aria-label="Dismiss hand"
                className="shrink-0 p-1"
                style={{ color: "var(--prep-text-3)" }}
                onClick={() => dismissHand(h.id)}
              >
                <IconX size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* chat */}
      <HostChatLog />

      <div className="border-t px-4 py-2.5 text-center text-[11px]" style={{ borderColor: "var(--prep-line)", color: "var(--prep-text-3)" }}>
        {room.answered.length} answered so far · every one becomes a chapter in your archive
      </div>
    </div>
  );
}

function HostChatLog() {
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
              <span className="mr-1.5 font-semibold" style={{ color: `hsl(${m.authorHue} 45% 68%)` }}>
                {m.author}
              </span>
              <span style={{ color: "var(--prep-text-2)" }}>{m.text}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
