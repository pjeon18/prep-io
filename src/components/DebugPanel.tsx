import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SECTIONS, SESSIONS } from "../data/seedData";
import { springs } from "../lib/motion";
import { usePrepStore } from "../store/usePrepStore";
import { IconGear, IconX } from "./icons";

/** `?debug` demo controls. Enabled via query param, persisted for the session. */
export function useDebugEnabled() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(location.search).has("debug")) {
      sessionStorage.setItem("prep-debug", "1");
    }
    setOn(sessionStorage.getItem("prep-debug") === "1");
  }, []);
  return on;
}

export function DebugPanel() {
  const enabled = useDebugEnabled();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const s = usePrepStore();

  if (!enabled) return null;

  const row = "flex items-center justify-between gap-3 py-2";
  const label = "text-[13px] text-prep-text-2";

  return (
    <>
      <button
        aria-label="Demo controls"
        className="fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border"
        style={{
          background: "var(--prep-surface-2)",
          borderColor: "var(--prep-line)",
          color: "var(--prep-text-2)",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <IconX size={18} /> : <IconGear size={18} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="card fixed bottom-[70px] right-4 z-50 w-[290px] max-w-[calc(100vw-32px)] p-4"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={springs.standard}
          >
            <div className="mb-1 font-display text-[13px] font-semibold tracking-wide text-prep-text-3">
              DEMO CONTROLS
            </div>

            <div className={row}>
              <span className={label}>Force viewer surge</span>
              <button className="chip" onClick={() => s.forceSurge()} disabled={!s.room}>
                +40
              </button>
            </div>

            <div className={row}>
              <span className={label}>Promote me to hot seat</span>
              <button
                className="chip"
                disabled={!s.room || s.room.role !== "viewer"}
                onClick={() => {
                  const r = s.room;
                  if (!r) return;
                  const mine = r.queue.find((h) => h.who === "you");
                  if (!mine) {
                    s.raiseHand("(demo) What would you tell your college self?");
                  }
                  s.fastTrackYou();
                  s.toast("Fast-tracking your raised hand");
                }}
              >
                go
              </button>
            </div>

            <div className={row}>
              <span className={label}>LLM crowd (dev only)</span>
              <button
                className={`chip ${s.debug.llmCrowd ? "chip-active" : ""}`}
                onClick={() => s.setLlmCrowd(!s.debug.llmCrowd)}
              >
                {s.debug.llmCrowd ? "on" : "off"}
              </button>
            </div>

            <div className={row}>
              <span className={label}>Verification</span>
              <select
                className="input !w-auto !px-2 !py-1 text-[12px]"
                value={s.verification.state}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "none") usePrepStore.setState({ verification: { state: "none", method: null } });
                  else if (v === "pending") s.startVerification("debug");
                  else s.completeVerification(v as "verified-role" | "verified-school" | "unverified");
                }}
              >
                <option value="none">none</option>
                <option value="pending">pending</option>
                <option value="verified-role">verified-role</option>
                <option value="verified-school">verified-school</option>
                <option value="unverified">unverified</option>
              </select>
            </div>

            <div className={row}>
              <span className={`${label} shrink-0`}>Jump to room</span>
              <select
                className="input !w-auto min-w-0 max-w-[150px] !px-2 !py-1 text-[12px]"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) nav(`/room/${e.target.value}`);
                }}
              >
                <option value="" disabled>
                  pick
                </option>
                {SESSIONS.filter((x) => x.kind === "live").map((x) => (
                  <option key={x.id} value={x.id}>
                    {SECTIONS.find((sec) => sec.id === x.sectionId)?.name}: {x.title.slice(0, 22)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2 border-t pt-3" style={{ borderColor: "var(--prep-line)" }}>
              <button className="btn btn-danger w-full !py-2 text-[13px]" onClick={() => s.resetAll()}>
                Reset all state
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
