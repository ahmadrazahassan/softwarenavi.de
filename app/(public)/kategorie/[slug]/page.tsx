import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getCategories, getCategoryBySlug, getPublishedComparisons, getSoftwareList, getTopRatedSoftware } from "@/lib/supabase/queries";
import { activeFilterCount, flatParams, parseSoftwareFilters, type SP } from "@/lib/filters";
import { Breadcrumb, Eyebrow, SectionHeader } from "@/components/public/Layout";
import { DirectoryResults } from "@/components/public/DirectoryResults";
import { ComparisonCard, CategoryIcon } from "@/components/public/Cards";
import { FaqAccordion } from "@/components/profile/FaqAccordion";
import { JsonLd } from "@/components/public/JsonLd";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/Rating";
import { CATEGORY_GUIDES } from "@/lib/data/categoryGuides";
import { CURRENT_YEAR, absoluteUrl } from "@/lib/site";
import { formatCount, formatRating } from "@/lib/utils/format";
import { hy } from "@/lib/utils/hyphenate";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategoryBySlug(slug);
  if (!c) return {};
  const noun = CATEGORY_GUIDES[slug]?.h1Noun ?? c.name;
  return {
    title: `Die beste ${noun} in Deutschland ${CURRENT_YEAR}`,
    description: `${c.name} im Vergleich: ${c.description} Verifizierte Bewertungen und Preise in Euro (netto).`,
    alternates: { canonical: `/kategorie/${slug}` },
    openGraph: { images: [`/api/og?title=${encodeURIComponent(`Die beste ${noun} ${CURRENT_YEAR}`)}`] },
  };
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SP> }) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const f = parseSoftwareFilters(sp, 12);
  const [categories, list, podium, comparisons] = await Promise.all([
    getCategories(),
    getSoftwareList({ ...f, categoryId: category.id }),
    getTopRatedSoftware(3, category.id),
    getPublishedComparisons(),
  ]);
  const guide = CATEGORY_GUIDES[slug];
  const noun = guide?.h1Noun ?? category.name;
  const relatedComparisons = comparisons.filter((c) => c.a.category_id === category.id || c.b.category_id === category.id);

  return (
    <div className="container-site pt-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Die beste ${noun} in Deutschland ${CURRENT_YEAR}`,
          inLanguage: "de-DE",
          itemListElement: podium.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/software/${s.slug}`), name: s.name })),
        }}
      />
      <Breadcrumb items={[{ label: "Kategorien", href: "/kategorien" }, { label: category.name }]} />

      <header className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end [&>*]:min-w-0">
        <div>
          <span className="inline-grid size-14 place-items-center rounded-lg text-brand-dark">
            <CategoryIcon icon={category.icon} className="size-7" />
          </span>
          <h1 className="mt-5 font-heading text-[2rem] font-medium tracking-tight sm:text-4xl md:text-5xl">
            Die beste {hy(noun)} in Deutschland {CURRENT_YEAR}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{category.description}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {formatCount(category.software_count)} Programme · Rangfolge nach Nutzerbewertung, sonst Redaktionsnote ·{" "}
            <Link href="/redaktionelle-grundsaetze" className="underline underline-offset-2">
              Methodik
            </Link>
          </p>
        </div>
        {podium.length > 0 && (
          <ol className="flex flex-col gap-2 rounded-xl border border-border p-4" aria-label="Top 3 nach Bewertung">
            {podium.map((s, i) => (
              <li key={s.id}>
                <Link href={`/software/${s.slug}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-paper">
                  <span className="w-5 text-center font-heading text-lg font-medium text-muted-foreground">{i + 1}</span>
                  <SoftwareLogo software={s} size={38} rounded="rounded-xl" />
                  <span className="min-w-0 flex-1 truncate font-semibold">{s.name}</span>
                  <StarRating rating={s.overall_rating} size="xs" />
                  <span className="text-sm font-semibold tabular-nums">{formatRating(s.overall_rating)}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </header>

      <div className="mt-12">
        <DirectoryResults
          items={list.items}
          total={list.total}
          page={f.page ?? 1}
          perPage={12}
          view={f.view}
          categories={categories}
          activeCount={activeFilterCount(sp)}
          basePath={`/kategorie/${slug}`}
          params={flatParams(sp)}
          hideCategory
        />
      </div>

      {guide && (
        <section aria-labelledby="guide-title" className="mt-20 grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Kaufberatung</Eyebrow>
            <h2 id="guide-title" className="mt-3 font-heading text-3xl font-medium tracking-tight">
              Worauf Sie bei {hy(noun)} achten sollten
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {guide.checklist.map((c) => (
                <li key={c.title} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-dark" aria-hidden="true" />
                  <p className="text-[15px] leading-relaxed">
                    <strong className="font-semibold">{c.title}:</strong> <span className="text-muted-foreground">{c.text}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight">Häufige Fragen</h2>
            <div className="mt-6">
              <FaqAccordion items={guide.faq} />
            </div>
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "FAQPage",
                inLanguage: "de-DE",
                mainEntity: guide.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
              }}
            />
          </div>
        </section>
      )}

      {relatedComparisons.length > 0 && (
        <section aria-labelledby="cat-cmp" className="mt-20">
          <SectionHeader id="cat-cmp" eyebrow="Vergleiche" title={`Beliebte Vergleiche: ${category.name}`} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedComparisons.map((c) => (
              <ComparisonCard key={c.id} comparison={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
