import { AnimatePresence, motion } from "framer-motion";
import { springs } from "../lib/motion";

/** Bottom sheet (mobile) / centered card (desktop) with scrim. */
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
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(6,10,20,0.7)" }}
            onClick={onClose}
          />
          <motion.div
            className="card relative z-10 w-full max-w-md rounded-b-none p-5 sm:rounded-card"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={springs.standard}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
