import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Minus, Trophy, X } from "lucide-react";
import { getAllSoftwareSlim, getComparisonByPair, getPublishedComparisons } from "@/lib/supabase/queries";
import type { Software } from "@/lib/types";
import { brandColorFor } from "@/lib/brandColors";
import { CURRENT_YEAR, absoluteUrl } from "@/lib/site";
import { formatDateShort, formatMoney, formatPeriod, formatRating, NET_PRICE_NOTE } from "@/lib/utils/format";
import { buildVerdict } from "@/lib/verdict";
import { chooseIf, factRows, featureCoverage, integrationSplit, pairFaq, priceText, rounds } from "@/lib/compare";
import { featureCatalogueFor } from "@/lib/data/categories";
import { RATING_DIMENSIONS } from "@/lib/i18n/options";
import { Breadcrumb, Eyebrow } from "@/components/public/Layout";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { AffiliateCTAButton, AffiliateDisclosureNote, AffiliatePageNotice } from "@/components/public/Affiliate";
import { CardActions, ComparisonCard, OfferBadges, PartnerLinkNote, RatingMeter } from "@/components/public/Cards";
import { complianceRows, ComplianceFootnote } from "@/components/public/ComplianceBadges";
import { ComparisonRadarChart } from "@/components/compare/ComparisonRadarChart";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { CostCalculator } from "@/components/compare/CostCalculator";
import { ProfileNav } from "@/components/profile/ProfileNav";
import { FaqAccordion } from "@/components/profile/FaqAccordion";
import { JsonLd } from "@/components/public/JsonLd";
import { cn } from "@/lib/utils";
import { ratingCaptionShort } from "@/lib/rating";
import { seedReviewsEnabled } from "@/lib/seedMode";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getPublishedComparisons()).map((c) => ({ paar: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ paar: string }> }): Promise<Metadata> {
  const { paar } = await params;
  const r = await getComparisonByPair(paar);
  if (!r) return {};
  const title = r.record?.meta_title ?? `${r.a.name} vs. ${r.b.name}: Der Vergleich ${CURRENT_YEAR}`;
  return {
    title,
    description:
      r.record?.meta_description ??
      `${r.a.name} oder ${r.b.name}? Preise in Euro (netto), Kostenrechner, Funktionen, Integrationen, DATEV, GoBD, Serverstandort und Support im direkten Vergleich.`,
    alternates: { canonical: `/vergleich/${r.record?.slug ?? `${r.a.slug}-vs-${r.b.slug}`}` },
    openGraph: { images: [`/api/og?title=${encodeURIComponent(`${r.a.name} vs. ${r.b.name}`)}`] },
  };
}

