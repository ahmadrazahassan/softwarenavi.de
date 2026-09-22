import Link from "next/link";
import { Check } from "lucide-react";
import type { Software } from "@/lib/types";
import { CardActions, OfferBadges, PartnerLinkNote, PriceTag, RatingMeter } from "@/components/public/Cards";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { ComplianceBadges } from "@/components/public/ComplianceBadges";
import { formatMoney, formatPeriod, formatRating } from "@/lib/utils/format";
import { ratingCaption, ratingCaptionShort } from "@/lib/rating";

const SUB: [keyof Software & `${string}_rating`, string][] = [
  ["ease_of_use_rating", "Bedienbarkeit"],
  ["value_for_money_rating", "Preis-Leistung"],
  ["customer_service_rating", "Kundenservice"],
  ["functionality_rating", "Funktionen"],
];

function Featured({ s }: { s: Software }) {
  const v = s.starting_price;
  return (
    <article className="group relative flex flex-col rounded-2xl bg-ink p-7 text-white md:col-span-2 md:p-9 lg:row-span-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="rounded-xl bg-white p-1">
            <SoftwareLogo software={s} size={56} rounded="rounded-lg" />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-white/50">Höchste Bewertung</p>
            <h3 className="card-title mt-1 font-heading text-3xl font-medium tracking-[-0.03em] md:text-4xl">
              <Link href={`/software/${s.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
                {s.name}
              </Link>
            </h3>
          </div>
        </div>
      </div>

      {s.tagline && <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/65 md:text-base">{s.tagline}</p>}
      <OfferBadges software={s} className="mt-5 [&_li]:border-white/20 [&_li:not(.bg-lime)]:text-white" />

      <div className="mt-8 grid gap-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-12">
        <div>
          <p className="font-heading text-[4.5rem] font-medium leading-none tracking-[-0.05em] tabular-nums">{formatRating(s.overall_rating)}</p>
          <p className="mt-2 text-sm text-white/55">{ratingCaption(s, true)}</p>
        </div>
        <ul className="flex flex-col justify-end gap-3">
          {SUB.map(([k, label]) => (
            <li key={k} className="grid grid-cols-[7.5rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm">
              <span className="text-white/60">{label}</span>
              <RatingMeter rating={s[k] as number} track="dark" />
              <span className="text-right font-medium tabular-nums">{formatRating(s[k] as number)}</span>
            </li>
          ))}
        </ul>
      </div>

      {s.top_features.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
          {s.top_features.slice(0, 3).map((f) => (
            <li key={f} className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-lime" aria-hidden="true" /> {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6 [&]:mt-10">
        <div>
          <span className="block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/50">{v === null ? "Preis" : v === 0 ? "Einstieg" : "ab"}</span>
          <span className="mt-1 block font-heading text-[2.5rem] font-medium leading-none tracking-[-0.04em] tabular-nums">
            {v === null ? "auf Anfrage" : v === 0 ? "Kostenlos" : formatMoney(v, s.price_currency)}
          </span>
          {v !== null && v > 0 && <span className="mt-1.5 block text-sm text-white/55">{formatPeriod(s.billing_period, s.price_unit)} · netto zzgl. MwSt.</span>}
        </div>
        <CardActions software={s} tone="dark" className="w-full sm:w-80" />
      </div>
    </article>
  );
}

function Tile({ s }: { s: Software }) {
  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-white p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_24px_48px_-28px_rgba(21,19,30,0.35)]">
      <div className="flex items-center gap-3">
        <SoftwareLogo software={s} size={44} rounded="rounded-lg" />
        <div className="min-w-0">
          <h3 className="card-title truncate font-heading text-lg font-medium tracking-[-0.02em]">
            <Link href={`/software/${s.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
              {s.name}
            </Link>
          </h3>
          <p className="truncate text-xs text-muted-foreground">{s.category?.name}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <span className="font-heading text-lg font-medium tabular-nums">{formatRating(s.overall_rating)}</span>
        <RatingMeter rating={s.overall_rating} className="flex-1" />
        <span className="text-xs tabular-nums text-muted-foreground">{ratingCaptionShort(s)}</span>
      </div>
      <OfferBadges software={s} max={2} className="mt-4" />
      <ComplianceBadges software={s} max={2} className="relative z-[1] mt-2" />
      <div className="mt-auto border-t border-border pt-5 [&]:mt-6">
        <PriceTag software={s} />
        <CardActions software={s} className="mt-4" />
      </div>
    </article>
  );
}

/** Bento: one dark featured product (sub-ratings, big price) + eight compact tiles. */
export function SoftwareSpotlight({ items }: { items: Software[] }) {
  const [first, ...rest] = items;
  if (!first) return null;
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Featured s={first} />
        {rest.slice(0, 8).map((s) => (
          <Tile key={s.id} s={s} />
        ))}
      </div>
      <PartnerLinkNote className="mt-6" />
    </>
  );
}
