import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRating } from "@/lib/utils/format";

export function StarRating({
  rating,
  size = "sm",
  className,
  showValue = false,
  tone = "light",
}: {
  rating: number;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
  /** `dark` for stars on an ink background */
  tone?: "light" | "dark";
}) {
  const px = { xs: "size-3", sm: "size-3.5", md: "size-4.5", lg: "size-6" }[size];
  const empty = tone === "dark" ? "text-white/20" : "text-[#dcd9e2]";
  const full = tone === "dark" ? "text-brand" : "text-brand-dark";
  const label = `Bewertung: ${formatRating(rating)} von 5 Sternen`;
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="inline-flex items-center gap-0.5" role="img" aria-label={label}>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)));
          return (
            <span key={i} className={cn("relative inline-block", px)} aria-hidden="true">
              <Star className={cn("absolute inset-0", empty, px)} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn(full, px)} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </span>
      {showValue && <span className="text-sm font-semibold tabular-nums">{formatRating(rating)}</span>}
    </span>
  );
}

export function RatingBar({
  label,
  value,
  max = 5,
  color,
  display,
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
  display?: string;
}) {
  const pct = max ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="grid grid-cols-[minmax(0,8.5rem)_1fr_auto] items-center gap-3 text-sm">
      <span className="truncate text-muted-foreground" title={label}>
        {label}
      </span>
      <span className="h-1.5 overflow-hidden rounded-sm bg-paper" aria-hidden="true">
        <span className="animate-fill-bar block h-full rounded-sm" style={{ width: `${pct}%`, background: color ?? "var(--color-brand)" }} />
      </span>
      <span className="w-9 text-right font-semibold tabular-nums">{display ?? formatRating(value)}</span>
    </div>
  );
}

export function CircularRating({
  rating,
  color = "var(--color-brand)",
  size = 88,
  label = "Gesamtbewertung",
}: {
  rating: number;
  color?: string;
  size?: number;
  label?: string;
}) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, rating / 5));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${formatRating(rating)} von 5`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="6" stroke="#efedfe" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="6" stroke={color} strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <span className="absolute font-heading text-2xl font-semibold tabular-nums" aria-hidden="true">
        {formatRating(rating)}
      </span>
    </div>
  );
}
