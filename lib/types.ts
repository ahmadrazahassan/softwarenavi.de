import type { PriceUnit } from "@/lib/utils/format";

export type Status = "published" | "draft";
export type ReviewStatus = "pending" | "published" | "hidden";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  software_count: number;
  display_order: number;
  created_at: string;
}

export interface PricingPlan {
  name: string;
  price: number | null;
  period: "month" | "year" | "once";
  unit?: PriceUnit;
  description?: string;
  features: string[];
  highlighted?: boolean;
}

export interface Screenshot {
  url: string;
  caption: string;
}

export type GobdCompliant = "ja" | "teilweise" | "nein";
export type DatevInterface = "vollintegriert" | "export" | "nein";
export type HostingLocation = "Deutschland" | "EU" | "Drittland" | "on-premise";

/** German compliance block. Every field optional/nullable: unknown renders as „keine Angabe“. */
export interface ComplianceBlock {
  gobd_compliant?: GobdCompliant | null;
  datev_interface?: DatevInterface | null;
  e_invoicing?: string[];
  elster_submission?: boolean | null;
  hosting_location?: HostingLocation | null;
  dpa_available?: boolean | null;
  iso27001?: boolean | null;
  tse_certified?: boolean | null;
  skr_support?: string[];
  german_support?: boolean | null;
  vendor_country?: string | null;
  compliance_checked_at?: string | null;
}

export interface EditorialReview {
  rating: number;
  ease: number;
  value: number;
  service: number;
  functionality: number;
  /** two or three sentences, shown as the „Fazit" */
  verdict: string;
  /** full test report as HTML (h3 + p) */
  body: string;
  author: string;
  tested_at: string;
}

export interface Software extends ComplianceBlock {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description_short: string;
  description_full: string;
  logo_url: string | null;
  screenshots: Screenshot[];
  category_id: string | null;
  category?: Pick<Category, "id" | "name" | "slug"> | null;

  starting_price: number | null;
  price_currency: string;
  billing_period: "month" | "year" | "once";
  price_is_net: boolean;
  price_unit: PriceUnit;
  free_trial: boolean;
  /** length of the free trial in days, when the vendor states one */
  trial_days?: number | null;
  free_version: boolean;
  /** vendor offers a free (guided or self-service) demo */
  free_demo?: boolean;
  pricing_plans: PricingPlan[];
  /** short caveat shown under the price, e.g. „bei jährlicher Zahlung" or „Preis nur über die Steuerkanzlei" */
  pricing_note?: string | null;

  features: string[];
  top_features: string[];
  integrations: string[];
  brand_color: string | null;

  affiliate_url: string | null;
  vendor_website: string | null;
  affiliate_network: "awin" | "belboon" | "direkt" | "keins" | null;

  vendor_name: string | null;
  founded_year: number | null;
  vendor_hq: string | null;
  support_types: string[];
  countries_available: string[];
  languages: string[];

  overall_rating: number;
  ease_of_use_rating: number;
  value_for_money_rating: number;
  customer_service_rating: number;
  functionality_rating: number;
  review_count: number;
  /** where the shown rating comes from: published user reviews, or the Redaktionsnote while none exist */
  rating_source?: "nutzer" | "redaktion" | null;

  pros?: string[];
  cons?: string[];
  ideal_for?: string;

  /** Redaktionstest: written and scored by the editorial team, always labelled as such. */
  editorial?: EditorialReview | null;

  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;

  status: Status;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  software_id: string;
  reviewer_name: string;
  reviewer_job_title: string | null;
  reviewer_company: string | null;
  reviewer_industry: string | null;
  reviewer_company_size: string | null;
  reviewer_country: string;
  reviewer_city?: string | null;
  reviewer_legal_form: string | null;
  reviewer_avatar_url: string | null;
  verified_linkedin: boolean;
  verified_badge: string | null;
  used_for_duration: string | null;
  overall_rating: number;
  ease_of_use: number | null;
  value_for_money: number | null;
  customer_service: number | null;
  functionality: number | null;
  review_title: string;
  summary: string | null;
  pros: string | null;
  cons: string | null;
  vendor_response: string | null;
  vendor_response_date: string | null;
  review_date: string;
  helpful_count: number;
  status: ReviewStatus;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  category_tag: string | null;
  related_software_id: string | null;
  author_name: string;
  author_bio: string | null;
  author_avatar_url: string | null;
  author_title: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  read_time_minutes: number;
  status: Status;
  featured: boolean;
  published_date: string;
  updated_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  status: Status;
  requires_legal_review: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comparison {
  id: string;
  software_a_id: string;
  software_b_id: string;
  custom_verdict: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: Status;
  created_at: string;
}

export interface ComparisonWithSoftware extends Comparison {
  a: Software;
  b: Software;
  slug: string;
}

export type SiteSettings = Record<string, string>;

export interface SiteStats {
  reviews: number;
  software: number;
  categories: number;
  /** products with a published Redaktionelle Bewertung */
  editorial: number;
}

export type SoftwareSort = "reviews" | "rating" | "recent" | "price_asc";

export interface SoftwareFilters {
  categoryId?: string;
  minRating?: number;
  freeTrial?: boolean;
  freeVersion?: boolean;
  paidOnly?: boolean;
  hostingLocation?: HostingLocation;
  datevInterface?: DatevInterface | "any";
  gobdCompliant?: boolean;
  eInvoicing?: string;
  germanSupport?: boolean;
  dpaAvailable?: boolean;
  maxPrice?: number;
  /** USER_BUCKETS key: klein | mittel | gross — products where ≥ 30 % of reviews come from that bucket */
  companySize?: string;
  sort?: SoftwareSort;
  page?: number;
  perPage?: number;
}

export interface ReviewFilters {
  country?: string;
  industry?: string;
  companySize?: string;
  legalForm?: string;
  duration?: string;
  rating?: number;
  sort?: "helpful" | "recent" | "rating_desc" | "rating_asc";
  page?: number;
  perPage?: number;
}

export type SearchSoftwareHit = Pick<
  Software,
  "id" | "name" | "slug" | "tagline" | "brand_color" | "logo_url" | "overall_rating" | "review_count"
> & { category_name: string | null };

export interface SearchResult {
  software: SearchSoftwareHit[];
  articles: Pick<Article, "id" | "title" | "slug" | "excerpt" | "category_tag">[];
  categories: Pick<Category, "id" | "name" | "slug">[];
}
