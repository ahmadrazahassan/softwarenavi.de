import "server-only";
import type {
  Article,
  Category,
  Comparison,
  ComparisonWithSoftware,
  Page,
  Review,
  ReviewFilters,
  SearchResult,
  SiteSettings,
  SiteStats,
  Software,
  SoftwareFilters,
} from "@/lib/types";
import { USER_BUCKETS } from "@/lib/i18n/options";
import { rankScore } from "@/lib/rating";
import { getDataset, type Dataset } from "./dataset";

/**
 * Public read fetchers (backend spec §6).
 * Data comes from Supabase when configured (see `dataset.ts`), otherwise from the authored dataset.
 * Every fetcher is wrapped in `safe(fallback, fn)`, so a failing read degrades a widget instead of a page.
 */

async function safe<T>(fallback: T, fn: (d: Dataset) => T | Promise<T>): Promise<T> {
  try {
    return await fn(await getDataset());
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.error("[queries]", err);
    return fallback;
  }
}

const published = (d: Dataset) => d.software.filter((s) => s.status === "published");
const byRank = (a: Software, b: Software) => rankScore(b) - rankScore(a);

// ───────────── Categories ─────────────

export const getCategories = (limit?: number) =>
  safe<Category[]>([], (d) => {
    const list = d.categories
      .map((c) => ({ ...c, software_count: published(d).filter((s) => s.category_id === c.id).length }))
      .sort((a, b) => a.display_order - b.display_order);
    return limit ? list.slice(0, limit) : list;
  });

export const getCategoryBySlug = (slug: string) =>
  safe<Category | null>(null, async (d) => (await getCategories()).find((c) => c.slug === slug) ?? d.categories.find((c) => c.slug === slug) ?? null);

// ───────────── Software ─────────────

export const getFeaturedSoftware = (limit = 6) =>
  safe<Software[]>([], (d) => published(d).filter((s) => s.featured).sort(byRank).slice(0, limit));

export const getTopRatedSoftware = (limit = 8, categoryId?: string) =>
  safe<Software[]>([], (d) =>
    published(d)
      .filter((s) => !categoryId || s.category_id === categoryId)
      .sort(byRank)
      .slice(0, limit),
  );

/** Most user reviews first; while nobody has reviews yet, falls back to the ranking. */
export const getMostReviewedSoftware = (limit = 5) =>
  safe<Software[]>([], (d) => [...published(d)].sort((a, b) => b.review_count - a.review_count || byRank(a, b)).slice(0, limit));

export const getRecentlyUpdatedSoftware = (limit = 6) =>
  safe<Software[]>([], (d) => [...published(d)].sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, limit));

export const getSoftwareBySlug = (slug: string) => safe<Software | null>(null, (d) => published(d).find((s) => s.slug === slug) ?? null);

export const getSoftwareById = (id: string) => safe<Software | null>(null, (d) => published(d).find((s) => s.id === id) ?? null);

export const getAllSoftwareSlim = () =>
  safe<Pick<Software, "id" | "name" | "slug" | "brand_color" | "logo_url" | "category">[]>([], (d) =>
    published(d)
      .map(({ id, name, slug, brand_color, logo_url, category }) => ({ id, name, slug, brand_color, logo_url, category }))
      .sort((a, b) => a.name.localeCompare(b.name, "de")),
  );

