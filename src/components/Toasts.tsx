import { AnimatePresence, motion } from "framer-motion";
import { usePrepStore } from "../store/usePrepStore";
import { springs } from "../lib/motion";

export function Toasts() {
  const toasts = usePrepStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="card px-4 py-2.5 text-[13px]"
            style={{ background: "var(--prep-surface-2)" }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springs.standard}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
