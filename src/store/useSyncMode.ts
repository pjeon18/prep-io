import { useEffect } from "react";
import { usePrepStore } from "./usePrepStore";

/** Deep links must set the mode, or arriving at a campus URL from a careers
 *  session (or a bookmark) renders campus content inside careers navigation.
 *  Mode-neutral screens (Library, Search, Settings) deliberately don't call
 *  this — they belong to both worlds. */
export function useSyncMode(mode: "careers" | "campus") {
  const current = usePrepStore((s) => s.mode);
  const setMode = usePrepStore((s) => s.setMode);
  useEffect(() => {
    if (current !== mode) setMode(mode);
  }, [current, mode, setMode]);
}
