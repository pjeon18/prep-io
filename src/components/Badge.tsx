import type { BadgeState } from "../lib/types";
import { IconShieldCheck, IconShieldQuestion } from "./icons";

/**
 * The credential badge — the product's trust primitive. Verified is the ONLY
 * green in the app; unverified is persistently marked, never hidden
 * (Principle 2).
 */
export function Badge({ state, compact }: { state: BadgeState; compact?: boolean }) {
  if (state === "unverified") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-pill border px-2 py-[3px] text-[11.5px] font-medium"
        style={{ color: "var(--prep-text-3)", borderColor: "var(--prep-line)" }}
        title="This host's credentials have not been verified"
      >
        <IconShieldQuestion size={12} />
        {!compact && "Unverified"}
      </span>
    );
  }
  const label = state === "verified-role" ? "Verified role" : "Verified school";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-pill px-2 py-[3px] text-[11.5px] font-semibold"
      style={{
        color: "var(--prep-verified)",
        background: "var(--prep-verified-tint)",
      }}
      title={`${label} — confirmed by Prep.io verification`}
    >
      <IconShieldCheck size={12} />
      {!compact && label}
    </span>
  );
}
