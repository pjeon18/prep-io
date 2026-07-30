import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wordmark } from "../components/TopNav";
import { AmbientField } from "../components/ui/AmbientField";
import { Pressable } from "../components/ui/Pressable";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { IconArrowUp, IconMic, IconUsers } from "../components/icons";
import { springs } from "../lib/motion";
import { usePrepStore } from "../store/usePrepStore";

/* The door. No signup wall — lurking is first-class (Principle 4).
 *
 * Now it also has to answer "which product is this?", because there are two
 * audiences (D17). Rather than explain the split in prose, the choice IS the
 * splash: two doors, and picking one sets the mode. */
export default function Splash() {
  const nav = useNavigate();
  const markSeen = usePrepStore((s) => s.markSplashSeen);
  const setMode = usePrepStore((s) => s.setMode);

  const enter = (mode: "careers" | "campus") => {
    markSeen();
    setMode(mode);
    nav(mode === "careers" ? "/fair" : "/campus");
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <AmbientField />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col px-7 pb-12 pt-8">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Wordmark />
          <ThemeToggle />
        </motion.div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <motion.h1
            className="font-display text-[42px] leading-[1.08] sm:text-[52px]"
            style={{ fontWeight: 500, letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.calm, delay: 0.1 }}
          >
            Office hours, live.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-[38ch] text-[17px] leading-relaxed"
            style={{ color: "var(--prep-text-2)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            Drop in on someone who has the job you want, or on your
            professor's office hours. Watch from the crowd, raise your hand
            when you're ready.
          </motion.p>

          {/* the two doors */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              {
                mode: "careers" as const,
                icon: <IconArrowUp size={18} />,
                kicker: "For your career",
                title: "Walk the fair",
                body: "Verified professionals hold drop-in office hours about breaking in.",
                delay: 0.6,
              },
              {
                mode: "campus" as const,
                icon: <IconUsers size={18} />,
                kicker: "For your courses",
                title: "Open your courses",
                body: "Instructors and TAs run live office hours, section, and review.",
                delay: 0.7,
              },
            ].map((d) => (
              <motion.div
                key={d.mode}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.calm, delay: d.delay }}
              >
                <Pressable
                  onClick={() => enter(d.mode)}
                  lift
                  className="card h-full w-full p-5 text-left"
                  style={{ display: "block" }}
                >
                  <span className="flex items-center gap-2" style={{ color: "var(--prep-text-3)" }}>
                    {d.icon}
                    <span className="overline">{d.kicker}</span>
                  </span>
                  <span className="mt-3 block font-display text-[22px]" style={{ fontWeight: 500 }}>
                    {d.title}
                  </span>
                  <span className="mt-1.5 block text-[14px] leading-relaxed" style={{ color: "var(--prep-text-2)" }}>
                    {d.body}
                  </span>
                </Pressable>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="flex items-center justify-between text-[13px]"
          style={{ color: "var(--prep-text-3)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          <span>No account needed to watch</span>
          <Pressable
            as="div"
            onClick={() => enter("campus")}
            className="inline-flex cursor-pointer items-center gap-1.5"
          >
            <IconMic size={14} /> I teach a course
          </Pressable>
        </motion.div>
      </div>
    </div>
  );
}
