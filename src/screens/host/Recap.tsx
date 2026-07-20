import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IconEye, IconHand, IconPlay, IconUsers } from "../../components/icons";
import { SECTIONS } from "../../data/seedData";
import { fadeUp, springs, stagger } from "../../lib/motion";
import { usePrepStore } from "../../store/usePrepStore";

/** Every session ends here — cleanly, with proof it compounded: the numbers,
 *  the questions, and the archive it just became. No dead ends. */
export default function Recap() {
  const nav = useNavigate();
  const recap = usePrepStore((s) => s.recap);
  const clearRecap = usePrepStore((s) => s.clearRecap);

  if (!recap) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6">
        <div style={{ color: "var(--prep-text-2)" }}>No recent session to recap.</div>
        <button className="btn btn-ghost mt-4" onClick={() => nav("/host")}>
          Host home
        </button>
      </div>
    );
  }

  const stat = (icon: React.ReactNode, value: string, label: string, i: number) => (
    <motion.div
      className="card flex flex-col items-center p-4"
      {...fadeUp}
      transition={{ ...springs.standard, ...stagger(i, 0.07) }}
    >
      <span style={{ color: "var(--prep-amber)" }}>{icon}</span>
      <div className="mt-1.5 font-display text-[20px] font-semibold">{value}</div>
      <div className="text-[11.5px]" style={{ color: "var(--prep-text-3)" }}>
        {label}
      </div>
    </motion.div>
  );

  return (
    <div className="mx-auto min-h-dvh max-w-md px-4 pb-16">
      <motion.div
        className="mt-10 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.calm}
      >
        <div className="font-display text-[12px] font-bold tracking-wider" style={{ color: "var(--prep-text-3)" }}>
          SESSION COMPLETE
        </div>
        <h1 className="mt-2 font-display text-[22px] font-semibold leading-snug">
          {recap.sessionTitle}
        </h1>
        <div className="mt-1 text-[13px]" style={{ color: "var(--prep-text-2)" }}>
          {SECTIONS.find((s) => s.id === recap.sectionId)?.name} · {recap.durationLabel}
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {stat(<IconEye size={20} />, String(recap.peakViewers), "peak viewers", 0)}
        {stat(<IconHand size={20} />, String(recap.handsRaised), "hands raised", 1)}
        {stat(
          <IconPlay size={20} />,
          String(recap.questionsAnswered.length),
          "questions answered live",
          2,
        )}
        {stat(<IconUsers size={20} />, `+${recap.followsGained}`, "new followers", 3)}
      </div>

      {recap.questionsAnswered.length > 0 && (
        <>
          <h2 className="mt-7 font-display text-[15px] font-semibold">
            What the room learned
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {recap.questionsAnswered.map((q, i) => (
              <div key={i} className="card flex items-start gap-3 p-3.5">
                <span className="mt-0.5 shrink-0 font-display text-[12px] font-semibold" style={{ color: "var(--prep-amber)" }}>
                  {String(Math.floor(q.atSec / 60)).padStart(2, "0")}:{String(q.atSec % 60).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block text-[13.5px] leading-snug">“{q.question}”</span>
                  <span className="mt-0.5 block text-[12px]" style={{ color: "var(--prep-text-3)" }}>
                    {q.askedBy}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <motion.button
        className="card mt-6 w-full p-4 text-left"
        style={{ borderColor: "var(--prep-amber)" }}
        {...fadeUp}
        transition={{ ...springs.standard, delay: 0.4 }}
        onClick={() => {
          const id = recap.vodId;
          clearRecap();
          nav(`/vod/${id}`);
        }}
      >
        <div className="font-display text-[12px] font-bold tracking-wider" style={{ color: "var(--prep-amber)" }}>
          YOUR SESSION IS NOW AN ARCHIVE
        </div>
        <div className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
          Chaptered by question, searchable forever. This is how one live hour
          keeps helping people while you sleep.
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
