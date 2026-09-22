import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftRight, BadgeCheck, CalendarCheck, PenLine } from "lucide-react";
import {
  getAlternatives,
  getArticlesForSoftware,
  getCompanySizeDistribution,
  getRatingDistribution,
  getReviewHighlights,
  getReviewsForSoftware,
  getSoftwareBySlug,
  getSoftwareList,
} from "@/lib/supabase/queries";
import { brandColorFor } from "@/lib/brandColors";
import { absoluteUrl } from "@/lib/site";
import { formatCount, formatDateShort, formatMoney, formatPeriod, formatRating } from "@/lib/utils/format";
import { buildProfileFaq } from "@/lib/profileFaq";
import { Breadcrumb } from "@/components/public/Layout";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/Rating";
import { ComplianceBadges } from "@/components/public/ComplianceBadges";
import { AffiliateCTAButton, AffiliateDisclosureNote } from "@/components/public/Affiliate";
import { AlternativeCard, OfferBadges } from "@/components/public/Cards";
import { ReviewCard } from "@/components/public/ReviewCard";
import { ArticleCard } from "@/components/public/ArticleCard";
import { JsonLd } from "@/components/public/JsonLd";
import { ProfileNav } from "@/components/profile/ProfileNav";
import { FaqAccordion } from "@/components/profile/FaqAccordion";
import { ratingCaption } from "@/lib/rating";
import { seedReviewsEnabled } from "@/lib/seedMode";
import {
  AllReviewsLink,
  CompanySizeChart,
  ComplianceBlock,
  EditorialReviewBlock,
  NoUserReviewsYet,
  FeatureChecklist,
  IntegrationsGrid,
  PricingCards,
  ProfileSection,
  ProsCons,
  RatingsOverview,
  ReviewHighlights,
  SupportFacts,
  TopFeatures,
  VendorFacts,
} from "@/components/profile/Sections";

export const revalidate = 3600;

export async function generateStaticParams() {
  const { items } = await getSoftwareList({ perPage: 1000 });
  return items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) return {};
  const title = s.meta_title ?? `${s.name}: Erfahrungen, Preise & Bewertungen`;
  const description =
    s.meta_description ??
    `${s.name}: ${s.rating_source === "redaktion" ? `Redaktionsnote ${formatRating(s.overall_rating)} von 5` : `${formatRating(s.overall_rating)} von 5 Sternen aus ${formatCount(s.review_count)} Bewertungen`}. Preise, Funktionen, DATEV-Schnittstelle, GoBD und Serverstandort im Überblick.`;
  return {
    title,
    description,
    alternates: { canonical: `/software/${slug}` },
    openGraph: { title, description, images: [s.og_image_url ?? `/api/og?slug=${slug}`] },
  };
}

const SECTIONS = [
  { id: "ueberblick", label: "Überblick" },
  { id: "redaktion", label: "Unsere Bewertung" },
  { id: "funktionen", label: "Funktionen" },
  { id: "compliance", label: "Compliance" },
  { id: "preise", label: "Preise" },
  { id: "integrationen", label: "Integrationen" },
  { id: "support", label: "Support" },
  { id: "bewertungen", label: "Bewertungen" },
  { id: "alternativen", label: "Alternativen" },
  { id: "faq", label: "FAQ" },
];

