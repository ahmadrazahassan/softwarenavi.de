import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComparisonWithSoftware, Software } from "@/lib/types";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { PriceTag } from "@/components/public/Cards";
import { cn } from "@/lib/utils";
import { formatRating } from "@/lib/utils/format";
import { ratingCaption } from "@/lib/rating";

const DIMENSIONS: [keyof Software & `${string}_rating`, string][] = [
  ["ease_of_use_rating", "Bedienbarkeit"],
  ["value_for_money_rating", "Preis-Leistung"],
  ["customer_service_rating", "Kundenservice"],
  ["functionality_rating", "Funktionen"],
];

/** Mirrored bar: grows outward from the centre label; leader in lime, trailer muted. */
function Bar({ value, lead, dir }: { value: number; lead: boolean; dir: "left" | "right" }) {
  return (
    <span className={cn("flex h-2 overflow-hidden rounded-full bg-ink/[0.06]", dir === "left" && "justify-end")} aria-hidden="true">
      <span className={cn("block h-full rounded-full", lead ? "bg-lime" : "bg-ink/20")} style={{ width: `${(value / 5) * 100}%` }} />
    </span>
  );
}

function DuelCard({ c, index }: { c: ComparisonWithSoftware; index: number }) {
  const { a, b } = c;
  const wins = DIMENSIONS.reduce((n, [k]) => n + ((a[k] as number) > (b[k] as number) ? 1 : 0), 0);
  const winsB = DIMENSIONS.reduce((n, [k]) => n + ((b[k] as number) > (a[k] as number) ? 1 : 0), 0);

  return (
    <article className="group relative flex min-w-0 flex-col rounded-2xl border border-border bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-ink/20 hover:shadow-[0_28px_56px_-32px_rgba(21,19,30,0.4)] md:p-8">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-heading font-medium tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <span className="uppercase tracking-[0.14em]">{a.category?.name ?? "Vergleich"}</span>
      </div>

      {/* identities + overall */}
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
        {[a, b].map((s, i) => {
          const lead = i === 0 ? a.overall_rating >= b.overall_rating : b.overall_rating >= a.overall_rating;
          return (
            <div key={s.id} className={cn("flex min-w-0 flex-col gap-3", i === 0 ? "col-start-1 items-start" : "col-start-3 items-end text-right")}>
              <SoftwareLogo software={s} size={56} rounded="rounded-xl" />
              <div className="min-w-0 max-w-full">
                <p className="card-title truncate font-heading text-lg font-medium tracking-[-0.02em] md:text-xl">{s.name}</p>
                <p className="text-xs text-muted-foreground">{ratingCaption(s)}</p>
              </div>
              <p className={cn("font-heading text-[2.75rem] font-medium leading-none tracking-[-0.05em] tabular-nums", !lead && "text-muted-foreground/60")}>
                {formatRating(s.overall_rating)}
              </p>
            </div>
          );
        })}
        <span className="col-start-2 row-start-1 grid size-10 place-items-center rounded-full border border-border font-heading text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          vs
        </span>
      </div>

      {/* sub-ratings */}
      <ul className="mt-7 flex flex-col gap-3.5 border-t border-border pt-6">
        {DIMENSIONS.map(([key, label]) => {
          const va = a[key] as number;
          const vb = b[key] as number;
          return (
            <li key={key} className="grid grid-cols-[2.25rem_minmax(0,1fr)_6.5rem_minmax(0,1fr)_2.25rem] items-center gap-2.5 text-sm sm:grid-cols-[2.25rem_minmax(0,1fr)_7.5rem_minmax(0,1fr)_2.25rem]">
              <span className={cn("tabular-nums", va >= vb ? "font-semibold" : "text-muted-foreground")}>{formatRating(va)}</span>
              <Bar value={va} lead={va >= vb} dir="left" />
              <span className="text-center text-[12.5px] text-muted-foreground">{label}</span>
              <Bar value={vb} lead={vb >= va} dir="right" />
              <span className={cn("text-right tabular-nums", vb >= va ? "font-semibold" : "text-muted-foreground")}>{formatRating(vb)}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Kriterien gewonnen: <span className="font-semibold tabular-nums text-ink">{wins}</span> : <span className="font-semibold tabular-nums text-ink">{winsB}</span>
      </p>

      {/* prices */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-paper p-4">
        <PriceTag software={a} />
        <PriceTag software={b} align="right" />
      </div>

      <Link
        href={`/vergleich/${c.slug}`}
        className="mt-6 flex items-center justify-between gap-3 text-sm font-medium after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
      >
        <span className="min-w-0 truncate">
          {a.name} vs. {b.name}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
          Vergleich öffnen <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}

/** „Im direkten Vergleich": grid of large head-to-head cards with sub-rating duels and net prices. */
export function ComparisonShowcase({ comparisons, limit = 6 }: { comparisons: ComparisonWithSoftware[]; limit?: number }) {
  if (!comparisons.length) return null;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {comparisons.slice(0, limit).map((c, i) => (
        <DuelCard key={c.id} c={c} index={i} />
      ))}
    </div>
  );
}
