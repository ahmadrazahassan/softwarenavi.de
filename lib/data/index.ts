import type { Category, Comparison, Review, SiteSettings, Software } from "@/lib/types";
import { CATEGORY_SEED } from "./categories";
import { buildSoftware, type ProductDef } from "./define";
import { FINANCE_ROSTER } from "./roster-finance";
import { BUSINESS_ROSTER } from "./roster-business";
import { WORK_ROSTER } from "./roster-work";
import { ADDITIONS_ROSTER } from "./roster-additions";
import { withDisplayScores } from "@/lib/rating";
export { ARTICLES } from "./articles";
export { PAGES } from "./pages";

/**
 * In-memory demo dataset. Mirrors what the Supabase schema + triggers will produce, so every page
 * renders fully before the backend exists. Aggregates are derived here exactly as
 * `update_software_ratings()` and `update_category_counts()` will do in Postgres — never hand-written.
 */

const DEFS: ProductDef[] = [...FINANCE_ROSTER, ...BUSINESS_ROSTER, ...WORK_ROSTER, ...ADDITIONS_ROSTER];

/**
 * User reviews only ever come from real submissions (moderated, UWG § 5b Abs. 3).
 * The offline fallback therefore ships none; the Redaktionstest carries each profile until reviews arrive.
 */
export const REVIEWS: Review[] = [];

const round1 = (n: number) => Math.round(n * 10) / 10;
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

const categoryById = new Map(CATEGORY_SEED.map((c) => [c.id, c]));

export const SOFTWARE: Software[] = DEFS.map((d, i) => {
  const s = buildSoftware(d, i);
  const rs = REVIEWS.filter((r) => r.software_id === s.id && r.status === "published");
  const cat = categoryById.get(d.category);
  return withDisplayScores({
    ...s,
    category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : null,
    overall_rating: round1(avg(rs.map((r) => r.overall_rating))),
    ease_of_use_rating: round1(avg(rs.map((r) => r.ease_of_use ?? 0))),
    value_for_money_rating: round1(avg(rs.map((r) => r.value_for_money ?? 0))),
    customer_service_rating: round1(avg(rs.map((r) => r.customer_service ?? 0))),
    functionality_rating: round1(avg(rs.map((r) => r.functionality ?? 0))),
    review_count: rs.length,
    updated_at: rs[0] ? `${rs[0].review_date}T09:00:00.000Z` : s.updated_at,
  });
});

export const CATEGORIES: Category[] = CATEGORY_SEED.map((c) => ({
  ...c,
  software_count: SOFTWARE.filter((s) => s.category_id === c.id && s.status === "published").length,
  created_at: "2025-01-01T00:00:00.000Z",
}));

const pair = (a: string, b: string, verdict: string | null = null): Comparison => ({
  id: `cmp-${a}-${b}`,
  software_a_id: `sw-${a}`,
  software_b_id: `sw-${b}`,
  custom_verdict: verdict,
  meta_title: null,
  meta_description: null,
  status: "published",
  created_at: "2026-06-01T00:00:00.000Z",
});

export const COMPARISONS: Comparison[] = [
  pair("sevdesk", "lexware-office"),
  pair("lexware-office", "datev-unternehmen-online"),
  pair("sevdesk", "buchhaltungsbutler"),
  pair("sage-active", "lexware-office"),
  pair("personio", "hrworks"),
  pair("personio", "factorial"),
  pair("hubspot", "pipedrive"),
  pair("salesforce", "hubspot"),
  pair("weclapp", "xentral"),
  pair("awork", "stackfield"),
  pair("clockodo", "papershift"),
  pair("docuware", "ecodms"),
  pair("sage-50-connected", "lexware-office"),
  pair("sage-active", "sevdesk"),
  pair("sage-50-connected", "datev-unternehmen-online"),
  pair("sage-hr-payroll", "personio"),
  pair("sage-hr-payroll", "lexware-lohn-gehalt"),
  pair("sage-100", "dynamics-365-business-central"),
  pair("sage-50-handwerk", "orgamax"),
  pair("wiso-meinbuero", "lexware-office"),
  pair("jtl-wawi", "xentral"),
];

/** Explicit alternatives (software_alternatives). Products without an entry fall back to category peers. */
export const ALTERNATIVES: Record<string, string[]> = {
  "sw-sevdesk": ["sw-lexware-office", "sw-sage-active", "sw-buchhaltungsbutler", "sw-papierkram"],
  "sw-lexware-office": ["sw-sevdesk", "sw-sage-active", "sw-wiso-meinbuero", "sw-papierkram"],
  "sw-sage-active": ["sw-lexware-office", "sw-sevdesk", "sw-sage-50-connected", "sw-buchhaltungsbutler"],
  "sw-sage-50-connected": ["sw-sage-active", "sw-lexware-office", "sw-orgamax", "sw-wiso-meinbuero"],
  "sw-personio": ["sw-hrworks", "sw-sage-hr-payroll", "sw-factorial", "sw-kenjo"],
  "sw-sage-hr-payroll": ["sw-personio", "sw-lexware-lohn-gehalt", "sw-factorial", "sw-datev-lohn-und-gehalt"],
  "sw-sage-100": ["sw-dynamics-365-business-central", "sw-weclapp", "sw-sap-business-one", "sw-myfactory"],
  "sw-orgamax": ["sw-sage-50-handwerk", "sw-sage-50-connected", "sw-wiso-meinbuero", "sw-lexware-office"],
};

export const SITE_SETTINGS: SiteSettings = {
  site_name: "Softwarenavi",
  tagline: "Deutschlands unabhängiges Vergleichsportal für Unternehmenssoftware",
  footer_tagline:
    "Unabhängige Bewertungen und Vergleiche der besten Unternehmenssoftware für den deutschen Mittelstand.",
  footer_text:
    "Softwarenavi hilft deutschen Unternehmen, die passende Software zu finden. Mit geprüften Bewertungen und unabhängigen Vergleichen.",
  contact_email: "hallo@softwarenavi.de",
  editorial_email: "hallo@softwarenavi.de",
  contact_phone: "+49 151 2037277",
  contact_city: "Neu-Isenburg (bei Frankfurt am Main), Deutschland",
  social_linkedin: "",
  social_xing: "",
  social_twitter: "",
  social_facebook: "",
  years_active: "1",
  items_per_page: "12",
  analytics_domain: "",
  vat_rate_standard: "19",
  vat_rate_reduced: "7",
};
