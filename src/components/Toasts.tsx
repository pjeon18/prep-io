import { AnimatePresence, motion } from "framer-motion";
import { springs } from "../lib/motion";
import { usePrepStore } from "../store/usePrepStore";
import { Glass } from "./ui/Glass";

/* Toasts: glass pills that drop in from the top edge and stack.
 * `layout` on each item makes the stack reflow with a spring when one
 * expires, instead of the ones below snapping upward. */
export function Toasts() {
  const toasts = usePrepStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -22, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.96 }}
            transition={springs.standard}
          >
            <Glass variant="pill" className="px-4 py-2.5 text-[13.5px]">
              {t.text}
            </Glass>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
