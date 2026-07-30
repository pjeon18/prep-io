import type { ElementType, ReactNode } from "react";

/* Liquid Glass wrapper (see src/styles/glass.css).
 *
 * CHROME ONLY — nav, headers, docks, sheets, control pills. Content stays
 * opaque so it can be read.
 *
 * Positioning gotcha, repeated here because it bites every time: `.glass`
 * sets `position` and `border-radius` itself, and glass.css loads after
 * Tailwind, so `absolute`/`fixed`/`sticky`/`rounded-full` utilities are
 * silently ignored. Pass `position` here instead of a Tailwind class. */

type Variant = "panel" | "bar" | "dock" | "sheet" | "pill" | "live";
type Position = "relative" | "absolute" | "fixed" | "sticky";

const POS: Record<Position, string> = {
  relative: "",
  absolute: "glass-abs",
  fixed: "glass-fixed",
  sticky: "glass-sticky",
};

export function Glass({
  as: Tag = "div",
  variant = "panel",
  position = "relative",
  round = false,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  variant?: Variant;
  position?: Position;
  /** fully circular (icon chrome) */
  round?: boolean;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <Tag
      className={[
        "glass",
        `glass-${variant}`,
        POS[position],
        round ? "glass-round" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}
