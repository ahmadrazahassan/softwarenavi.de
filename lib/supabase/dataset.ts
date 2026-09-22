import "server-only";
import { cache } from "react";
import type { Article, Category, Comparison, Page, Review, SiteSettings, Software } from "@/lib/types";
import * as local from "@/lib/data";
import { withDisplayScores } from "@/lib/rating";
import { PRODUCT_LOGOS } from "@/lib/data/logos";
import { FETCHED_LOGOS } from "@/lib/data/logos-fetched";
import { createPublicClient, isSupabaseConfigured } from "./public";
import { applySeedReviews } from "@/lib/data/seedReviews";
import { seedReviewsEnabled } from "@/lib/seedMode";

/**
 * Everything the public site reads, in one shape. With Supabase configured it comes from the database
 * (RLS: published rows only); otherwise, or if the database is unreachable, from the authored dataset in
 * `lib/data`, so the site always builds and renders.
 *
 * The catalogue is small (a few dozen products), so loading it once per request and filtering in memory is
 * both simpler and faster than one round trip per widget. `cache()` dedupes within a single render.
 */
export interface Dataset {
  source: "supabase" | "local";
  software: Software[];
  categories: Category[];
  reviews: Review[];
  comparisons: Comparison[];
  alternatives: Record<string, string[]>;
  articles: Article[];
  pages: Page[];
  settings: SiteSettings;
}

const localDataset = (): Dataset => ({
  source: "local",
  software: local.SOFTWARE,
  categories: local.CATEGORIES,
  reviews: local.REVIEWS,
  comparisons: local.COMPARISONS,
  alternatives: local.ALTERNATIVES,
  articles: local.ARTICLES,
  pages: local.PAGES,
  settings: local.SITE_SETTINGS,
});

type Row = Record<string, unknown>;

function toSoftware(r: Row): Software {
  const {
    editorial_rating,
    editorial_ease,
    editorial_value,
    editorial_service,
    editorial_functionality,
    editorial_verdict,
    editorial_review,
    editorial_author,
    editorial_tested_at,
    search_vector,
    category,
    ...rest
  } = r;
  void search_vector;
  const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));
  const s = {
    ...(rest as unknown as Software),
    category: (category as Software["category"]) ?? null,
    // uploaded logos (storage URL) win; otherwise the logo bundled in /public/logos
    logo_url: (rest.logo_url as string | null) || PRODUCT_LOGOS[String(rest.slug)] || FETCHED_LOGOS[String(rest.slug)] || null,
    starting_price: num(rest.starting_price) as number | null,
    overall_rating: Number(rest.overall_rating ?? 0),
    ease_of_use_rating: Number(rest.ease_of_use_rating ?? 0),
    value_for_money_rating: Number(rest.value_for_money_rating ?? 0),
    customer_service_rating: Number(rest.customer_service_rating ?? 0),
    functionality_rating: Number(rest.functionality_rating ?? 0),
    editorial:
      editorial_rating === null || editorial_rating === undefined
        ? null
        : {
            rating: Number(editorial_rating),
            ease: Number(editorial_ease),
            value: Number(editorial_value),
            service: Number(editorial_service),
            functionality: Number(editorial_functionality),
            verdict: String(editorial_verdict ?? ""),
            body: String(editorial_review ?? ""),
            author: String(editorial_author ?? "Nadeem Abbas"),
            tested_at: String(editorial_tested_at ?? ""),
          },
  } satisfies Software;
  return withDisplayScores(s);
}

async function loadFromSupabase(): Promise<Dataset> {
  const db = createPublicClient();
  const [sw, cats, revs, cmps, alts, arts, pages, settings] = await Promise.all([
    db.from("software").select("*, category:categories(id, name, slug)").eq("status", "published"),
    db.from("categories").select("*").order("display_order"),
    db.from("reviews").select("*").eq("status", "published").order("review_date", { ascending: false }),
    db.from("comparisons").select("*").eq("status", "published"),
    db.from("software_alternatives").select("software_id, alternative_id, display_order").order("display_order"),
    db.from("articles").select("*").eq("status", "published"),
    db.from("pages").select("*").eq("status", "published"),
    db.from("site_settings").select("key, value"),
  ]);
  // Product and review reads are essential. An unrelated content-table failure must not
  // replace published reviews with the review-free offline dataset.
  if (sw.error) throw sw.error;
  if (revs.error) throw revs.error;
  for (const [name, result] of Object.entries({ cats, cmps, alts, arts, pages, settings })) {
    if (result.error) console.error(`[dataset] ${name} konnte nicht geladen werden:`, result.error);
  }

  const alternatives: Record<string, string[]> = {};
  for (const a of (alts.data ?? []) as { software_id: string; alternative_id: string }[]) {
    (alternatives[a.software_id] ??= []).push(a.alternative_id);
  }

  return {
    source: "supabase",
    software: ((sw.data ?? []) as Row[]).map(toSoftware),
    categories: (cats.data ?? []) as Category[],
    reviews: (revs.data ?? []) as Review[],
    comparisons: (cmps.data ?? []) as Comparison[],
    alternatives,
    articles: ((arts.data ?? []) as Article[]).map((a) => ({ ...a, updated_date: a.updated_date ?? a.published_date })),
    pages: (pages.data ?? []) as Page[],
    settings: settings.error
      ? local.SITE_SETTINGS
      : Object.fromEntries(((settings.data ?? []) as { key: string; value: string | null }[]).map((x) => [x.key, x.value ?? ""])),
  };
}

const loadDataset = async (): Promise<Dataset> => {
  if (!isSupabaseConfigured()) return localDataset();
  try {
    return await loadFromSupabase();
  } catch (err) {
    console.error("[dataset] Supabase nicht erreichbar, nutze lokale Daten:", err);
    return localDataset();
  }
};

/** SEED_REVIEWS=true swaps in the generated seed reviews (never on Vercel Production, see lib/data/seedReviews.ts). */
export const getDataset = cache(async (): Promise<Dataset> => {
  const d = await loadDataset();
  return seedReviewsEnabled() ? applySeedReviews(d, withDisplayScores) : d;
});
