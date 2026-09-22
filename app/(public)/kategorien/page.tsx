import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ArrowLeftRight, ShieldCheck, Star } from "lucide-react";
import { getCategories, getSiteStats, getTopRatedSoftware } from "@/lib/supabase/queries";
import { Breadcrumb } from "@/components/public/Layout";
import { CategoryIcon } from "@/components/public/Cards";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { formatCount, formatRating } from "@/lib/utils/format";
import { seedReviewsEnabled } from "@/lib/seedMode";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Alle Kategorien",
  description: "Buchhaltung, Lohnabrechnung, HR, CRM, ERP, Projektmanagement, Zeiterfassung und Dokumentenmanagement: alle Softwarekategorien im Überblick.",
  alternates: { canonical: "/kategorien" },
};

const pad = (n: number) => String(n).padStart(2, "0");

export default async function CategoriesPage() {
  const [categories, stats] = await Promise.all([getCategories(), getSiteStats()]);
  const tops = await Promise.all(categories.map((c) => getTopRatedSoftware(3, c.id)));
  const programmes = categories.reduce((n, c) => n + c.software_count, 0);
  const largest = [...categories].sort((a, b) => b.software_count - a.software_count)[0];

  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Kategorien" }]} />

      {/* ───────── Hero ───────── */}
      <header className="mt-10 md:mt-16">
        <p className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span className="tabular-nums text-ink">Index</span>
          <span className="h-px w-8 bg-border" aria-hidden="true" />
          {pad(categories.length)} Einsatzbereiche
        </p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:gap-20">
          <h1 className="font-heading text-[2.5rem] font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-[5rem]">
            Software, nach <span className="text-muted-foreground/60">Einsatzbereich</span> geordnet.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Von der GoBD-konformen Buchhaltung bis zur revisionssicheren Archivierung. Jede Kategorie mit geprüften Bewertungen und Nettopreisen in Euro.
          </p>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-px border-y border-border bg-border md:grid-cols-4">
          {[
            { k: "Programme", v: formatCount(stats.software || programmes) },
            stats.reviews > 0 ? { k: seedReviewsEnabled() ? "Nutzerbewertungen" : "Geprüfte Nutzerbewertungen", v: formatCount(stats.reviews) } : { k: "Redaktionelle Bewertungen", v: formatCount(stats.editorial) },
            { k: "Kategorien", v: pad(categories.length) },
            { k: "Größte Kategorie", v: largest?.name ?? "k. A.", small: true },
          ].map((s, i) => (
            <div
              key={s.k}
              className={`flex min-w-0 flex-col-reverse justify-end gap-2 bg-white py-6 pr-5 md:pr-8 ${i === 0 ? "pl-0" : i === 2 ? "pl-0 md:pl-8" : "pl-5 md:pl-8"}`}
            >
              <dt className="text-xs text-muted-foreground">{s.k}</dt>
              <dd
                className={
                  s.small
                    ? "truncate font-heading text-lg font-medium tracking-[-0.02em] md:text-xl"
                    : "font-heading text-3xl font-medium tracking-[-0.04em] tabular-nums md:text-[2.5rem] md:leading-none"
                }
              >
                {s.v}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* ───────── Ledger ───────── */}
      <section aria-labelledby="alle-kategorien" className="mt-20 md:mt-28">
        <div className="flex items-end justify-between gap-6">
          <h2 id="alle-kategorien" className="font-heading text-2xl font-medium tracking-[-0.03em] md:text-3xl">
            Alle Kategorien
          </h2>
          <p className="hidden text-sm text-muted-foreground md:block">Nutzerbewertungen vor Redaktionsnote · Provisionen ohne Einfluss</p>
        </div>

        <div className="mt-8 hidden grid-cols-[3.5rem_minmax(0,1.3fr)_minmax(0,1fr)_8rem_7rem_2.5rem] gap-6 border-b border-ink pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground lg:grid">
          <span>Nr.</span>
          <span>Kategorie</span>
          <span>Top bewertet</span>
          <span className="text-right">Bestwert</span>
          <span className="text-right">Programme</span>
          <span />
        </div>

        <ol className="mt-4 border-t border-border lg:mt-0 lg:border-t-0">
          {categories.map((c, i) => {
            const top = tops[i];
            const best = top[0];
            return (
              <li key={c.id} className="group relative border-b border-border">
                <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-4 py-7 transition-colors duration-300 md:py-8 lg:grid-cols-[3.5rem_minmax(0,1.3fr)_minmax(0,1fr)_8rem_7rem_2.5rem] lg:items-center lg:gap-6">
                  <span className="pt-1 font-heading text-sm font-medium tabular-nums text-muted-foreground transition-colors group-hover:text-brand-dark lg:pt-0">
                    {pad(i + 1)}
                  </span>

                  <div className="flex min-w-0 items-start gap-4">
                    <CategoryIcon icon={c.icon} className="mt-1 size-6 shrink-0 text-ink transition-colors duration-300 group-hover:text-brand-dark" />
                    <div className="min-w-0">
                      <h3 className="card-title font-heading text-xl font-medium tracking-[-0.025em] md:text-2xl">
                        <Link href={`/kategorie/${c.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                          {c.name}
                        </Link>
                      </h3>
                      {c.description && <p className="mt-1.5 line-clamp-2 max-w-md text-sm leading-relaxed text-muted-foreground">{c.description}</p>}
                    </div>
                  </div>

                  <span className="grid size-10 place-items-center self-center rounded-full border border-border text-ink transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white lg:hidden" aria-hidden="true">
                    <ArrowUpRight className="size-4" />
                  </span>

                  <div className="relative z-[1] col-span-3 flex items-center gap-3 pl-[3.5rem] lg:col-span-1 lg:pl-0">
                    <div className="flex -space-x-2">
                      {top.map((s) => (
                        <Link key={s.id} href={`/software/${s.slug}`} title={s.name} className="rounded-lg bg-white ring-2 ring-white transition-transform hover:z-10 hover:-translate-y-0.5">
                          <SoftwareLogo software={s} size={32} rounded="rounded-lg" />
                          <span className="sr-only">{s.name}</span>
                        </Link>
                      ))}
                    </div>
                    {best && <span className="min-w-0 truncate text-sm text-muted-foreground">{top.map((s) => s.name).join(", ")}</span>}
                  </div>

                  <div className="hidden text-right lg:block">
                    {best ? (
                      <span className="inline-flex items-center gap-1.5 font-heading text-lg font-medium tabular-nums">
                        <Star className="size-3.5 text-brand-dark" fill="currentColor" strokeWidth={0} aria-hidden="true" />
                        {formatRating(best.overall_rating)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">k. A.</span>
                    )}
                  </div>

                  <div className="hidden text-right lg:block">
                    <span className="font-heading text-2xl font-medium tracking-[-0.03em] tabular-nums">{pad(c.software_count)}</span>
                  </div>

                  <span className="hidden size-10 place-items-center justify-self-end rounded-full border border-border text-ink transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white lg:grid" aria-hidden="true">
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ───────── Closing band ───────── */}
      <section aria-labelledby="weiter" className="mt-24 overflow-hidden rounded-2xl bg-ink text-white md:mt-32">
        <div className="grid gap-12 p-8 md:p-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/50">Nächster Schritt</p>
            <h2 id="weiter" className="mt-5 font-heading text-3xl font-medium leading-[1.05] tracking-[-0.035em] md:text-5xl">
              Zwei Kandidaten gefunden? Stellen Sie sie gegenüber.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/vergleich" className="inline-flex h-12 items-center gap-2 rounded-[7px] btn-glossy px-6 text-[15px] font-medium">
                Zum Vergleich <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/software"
                className="inline-flex h-12 items-center gap-2 rounded-[7px] border border-white/20 px-6 text-[15px] font-medium text-white transition-colors hover:border-white"
              >
                Alle Programme
              </Link>
            </div>
          </div>
          <ul className="grid content-end gap-px self-end overflow-hidden rounded-xl border border-white/10 bg-white/10">
            {[
              { icon: ShieldCheck, t: "Compliance zuerst", d: "GoBD, DATEV, E-Rechnung und Serverstandort für jedes Programm geprüft." },
              { icon: Star, t: "Nur echte Stimmen", d: "Jede Bewertung wird vor der Veröffentlichung gelesen. Provisionen ändern an der Reihenfolge nichts." },
              { icon: ArrowLeftRight, t: "Direkter Vergleich", d: "Preise netto in Euro, Funktionen und Support nebeneinander." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4 bg-ink p-5">
                <Icon className="mt-0.5 size-5 shrink-0 text-brand-soft" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
