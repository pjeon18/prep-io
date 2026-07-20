import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SECTIONS } from "../../data/seedData";
import { fadeUp, springs, stagger } from "../../lib/motion";
import { usePrepStore } from "../../store/usePrepStore";

/** Every session ends here — cleanly, with proof it compounded: the numbers,
 *  the questions, and the recording it just became. No dead ends. */
export default function Recap() {
  const nav = useNavigate();
  const recap = usePrepStore((s) => s.recap);
  const clearRecap = usePrepStore((s) => s.clearRecap);

  if (!recap) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div style={{ color: "var(--prep-text-2)" }}>No recent session to recap.</div>
        <button className="btn btn-ghost mt-5" onClick={() => nav("/host")}>
          Host home
        </button>
      </div>
    );
  }

  const stats: [string, string][] = [
    [String(recap.peakViewers), "peak viewers"],
    [String(recap.handsRaised), "hands raised"],
    [String(recap.questionsAnswered.length), "answered live"],
    [`+${recap.followsGained}`, "new subscribers"],
    ...(recap.boostPoints > 0
      ? ([[String(recap.boostPoints), "boost points earned"]] as [string, string][])
      : []),
  ];

  return (
    <div className="mx-auto min-h-dvh max-w-md px-5 pb-16">
      <motion.div
        className="mt-14"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.calm}
      >
        <div className="overline">Session complete</div>
        <h1 className="mt-2 font-display text-[30px] leading-tight" style={{ fontWeight: 500 }}>
          {recap.sessionTitle}
        </h1>
        <div className="mt-2 text-[14px]" style={{ color: "var(--prep-text-2)" }}>
          {SECTIONS.find((s) => s.id === recap.sectionId)?.name} · {recap.durationLabel}
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-x-6">
        {stats.map(([value, label], i) => (
          <motion.div
            key={label}
            className="border-t py-4"
            style={{ borderColor: "var(--prep-line)" }}
            {...fadeUp}
            transition={{ ...springs.standard, ...stagger(i, 0.07) }}
          >
            <div className="font-display text-[34px] leading-none tabular-nums" style={{ fontWeight: 500 }}>
              {value}
            </div>
            <div className="mt-1.5 text-[13px]" style={{ color: "var(--prep-text-3)" }}>
              {label}
            </div>
          </motion.div>
        ))}
      </div>

      {recap.questionsAnswered.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-[24px]" style={{ fontWeight: 500 }}>
            What the room learned
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {recap.questionsAnswered.map((q, i) => (
              <div key={i} className="card flex items-start gap-4 p-4">
                <span className="mt-0.5 shrink-0 text-[13px] font-medium tabular-nums" style={{ color: "var(--prep-text-3)" }}>
                  {String(Math.floor(q.atSec / 60)).padStart(2, "0")}:{String(q.atSec % 60).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] leading-snug">“{q.question}”</span>
                  <span className="mt-1 block text-[13px]" style={{ color: "var(--prep-text-3)" }}>
                    {q.askedBy}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <motion.button
        className="card mt-8 w-full p-5 text-left"
        {...fadeUp}
        transition={{ ...springs.standard, delay: 0.4 }}
        onClick={() => {
          const id = recap.vodId;
          clearRecap();
          nav(`/vod/${id}`);
        }}
      >
        <div className="overline">Saved to your library</div>
        <div className="mt-2 text-[14.5px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          The session is now a recording, chaptered by question. It keeps
          answering after you've logged off.
        </div>
      </motion.button>

      <button
        className="btn btn-ghost mt-4 w-full"
        onClick={() => {
          clearRecap();
          nav("/host");
        }}
      >
        Done
      </button>
    </div>
  );
}
