import { useState } from "react";
import { useStore } from "../store/useStore";
import { debugAnswerMine, debugSurge } from "../lib/sim";
import { Gear } from "./icons";

/* ?debug demo controls, remembered for the tab. */
export function DebugPanel() {
  const [on] = useState(() => {
    const q = new URLSearchParams(location.search).has("debug");
    if (q) sessionStorage.setItem("prep-debug", "1");
    return q || sessionStorage.getItem("prep-debug") === "1";
  });
  const [open, setOpen] = useState(false);
  const room = useStore((s) => s.room);
  const reset = useStore((s) => s.reset);
  if (!on) return null;
  const actions: [string, () => void, boolean?][] = [
    ["More viewers", debugSurge],
    ["Host answers my question next", debugAnswerMine, !room],
    ["Reset demo", reset],
  ];
  return (
    <div className="fixed bottom-4 left-4 z-50">
      {open && (
        <div className="mb-2 w-60 rounded-xl border border-line bg-white p-2 shadow-lift">
          <p className="px-2 pb-1 pt-1 text-[12px] font-semibold text-ink-3">Demo controls</p>
          {actions.map(([label, fn, disabled]) => (
            <button key={label} disabled={disabled} onClick={fn} className="block w-full rounded-lg px-2.5 py-2 text-left text-[14px] text-ink hover:bg-[#f3f2ef] disabled:opacity-35">{label}</button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-2 shadow-lift" aria-label="Demo controls"><Gear size={18} /></button>
    </div>
  );
}
