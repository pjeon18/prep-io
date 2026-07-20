/** Generated gradient avatar — no photos needed, hue-keyed per person. */
export function Avatar({
  hue,
  initials,
  size = 40,
  ring,
}: {
  hue: number;
  initials: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        color: "rgba(255,255,255,0.92)",
        background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${(hue + 40) % 360} 60% 28%))`,
        boxShadow: ring ? "0 0 0 2px var(--prep-bg), 0 0 0 4px var(--prep-amber)" : undefined,
      }}
    >
      {initials}
    </div>
  );
}
