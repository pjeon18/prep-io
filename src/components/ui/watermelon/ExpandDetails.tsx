import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import useMeasure from "react-use-measure";
import { IconChevronDown } from "../../icons";

/* ------------------------------------------------------------------ */
/* ExpandDetails — adapted from Watermelon UI.                         */
/*                                                                     */
/* Source: `npx shadcn@latest add                                      */
/*   https://registry.watermelon.sh/r/expand-details.json`              */
/*                                                                     */
/* The mechanism worth stealing is the CHOREOGRAPHY, not the markup:    */
/* width and height animate on separate springs with mirrored delays —  */
/* opening, the pill widens first and then grows tall; closing, it       */
/* shortens first and then narrows. That ordering is why it reads as     */
/* one object unfolding instead of a box being resized. Content enters   */
/* blurred and slightly low, 0.3s behind, so it arrives into a container */
/* that has already made room for it.                                   */
/*                                                                     */
/* Height comes from `react-use-measure` (their dependency): you cannot  */
/* spring to `auto`, so the inner content is measured and the outer      */
/* animates to that number.                                             */
/*                                                                     */
/* Changed for this project: their fixed 120/320px widths became props    */
/* (a course panel is wider than a demo widget), lucide → our chevron,   */
/* zinc → our tokens, and it starts CLOSED because on a real page an      */
/* auto-expanded disclosure is just a card.                              */
/* ------------------------------------------------------------------ */

const SPRING = { type: "spring", stiffness: 200, damping: 22, mass: 1.2 } as const;

export function ExpandDetails({
  label = "Details",
  collapsedWidth = 132,
  expandedWidth = 340,
  rows,
}: {
  label?: string;
  collapsedWidth?: number;
  expandedWidth?: number;
  /** label → value pairs; `wide` spans both columns */
  rows: { label: string; value: string; wide?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  const [ref, bounds] = useMeasure({ offsetSize: true });

  return (
    <motion.div
      initial={{ borderRadius: 22 }}
      animate={{
        width: open ? expandedWidth : collapsedWidth,
        height: bounds.height > 0 ? bounds.height : "auto",
        borderRadius: open ? 18 : 22,
      }}
      transition={{
        // mirrored delays: grow tall after widening, narrow after shortening
        height: { ...SPRING, delay: open ? 0.25 : 0 },
        width: { ...SPRING, delay: open ? 0 : 0.3 },
        borderRadius: SPRING,
      }}
      className="overflow-hidden"
      style={{ background: "var(--prep-surface-2)" }}
    >
      <div ref={ref} className="relative px-4 py-2.5">
        <motion.button
          layout="position"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center gap-1.5 focus:outline-none"
          style={{ color: "var(--prep-text)" }}
        >
          <motion.span
            animate={{ rotate: open ? 0 : -90 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
            className="inline-flex items-center justify-center"
            style={{ color: "var(--prep-text-3)" }}
          >
            <IconChevronDown size={18} />
          </motion.span>
          <span className="text-[15px] font-medium tracking-tight">{label}</span>
        </motion.button>

        <AnimatePresence initial={false} mode="popLayout">
          {open && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(8px)", y: 40 }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: { type: "spring", duration: 0.4, bounce: 0, delay: 0.3 },
              }}
              exit={{ opacity: 0, filter: "blur(8px)", y: 16 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="overflow-hidden"
              style={{ minWidth: expandedWidth - 32 }}
            >
              <div className="ml-6 mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
                {rows.map((r) => (
                  <div key={r.label} className={r.wide ? "col-span-2" : undefined}>
                    <div className="text-[12.5px] font-medium" style={{ color: "var(--prep-text-3)" }}>
                      {r.label}
                    </div>
                    <div className="mt-0.5 text-[15px] tracking-tight" style={{ color: "var(--prep-text)" }}>
                      {r.value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
