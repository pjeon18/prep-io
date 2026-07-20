import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Waveform } from "../components/LiveStage";
import { IconClock, IconDollar } from "../components/icons";
import { HOSTS } from "../data/seedData";
import { springs } from "../lib/motion";
import { fmtClock, usePrepStore } from "../store/usePrepStore";

/** The funnel's paid layer — a timed 1:1 room. Checkout is STUBBED (no real
 *  payments in the prototype); the money buys the host's time, never
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
        <motion.div className="card p-5" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={springs.calm}>
          <div className="font-display text-[12px] font-bold tracking-wider" style={{ color: "var(--prep-text-3)" }}>
            PRIVATE BREAKOUT
          </div>
          <div className="mt-3 flex items-center gap-3">
            {host && <Avatar hue={host.hue} initials={host.initials} size={48} />}
            <div>
              <div className="font-display text-[16px] font-semibold">{breakout.hostName}</div>
              <div className="text-[13px]" style={{ color: "var(--prep-text-2)" }}>
                15 minutes, just you two
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-tile p-3.5" style={{ background: "var(--prep-surface-2)" }}>
            <span className="inline-flex items-center gap-2 text-[14px]">
              <IconDollar size={16} /> Host's rate
            </span>
            <span className="font-display text-[16px] font-semibold">${breakout.rate}</span>
          </div>
          <button className="btn btn-primary mt-4 w-full" onClick={payBreakout}>
            Pay ${breakout.rate} (stubbed)
          </button>
          <div className="mt-2 text-center text-[11.5px]" style={{ color: "var(--prep-text-3)" }}>
            Prototype: no real payment happens. Goes to the host's time — never to placement.
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
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="font-display text-[13px] font-bold tracking-wider" style={{ color: "var(--prep-amber)" }}>
          BREAKOUT · PRIVATE
        </div>
        <span className="inline-flex items-center gap-1.5 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
          <IconClock size={14} /> {fmtClock(remaining)} left
        </span>
      </div>
      <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-8">
        {host && (
          <div className="flex flex-col items-center">
            <Avatar hue={host.hue} initials={host.initials} size={96} ring />
            <div className="mt-3 font-display text-[17px] font-semibold">{breakout.hostName}</div>
            <div className="mt-2">
              <Waveform active />
            </div>
          </div>
        )}
        <div className="flex flex-col items-center">
          <Avatar hue={36} initials="Y" size={64} />
          <div className="mt-2 text-[13px]" style={{ color: "var(--prep-text-2)" }}>you</div>
          <div className="mt-2">
            <Waveform active bars={16} height={20} color="var(--prep-text-3)" />
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
  );
}