function Cell({ ok, children }: { ok: boolean | null; children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {ok === true ? (
        <Check className="size-4 shrink-0 text-brand-dark" aria-hidden="true" />
      ) : ok === false ? (
        <X className="size-4 shrink-0 text-destructive" aria-hidden="true" />
      ) : (
        <Minus className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
      <span className={cn(ok === null && "text-muted-foreground")}>{children}</span>
    </span>
  );
}

function Head({ id, eyebrow, title, intro }: { id: string; eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-3 font-heading text-2xl font-medium tracking-[-0.02em] md:text-[2rem]">
        {title}
      </h2>
      {intro && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{intro}</p>}
    </div>
  );
}

const Th = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th scope="col" className={cn("px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground", className)}>
    {children}
  </th>
);

const planPrice = (s: Software, p: Software["pricing_plans"][number]) =>
  p.price === null ? "auf Anfrage" : p.price === 0 ? "kostenlos" : `${formatMoney(p.price, s.price_currency)} ${formatPeriod(p.period, p.unit ?? s.price_unit)}`;

export default async function ComparisonPage({ params }: { params: Promise<{ paar: string }> }) {
  const { paar } = await params;
  const r = await getComparisonByPair(paar);
  if (!r) notFound();
  const { a, b, record } = r;
  const canonical = `${a.slug}-vs-${b.slug}`;
  const [options, allComparisons] = await Promise.all([getAllSoftwareSlim(), getPublishedComparisons()]);
  const colorA = brandColorFor(a);
  const colorB = brandColorFor(b, "#132238");
  const verdict = buildVerdict(a, b);
  const updated = [a.updated_at, b.updated_at].sort().reverse()[0];

  const radar = [
    ...RATING_DIMENSIONS.map((d) => ({ axis: d.label, a: a[d.ratingKey], b: b[d.ratingKey] })),
    { axis: "Gesamt", a: a.overall_rating, b: b.overall_rating },
  ];

  const catalogue = Array.from(
    new Map([...featureCatalogueFor(a), ...featureCatalogueFor(b)].map((f) => [f.name, f])).values(),
  );
  const extraFeatures = (s: Software) => s.features.filter((f) => !catalogue.some((c) => c.name === f));
  const covA = featureCoverage(a, catalogue);
  const covB = featureCoverage(b, catalogue);
  const compA = complianceRows(a);
  const compB = complianceRows(b);
  const facts = factRows(a, b, catalogue);
  const score = rounds(a, b, catalogue);
  const winsA = score.filter((x) => x.winner === 0).length;
  const winsB = score.filter((x) => x.winner === 1).length;
  const ints = integrationSplit(a, b);
  const faq = pairFaq(a, b, catalogue);
  const related = allComparisons
    .filter((c) => c.slug !== canonical && c.slug !== record?.slug && [c.a.id, c.b.id].some((id) => id === a.id || id === b.id))
    .slice(0, 6);
  const both = [
    { s: a, color: colorA, pts: verdict.pointsA, choose: chooseIf(a, b, catalogue) },
    { s: b, color: colorB, pts: verdict.pointsB, choose: chooseIf(b, a, catalogue) },
  ];
  const calcSide = (s: Software) => ({
    id: s.id,
    name: s.name,
    starting_price: s.starting_price,
    price_currency: s.price_currency,
    price_unit: s.price_unit,
    billing_period: s.billing_period,
    pricing_note: s.pricing_note ?? null,
    free_trial: s.free_trial,
    trial_days: s.trial_days ?? null,
  });

  const sections = [
    { id: "ueberblick", label: "Überblick" },
    { id: "ergebnis", label: "Ergebnis" },
    { id: "eignung", label: "Für wen" },
    { id: "bewertung", label: "Bewertung" },
    { id: "funktionen", label: "Funktionen" },
    { id: "integrationen", label: "Integrationen" },
    { id: "preise", label: "Preise" },
    { id: "compliance", label: "Compliance" },
    { id: "fazit", label: "Fazit" },
    { id: "faq", label: "FAQ", count: faq.length },
  ];

  return (
    <div className="container-site pt-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${a.name} vs. ${b.name}: Der Vergleich ${CURRENT_YEAR}`,
          inLanguage: "de-DE",
          dateModified: updated,
          mainEntityOfPage: absoluteUrl(`/vergleich/${canonical}`),
          publisher: { "@type": "Organization", name: "Softwarenavi" },
          about: [a, b].map((s) => ({
            "@type": "SoftwareApplication",
            name: s.name,
            applicationCategory: "BusinessApplication",
            // only real user reviews count as an AggregateRating; the Redaktionsnote is not one
            ...(s.review_count > 0 && s.rating_source !== "redaktion"
              ? { aggregateRating: { "@type": "AggregateRating", ratingValue: s.overall_rating, reviewCount: s.review_count, bestRating: 5 } }
              : {}),
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <Breadcrumb items={[{ label: "Vergleich", href: "/vergleich" }, { label: `${a.name} vs. ${b.name}` }]} />
      <AffiliatePageNotice />

      {/* ── Hero duel ── */}
      <header className="mt-8">
        <div className="max-w-3xl">
          <Eyebrow>Direktvergleich {CURRENT_YEAR}</Eyebrow>
          <h1 className="mt-3 font-heading text-[2rem] font-medium leading-[1.08] tracking-[-0.03em] sm:text-4xl md:text-[3.25rem]">
            {a.name} oder {b.name}?
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground md:text-base">
            Wir stellen beide Programme in {sections.length} Kapiteln gegenüber: Preise mit Kostenrechner, Funktionen, Integrationen, Compliance,
            Support und unser Redaktionsurteil. Zuletzt aktualisiert am {formatDateShort(updated)}.
          </p>
        </div>

        <div className="relative mt-8 grid overflow-hidden rounded-2xl border border-border bg-white md:grid-cols-2">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-[1] hidden size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground md:flex"
          >
            vs.
          </span>
          {both.map(({ s, color }, i) => (
            <div key={s.id} className={cn("flex flex-col p-6 md:p-8", i === 0 && "border-b border-border md:border-b-0 md:border-r")}>
              <span aria-hidden="true" className="mb-6 block h-1 w-12 rounded-full" style={{ background: color }} />
              <div className="flex items-center gap-4">
                <SoftwareLogo software={s} size={56} />
                <div className="min-w-0">
                  <p className="truncate font-heading text-xl font-medium tracking-[-0.02em]">{s.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{s.vendor_name ?? s.category?.name}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{s.tagline ?? s.description_short}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5">
                <div>
                  <dt className="text-xs text-muted-foreground">{ratingCaptionShort(s)}</dt>
                  <dd className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-heading text-3xl font-medium tracking-[-0.03em] tabular-nums">{formatRating(s.overall_rating)}</span>
                    <span className="text-xs text-muted-foreground">/ 5</span>
                  </dd>
                  <RatingMeter rating={s.overall_rating} className="mt-2" />
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Einstiegspreis netto</dt>
                  <dd className="mt-1 font-heading text-xl font-medium tracking-[-0.02em]">{priceText(s)}</dd>
                </div>
              </dl>
              <OfferBadges software={s} className="mt-5" />
              <div className="mt-auto pt-6">
                <CardActions software={s} />
              </div>
            </div>
          ))}
        </div>
        <PartnerLinkNote className="mt-3" />
      </header>

      <ProfileNav
        sections={sections}
        identity={
          <span className="flex items-center gap-2">
            <SoftwareLogo software={a} size={28} rounded="rounded-lg" />
            <SoftwareLogo software={b} size={28} rounded="rounded-lg" />
          </span>
        }
      />

      <div className="flex flex-col gap-20 pb-8 pt-12 md:gap-24">
        {/* ── Überblick ── */}
        <section aria-labelledby="ueberblick" className="scroll-mt-40">
          <Head
            id="ueberblick"
            eyebrow="Das Wichtigste in Kürze"
            title="Beide Programme im Steckbrief"
            intro="Anbieter, Preismodell, Testmöglichkeiten, Datenhaltung und Support auf einen Blick. Die Angaben stammen von den Herstellern und aus unserer eigenen Prüfung."
          />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="border-b border-border bg-paper/60">
                <tr>
                  <Th className="w-[26%]">Merkmal</Th>
                  <Th>{a.name}</Th>
                  <Th>{b.name}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {facts.map((f) => (
                  <tr key={f.label}>
                    <th scope="row" className="px-4 py-3.5 text-left font-medium">{f.label}</th>
                    {[f.a, f.b].map((v, i) => (
                      <td key={i} className={cn("px-4 py-3.5", v === "keine Angabe" && "text-muted-foreground")}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Ergebnis je Kategorie ── */}
        <section aria-labelledby="ergebnis" className="scroll-mt-40">
          <Head
            id="ergebnis"
            eyebrow="Wer liegt wo vorn"
            title="Das Ergebnis in sieben Disziplinen"
            intro="Jede Zeile vergleicht einen messbaren Wert. So sehen Sie auf einen Blick, wo die Stärken liegen, unabhängig davon, welches Programm insgesamt vorn liegt."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_18rem]">
            <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
              {score.map((row, i) => (
                <li key={row.label} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 p-5 md:grid-cols-[2rem_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-5">
                  <span className="font-heading text-sm tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <p className="font-medium">{row.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{row.detail}</p>
                  </div>
                  {[row.a, row.b].map((v, j) => (
                    <div
                      key={j}
                      className={cn(
                        "col-start-2 flex min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-sm md:col-start-auto",
                        row.winner === j ? "bg-lime/35 font-semibold text-ink" : "text-muted-foreground",
                      )}
                    >
                      {row.winner === j && <Trophy className="size-3.5 shrink-0" aria-label="vorn" />}
                      <span className="min-w-0">
                        <span className="mr-1 text-xs font-normal text-muted-foreground md:hidden">{j === 0 ? a.name : b.name}:</span>
                        {v}
                      </span>
                    </div>
                  ))}
                </li>
              ))}
            </ol>
            <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-paper/60 p-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Punktestand</p>
                <div className="mt-4 flex flex-col gap-4">
                  {[
                    { s: a, n: winsA },
                    { s: b, n: winsB },
                  ].map(({ s, n }) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <SoftwareLogo software={s} size={36} rounded="rounded-lg" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{s.name}</span>
                      <span className="font-heading text-3xl font-medium tabular-nums tracking-[-0.03em]">{n}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  {score.length - winsA - winsB} Disziplin{score.length - winsA - winsB === 1 ? "" : "en"} ohne klaren Vorsprung.
                </p>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Der Punktestand gewichtet alle Disziplinen gleich. Für Ihre Entscheidung zählen die Punkte, die für Ihren Betrieb wichtig sind.
              </p>
            </div>
          </div>
        </section>

        {/* ── Für wen ── */}
        <section aria-labelledby="eignung" className="scroll-mt-40">
          <Head id="eignung" eyebrow="Entscheidungshilfe" title="Welches Programm passt zu Ihnen?" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {both.map(({ s, color, choose }) => (
              <div key={s.id} className="flex flex-col rounded-2xl border border-border bg-white p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <SoftwareLogo software={s} size={40} />
                  <p className="font-heading text-lg font-medium">Wählen Sie {s.name}, wenn</p>
                </div>
                {s.ideal_for && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Ideal für: {s.ideal_for}</p>}
                {choose.length ? (
                  <ul className="mt-5 flex flex-col gap-3 text-[15px]">
                    {choose.map((c) => (
                      <li key={c} className="flex gap-3">
                        <Check className="mt-0.5 size-4 shrink-0" style={{ color }} aria-hidden="true" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-5 text-sm text-muted-foreground">In den erfassten Daten gibt es keinen Punkt, in dem {s.name} klar vorn liegt.</p>
                )}
                <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Stärken</p>
                    <ul className="mt-3 flex flex-col gap-2 text-sm">
                      {(s.pros ?? []).map((p) => (
                        <li key={p} className="flex gap-2">
                          <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-lime-dark" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Schwächen</p>
                    <ul className="mt-3 flex flex-col gap-2 text-sm">
                      {(s.cons ?? []).map((p) => (
                        <li key={p} className="flex gap-2">
                          <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full bg-destructive/70" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bewertung ── */}
        <section aria-labelledby="bewertung" className="scroll-mt-40">
          <Head
            id="bewertung"
            eyebrow="Bewertung"
            title="Noten im Detail"
            intro={
              [a, b].some((s) => s.rating_source === "redaktion")
                ? "Solange keine veröffentlichten Nutzerbewertungen vorliegen, zeigen wir die Redaktionsnote aus unserem Test. Sie ist als solche gekennzeichnet und wird nie mit Nutzerstimmen vermischt."
                : seedReviewsEnabled() ? "Durchschnitt aus veröffentlichten Nutzerbewertungen." : "Durchschnitt aus veröffentlichten, geprüften Nutzerbewertungen."
            }
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
            <div className="rounded-2xl border border-border bg-white p-4">
              <ComparisonRadarChart data={radar} nameA={a.name} nameB={b.name} colorA={colorA} colorB={colorB} />
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
              <ul className="flex flex-col gap-6">
                {radar.map((row) => (
                  <li key={row.axis}>
                    <p className="text-sm font-medium">{row.axis}</p>
                    <div className="mt-2 grid gap-2">
                      {[
                        { s: a, v: row.a, o: row.b },
                        { s: b, v: row.b, o: row.a },
                      ].map(({ s, v, o }) => (
                        <div key={s.id} className="grid grid-cols-[7rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-sm sm:grid-cols-[9rem_minmax(0,1fr)_2.5rem]">
                          <span className="truncate text-muted-foreground">{s.name}</span>
                          <RatingMeter rating={v} className="h-2" />
                          <span className={cn("text-right tabular-nums", v > o ? "font-semibold" : "text-muted-foreground")}>{formatRating(v)}</span>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {(a.editorial || b.editorial) && (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {[a, b].map((s) =>
                s.editorial ? (
                  <article key={s.id} className="flex flex-col rounded-2xl border border-border bg-paper/60 p-6 md:p-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Redaktionsurteil {s.name}</p>
                      <p className="font-heading text-2xl font-medium tabular-nums">{formatRating(s.editorial.rating)}</p>
                    </div>
                    <p className="mt-4 font-heading text-lg font-medium leading-snug tracking-[-0.015em]">{s.editorial.verdict}</p>
                    <p className="mt-auto pt-6 text-xs text-muted-foreground">
                      {s.editorial.author} · Stand {formatDateShort(s.editorial.tested_at)} ·{" "}
                      <Link href={`/software/${s.slug}#redaktion`} className="inline-flex items-center gap-0.5 font-medium text-ink underline decoration-brand underline-offset-2">
                        Ganzen Testbericht lesen <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                    </p>
                  </article>
                ) : (
                  <div key={s.id} />
                ),
              )}
            </div>
          )}
        </section>

        {/* ── Funktionen ── */}
        <section aria-labelledby="funktionen" className="scroll-mt-40">
          <Head
            id="funktionen"
            eyebrow="Funktionen"
            title="Was beide Programme können"
            intro={
              catalogue.length
                ? `Wir prüfen jede Kategorie gegen die Funktionen, die im Alltag wirklich zählen. ${a.name} deckt ${covA.hit} von ${covA.total} ab, ${b.name} ${covB.hit} von ${covB.total}.`
                : undefined
            }
          />
          {catalogue.length > 0 && (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full min-w-[40rem] text-sm">
                <thead className="border-b border-border bg-paper/60">
                  <tr>
                    <Th>Funktion</Th>
                    <Th className="w-36 text-center">{a.name}</Th>
                    <Th className="w-36 text-center">{b.name}</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {catalogue.map((f) => (
                    <tr key={f.name}>
                      <th scope="row" className="px-4 py-3.5 text-left font-normal">
                        <span className="block font-medium">{f.name}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{f.description}</span>
                      </th>
                      {[a, b].map((s) => (
                        <td key={s.id} className="px-4 py-3.5 text-center">
                          {s.features.includes(f.name) ? (
                            <Check className="mx-auto size-5 text-brand-dark" aria-label="vorhanden" />
                          ) : (
                            <X className="mx-auto size-5 text-[#d6d3de]" aria-label="nicht vorhanden" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-border bg-paper/60">
                  <tr>
                    <th scope="row" className="px-4 py-3.5 text-left font-semibold">Abgedeckt</th>
                    {[covA, covB].map((c, i) => (
                      <td key={i} className="px-4 py-3.5 text-center font-semibold tabular-nums">
                        {c.hit} / {c.total}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {[a, b].map((s) => (
              <div key={s.id} className="rounded-2xl border border-border bg-white p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Besonders hervorzuheben bei {s.name}</p>
                <ul className="mt-4 flex flex-wrap gap-2 text-sm">
                  {[...s.top_features, ...extraFeatures(s)].map((f) => (
                    <li key={f} className="rounded-lg border border-border px-3 py-1.5">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Integrationen ── */}
        <section aria-labelledby="integrationen" className="scroll-mt-40">
          <Head
            id="integrationen"
            eyebrow="Integrationen"
            title="Anbindung an Ihre anderen Programme"
            intro="Welche Schnittstellen beide teilen und welche nur eines der Programme bietet. Viele Hersteller ergänzen weitere Anbindungen über Zapier oder eine offene API."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { title: `Nur ${a.name}`, items: ints.onlyA },
              { title: "Bei beiden", items: ints.both },
              { title: `Nur ${b.name}`, items: ints.onlyB },
            ].map((g) => (
              <div key={g.title} className={cn("rounded-2xl border border-border p-6", g.title === "Bei beiden" ? "bg-paper/60" : "bg-white")}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium">{g.title}</p>
                  <span className="font-heading text-2xl font-medium tabular-nums">{g.items.length}</span>
                </div>
                {g.items.length ? (
                  <ul className="mt-4 flex flex-wrap gap-2 text-sm">
                    {g.items.map((i) => (
                      <li key={i} className="rounded-lg border border-border bg-white px-3 py-1.5">
                        {i}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">Keine erfasst.</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Preise ── */}
        <section aria-labelledby="preise" className="scroll-mt-40">
          <Head
            id="preise"
            eyebrow="Preise und Kosten"
            title="Was Sie tatsächlich bezahlen"
            intro="Alle Tarife mit aktuellen Nettopreisen laut Hersteller, dazu ein Rechner für Ihre Teamgröße. Achten Sie auf das Preismodell: Pauschalpreise und Preise je Nutzer verhalten sich bei wachsendem Team sehr unterschiedlich."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[a, b].map((s) => (
              <div key={s.id} className="flex flex-col rounded-2xl border border-border bg-white">
                <div className="flex items-center gap-3 border-b border-border p-6">
                  <SoftwareLogo software={s} size={40} />
                  <div className="min-w-0">
                    <p className="truncate font-heading text-lg font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{priceText(s)}</p>
                  </div>
                </div>
                {s.pricing_plans.length > 0 ? (
                  <ul className="divide-y divide-border">
                    {s.pricing_plans.map((p) => (
                      <li key={p.name} className="p-6">
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="flex items-center gap-2 font-medium">
                            {p.name}
                            {p.highlighted && <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold">beliebt</span>}
                          </p>
                          <p className="font-heading text-lg font-medium tabular-nums">{planPrice(s, p)}</p>
                        </div>
                        {p.features.length > 0 && (
                          <ul className="mt-3 grid gap-1.5 text-sm text-muted-foreground">
                            {p.features.map((f) => (
                              <li key={f} className="flex gap-2">
                                <Check className="mt-0.5 size-3.5 shrink-0 text-brand-dark" aria-hidden="true" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-6 text-sm text-muted-foreground">Der Hersteller veröffentlicht keine Tarifliste. Preise gibt es auf Anfrage.</p>
                )}
                <div className="mt-auto border-t border-border p-6">
                  {s.pricing_note && <p className="mb-4 text-xs text-muted-foreground">{s.pricing_note}</p>}
                  <OfferBadges software={s} />
                  <div className="mt-5">
                    <AffiliateCTAButton software={s} fullWidth label={`Preise bei ${s.name} ansehen`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <CostCalculator a={calcSide(a)} b={calcSide(b)} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{NET_PRICE_NOTE} Preise geprüft am {formatDateShort(updated)}, Änderungen durch die Hersteller vorbehalten.</p>
        </section>

        {/* ── Compliance + Support ── */}
        <section aria-labelledby="compliance" className="scroll-mt-40">
          <Head
            id="compliance"
            eyebrow="Compliance, Datenschutz und Support"
            title="Was für Finanzamt, Steuerkanzlei und DSGVO zählt"
            intro="GoBD, DATEV, E-Rechnung und Serverstandort entscheiden darüber, ob Ihre Buchhaltung einer Betriebsprüfung standhält und die Zusammenarbeit mit der Kanzlei reibungslos läuft."
          />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="border-b border-border bg-paper/60">
                <tr>
                  <Th className="w-[34%]">Merkmal</Th>
                  <Th>{a.name}</Th>
                  <Th>{b.name}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {compA.map((row, i) => {
                  const other = compB.find((x) => x.label === row.label) ?? compB[i];
                  return (
                    <tr key={row.label}>
                      <th scope="row" className="px-4 py-3.5 text-left font-normal">
                        <span className="block font-medium">{row.label}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{row.note}</span>
                      </th>
                      <td className="px-4 py-3.5 align-top">
                        <Cell ok={row.ok}>{row.value}</Cell>
                      </td>
                      <td className="px-4 py-3.5 align-top">
                        <Cell ok={other?.ok ?? null}>{other?.value ?? "keine Angabe"}</Cell>
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <th scope="row" className="px-4 py-3.5 text-left font-normal">
                    <span className="block font-medium">Kontaktwege</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">Wie Sie den Hersteller erreichen.</span>
                  </th>
                  {[a, b].map((s) => (
                    <td key={s.id} className="px-4 py-3.5 align-top">
                      {s.support_types.length ? s.support_types.join(", ") : <span className="text-muted-foreground">keine Angabe</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="px-4 py-3.5 text-left font-normal">
                    <span className="block font-medium">Sprachen der Oberfläche</span>
                  </th>
                  {[a, b].map((s) => (
                    <td key={s.id} className="px-4 py-3.5 align-top">
                      {s.languages.join(", ") || <span className="text-muted-foreground">keine Angabe</span>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <ComplianceFootnote checkedAt={[a.compliance_checked_at, b.compliance_checked_at].filter(Boolean).sort()[0]} />
          </div>
        </section>

        {/* ── Fazit ── */}
        <section aria-labelledby="fazit" className="scroll-mt-40 rounded-2xl border border-border bg-white p-6 md:p-10">
          <Eyebrow>Unser Fazit</Eyebrow>
          <h2 id="fazit" className="mt-3 font-heading text-2xl font-medium tracking-[-0.02em] md:text-[2rem]">
            {a.name} oder {b.name}: So entscheiden Sie richtig
          </h2>
          <div className="prose-content mt-5 max-w-3xl">
            {record?.custom_verdict ? <div dangerouslySetInnerHTML={{ __html: record.custom_verdict }} /> : <p>{verdict.summary}</p>}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {both.map(({ s, pts, color }) => (
              <div key={s.id} className="rounded-xl border border-border p-5">
                <div className="flex items-center gap-3">
                  <SoftwareLogo software={s} size={36} rounded="rounded-lg" />
                  <p className="font-medium">Vorteile von {s.name}</p>
                </div>
                {pts.length ? (
                  <ul className="mt-4 flex flex-col gap-2 text-sm">
                    {pts.map((p) => (
                      <li key={p} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0" style={{ color }} aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">Keine deutlichen Vorteile in den erfassten Daten.</p>
                )}
                <div className="mt-5">
                  <CardActions software={s} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Das Fazit ergibt sich aus Bewertungen, Preisen, Funktionen und Compliance-Angaben. Provisionen haben keinen Einfluss.{" "}
            <Link href="/redaktionelle-grundsaetze" className="underline underline-offset-2">
              Methodik
            </Link>
            .
          </p>
          <AffiliateDisclosureNote className="mt-3" />
        </section>

        {/* ── FAQ ── */}
        <section aria-labelledby="faq" className="scroll-mt-40 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
          <Head id="faq" eyebrow="Häufige Fragen" title={`${a.name} vs. ${b.name}: Fragen und Antworten`} />
          <FaqAccordion items={faq} />
        </section>

        {related.length > 0 && (
          <section aria-labelledby="weitere">
            <Head id="weitere" eyebrow="Weiterlesen" title="Weitere Vergleiche mit diesen Programmen" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <ComparisonCard key={c.id} comparison={c} />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="neu">
          <Head id="neu" eyebrow="Eigener Vergleich" title="Zwei andere Programme gegenüberstellen" />
          <div className="mt-6">
            <CompareSelector options={options} initialA={a.slug} />
          </div>
        </section>
      </div>
    </div>
  );
}
