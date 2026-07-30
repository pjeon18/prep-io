/* Shimmer placeholders. Sized by the caller so a loading card occupies
 * exactly the space the real card will, which is the whole point: a
 * skeleton that reflows on load is worse than a spinner. */
export function Skeleton({
  className = "",
  radius = "var(--radius-tile)",
  style,
}: {
  className?: string;
  radius?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`shimmer ${className}`}
      style={{ borderRadius: radius, ...style }}
    />
  );
}

/** The 16:9 thumbnail + two text lines used by every media grid. */
export function SkeletonCard() {
  return (
    <div>
      <Skeleton style={{ aspectRatio: "16 / 9" }} />
      <div className="mt-2.5 flex gap-3">
        <Skeleton style={{ width: 34, height: 34, borderRadius: "50%" }} />
        <div className="flex-1">
          <Skeleton style={{ height: 13, width: "82%" }} />
          <Skeleton className="mt-2" style={{ height: 11, width: "54%" }} />
        </div>
      </div>
    </div>
  );
}
