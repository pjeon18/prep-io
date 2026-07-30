import { AnimatePresence, motion } from "framer-motion";
import { sheetUp, springs } from "../lib/motion";
import { Glass } from "./ui/Glass";

/* Bottom sheet (mobile) / centered panel (desktop).
 *
 * Glass here rather than an opaque card: a sheet is chrome that rises over
 * content, and letting the page blur through underneath is what keeps the
 * context visible while it's open. The scrim is separate so it can fade at
 * its own rate — a scrim that springs with the sheet reads as one heavy
 * slab instead of a panel lifting off a dimmed page. */
export function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(6, 6, 8, 0.55)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-md"
            variants={sheetUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={springs.standard}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            /* a fast flick down closes it, matching the platform gesture —
               velocity, not distance, so a short sharp swipe works */
            onDragEnd={(_, info) => {
              if (info.velocity.y > 520 || info.offset.y > 140) onClose();
            }}
          >
            <Glass variant="sheet" className="p-5 pb-7 sm:rounded-[22px]">
              {/* grabber: the affordance for the drag above */}
              <div
                aria-hidden
                className="mx-auto mb-4 h-1 w-10 rounded-full sm:hidden"
                style={{ background: "var(--prep-text-3)", opacity: 0.4 }}
              />
              {children}
            </Glass>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
