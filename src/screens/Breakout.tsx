import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Waveform } from "../components/LiveStage";
import { IconClock } from "../components/icons";
import { HOSTS } from "../data/seedData";
import { springs } from "../lib/motion";
import { fmtClock, usePrepStore } from "../store/usePrepStore";

/** The funnel's paid layer — a timed 1:1 room in the theater. Checkout is
 *  STUBBED (no real payments); the money buys the host's time, never
 *  visibility (Principle 1). */
export default function Breakout() {
  const nav = useNavigate();
  const breakout = usePrepStore((s) => s.breakout);
  const payBreakout = usePrepStore((s) => s.payBreakout);
  const closeBreakout = usePrepStore((s) => s.closeBreakout);
  const [remaining, setRemaining] = useState(15 * 60);

  const host = HOSTS.find((h) => h.id === breakout?.hostId);

  useEffect(() => {
    if (!breakout?.paid) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [breakout?.paid]);

  if (!breakout) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <button className="btn btn-ghost" onClick={() => nav("/fair")}>
          Back to the fair
        </button>
      </div>
    );
  }

  if (!breakout.paid) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.calm}
        >
          <div className="overline">Private breakout</div>
          <div className="mt-4 flex items-center gap-3.5">
            {host && <Avatar hue={host.hue} initials={host.initials} size={48} />}
            <div>
              <div className="font-display text-[20px]" style={{ fontWeight: 500 }}>
                {breakout.hostName}
              </div>
              <div className="text-[14px]" style={{ color: "var(--prep-text-2)" }}>
                Fifteen minutes, one on one
              </div>
            </div>
          </div>
          <div
            className="mt-5 flex items-baseline justify-between border-t pt-4"
            style={{ borderColor: "var(--prep-line)" }}
          >
            <span className="text-[14px]" style={{ color: "var(--prep-text-2)" }}>
              Host's rate
            </span>
            <span className="font-display text-[24px] tabular-nums" style={{ fontWeight: 500 }}>
              ${breakout.rate}
            </span>
          </div>
          <button className="btn btn-primary mt-5 w-full" onClick={payBreakout}>
            Pay ${breakout.rate}
          </button>
          <div className="mt-2.5 text-center text-[12px] leading-relaxed" style={{ color: "var(--prep-text-3)" }}>
            Prototype — no real payment. Pays for the host's time, never for placement.
          </div>
          <button
            className="btn btn-ghost mt-3 w-full"
            onClick={() => {
              closeBreakout();
              nav(-1);
            }}
          >
            Cancel
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="theater min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-6">
        <div className="flex items-center justify-between">
          <span className="overline" style={{ color: "var(--prep-live)" }}>
            Private breakout
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13.5px] tabular-nums" style={{ color: "var(--prep-text-2)" }}>
            <IconClock size={14} /> {fmtClock(remaining)}
          </span>
        </div>
        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-10">
          {host && (
            <div className="flex flex-col items-center">
              <Avatar hue={host.hue} initials={host.initials} size={96} ring />
              <div className="mt-4 font-display text-[20px]" style={{ fontWeight: 500 }}>
                {breakout.hostName}
              </div>
              <div className="mt-3">
                <Waveform active />
              </div>
            </div>
          )}
          <div className="flex flex-col items-center">
            <Avatar hue={36} initials="Y" size={60} />
            <div className="mt-2 text-[13.5px]" style={{ color: "var(--prep-text-2)" }}>you</div>
            <div className="mt-2">
              <Waveform active bars={16} height={18} />
            </div>
          </div>
        </div>
        <button
          className="btn btn-danger w-full"
          onClick={() => {
            closeBreakout();
            nav("/fair");
          }}
        >
          End breakout
        </button>
      </div>
    </div>
  );
}
