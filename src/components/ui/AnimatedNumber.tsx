import { fmtCount } from "../../store/usePrepStore";

/* Odometer digits.
 *
 * The live viewer count changes every couple of seconds, and a number that
 * silently swaps is the single clearest tell that a "live" figure is fake.
 * Animating only the digits that CHANGED makes the count feel like a meter
 * being driven by something real.
 *
 * Mechanism: key each character by index+value, so React remounts exactly
 * the characters that changed and the CSS entrance (.odo-in) replays for
 * those alone. Mount-only animation means there's no exit to leave a stale
 * digit behind mid-flight. */
export function AnimatedNumber({
  value,
  format = true,
  className = "",
}: {
  value: number;
  /** 1.2k-style compaction (off for small counts like a queue length) */
  format?: boolean;
  className?: string;
}) {
  const text = format ? fmtCount(value) : String(value);
  return (
    <span className={`tabular-nums ${className}`} aria-label={String(value)}>
      {text.split("").map((ch, i) => (
        <span key={`${i}-${ch}`} className="odo-in" aria-hidden>
          {ch}
        </span>
      ))}
    </span>
  );
}
