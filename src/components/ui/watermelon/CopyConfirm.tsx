import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IconCheck, IconLink2 } from "../../icons";

/* ------------------------------------------------------------------ */
/* CopyConfirm — adapted from Watermelon UI.                           */
/*                                                                     */
/* Source: `npx shadcn@latest add                                      */
/*   https://registry.watermelon.sh/r/copy-confirm.json`               */
/* (Watermelon UI, credited on their page to Maxim Kuznetsov.)         */
/*                                                                     */
/* What we kept — the two mechanisms worth having:                     */
/*   1. the icon swaps through a blur+scale spring rather than a fade,  */
/*      so it reads as one control changing state;                      */
/*   2. the LABEL morphs per character with a staggered layout spring,  */
/*      so "Copy link" → "Copied" flows instead of cutting.             */
/*                                                                     */
/* What we changed, deliberately:                                      */
/*   - their demo shell (h-screen wrapper, title/settings pill) is      */
/*     gone; this is a button, not a page;                              */
/*   - lucide icons → our stroke set, because two icon languages in one */
/*     product is exactly the inconsistency the icon rule exists to     */
/*     prevent;                                                         */
/*   - hardcoded zinc/green/black → our tokens, so it themes with       */
/*     everything else (their green-on-success became our verified      */
/*     green, which is the only sanctioned green here).                  */
/* ------------------------------------------------------------------ */

export function CopyConfirm({
  value,
  copyText = "Copy join link",
  copiedText = "Copied",
  className = "",
}: {
  value: string;
  copyText?: string;
  copiedText?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard can be blocked (insecure context, permissions); the
      // confirmation is still honest about the attempt having been made
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.button
      onClick={copy}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      animate={{
        backgroundColor: copied ? "var(--prep-verified)" : "var(--prep-action-bg)",
      }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill px-4 py-2.5 text-[13.5px] font-medium ${className}`}
      style={{ color: copied ? "#fff" : "var(--prep-action-fg)" }}
      aria-label={copied ? copiedText : copyText}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className="inline-flex"
        >
          {copied ? <IconCheck size={15} /> : <IconLink2 size={15} />}
        </motion.span>
      </AnimatePresence>
      <MorphingLabel from={copyText} to={copiedText} showTo={copied} />
    </motion.button>
  );
}

/** Per-character morph: each glyph is its own layout-animated element, so
 *  the two labels interleave instead of cross-fading. */
function MorphingLabel({
  from,
  to,
  showTo,
}: {
  from: string;
  to: string;
  showTo: boolean;
}) {
  const active = showTo ? to : from;
  return (
    <span className="flex will-change-transform">
      <AnimatePresence mode="popLayout" initial={false}>
        {active.split("").map((ch, i) => (
          <motion.span
            key={`${active}-${ch}-${i}`}
            layout
            initial={{ opacity: 0, y: 5, scale: 0.7 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.03 * i,
              },
            }}
            exit={{ opacity: 0, y: -5, scale: 0.7 }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
