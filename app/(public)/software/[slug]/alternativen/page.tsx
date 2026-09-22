import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryPeers, getSoftwareBySlug } from "@/lib/supabase/queries";
import { Breadcrumb } from "@/components/public/Layout";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { StarRating } from "@/components/public/Rating";
import { ComplianceBadges } from "@/components/public/ComplianceBadges";
import { PriceLine } from "@/components/public/Cards";
import { AffiliateCTAButton, AffiliateDisclosureNote } from "@/components/public/Affiliate";
import { CURRENT_YEAR } from "@/lib/site";
import { formatCount, formatRating, NET_PRICE_NOTE } from "@/lib/utils/format";
import { ratingCaption } from "@/lib/rating";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) return {};
  return {
    title: `Die besten Alternativen zu ${s.name} (${CURRENT_YEAR})`,
    description: `Alternativen zu ${s.name} im Vergleich: Bewertungen, Preise in Euro (netto), DATEV-Schnittstelle, GoBD und Serverstandort.`,
    alternates: { canonical: `/software/${slug}/alternativen` },
  };
}

export default async function AlternativesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) notFound();
  const peers = await getCategoryPeers(s.id, s.category_id ?? "", 12);

  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Software", href: "/software" }, { label: s.name, href: `/software/${slug}` }, { label: "Alternativen" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-heading text-[2rem] font-medium tracking-tight sm:text-4xl md:text-5xl">
          Die besten Alternativen zu {s.name} ({CURRENT_YEAR})
        </h1>
        <p className="mt-4 text-muted-foreground md:text-lg">
          {formatCount(peers.length)} Programme aus der Kategorie „{s.category?.name}“, gerankt nach Nutzerbewertung, solange keine vorliegen nach Redaktionsnote. {s.name} selbst erreicht{" "}
          {formatRating(s.overall_rating)} von 5 Sternen.
        </p>
      </header>

      <ol className="mt-10 flex flex-col gap-4">
        {peers.map((p, i) => (
          <li key={p.id} className="grid gap-4 rounded-xl border border-border bg-white p-5 md:grid-cols-[auto_1fr_auto] md:items-center md:p-6">
            <div className="flex items-center gap-4">
              <span className="w-6 text-center font-heading text-2xl font-medium text-muted-foreground">{i + 1}</span>
              <SoftwareLogo software={p} size={56} />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading text-xl font-semibold">
                <Link href={`/software/${p.slug}`} className="hover:underline">
                  {p.name}
                </Link>
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <StarRating rating={p.overall_rating} size="xs" />
                <strong className="tabular-nums">{formatRating(p.overall_rating)}</strong>
                <span className="text-muted-foreground">({ratingCaption(p)})</span>
                <span className="text-muted-foreground">·</span>
                <PriceLine software={p} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.description_short}</p>
              <ComplianceBadges software={p} className="mt-3" />
            </div>
            <div className="flex flex-col gap-2 md:w-56">
              <AffiliateCTAButton software={p} fullWidth size="sm" />
              <Link
                href={`/vergleich/${s.slug}-vs-${p.slug}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-border text-sm font-semibold hover:bg-paper"
              >
                {s.name} vs. {p.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <AffiliateDisclosureNote className="mt-6" />
      <p className="mt-4 text-xs text-muted-foreground">
        {NET_PRICE_NOTE} Die Reihenfolge ergibt sich aus Nutzerbewertungen und, solange keine vorliegen, aus der Redaktionsnote. Kommerzielle Beziehungen beeinflussen sie nicht.
      </p>
    </div>
  );
}