export const getSoftwareList = (filters: SoftwareFilters = {}) =>
  safe<{ items: Software[]; total: number }>({ items: [], total: 0 }, (d) => {
    const {
      categoryId,
      minRating,
      freeTrial,
      freeVersion,
      paidOnly,
      hostingLocation,
      datevInterface,
      gobdCompliant,
      eInvoicing,
      germanSupport,
      dpaAvailable,
      maxPrice,
      companySize,
      sort = "reviews",
      page = 1,
      perPage = 12,
    } = filters;

    let list = published(d);
    if (categoryId) list = list.filter((s) => s.category_id === categoryId);
    if (minRating) list = list.filter((s) => s.overall_rating >= minRating);
    if (freeTrial) list = list.filter((s) => s.free_trial);
    if (freeVersion) list = list.filter((s) => s.free_version);
    if (paidOnly) list = list.filter((s) => !s.free_version);
    if (hostingLocation) list = list.filter((s) => s.hosting_location === hostingLocation);
    if (datevInterface === "any") list = list.filter((s) => s.datev_interface === "export" || s.datev_interface === "vollintegriert");
    else if (datevInterface) list = list.filter((s) => s.datev_interface === datevInterface);
    if (gobdCompliant) list = list.filter((s) => s.gobd_compliant === "ja");
    if (eInvoicing) list = list.filter((s) => (s.e_invoicing ?? []).includes(eInvoicing));
    if (germanSupport) list = list.filter((s) => s.german_support === true);
    if (dpaAvailable) list = list.filter((s) => s.dpa_available === true);
    if (maxPrice !== undefined) list = list.filter((s) => s.starting_price !== null && s.starting_price <= maxPrice);
    if (companySize) {
      const bucket = USER_BUCKETS.find((b) => b.key === companySize);
      if (bucket) {
        list = list.filter((s) => {
          const rs = d.reviews.filter((r) => r.software_id === s.id && r.status === "published");
          const hits = rs.filter((r) => (bucket.sizes as readonly string[]).includes(r.reviewer_company_size ?? "")).length;
          return rs.length > 0 && hits / rs.length >= 0.3;
        });
      }
    }

    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "rating":
          return byRank(a, b);
        case "recent":
          return b.updated_at.localeCompare(a.updated_at);
        case "price_asc": {
          const pa = a.starting_price ?? Number.POSITIVE_INFINITY;
          const pb = b.starting_price ?? Number.POSITIVE_INFINITY;
          return pa - pb || byRank(a, b);
        }
        default:
          return b.review_count - a.review_count || byRank(a, b);
      }
    });

    const start = (page - 1) * perPage;
    return { items: sorted.slice(start, start + perPage), total: sorted.length };
  });

export const getAlternatives = (id: string, limit = 4) =>
  safe<Software[]>([], (d) => {
    const all = published(d);
    const explicit = (d.alternatives[id] ?? []).map((aid) => all.find((s) => s.id === aid)).filter((s): s is Software => Boolean(s));
    if (explicit.length >= limit) return explicit.slice(0, limit);
    const self = all.find((s) => s.id === id);
    const peers = all.filter((s) => s.id !== id && s.category_id === self?.category_id && !explicit.some((e) => e.id === s.id)).sort(byRank);
    return [...explicit, ...peers].slice(0, limit);
  });

export const getCategoryPeers = (id: string, categoryId: string, limit = 6) =>
  safe<Software[]>([], (d) => published(d).filter((s) => s.id !== id && s.category_id === categoryId).sort(byRank).slice(0, limit));

// ───────────── Reviews (published user reviews only) ─────────────

export const getReviewsForSoftware = (softwareId: string, filters: ReviewFilters = {}) =>
  safe<{ items: Review[]; total: number }>({ items: [], total: 0 }, (d) => {
    const { country, industry, companySize, legalForm, duration, rating, sort = "recent", page = 1, perPage = 10 } = filters;
    let list = d.reviews.filter((r) => r.software_id === softwareId && r.status === "published");
    if (country) list = list.filter((r) => r.reviewer_country === country);
    if (industry) list = list.filter((r) => r.reviewer_industry === industry);
    if (companySize) list = list.filter((r) => r.reviewer_company_size === companySize);
    if (legalForm) list = list.filter((r) => r.reviewer_legal_form === legalForm);
    if (duration) list = list.filter((r) => r.used_for_duration === duration);
    if (rating) list = list.filter((r) => r.overall_rating === rating);
    const sorted = [...list].sort((a, b) => {
      switch (sort) {
        case "helpful":
          return b.helpful_count - a.helpful_count;
        case "rating_desc":
          return b.overall_rating - a.overall_rating || b.review_date.localeCompare(a.review_date);
        case "rating_asc":
          return a.overall_rating - b.overall_rating || b.review_date.localeCompare(a.review_date);
        default:
          return b.review_date.localeCompare(a.review_date);
      }
    });
    const start = (page - 1) * perPage;
    return { items: sorted.slice(start, start + perPage), total: sorted.length };
  });

