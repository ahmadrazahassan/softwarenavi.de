import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getSoftwareList } from "@/lib/supabase/queries";
import { activeFilterCount, FILTER_PARAMS, flatParams, parseSoftwareFilters, type SP } from "@/lib/filters";
import { Breadcrumb } from "@/components/public/Layout";
import { AffiliatePageNotice } from "@/components/public/Affiliate";
import { DirectoryResults } from "@/components/public/DirectoryResults";
import { formatCount } from "@/lib/utils/format";
import { hy } from "@/lib/utils/hyphenate";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Unternehmenssoftware im Vergleich",
  description:
    "Buchhaltungssoftware, Lohnabrechnung, HR, CRM und ERP im Vergleich: Filter nach Serverstandort, DATEV-Schnittstelle, GoBD und E-Rechnung. Alle Preise netto in Euro.",
  alternates: { canonical: "/software" },
};

export default async function SoftwarePage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const f = parseSoftwareFilters(sp, 12);
  const categories = await getCategories();
  const category = f.categorySlug ? categories.find((c) => c.slug === f.categorySlug) : undefined;
  const { items, total } = await getSoftwareList({ ...f, categoryId: category?.id });

  const params = flatParams(sp);
  const catHref = (slug?: string) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== FILTER_PARAMS.page && k !== FILTER_PARAMS.category) q.set(k, v);
    if (slug) q.set(FILTER_PARAMS.category, slug);
    const s = q.toString();
    return s ? `/software?${s}` : "/software";
  };
  const programmes = categories.reduce((n, c) => n + c.software_count, 0);

  const stats = [
    { value: formatCount(programmes), label: "Programme" },
    { value: formatCount(categories.length), label: "Kategorien" },
    { value: "6", label: "Compliance-Filter" },
  ];

  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Software" }]} />
      <AffiliatePageNotice />

      <header className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            Softwareverzeichnis
          </p>
          <h1 className="mt-5 font-heading text-[2.25rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-5xl md:text-[3.75rem]">
            {hy("Unternehmenssoftware im Vergleich")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Verifizierte Bewertungen, Compliance-Merkmale für den deutschen Markt und transparente Preise. Filtern Sie nach Serverstandort, DATEV, GoBD und
            E-Rechnung.
          </p>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-border border-y border-border lg:border-y-0 lg:border-l">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end gap-1 px-4 py-4 first:pl-0 sm:px-5 lg:py-1 lg:first:pl-8">
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="font-heading text-2xl font-medium tracking-[-0.03em] tabular-nums md:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <nav aria-label="Kategorien" className="mt-12 border-b border-border md:mt-16">
        <ul className="scrollbar-none -mb-px flex gap-1 overflow-x-auto [mask-image:linear-gradient(to_right,#000_calc(100%-32px),transparent)]">
          {[{ slug: undefined, name: "Alle", software_count: programmes }, ...categories].map((c) => {
            const active = (c.slug ?? null) === (category?.slug ?? null);
            return (
              <li key={c.slug ?? "alle"} className="shrink-0">
                <Link
                  href={catHref(c.slug)}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "nav-label inline-flex h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-sm font-medium transition-colors",
                    active ? "border-ink text-ink" : "border-transparent text-muted-foreground hover:border-border hover:text-ink",
                  )}
                >
                  {c.name}
                  <span className={cn("text-xs tabular-nums", active ? "text-brand-dark" : "text-muted-foreground/70")}>{c.software_count}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-10 md:mt-12">
        <DirectoryResults
          items={items}
          total={total}
          page={f.page ?? 1}
          perPage={12}
          view={f.view}
          categories={categories}
          activeCount={activeFilterCount(sp)}
          basePath="/software"
          params={params}
          hideCategory
        />
      </div>
    </div>
  );
}
