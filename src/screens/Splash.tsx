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
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-7 pb-12 pt-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Wordmark />
      </motion.div>

      <div className="flex flex-1 flex-col justify-center">
        <motion.h1
          className="font-display text-[46px] leading-[1.08]"
          style={{ fontWeight: 500, letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.calm, delay: 0.15 }}
        >
          Office hours with people who have the job you want.
        </motion.h1>

        <motion.p
          className="mt-7 max-w-[30ch] text-[17px] leading-relaxed"
          style={{ color: "var(--prep-text-2)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Live, drop-in, and verified. Watch from the crowd, or raise your
          hand and ask.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springs.calm, delay: 0.7 }}
      >
        <div
          className="mb-7 h-px w-full"
          style={{ background: "var(--prep-line)" }}
        />
        <button className="btn btn-primary w-full !py-4 text-[16px]" onClick={enter}>
          Walk the fair
        </button>
        <div
          className="mt-4 text-center text-[13.5px]"
          style={{ color: "var(--prep-text-3)" }}
        >
          No account needed to watch
        </div>
      </motion.div>
    </div>
  );
}