export const getLatestReviews = (limit = 6) =>
  safe<(Review & { software: Pick<Software, "name" | "slug" | "brand_color" | "logo_url"> })[]>([], (d) =>
    d.reviews
      .filter((r) => r.status === "published")
      .sort((a, b) => b.review_date.localeCompare(a.review_date))
      .slice(0, limit)
      .flatMap((r) => {
        const s = d.software.find((x) => x.id === r.software_id);
        return s ? [{ ...r, software: { name: s.name, slug: s.slug, brand_color: s.brand_color, logo_url: s.logo_url } }] : [];
      }),
  );

/** { 5: n, 4: n, 3: n, 2: n, 1: n } */
export const getRatingDistribution = (softwareId: string) =>
  safe<Record<1 | 2 | 3 | 4 | 5, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, (d) => {
    const out: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of d.reviews) if (r.software_id === softwareId && r.status === "published") out[r.overall_rating as 1 | 2 | 3 | 4 | 5]++;
    return out;
  });

/** Company-size distribution for the „Für wen ist … geeignet?" chart. */
export const getCompanySizeDistribution = (softwareId: string) =>
  safe<Record<string, number>>({}, (d) => {
    const out: Record<string, number> = {};
    for (const r of d.reviews) {
      if (r.software_id !== softwareId || r.status !== "published" || !r.reviewer_company_size) continue;
      out[r.reviewer_company_size] = (out[r.reviewer_company_size] ?? 0) + 1;
    }
    return out;
  });

export const getIndustryDistribution = (softwareId: string) =>
  safe<{ name: string; count: number }[]>([], (d) => {
    const out: Record<string, number> = {};
    for (const r of d.reviews) {
      if (r.software_id !== softwareId || r.status !== "published" || !r.reviewer_industry) continue;
      out[r.reviewer_industry] = (out[r.reviewer_industry] ?? 0) + 1;
    }
    return Object.entries(out)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  });

// ───────────── Comparisons ─────────────

const withSoftware = (d: Dataset, c: Comparison): ComparisonWithSoftware | null => {
  const a = d.software.find((s) => s.id === c.software_a_id);
  const b = d.software.find((s) => s.id === c.software_b_id);
  if (!a || !b) return null;
  return { ...c, a, b, slug: `${a.slug}-vs-${b.slug}` };
};

export const getPublishedComparisons = () =>
  safe<ComparisonWithSoftware[]>([], (d) =>
    d.comparisons
      .filter((c) => c.status === "published")
      .map((c) => withSoftware(d, c))
      .filter((c): c is ComparisonWithSoftware => Boolean(c)),
  );

export const getComparisonRecord = (aId: string, bId: string) =>
  safe<ComparisonWithSoftware | null>(null, (d) => {
    const c = d.comparisons.find((x) => (x.software_a_id === aId && x.software_b_id === bId) || (x.software_a_id === bId && x.software_b_id === aId));
    return c ? withSoftware(d, c) : null;
  });

/** Resolves `sevdesk-vs-lexware-office` into both products (works for any pair, stored or not). */
export const getComparisonByPair = (pairSlug: string) =>
  safe<{ a: Software; b: Software; record: ComparisonWithSoftware | null } | null>(null, async (d) => {
    const [aSlug, bSlug] = pairSlug.split("-vs-");
    if (!aSlug || !bSlug || aSlug === bSlug) return null;
    const a = published(d).find((s) => s.slug === aSlug);
    const b = published(d).find((s) => s.slug === bSlug);
    if (!a || !b) return null;
    const record = await getComparisonRecord(a.id, b.id);
    return { a, b, record };
  });

// ───────────── Articles ─────────────

const publishedArticles = (d: Dataset) =>
  d.articles.filter((a) => a.status === "published").sort((a, b) => b.published_date.localeCompare(a.published_date));

export const getArticles = (page = 1, perPage = 9) =>
  safe<{ items: Article[]; total: number }>({ items: [], total: 0 }, (d) => {
    const list = publishedArticles(d);
    const start = (page - 1) * perPage;
    return { items: list.slice(start, start + perPage), total: list.length };
  });

