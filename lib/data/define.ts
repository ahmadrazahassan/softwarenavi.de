import type { ComplianceBlock, PricingPlan, Software } from "@/lib/types";
import type { PriceUnit } from "@/lib/utils/format";
import { PRODUCT_LOGOS } from "./logos";
import { FETCHED_LOGOS } from "./logos-fetched";
import { VERIFIED, PRICES_CHECKED_AT } from "./pricing-verified";
import { EDITORIAL } from "./editorial";

/** Compact authoring shape for the demo roster; `buildSoftware` expands it to a full `Software` row. */
export interface ProductDef extends ComplianceBlock {
  slug: string;
  name: string;
  category: string; // category id
  vendor: string;
  hq: string;
  founded?: number | null;
  tagline: string;
  short: string;
  full: string[]; // paragraphs
  price: number | null;
  unit?: PriceUnit;
  period?: "month" | "year" | "once";
  trial?: boolean;
  free?: boolean;
  plans?: PricingPlan[];
  features: string[];
  top: string[];
  integrations: string[];
  support?: string[];
  languages?: string[];
  pros: string[];
  cons: string[];
  ideal: string;
  website: string;
  network?: Software["affiliate_network"];
  featured?: boolean;
  /** legacy authoring hint from the demo phase; no longer used to generate reviews */
  quality?: number;
  /** legacy: demo review count, ignored */
  reviews?: number;
  updated?: string;
}

export const CHECKED = "2026-08-15";

export function buildSoftware(d: ProductDef, index: number): Software {
  const created = new Date(Date.UTC(2025, 0, 10 + index * 3)).toISOString();
  const v = VERIFIED[d.slug] ?? {};
  const ed = EDITORIAL[d.slug] ?? null;
  const has = <K extends keyof typeof v>(k: K) => Object.prototype.hasOwnProperty.call(v, k);
  return {
    id: `sw-${d.slug}`,
    name: d.name,
    slug: d.slug,
    tagline: d.tagline,
    description_short: d.short,
    description_full: d.full.map((p) => `<p>${p}</p>`).join(""),
    logo_url: PRODUCT_LOGOS[d.slug] ?? FETCHED_LOGOS[d.slug] ?? null,
    screenshots: [],
    category_id: d.category,
    starting_price: has("price") ? (v.price ?? null) : d.price,
    price_currency: "EUR",
    billing_period: v.period ?? d.period ?? "month",
    price_is_net: true,
    price_unit: v.unit ?? d.unit ?? "account",
    free_trial: v.trial ?? d.trial ?? false,
    trial_days: v.trialDays ?? null,
    free_version: v.free ?? d.free ?? false,
    free_demo: v.demo ?? false,
    pricing_plans: v.plans ?? d.plans ?? [],
    pricing_note: v.note ?? null,
    features: d.features,
    top_features: d.top,
    integrations: d.integrations,
    brand_color: null,
    // Affiliate URLs belong in the DB; in the demo the vendor website is the only destination.
    affiliate_url: null,
    vendor_website: v.website ?? d.website,
    affiliate_network: d.network ?? "keins",
    vendor_name: d.vendor,
    founded_year: d.founded ?? null,
    vendor_hq: d.hq,
    support_types: d.support ?? ["E-Mail", "Telefon", "Hilfe-Center"],
    countries_available: ["Deutschland", "Österreich", "Schweiz"],
    languages: d.languages ?? ["Deutsch", "Englisch"],
    overall_rating: 0,
    ease_of_use_rating: 0,
    value_for_money_rating: 0,
    customer_service_rating: 0,
    functionality_rating: 0,
    review_count: 0,
    pros: d.pros,
    cons: d.cons,
    ideal_for: d.ideal,
    editorial: ed,
    gobd_compliant: d.gobd_compliant ?? null,
    datev_interface: d.datev_interface ?? null,
    e_invoicing: d.e_invoicing ?? [],
    elster_submission: d.elster_submission ?? null,
    hosting_location: d.hosting_location ?? null,
    dpa_available: d.dpa_available ?? null,
    iso27001: d.iso27001 ?? null,
    tse_certified: d.tse_certified ?? null,
    skr_support: d.skr_support ?? [],
    german_support: d.german_support ?? null,
    vendor_country: d.vendor_country ?? null,
    compliance_checked_at: d.compliance_checked_at ?? (VERIFIED[d.slug] ? PRICES_CHECKED_AT : CHECKED),
    meta_title: null,
    meta_description: null,
    og_image_url: null,
    status: "published",
    featured: d.featured ?? false,
    created_at: created,
    updated_at: d.updated ?? "2026-08-20T09:00:00.000Z",
  };
}
