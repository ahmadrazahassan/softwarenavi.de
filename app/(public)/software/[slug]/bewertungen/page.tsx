import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PenLine } from "lucide-react";
import { getRatingDistribution, getReviewHighlights, getReviewsForSoftware, getSoftwareBySlug } from "@/lib/supabase/queries";
import { Breadcrumb, EmptyState, Pagination } from "@/components/public/Layout";
import { ReviewCard } from "@/components/public/ReviewCard";
import { RatingsOverview, ReviewHighlights } from "@/components/profile/Sections";
import { ReviewFilters } from "@/components/profile/ReviewFilters";
import { SoftwareLogo } from "@/components/public/SoftwareLogo";
import { AffiliateCTAButton, AffiliateDisclosureNote } from "@/components/public/Affiliate";
import type { ReviewFilters as RF } from "@/lib/types";
import { flatParams, type SP } from "@/lib/filters";
import { formatCount } from "@/lib/utils/format";
import { seedReviewsEnabled } from "@/lib/seedMode";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSoftwareBySlug(slug);
  if (!s) return {};
  return {
    title: `${s.name} Erfahrungen: ${formatCount(s.review_count)} Bewertungen`,
    description: `Alle ${seedReviewsEnabled() ? "" : "geprüften "}Bewertungen zu ${s.name}, filterbar nach Branche, Unternehmensgröße, Rechtsform und Land.`,
    alternates: { canonical: `/software/${slug}/bewertungen` },
  };
}

const SORT_MAP: Record<string, RF["sort"]> = { hilfreich: "helpful", beste: "rating_desc", kritischste: "rating_asc" };

export default async function ReviewsPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SP> }) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const s = await getSoftwareBySlug(slug);
  if (!s) notFound();
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : (sp[k] as string | undefined));
  const page = Math.max(1, Number(one("seite")) || 1);
  const perPage = 10;
  const [dist, list, highlights] = await Promise.all([
    getRatingDistribution(s.id),
    getReviewsForSoftware(s.id, {
      country: one("land"),
      industry: one("branche"),
      companySize: one("groesse"),
      legalForm: one("rechtsform"),
      duration: one("dauer"),
      rating: Number(one("sterne")) || undefined,
      sort: SORT_MAP[one("sortierung") ?? ""] ?? "recent",
      page,
      perPage,
    }),
    getReviewHighlights(s.id, 4),
  ]);

  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Software", href: "/software" }, { label: s.name, href: `/software/${slug}` }, { label: "Bewertungen" }]} />
      <header className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <SoftwareLogo software={s} size={64} />
          <div>
            <h1 className="font-heading text-[1.7rem] font-medium tracking-tight sm:text-3xl md:text-4xl">{s.name}: Erfahrungen und Bewertungen</h1>
            <p className="mt-1 text-muted-foreground">{formatCount(s.review_count)} {seedReviewsEnabled() ? "" : "geprüfte "}Bewertungen aus Unternehmen in Deutschland, Österreich und der Schweiz</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:w-72">
          <Link
            href={`/software/${slug}/bewertungen/neu`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] btn-glossy px-5 text-sm font-medium"
          >
            <PenLine className="size-4" aria-hidden="true" /> Bewertung schreiben
          </Link>
          <AffiliateCTAButton software={s} fullWidth variant="outline" />
          <AffiliateDisclosureNote compact />
        </div>
      </header>

      <div className="mt-8">
        <RatingsOverview software={s} distribution={dist} />
      </div>

      <div className="mt-4">
        <ReviewHighlights highlights={highlights} />
      </div>

      <div className="mt-8">
        <Suspense>
          <ReviewFilters />
        </Suspense>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        <strong className="text-foreground">{formatCount(list.total)}</strong> {list.total === 1 ? "Bewertung" : "Bewertungen"} gefunden
      </p>

      <div className="mt-4 grid gap-5">
        {list.items.length ? (
          list.items.map((r) => <ReviewCard key={r.id} review={r} />)
        ) : (
          <EmptyState title="Keine Bewertungen gefunden">Für diese Filterkombination liegen keine Bewertungen vor. Setzen Sie einzelne Filter zurück.</EmptyState>
        )}
      </div>
      <Pagination page={page} total={list.total} perPage={perPage} basePath={`/software/${slug}/bewertungen`} params={flatParams(sp)} />
    </div>
  );
}
