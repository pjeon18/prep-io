import { motion } from "framer-motion";
import { springs } from "../../lib/motion";
import { Pressable } from "./Pressable";

/* ------------------------------------------------------------------ */
/* SegmentedSwitch — one sliding pill, shared by layoutId.             */
/*                                                                     */
/* The mechanism that makes this feel native rather than web: the       */
/* active indicator is a SINGLE element with a `layoutId`, so framer    */
/* animates it between segments instead of cross-fading two states.     */
/* The pill physically travels, and because it's a spring it carries a  */
/* little momentum into the stop.                                      */
/*                                                                     */
/* Used for the Careers/Campus mode switch and for in-page tab rows,    */
/* which is why `layoutGroup` is required: two switches on one screen   */
/* sharing a layoutId would animate the pill BETWEEN them across the    */
/* page. Pass a unique group per instance.                              */
/* ------------------------------------------------------------------ */

export function SegmentedSwitch<T extends string>({
  options,
  value,
  onChange,
  layoutGroup,
  size = "md",
  className = "",
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  /** unique per instance — see the note above */
  layoutGroup: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const pad = size === "sm" ? "px-3 py-1.5 text-[13px]" : "px-4 py-2 text-[14px]";
  return (
    <div
      role="tablist"
      className={`relative inline-flex items-center gap-1 rounded-pill p-1 ${className}`}
      style={{ background: "var(--prep-surface-2)" }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={`relative z-10 inline-flex items-center gap-1.5 rounded-pill font-medium ${pad}`}
            style={{ color: on ? "var(--prep-action-fg)" : "var(--prep-text-2)" }}
          >
            {on && (
              <motion.span
                layoutId={`seg-${layoutGroup}`}
                transition={springs.standard}
                className="absolute inset-0 rounded-pill"
                style={{ background: "var(--prep-action-bg)", zIndex: -1 }}
              />
            )}
            {o.icon}
            {o.label}
          </Pressable>
        );
      })}
    </div>
  );
}
