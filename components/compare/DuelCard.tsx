import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComparisonWithSoftware, Software } from "@/lib/types";
import { formatMoney, formatRating } from "@/lib/utils/format";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { ratingCaption } from "@/lib/rating";

function price(s: Software) {
  if (s.starting_price === null) return "auf Anfrage";
  if (s.starting_price === 0) return "kostenlos";
  return `ab ${formatMoney(s.starting_price, s.price_currency)}`;
}

/** Head-to-head tile: two identities, ratings as a split bar, net entry price per side. */
export function DuelCard({ comparison }: { comparison: ComparisonWithSoftware }) {
  const { a, b } = comparison;
  const share = a.overall_rating + b.overall_rating > 0 ? (a.overall_rating / (a.overall_rating + b.overall_rating)) * 100 : 50;
  const leader = a.overall_rating === b.overall_rating ? null : a.overall_rating > b.overall_rating ? "a" : "b";

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_24px_48px_-28px_rgba(21,19,30,0.4)]">
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        {[a, b].map((s, i) => (
          <div key={s.id} className={i === 0 ? "col-start-1 min-w-0" : "col-start-3 min-w-0 text-right"}>
            <SoftwareLogo software={s} size={40} rounded="rounded-lg" className={i === 1 ? "ml-auto" : undefined} />
            <p className="card-title mt-3 truncate font-heading text-base font-medium tracking-[-0.015em]">{s.name}</p>
            <p className="text-xs text-muted-foreground">{ratingCaption(s)}</p>
          </div>
        ))}
        <span className="col-start-2 row-start-1 mt-2.5 font-heading text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">vs</span>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline justify-between font-heading tabular-nums">
          <span className={`text-2xl font-medium tracking-[-0.03em] ${leader === "b" ? "text-muted-foreground" : ""}`}>{formatRating(a.overall_rating)}</span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Bewertung</span>
          <span className={`text-2xl font-medium tracking-[-0.03em] ${leader === "a" ? "text-muted-foreground" : ""}`}>{formatRating(b.overall_rating)}</span>
        </div>
        <div className="mt-2.5 flex h-1.5 gap-1" aria-hidden="true">
          <span className={`rounded-full ${leader === "b" ? "bg-border" : "bg-ink"}`} style={{ width: `${share}%` }} />
          <span className={`flex-1 rounded-full ${leader === "a" ? "bg-border" : "bg-brand"}`} />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 border-t border-border pt-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Preis netto</dt>
          <dd className="mt-0.5 font-medium tabular-nums">{price(a)}</dd>
        </div>
        <div className="text-right">
          <dt className="text-xs text-muted-foreground">Preis netto</dt>
          <dd className="mt-0.5 font-medium tabular-nums">{price(b)}</dd>
        </div>
      </dl>

      <Link
        href={`/vergleich/${comparison.slug}`}
        className="mt-6 flex items-center justify-between text-sm font-medium after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
      >
        <span>
          {a.name} vs. {b.name}
        </span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white" aria-hidden="true">
          <ArrowUpRight className="size-3.5" />
        </span>
      </Link>
    </article>
  );
}
