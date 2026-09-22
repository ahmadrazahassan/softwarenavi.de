import type { Metadata } from "next";
import Link from "next/link";
import { Euro, ListChecks, ShieldCheck, Star } from "lucide-react";
import { getAllSoftwareSlim, getCategories, getPublishedComparisons } from "@/lib/supabase/queries";
import { Breadcrumb } from "@/components/public/Layout";
import { CategoryIcon } from "@/components/public/Cards";
import { CompareSelector } from "@/components/compare/CompareSelector";
import { DuelCard } from "@/components/compare/DuelCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Software-Vergleich: zwei Programme im direkten Duell",
  description: "Vergleichen Sie zwei Programme direkt: Bewertungen, Preise in Euro (netto), Funktionen, DATEV-Schnittstelle, GoBD und Serverstandort.",
  alternates: { canonical: "/vergleich" },
};

const pad = (n: number) => String(n).padStart(2, "0");

const CRITERIA = [
  { icon: Star, title: "Bewertungen", text: "Gesamtnote und Teilnoten für Bedienung, Preis-Leistung, Service und Funktionen. Nutzerbewertungen, sonst Redaktionsnote." },
  { icon: Euro, title: "Preise netto", text: "Einstiegspreise und Tarife in Euro, zuzüglich Umsatzsteuer, direkt nebeneinander." },
  { icon: ShieldCheck, title: "Compliance", text: "GoBD, DATEV-Schnittstelle, E-Rechnung, AV-Vertrag und Serverstandort." },
  { icon: ListChecks, title: "Funktionsumfang", text: "Was beide können und an welcher Stelle sich die Programme unterscheiden." },
];

export default async function CompareHubPage() {
  const [options, comparisons, categories] = await Promise.all([getAllSoftwareSlim(), getPublishedComparisons(), getCategories()]);
  const groups = categories.map((c) => ({ c, items: comparisons.filter((x) => x.a.category_id === c.id) })).filter((g) => g.items.length);

  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Vergleich" }]} />

      {/* ───────── Hero + selector ───────── */}
      <section aria-labelledby="vergleich-h" className="mt-8 overflow-hidden rounded-2xl bg-ink text-white">
        <div className="px-6 pb-6 pt-12 sm:px-10 md:px-14 md:pt-20">
          <p className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.18em] text-white/50">
            <span className="text-white">Vergleich</span>
            <span className="h-px w-8 bg-white/25" aria-hidden="true" />
            {pad(options.length)} Programme · {pad(comparisons.length)} Duelle
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-20">
            <h1 id="vergleich-h" className="font-heading text-[2.5rem] font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-[5rem]">
              Zwei Programme. <span className="text-white/45">Ein klares Urteil.</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-white/65 md:text-lg">
              Bewertungen, Preise, Funktionen und Compliance nebeneinander. Das Fazit ergibt sich aus den Daten, nicht aus Provisionen.
            </p>
          </div>
        </div>
        <div className="p-2 sm:p-3">
          <div className="rounded-xl bg-white p-5 text-ink md:p-7">
            <CompareSelector options={options} />
          </div>
        </div>
      </section>

      {/* ───────── Methodology ───────── */}
      <section aria-labelledby="kriterien" className="mt-20 md:mt-28">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Methodik</p>
            <h2 id="kriterien" className="mt-4 font-heading text-3xl font-medium leading-[1.05] tracking-[-0.035em] md:text-[2.75rem]">
              Verglichen wird, was im Alltag zählt.
            </h2>
          </div>
          <ol className="grid border-t border-ink sm:grid-cols-2">
            {CRITERIA.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex flex-col gap-4 border-b border-border py-7 sm:odd:pr-8 sm:even:border-l sm:even:pl-8">
                <div className="flex items-center justify-between">
                  <Icon className="size-6 text-ink" strokeWidth={1.5} aria-hidden="true" />
                  <span className="font-heading text-sm font-medium tabular-nums text-muted-foreground">{pad(i + 1)}</span>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-medium tracking-[-0.02em]">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── Popular duels ───────── */}
      <section aria-labelledby="duelle" className="mt-24 md:mt-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Beliebte Duelle</p>
            <h2 id="duelle" className="mt-4 font-heading text-3xl font-medium leading-[1.05] tracking-[-0.035em] md:text-[2.75rem]">
              Nach Kategorie
            </h2>
          </div>
          <nav aria-label="Kategorien springen" className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto px-1">
            {groups.map(({ c }) => (
              <a
                key={c.id}
                href={`#cmp-${c.slug}`}
                className="inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-border px-3.5 text-sm text-muted-foreground transition-colors hover:border-ink hover:text-ink"
              >
                <CategoryIcon icon={c.icon} className="size-4" />
                {c.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-16 md:gap-20">
          {groups.map(({ c, items }, i) => (
            <section key={c.id} id={`cmp-${c.slug}`} aria-labelledby={`cmp-${c.slug}-h`} className="scroll-mt-28">
              <div className="flex items-center gap-4 border-b border-ink pb-4">
                <span className="font-heading text-sm font-medium tabular-nums text-muted-foreground">{pad(i + 1)}</span>
                <CategoryIcon icon={c.icon} className="size-5 text-ink" />
                <h3 id={`cmp-${c.slug}-h`} className="font-heading text-xl font-medium tracking-[-0.025em] md:text-2xl">
                  {c.name}
                </h3>
                <span className="ml-auto text-sm tabular-nums text-muted-foreground">
                  {items.length} {items.length === 1 ? "Duell" : "Duelle"}
                </span>
                <Link href={`/kategorie/${c.slug}`} className="hidden text-sm font-medium underline decoration-border underline-offset-4 transition-colors hover:decoration-ink sm:inline">
                  Alle Programme
                </Link>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {items.map((x) => (
                  <DuelCard key={x.id} comparison={x} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
