import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wordmark } from "../components/TopNav";
import { springs } from "../lib/motion";
import { usePrepStore } from "../store/usePrepStore";

/** Value prop, then straight to the fair. No signup wall — lurking is
 *  first-class (Principle 4), so the door is always open. */
export default function Splash() {
  const nav = useNavigate();
  const markSeen = usePrepStore((s) => s.markSplashSeen);

  const enter = () => {
    markSeen();
    nav("/fair");
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 110%, rgba(255,181,71,0.22) 0%, rgba(255,181,71,0.05) 45%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.calm, delay: 0.15 }}
      >
        <Wordmark size={40} />
      </motion.div>
      <motion.h1
        className="mt-6 max-w-sm text-center font-display text-[26px] font-semibold leading-snug"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.calm, delay: 0.35 }}
      >
        Live office hours with people who have the job you want.
      </motion.h1>
      <motion.p
        className="mt-4 max-w-xs text-center text-[15px] leading-relaxed"
        style={{ color: "var(--prep-text-2)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Wander the fair. Lurk in the crowd. Raise your hand when you're ready —
        everyone learns from every question.
      </motion.p>
      <motion.div
        className="mt-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.calm, delay: 0.8 }}
      >
        <button className="btn btn-primary px-8" onClick={enter}>
          Walk the fair
        </button>
        <span className="text-[12px]" style={{ color: "var(--prep-text-3)" }}>
          No account needed to watch
        </span>
      </motion.div>
    </div>
  );
}