export default async function SoftwareProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) notFound();

  const [distribution, sizeDist, reviews, alternatives, articles, highlights] = await Promise.all([
    getRatingDistribution(s.id),
    getCompanySizeDistribution(s.id),
    getReviewsForSoftware(s.id, { sort: "helpful", perPage: 4 }),
    getAlternatives(s.id, 4),
    getArticlesForSoftware(s.id, 2),
    getReviewHighlights(s.id, 3),
  ]);
  const color = brandColorFor(s);
  const faq = buildProfileFaq(s);

  const sections = SECTIONS.map((x) => ({
    ...x,
    count:
      x.id === "bewertungen" ? s.review_count : x.id === "integrationen" ? s.integrations.length : x.id === "faq" ? faq.length : x.id === "alternativen" ? alternatives.length : undefined,
  }));
  const shortPrice = s.starting_price === null ? "Auf Anfrage" : s.starting_price === 0 ? "Kostenlos" : formatMoney(s.starting_price, s.price_currency);

  const priceText =
    s.starting_price === null ? "Preis auf Anfrage" : s.starting_price === 0 ? "Kostenlos" : `ab ${formatMoney(s.starting_price, s.price_currency)} ${formatPeriod(s.billing_period, s.price_unit)}`;

  return (
    <div className="container-site pt-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: s.name,
          description: s.description_short,
          applicationCategory: "BusinessApplication",
          applicationSubCategory: s.category?.name,
          operatingSystem: "Web",
          url: absoluteUrl(`/software/${s.slug}`),
          inLanguage: "de-DE",
          publisher: s.vendor_name ? { "@type": "Organization", name: s.vendor_name } : undefined,
          ...(s.review_count > 0
            ? { aggregateRating: { "@type": "AggregateRating", ratingValue: s.overall_rating, reviewCount: s.review_count, bestRating: 5, worstRating: 1 } }
            : {}),
          ...(s.starting_price !== null
            ? {
                offers: {
                  "@type": "Offer",
                  price: s.starting_price,
                  priceCurrency: s.price_currency,
                  priceSpecification: { "@type": "UnitPriceSpecification", price: s.starting_price, priceCurrency: s.price_currency, valueAddedTaxIncluded: false },
                },
              }
            : {}),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "de-DE",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      <Breadcrumb
        items={[
          { label: "Software", href: "/software" },
          ...(s.category ? [{ label: s.category.name, href: `/kategorie/${s.category.slug}` }] : []),
          { label: s.name },
        ]}
      />

      {/* ───────────── ProfileShell ───────────── */}
      <header className="mt-8 grid gap-10 border-b border-border pb-10 md:mt-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 lg:pb-12">
        <div className="min-w-0">
          <div className="flex items-center gap-4 md:gap-5">
            <SoftwareLogo software={s} size={72} rounded="rounded-xl" />
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                von <span className="font-medium text-ink">{s.vendor_name}</span>
              </p>
              {s.category && (
                <Link
                  href={`/kategorie/${s.category.slug}`}
                  className="mt-1.5 inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-ink transition-colors hover:border-ink"
                >
                  {s.category.name}
                </Link>
              )}
            </div>
          </div>
          <h1 className="mt-7 font-heading text-[2.25rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-5xl md:text-[3.5rem]">{s.name}</h1>
          {s.tagline && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{s.tagline}</p>}

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            <div className="flex flex-col-reverse gap-1.5 bg-white px-4 py-3.5">
              <dt className="text-xs text-muted-foreground">
                <a href="#bewertungen" className="underline-offset-2 hover:text-ink hover:underline">
                  {ratingCaption(s)}
                </a>
              </dt>
              <dd className="flex items-center gap-2">
                <span className="font-heading text-xl font-medium tabular-nums">{formatRating(s.overall_rating)}</span>
                <StarRating rating={s.overall_rating} size="xs" />
              </dd>
            </div>
            <div className="flex flex-col-reverse gap-1.5 bg-white px-4 py-3.5">
              <dt className="text-xs text-muted-foreground">Einstiegspreis{s.starting_price ? " (netto)" : ""}</dt>
              <dd className="truncate font-heading text-xl font-medium tabular-nums">{shortPrice}</dd>
            </div>
            <div className="flex flex-col-reverse gap-1.5 bg-white px-4 py-3.5">
              <dt className="text-xs text-muted-foreground">Serverstandort</dt>
              <dd className="truncate font-heading text-xl font-medium">{s.hosting_location ?? "k. A."}</dd>
            </div>
            <div className="flex flex-col-reverse gap-1.5 bg-white px-4 py-3.5">
              <dt className="text-xs text-muted-foreground">Aktualisiert</dt>
              <dd className="flex items-center gap-1.5 font-heading text-xl font-medium tabular-nums">
                <CalendarCheck className="size-4 text-brand-dark" aria-hidden="true" />
                {formatDateShort(s.updated_at)}
              </dd>
            </div>
          </dl>

          <OfferBadges software={s} className="mt-5" />
          <ComplianceBadges software={s} max={6} className="mt-3" />
        </div>

        <div className="flex flex-col gap-3 self-end rounded-xl border border-border bg-paper/60 p-5">
          <p>
            <span className="block text-xs text-muted-foreground">Preis</span>
            <span className="mt-1 block font-heading text-2xl font-medium tracking-[-0.02em]">{priceText}</span>
            {s.starting_price ? <span className="block text-xs text-muted-foreground">netto zzgl. MwSt.</span> : null}
          </p>
          <AffiliateCTAButton software={s} size="lg" fullWidth className="mt-2" />
          <AffiliateDisclosureNote compact />
        </div>
      </header>

      <ProfileNav
        sections={sections}
        identity={
          <span className="flex min-w-0 items-center gap-2.5">
            <SoftwareLogo software={s} size={28} rounded="rounded-md" />
            <span className="min-w-0">
              <span className="block truncate font-heading text-sm font-semibold leading-tight">{s.name}</span>
              <span className="block text-[11px] leading-tight text-muted-foreground tabular-nums">
                {formatRating(s.overall_rating)} ★ · {ratingCaption(s)}
              </span>
            </span>
          </span>
        }
        cta={<AffiliateCTAButton software={s} size="sm" />}
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-16 [counter-reset:profile]">
          <ProfileSection id="ueberblick" title="Überblick">
            <div className="prose-content max-w-3xl" dangerouslySetInnerHTML={{ __html: s.description_full }} />
            <h3 className="mt-12 font-heading text-xl font-semibold">Für wen ist {s.name} geeignet?</h3>
            {s.ideal_for && <p className="mt-2 text-[15px] text-muted-foreground">{s.ideal_for}</p>}
            {s.review_count > 0 && (
              <div className="mt-5">
                <CompanySizeChart distribution={sizeDist} color={color} total={s.review_count} />
              </div>
            )}
            <h3 className="mt-12 font-heading text-xl font-semibold">Vor- und Nachteile</h3>
            <div className="mt-5">
              <ProsCons pros={s.pros} cons={s.cons} />
            </div>
          </ProfileSection>

          {s.editorial && (
            <ProfileSection id="redaktion" title={`${s.name}: unsere Bewertung`}>
              <EditorialReviewBlock software={s} />
            </ProfileSection>
          )}

          <ProfileSection id="funktionen" title="Funktionen">
            <TopFeatures items={s.top_features} color={color} />
            <h3 className="mt-8 font-heading text-lg font-semibold">Funktionsumfang im Detail</h3>
            <div className="mt-4">
              <FeatureChecklist software={s} />
            </div>
          </ProfileSection>

          <ProfileSection id="compliance" title="Compliance & Datenschutz">
            <p className="mb-5 max-w-3xl text-[15px] text-muted-foreground">
              GoBD, DATEV-Schnittstelle, E-Rechnung und Serverstandort entscheiden im deutschen Alltag oft mehr als der Preis. Unbekannte Werte kennzeichnen wir
              als „keine Angabe“ statt sie zu schätzen.
            </p>
            <ComplianceBlock software={s} />
          </ProfileSection>

          <ProfileSection id="preise" title="Preise & Tarife">
            <PricingCards software={s} />
          </ProfileSection>

          <ProfileSection id="integrationen" title="Integrationen">
            <IntegrationsGrid items={s.integrations} />
          </ProfileSection>

          <ProfileSection id="support" title="Support">
            <SupportFacts software={s} />
          </ProfileSection>

          <ProfileSection id="bewertungen" title="Nutzerbewertungen">
            {s.review_count === 0 ? (
              <NoUserReviewsYet software={s} />
            ) : (
            <>
            <RatingsOverview software={s} distribution={distribution} />
            <div className="mt-4">
              <ReviewHighlights highlights={highlights} />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <AllReviewsLink slug={s.slug} count={s.review_count} />
              <Link
                href={`/software/${s.slug}/bewertungen/neu`}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold hover:bg-paper"
              >
                <PenLine className="size-4" aria-hidden="true" /> Bewertung schreiben
              </Link>
            </div>
            <div className="mt-6 grid gap-5">
              {reviews.items.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
            </>
            )}
            {!seedReviewsEnabled() && (
            <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <BadgeCheck className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Alle Bewertungen werden vor der Veröffentlichung geprüft. Wie wir das tun, erläutern unsere{" "}
              <Link href="/redaktionelle-grundsaetze" className="underline underline-offset-2">
                redaktionellen Grundsätze
              </Link>
              .
            </p>
            )}
          </ProfileSection>

          <ProfileSection id="alternativen" title={`Alternativen zu ${s.name}`}>
            <div className="grid gap-5 sm:grid-cols-2">
              {alternatives.map((a) => (
                <AlternativeCard key={a.id} software={a} base={s} />
              ))}
            </div>
            <Link href={`/software/${s.slug}/alternativen`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-dark hover:underline">
              Alle Alternativen zu {s.name} ansehen →
            </Link>
          </ProfileSection>

          <ProfileSection id="faq" title="Häufige Fragen">
            <FaqAccordion items={faq} />
          </ProfileSection>

          {articles.length > 0 && (
            <section aria-labelledby="related-guides" className="border-t border-border pt-12">
              <h2 id="related-guides" className="font-heading text-2xl font-medium tracking-tight">
                Passende Ratgeber
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ───────────── SoftwareSidebar ───────────── */}
        <aside aria-label={`Fakten zu ${s.name}`} className="lg:sticky lg:top-[9.5rem] lg:self-start">
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="flex items-center gap-3">
              <SoftwareLogo software={s} size={44} />
              <div>
                <p className="font-heading font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground">{priceText}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <AffiliateCTAButton software={s} fullWidth />
              <AffiliateDisclosureNote compact />
            </div>
            <div className="mt-5">
              <VendorFacts software={s} />
            </div>
            {alternatives[0] && (
              <Link
                href={`/vergleich/${s.slug}-vs-${alternatives[0].slug}`}
                className="mt-5 flex items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold hover:border-brand hover:text-brand-dark"
              >
                <ArrowLeftRight className="size-4" aria-hidden="true" /> Mit {alternatives[0].name} vergleichen
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
