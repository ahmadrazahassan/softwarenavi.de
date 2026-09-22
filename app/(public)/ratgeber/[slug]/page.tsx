import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, RefreshCw } from "lucide-react";
import { getArticleBySlug, getArticles, getLatestArticles, getSoftwareById } from "@/lib/supabase/queries";
import { Breadcrumb } from "@/components/public/Layout";
import { ArticleCard } from "@/components/public/ArticleCard";
import { JsonLd } from "@/components/public/JsonLd";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/Rating";
import { AffiliateCTAButton, AffiliateDisclosureNote, AffiliatePageNotice } from "@/components/public/Affiliate";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { AUTHOR_BIO, AUTHOR_NAME, AUTHOR_TITLE, absoluteUrl } from "@/lib/site";
import { formatDateLong, formatRating } from "@/lib/utils/format";
import { hy } from "@/lib/utils/hyphenate";
import { ratingCaptionShort } from "@/lib/rating";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { items } = await getArticles(1, 1000);
  return items.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) return {};
  return {
    title: a.meta_title ?? a.title,
    description: a.meta_description ?? a.excerpt ?? undefined,
    alternates: { canonical: `/ratgeber/${slug}` },
    openGraph: {
      type: "article",
      publishedTime: a.published_date,
      modifiedTime: a.updated_date ?? a.published_date,
      authors: [AUTHOR_NAME],
      images: [a.og_image_url ?? `/api/og?title=${encodeURIComponent(a.title)}`],
    },
  };
}

/** Extracts h2 headings (with ids) from the article HTML for the table of contents. */
function toc(html: string) {
  return Array.from(html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)).map((m) => ({ id: m[1], text: m[2] }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticleBySlug(slug);
  if (!a) notFound();
  const [related, latest] = await Promise.all([
    a.related_software_id ? getSoftwareById(a.related_software_id) : Promise.resolve(null),
    getLatestArticles(4),
  ]);
  const more = latest.filter((x) => x.id !== a.id).slice(0, 3);
  const headings = toc(a.content);

  return (
    <div className="container-site pt-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          inLanguage: "de-DE",
          datePublished: a.published_date,
          dateModified: a.updated_date ?? a.published_date,
          author: { "@type": "Person", name: AUTHOR_NAME, url: absoluteUrl("/ueber-uns") },
          publisher: { "@type": "Organization", name: "Softwarenavi", logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
          mainEntityOfPage: absoluteUrl(`/ratgeber/${a.slug}`),
          image: absoluteUrl(`/api/og?title=${encodeURIComponent(a.title)}`),
        }}
      />
      <Breadcrumb items={[{ label: "Ratgeber", href: "/ratgeber" }, { label: a.title }]} />
      <AffiliatePageNotice />

      <article className="mt-8">
        <header className="mx-auto max-w-3xl">
          <span className="rounded-md bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">{a.category_tag}</span>
          <h1 className="mt-5 font-heading text-[2rem] font-medium leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">{hy(a.title)}</h1>
          {a.excerpt && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{a.excerpt}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{AUTHOR_NAME}</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" /> <time dateTime={a.published_date}>{formatDateLong(a.published_date)}</time>
            </span>
            {a.updated_date && a.updated_date !== a.published_date && (
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className="size-4" aria-hidden="true" /> zuletzt aktualisiert am <time dateTime={a.updated_date}>{formatDateLong(a.updated_date)}</time>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" /> {a.read_time_minutes} Min. Lesezeit
            </span>
          </div>
        </header>

        <div className="mx-auto mt-10 grid max-w-6xl gap-12 lg:grid-cols-[14rem_1fr_16rem]">
          <aside className="hidden lg:block">
            {headings.length > 0 && (
              <nav aria-label="Inhaltsverzeichnis" className="sticky top-24">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Inhalt</p>
                <ol className="mt-3 flex flex-col gap-2 border-l border-border text-sm">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l-2 border-transparent pl-3 text-muted-foreground hover:border-brand hover:text-foreground">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>

          <div className="min-w-0">
            <div className="article-content" dangerouslySetInnerHTML={{ __html: a.content }} />

            <div className="mt-14 flex gap-4 rounded-xl border border-border bg-white p-6">
              <span className="grid size-14 shrink-0 place-items-center rounded-md font-heading text-lg font-medium text-brand-dark" aria-hidden="true">
                RS
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Über die Redaktion</p>
                <p className="mt-1 font-heading text-lg font-semibold">{AUTHOR_NAME}</p>
                <p className="text-sm text-brand-dark">{AUTHOR_TITLE}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{AUTHOR_BIO}</p>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            {related && (
              <div className="rounded-xl border border-border bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Erwähnte Software</p>
                <Link href={`/software/${related.slug}`} className="mt-3 flex items-center gap-3">
                  <SoftwareLogo software={related} size={44} />
                  <span>
                    <span className="block font-semibold">{related.name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <StarRating rating={related.overall_rating} size="xs" /> {formatRating(related.overall_rating)} {ratingCaptionShort(related)}
                    </span>
                  </span>
                </Link>
                <div className="mt-4 flex flex-col gap-2">
                  <AffiliateCTAButton software={related} fullWidth size="sm" />
                  <AffiliateDisclosureNote compact />
                </div>
              </div>
            )}
            <div className="rounded-xl border border-border p-5">
              <p className="font-heading font-semibold">Newsletter</p>
              <p className="mt-1 text-sm text-muted-foreground">Neue Ratgeber und Fristen per E-Mail, höchstens zweimal im Monat.</p>
              <div className="mt-4">
                <NewsletterForm variant="full" source={`ratgeber/${a.slug}`} />
              </div>
            </div>
          </aside>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="mehr" className="mx-auto mt-20 max-w-6xl">
          <h2 id="mehr" className="font-heading text-2xl font-medium tracking-tight">
            Weitere Beiträge
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {more.map((x) => (
              <ArticleCard key={x.id} article={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
