import Link from "next/link";
import { Check, CheckCircle2, Globe2, Headphones, Minus, Star, ThumbsDown, ThumbsUp, X } from "lucide-react";
import type { PricingPlan, Software } from "@/lib/types";
/** Profile accents use the site palette, not per-vendor colours. */
const ACCENT = "#8A7FFE";
import { cn } from "@/lib/utils";
import { formatCount, formatDateShort, formatMoney, formatMonthYear, formatPercent, formatPeriod, formatRating, NET_PRICE_NOTE } from "@/lib/utils/format";
import { featureCatalogueFor } from "@/lib/data/categories";
import { INTEGRATION_ICONS } from "@/lib/data/logos";
import { RATING_DIMENSIONS, USER_BUCKETS } from "@/lib/i18n/options";
import { complianceRows, ComplianceFootnote } from "@/components/public/ComplianceBadges";
import { StarRating } from "@/components/public/Rating";
import { AffiliateCTAButton, AffiliateDisclosureNote } from "@/components/public/Affiliate";
import { ratingWord } from "@/lib/rating";

export function ProfileSection({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={cn("scroll-mt-40 border-t border-border pt-12 [counter-increment:profile]", className)}>
      <p
        aria-hidden="true"
        className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-dark tabular-nums before:content-[counter(profile,decimal-leading-zero)]"
      />
      <h2 id={`${id}-h`} className="mt-2 font-heading text-[1.75rem] font-medium tracking-[-0.03em] md:text-[2.25rem]">
        {title}
      </h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

// ───────────── Vor- und Nachteile ─────────────

export function ProsCons({ pros = [], cons = [] }: { pros?: string[]; cons?: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border p-5">
        <h3 className="flex items-center gap-2 font-medium text-ink">
          <ThumbsUp className="size-4 text-brand-dark" aria-hidden="true" /> Das gefällt Nutzern
        </h3>
        <ul className="mt-3 flex flex-col gap-2 text-[15px]">
          {pros.map((p) => (
            <li key={p} className="flex gap-2">
              <Check className="mt-1 size-4 shrink-0 text-brand-dark" aria-hidden="true" /> {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-border p-5">
        <h3 className="flex items-center gap-2 font-medium text-ink">
          <ThumbsDown className="size-4 text-muted-foreground" aria-hidden="true" /> Das wird kritisiert
        </h3>
        <ul className="mt-3 flex flex-col gap-2 text-[15px]">
          {cons.map((p) => (
            <li key={p} className="flex gap-2">
              <Minus className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" /> {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ───────────── Für wen geeignet ─────────────

export function CompanySizeChart({ distribution, color, total }: { distribution: Record<string, number>; color: string; total: number }) {
  const buckets = USER_BUCKETS.map((b) => ({
    ...b,
    count: b.sizes.reduce((sum, s) => sum + (distribution[s] ?? 0), 0),
  }));
  const max = Math.max(1, ...buckets.map((b) => b.count));
  return (
    <figure>
      <div className="grid grid-cols-3 gap-3">
        {buckets.map((b) => {
          const pct = total ? Math.round((b.count / total) * 100) : 0;
          return (
            <div key={b.key} className="rounded-xl border border-border p-4">
              <div className="flex h-24 items-end" aria-hidden="true">
                <div className="animate-fill-bar w-full rounded-sm" style={{ height: `${Math.max(6, (b.count / max) * 100)}%`, background: color }} />
              </div>
              <p className="mt-3 font-heading text-2xl font-medium tabular-nums">{pct}&nbsp;%</p>
              <p className="card-title text-sm font-semibold">{b.label}</p>
              <p className="text-xs text-muted-foreground">{b.range} Mitarbeitende</p>
            </div>
          );
        })}
      </div>
      <figcaption className="mt-3 text-xs text-muted-foreground">Anteil der Bewertungen nach Unternehmensgröße (EU-KMU-Definition), Basis: {formatCount(total)} Bewertungen.</figcaption>
    </figure>
  );
}

// ───────────── Funktionen ─────────────

export function FeatureChecklist({ software }: { software: Software }) {
  const catalogue = featureCatalogueFor(software);
  const has = new Set(software.features);
  const rows = catalogue.length ? catalogue : software.features.map((f) => ({ name: f, description: "" }));
  return (
    <ul className="grid gap-2.5 sm:grid-cols-2">
      {rows.map((f) => {
        const yes = has.has(f.name);
        return (
          <li key={f.name} className={cn("flex gap-3 rounded-lg border p-3.5", yes ? "border-border bg-white" : "border-border")}>
            <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center", yes ? "text-brand-dark" : "text-[#b9b6c4]")}>
              {yes ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" strokeWidth={3} />}
              <span className="sr-only">{yes ? "vorhanden" : "nicht vorhanden"}</span>
            </span>
            <span className="min-w-0">
              <span className={cn("block text-sm font-semibold", !yes && "text-muted-foreground")}>{f.name}</span>
              {f.description && <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{f.description}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function TopFeatures({ items }: { items: string[]; color?: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-3 border-b border-border py-3.5">
          <CheckCircle2 className="size-5 shrink-0 text-brand-dark" strokeWidth={1.75} aria-hidden="true" />
          <span className="text-[15px] font-medium">{t}</span>
        </li>
      ))}
    </ul>
  );
}

// ───────────── Preise ─────────────

function planPrice(p: PricingPlan, s: Software) {
  if (p.price === null) return { main: "auf Anfrage", sub: "" };
  if (p.price === 0) return { main: "0 €", sub: "kostenlos" };
  return { main: formatMoney(p.price, s.price_currency), sub: formatPeriod(p.period, p.unit ?? s.price_unit) };
}

export function PricingCards({ software }: { software: Software }) {
  const color = ACCENT;
  const plans = software.pricing_plans;
  if (!plans.length) {
    return (
      <div className="rounded-xl border border-border p-6">
        <p className="font-heading text-xl font-medium">
          {software.starting_price === null
            ? "Preis auf Anfrage"
            : `ab ${formatMoney(software.starting_price, software.price_currency)} ${formatPeriod(software.billing_period, software.price_unit)}`}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {software.vendor_name} veröffentlicht {software.starting_price === null ? "keine Listenpreise" : "keine detaillierten Tarife"}. Die Kosten hängen in der Regel von Nutzerzahl, Modulen und Vertragslaufzeit ab.
        </p>
        <div className="mt-5">
          <AffiliateCTAButton software={software} label="Preis anfragen" />
        </div>
        <p className="mt-5 text-xs text-muted-foreground">{NET_PRICE_NOTE}</p>
      </div>
    );
  }
  // highlight: explicitly flagged plan, else the middle of three / the higher of two
  const hi = plans.findIndex((p) => p.highlighted);
  const highlight = hi >= 0 ? hi : plans.length === 3 ? 1 : plans.length === 2 ? 1 : -1;
  return (
    <div>
      <div className={cn("grid gap-4", plans.length >= 3 ? "md:grid-cols-3" : plans.length === 2 ? "md:grid-cols-2" : "")}>
        {plans.map((p, i) => {
          const { main, sub } = planPrice(p, software);
          const isHi = i === highlight;
          return (
            <div
              key={p.name}
              className={cn("relative flex flex-col rounded-xl border bg-white p-6", isHi ? "border-2" : "border-border")}
              style={isHi ? { borderColor: color } : undefined}
            >
              {isHi && (
                <span className="absolute -top-3 left-6 rounded-sm px-2.5 py-1 text-[11px] font-semibold text-ink" style={{ background: color }}>
                  Beliebteste Wahl
                </span>
              )}
              <h3 className="font-heading text-lg font-medium">{p.name}</h3>
              {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
              <p className="mt-4">
                <span className="font-heading text-3xl font-medium tracking-[-0.02em] tabular-nums">{main}</span>
                {sub && <span className="ml-1 text-sm text-muted-foreground">{sub}</span>}
              </p>
              {p.price !== null && p.price > 0 && <p className="text-xs text-muted-foreground">netto zzgl. MwSt.</p>}
              <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-brand-dark" aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <AffiliateCTAButton software={software} label={p.price === null ? "Preis anfragen" : software.free_trial ? "Kostenlos testen" : "Zum Anbieter"} fullWidth size="sm" variant={isHi ? "brand" : "outline"} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        {NET_PRICE_NOTE} Listenpreise laut Anbieter, Stand {software.compliance_checked_at ? formatMonthYear(software.compliance_checked_at) : "unbekannt"}. Aktionspreise und
        Jahresrabatte können abweichen.
      </p>
      <AffiliateDisclosureNote compact className="mt-2" />
    </div>
  );
}

// ───────────── Compliance ─────────────

export function ComplianceBlock({ software }: { software: Software }) {
  const rows = complianceRows(software);
  return (
    <div className="rounded-xl border border-border bg-white">
      <dl className="divide-y divide-dashed divide-border">
        {rows.map(({ label, value, ok, note, icon: Icon }) => (
          <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-[14rem_1fr] sm:gap-4">
            <dt className="flex items-center gap-2 text-sm font-semibold">
              <Icon className="size-4 text-brand-dark" aria-hidden="true" /> {label}
            </dt>
            <dd>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium",
                  ok === true && "text-ink [&_svg]:text-success",
                  ok === false && "text-ink [&_svg]:text-destructive",
                  ok === null && "text-muted-foreground",
                )}
              >
                {ok === true ? <Check className="size-3.5" aria-hidden="true" /> : ok === false ? <X className="size-3.5" aria-hidden="true" /> : <Minus className="size-3.5" aria-hidden="true" />}
                {value}
              </span>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p>
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-border px-5 py-4">
        <ComplianceFootnote checkedAt={software.compliance_checked_at} />
      </div>
    </div>
  );
}

// ───────────── Integrationen & Support ─────────────

export function IntegrationsGrid({ items }: { items: string[] }) {
  if (!items.length) return <p className="text-muted-foreground">Keine Angaben zu Integrationen.</p>;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((name) => {
        const icon = INTEGRATION_ICONS[name];
        return (
          <li key={name} className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-white p-3">
            {icon ? (
              <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element -- mixed svg/png/ico assets, tiny */}
                <img src={icon} alt="" width={28} height={28} loading="lazy" className="size-full object-contain" />
              </span>
            ) : (
              <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border text-xs font-semibold text-ink" aria-hidden="true">
                {name.replace(/[^A-Za-zÄÖÜäöü0-9 ]/g, " ").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
              </span>
            )}
            <span className="card-title min-w-0 text-sm font-semibold">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function SupportFacts({ software }: { software: Software }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl border border-border p-5">
        <Headphones className="size-6 text-brand-dark" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="mt-3 font-semibold">Supportkanäle</h3>
        <p className="mt-1 text-sm text-muted-foreground">{software.support_types.join(", ")}</p>
      </div>
      <div className="rounded-xl border border-border p-5">
        <Globe2 className="size-6 text-brand-dark" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="mt-3 font-semibold">Sprachen</h3>
        <p className="mt-1 text-sm text-muted-foreground">{software.languages.join(", ")}</p>
      </div>
      <div className="rounded-xl border border-border p-5">
        <CheckCircle2 className="size-6 text-brand-dark" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="mt-3 font-semibold">Deutschsprachiger Support</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {software.german_support === true ? "Ja" : software.german_support === false ? "Nein" : "keine Angabe"}
          {" · "}Kundenservice-Bewertung {formatRating(software.customer_service_rating)} / 5
        </p>
      </div>
    </div>
  );
}

// ───────────── Bewertungen ─────────────

export function RatingsOverview({
  software,
  distribution,
}: {
  software: Software;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}) {
  const total = software.review_count;
  const positive = total ? ((distribution[5] + distribution[4]) / total) * 100 : 0;
  const base = `/software/${software.slug}/bewertungen`;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="grid md:grid-cols-[18rem_minmax(0,1fr)]">
        {/* score panel */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden bg-ink p-7 text-center text-white md:items-start md:p-8 md:text-left">
          <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand/25 blur-3xl" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">Gesamtbewertung</p>
          <p className="mt-3 flex items-end gap-1.5">
            <span className="font-heading text-[4.5rem] font-medium leading-[0.85] tracking-[-0.05em] tabular-nums">{formatRating(software.overall_rating)}</span>
            <span className="mb-1 text-lg text-white/45">/ 5</span>
          </p>
          <StarRating rating={software.overall_rating} size="lg" tone="dark" className="mt-4" />
          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="rounded-full bg-lime px-3 py-1 text-xs font-semibold text-ink">{ratingWord(software.overall_rating)}</span>
            <span className="text-sm text-white/65">aus {formatCount(total)} Bewertungen</span>
          </p>
          <div className="mt-6 w-full border-t border-white/10 pt-5">
            <p className="font-heading text-3xl font-medium tabular-nums">{formatPercent(positive)}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">der Nutzerinnen und Nutzer vergeben 4 oder 5 Sterne</p>
          </div>
        </div>

        {/* distribution + sub-scores */}
        <div className="p-6 md:p-8">
          <p className="text-sm font-semibold">Verteilung der Sterne</p>
          <ul className="mt-3 flex flex-col gap-1" aria-label="Verteilung der Sterne">
            {([5, 4, 3, 2, 1] as const).map((n) => {
              const pct = total ? (distribution[n] / total) * 100 : 0;
              return (
                <li key={n}>
                  <Link
                    href={`${base}?sterne=${n}`}
                    className="group grid grid-cols-[3.25rem_minmax(0,1fr)_3rem_2.75rem] items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-paper"
                    aria-label={`${n} ${n === 1 ? "Stern" : "Sterne"}: ${formatCount(distribution[n])} Bewertungen anzeigen`}
                  >
                    <span className="inline-flex items-center gap-1 font-medium tabular-nums">
                      {n} <Star className="size-3.5 text-brand-dark" fill="currentColor" strokeWidth={0} aria-hidden="true" />
                    </span>
                    <span className="h-2 overflow-hidden rounded-full bg-paper group-hover:bg-white" aria-hidden="true">
                      <span
                        className="animate-fill-bar block h-full rounded-full"
                        style={{ width: `${pct}%`, background: n >= 4 ? "var(--color-brand)" : n === 3 ? "var(--color-brand-soft)" : "#cfccd8" }}
                      />
                    </span>
                    <span className="text-right text-muted-foreground tabular-nums">{formatPercent(pct)}</span>
                    <span className="text-right font-semibold tabular-nums">{formatCount(distribution[n])}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-7 text-sm font-semibold">Teilbewertungen</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2" aria-label="Teilbewertungen">
            {RATING_DIMENSIONS.map((d) => {
              const v = software[d.ratingKey];
              return (
                <li key={d.key} className="rounded-xl bg-paper p-4">
                  <p className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-muted-foreground">{d.label}</span>
                    <span className="font-heading text-xl font-medium tabular-nums">{formatRating(v)}</span>
                  </p>
                  <span className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-ink/[0.07]" aria-hidden="true">
                    <span className="animate-fill-bar block h-full rounded-full bg-brand" style={{ width: `${(v / 5) * 100}%` }} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** „Häufig gelobt" / „Häufig kritisiert": the points reviewers mention most, counted from the published reviews. */
export function ReviewHighlights({
  highlights,
}: {
  highlights: { pros: { text: string; count: number }[]; cons: { text: string; count: number }[]; total: number };
}) {
  if (!highlights.total || (!highlights.pros.length && !highlights.cons.length)) return null;
  const col = (kind: "pros" | "cons") => {
    const items = highlights[kind];
    const good = kind === "pros";
    return (
      <div className={cn("rounded-2xl border p-5 md:p-6", good ? "border-success/15 bg-success/[0.05]" : "border-error/15 bg-error/[0.04]")}>
        <p className="flex items-center gap-2 font-heading text-lg font-medium tracking-[-0.01em]">
          <span className={cn("grid size-8 place-items-center rounded-full", good ? "bg-success/12 text-success" : "bg-error/10 text-error")} aria-hidden="true">
            {good ? <ThumbsUp className="size-4" /> : <ThumbsDown className="size-4" />}
          </span>
          {good ? "Häufig gelobt" : "Häufig kritisiert"}
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((it) => (
            <li key={it.text} className="flex items-start justify-between gap-4 text-sm leading-relaxed">
              <span>{it.text}</span>
              <span className="mt-0.5 shrink-0 rounded-full bg-white px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground shadow-[0_0_0_1px_var(--color-border)]">
                {formatCount(it.count)}×
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {col("pros")}
      {col("cons")}
    </div>
  );
}

/**
 * Redaktionelle Bewertung: verdict, four sub-scores, the full report and the method note.
 * Clearly separated from user reviews (own label, byline, date) as required by UWG § 5b Abs. 3.
 */
export function EditorialReviewBlock({ software }: { software: Software }) {
  const e = software.editorial;
  if (!e) return null;
  const subs: [string, number][] = [
    ["Bedienung", e.ease],
    ["Preis-Leistung", e.value],
    ["Service", e.service],
    ["Funktionsumfang", e.functionality],
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="grid gap-8 border-b border-border bg-paper/60 p-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12 md:p-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Redaktionsnote</p>
          <p className="mt-2 font-heading text-[3.5rem] font-medium leading-none tracking-[-0.05em] tabular-nums">{formatRating(e.rating)}</p>
          <p className="mt-2 text-xs text-muted-foreground">von 5 Punkten</p>
        </div>
        <div className="min-w-0">
          <p className="font-heading text-lg font-medium leading-snug tracking-[-0.015em] md:text-xl">{e.verdict}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
            {subs.map(([label, v]) => (
              <li key={label} className="grid grid-cols-[7.5rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="block h-1.5 overflow-hidden rounded-full bg-ink/[0.07]" aria-hidden="true">
                  <span className="block h-full rounded-full bg-lime" style={{ width: `${(v / 5) * 100}%` }} />
                </span>
                <span className="text-right font-medium tabular-nums">{formatRating(v)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="prose-content max-w-3xl p-6 md:p-8" dangerouslySetInnerHTML={{ __html: e.body }} />
      <p className="border-t border-border px-6 py-4 text-xs leading-relaxed text-muted-foreground md:px-8">
        <strong className="font-semibold text-ink">{e.author}</strong> · Stand {formatDateShort(e.tested_at)} · Bewertet auf Basis von
        Herstellerangaben, geprüften Preislisten und Produktdokumentation. Die Redaktionsnote ist keine Nutzerbewertung und wird getrennt von
        diesen ausgewiesen. Provisionen haben keinen Einfluss.{" "}
        <Link href="/redaktionelle-grundsaetze" className="underline decoration-brand underline-offset-2">
          Unsere Methodik
        </Link>
      </p>
    </div>
  );
}

/** Shown in „Bewertungen" until the first user review is published. */
export function NoUserReviewsYet({ software }: { software: Software }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-center">
      <p className="font-heading text-xl font-medium tracking-[-0.02em]">Noch keine Nutzerbewertungen zu {software.name}</p>
      <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
        Sie arbeiten mit {software.name}? Ihre Erfahrung hilft anderen Unternehmen bei der Auswahl. Jede Bewertung wird vor der Veröffentlichung von
        unserer Redaktion geprüft.
      </p>
      <Link
        href={`/software/${software.slug}/bewertungen/neu`}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-[7px] bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-ink/85"
      >
        Erste Bewertung schreiben
      </Link>
    </div>
  );
}

export function VendorFacts({ software }: { software: Software }) {
  const rows: [string, string | null][] = [
    ["Anbieter", software.vendor_name],
    ["Gegründet", software.founded_year ? String(software.founded_year) : null],
    ["Hauptsitz", software.vendor_hq],
    ["Serverstandort", software.hosting_location ?? null],
    ["Sprachen", software.languages.join(", ")],
    ["Support", software.support_types.join(", ")],
    ["Verfügbar in", software.countries_available.join(", ")],
  ];
  return (
    <dl className="flex flex-col divide-y divide-dashed divide-border text-sm">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2.5">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
    </dl>
  );
}

export function AllReviewsLink({ slug, count }: { slug: string; count: number }) {
  return (
    <Link href={`/software/${slug}/bewertungen`} className="inline-flex items-center gap-1 text-sm font-medium underline decoration-brand decoration-2 underline-offset-4 hover:decoration-ink">
      Alle {formatCount(count)} Bewertungen lesen →
    </Link>
  );
}