export const getArticleBySlug = (slug: string) => safe<Article | null>(null, (d) => publishedArticles(d).find((a) => a.slug === slug) ?? null);

export const getLatestArticles = (limit = 3) => safe<Article[]>([], (d) => publishedArticles(d).slice(0, limit));

export const getArticlesForSoftware = (softwareId: string, limit = 3) =>
  safe<Article[]>([], (d) => publishedArticles(d).filter((a) => a.related_software_id === softwareId).slice(0, limit));

// ───────────── Pages, settings, stats ─────────────

export const getPageBySlug = (slug: string) =>
  safe<Page | null>(null, (d) => d.pages.find((p) => p.slug === slug && p.status === "published") ?? null);

export const getSiteSettings = () => safe<SiteSettings>({}, (d) => ({ ...d.settings }));

export const getSiteStats = () =>
  safe<SiteStats>({ reviews: 0, software: 0, categories: 0, editorial: 0 }, (d) => ({
    reviews: d.reviews.filter((r) => r.status === "published").length,
    software: published(d).length,
    categories: d.categories.length,
    editorial: published(d).filter((s) => s.editorial).length,
  }));

// ───────────── Search ─────────────

/** German-aware normalisation: lower-case, fold umlauts both ways so „Lohn" finds „Lohnabrechnung". */
const norm = (s: string) => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");

export const searchContent = (query: string, limit = 8) =>
  safe<SearchResult>({ software: [], articles: [], categories: [] }, (d) => {
    const q = norm(query.trim());
    if (q.length < 2) return { software: [], articles: [], categories: [] };
    const terms = q.split(/\s+/).filter(Boolean);
    const matches = (hay: string) => {
      const h = norm(hay);
      return terms.every((t) => h.includes(t));
    };

    const software = published(d)
      .map((s) => {
        const hay = [s.name, s.tagline, s.description_short, s.vendor_name, s.category?.name, ...s.features].join(" ");
        const nameHit = norm(s.name).includes(q) ? 2 : 0;
        return { s, score: matches(hay) ? 1 + nameHit : 0 };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || byRank(a.s, b.s))
      .slice(0, limit)
      .map(({ s }) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        tagline: s.tagline,
        brand_color: s.brand_color,
        logo_url: s.logo_url,
        overall_rating: s.overall_rating,
        review_count: s.review_count,
        category_name: s.category?.name ?? null,
      }));

    const articles = publishedArticles(d)
      .filter((a) => matches(`${a.title} ${a.excerpt ?? ""} ${a.category_tag ?? ""}`))
      .slice(0, limit)
      .map(({ id, title, slug, excerpt, category_tag }) => ({ id, title, slug, excerpt, category_tag }));

    const categories = d.categories.filter((c) => matches(`${c.name} ${c.description ?? ""}`)).map(({ id, name, slug }) => ({ id, name, slug }));

    return { software, articles, categories };
  });

/**
 * The points reviewers raise most often: every sentence of „Das gefällt" / „Das gefällt nicht" counted across all
 * published reviews of one product. Lead-ins such as „Kritikpunkt:" are stripped so equal points count together.
 */
export const getReviewHighlights = (softwareId: string, limit = 4) =>
  safe<{ pros: { text: string; count: number }[]; cons: { text: string; count: number }[]; total: number }>(
    { pros: [], cons: [], total: 0 },
    (d) => {
      const rs = d.reviews.filter((r) => r.software_id === softwareId && r.status === "published");
      const tally = (texts: (string | null)[]) => {
        const counts = new Map<string, number>();
        for (const t of texts) {
          if (!t) continue;
          for (const raw of t.split(/(?<=[.!?])\s+/)) {
            const s = raw.replace(/^(Nur Kleinigkeiten|Kritikpunkt|Größter Pluspunkt für uns):\s*/, "").trim();
            if (s.length > 12) counts.set(s, (counts.get(s) ?? 0) + 1);
          }
        }
        return [...counts.entries()]
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "de"))
          .slice(0, limit)
          .map(([text, count]) => ({ text, count }));
      };
      return { pros: tally(rs.map((r) => r.pros)), cons: tally(rs.map((r) => r.cons)), total: rs.length };
    },
  );
