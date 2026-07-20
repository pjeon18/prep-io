/** Generated avatar — muted, hue-keyed per person. No photos needed. */
export function Avatar({
  hue,
  initials,
  size = 40,
  ring,
}: {
  hue: number;
  initials: string;
  size?: number;
  /** on-air ring (live crimson) */
  ring?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-medium"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        letterSpacing: "0.02em",
        color: "rgba(255,255,255,0.94)",
        background: `linear-gradient(140deg, hsl(${hue} 22% 46%), hsl(${(hue + 30) % 360} 26% 32%))`,
        boxShadow: ring
          ? "0 0 0 2px var(--prep-bg), 0 0 0 4px var(--prep-live)"
          : undefined,
      }}
    >
      {initials}
    </div>
  );
}
