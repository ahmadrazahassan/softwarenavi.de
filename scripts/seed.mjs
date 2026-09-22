// Seeds (or re-syncs) Supabase from the authored dataset in lib/data.
// Idempotent: every table is upserted on its natural key (slug / pair), nothing is deleted.
// Usage: node scripts/seed.mjs            (reads .env / .env.local for the service-role key)
import { createJiti } from "jiti";
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Small hand-rolled .env parser (spec §1.3): later files win, real env vars win over files.
const env = {};
for (const f of [".env", ".env.local"]) {
  const p = path.join(root, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}
const get = (k) => process.env[k] ?? env[k];
const url = get("NEXT_PUBLIC_SUPABASE_URL");
const key = get("SUPABASE_SERVICE_ROLE_KEY");
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY werden benötigt.");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const jiti = createJiti(import.meta.url, { alias: { "@": root }, interopDefault: true });
const data = await jiti.import(path.join(root, "lib/data/index.ts"));
const { CATEGORY_SEED } = await jiti.import(path.join(root, "lib/data/categories.ts"));

const must = async (label, p) => {
  const { data: rows, error } = await p;
  if (error) throw new Error(`${label}: ${error.message}`);
  return rows;
};

// ── categories ──
await must(
  "categories",
  db.from("categories").upsert(
    CATEGORY_SEED.map(({ name, slug, icon, description, display_order }) => ({ name, slug, icon, description, display_order })),
    { onConflict: "slug" },
  ),
);
const cats = await must("categories read", db.from("categories").select("id, slug"));
const catId = new Map(CATEGORY_SEED.map((c) => [c.id, cats.find((x) => x.slug === c.slug)?.id ?? null]));

// ── software ──
const swRows = data.SOFTWARE.map((s) => {
  const e = s.editorial ?? {};
  return {
    name: s.name,
    slug: s.slug,
    tagline: s.tagline,
    description_short: s.description_short,
    description_full: s.description_full,
    // Only absolute URLs belong in the DB; bundled /logos/* paths are resolved by the app.
    logo_url: s.logo_url && /^https?:\/\//.test(s.logo_url) ? s.logo_url : null,
    category_id: catId.get(s.category_id) ?? null,
    starting_price: s.starting_price,
    price_currency: s.price_currency,
    billing_period: s.billing_period,
    price_is_net: s.price_is_net,
    price_unit: s.price_unit,
    free_trial: s.free_trial,
    trial_days: s.trial_days ?? null,
    free_version: s.free_version,
    free_demo: s.free_demo ?? false,
    pricing_plans: s.pricing_plans,
    pricing_note: s.pricing_note ?? null,
    features: s.features,
    top_features: s.top_features,
    integrations: s.integrations,
    pros: s.pros ?? [],
    cons: s.cons ?? [],
    ideal_for: s.ideal_for ?? null,
    brand_color: s.brand_color,
    gobd_compliant: s.gobd_compliant ?? null,
    datev_interface: s.datev_interface ?? null,
    e_invoicing: s.e_invoicing ?? [],
    elster_submission: s.elster_submission ?? null,
    hosting_location: s.hosting_location ?? null,
    dpa_available: s.dpa_available ?? null,
    iso27001: s.iso27001 ?? null,
    tse_certified: s.tse_certified ?? null,
    skr_support: s.skr_support ?? [],
    german_support: s.german_support ?? null,
    vendor_country: s.vendor_country ?? null,
    compliance_checked_at: s.compliance_checked_at ?? null,
    affiliate_url: s.affiliate_url,
    vendor_website: s.vendor_website,
    affiliate_network: s.affiliate_network ?? "keins",
    vendor_name: s.vendor_name,
    founded_year: s.founded_year,
    vendor_hq: s.vendor_hq,
    support_types: s.support_types,
    countries_available: s.countries_available,
    languages: s.languages,
    editorial_rating: e.rating ?? null,
    editorial_ease: e.ease ?? null,
    editorial_value: e.value ?? null,
    editorial_service: e.service ?? null,
    editorial_functionality: e.functionality ?? null,
    editorial_verdict: e.verdict ?? null,
    editorial_review: e.body ?? null,
    editorial_author: e.author ?? null,
    editorial_tested_at: e.tested_at ?? null,
    status: "published",
    featured: s.featured,
  };
});
await must("software", db.from("software").upsert(swRows, { onConflict: "slug" }));
const sw = await must("software read", db.from("software").select("id, slug"));
const swId = new Map(data.SOFTWARE.map((s) => [s.id, sw.find((x) => x.slug === s.slug)?.id]));

// ── comparisons & alternatives ──
const cmpRows = data.COMPARISONS.map((c) => ({
  software_a_id: swId.get(c.software_a_id),
  software_b_id: swId.get(c.software_b_id),
  custom_verdict: c.custom_verdict,
  status: "published",
})).filter((c) => c.software_a_id && c.software_b_id);
await must("comparisons", db.from("comparisons").upsert(cmpRows, { onConflict: "software_a_id,software_b_id" }));

const altRows = Object.entries(data.ALTERNATIVES).flatMap(([sid, list]) =>
  list.map((aid, i) => ({ software_id: swId.get(sid), alternative_id: swId.get(aid), display_order: i })),
).filter((a) => a.software_id && a.alternative_id);
if (altRows.length) await must("alternatives", db.from("software_alternatives").upsert(altRows, { onConflict: "software_id,alternative_id" }));

// ── articles & pages ──
const artRows = data.ARTICLES.map((a) => ({
  title: a.title,
  slug: a.slug,
  excerpt: a.excerpt,
  content: a.content,
  featured_image_url: a.featured_image_url,
  category_tag: a.category_tag,
  related_software_id: a.related_software_id ? swId.get(a.related_software_id) ?? null : null,
  author_name: a.author_name,
  author_bio: a.author_bio,
  author_title: a.author_title,
  meta_title: a.meta_title,
  meta_description: a.meta_description,
  read_time_minutes: a.read_time_minutes,
  status: a.status,
  featured: a.featured,
  published_date: a.published_date,
  updated_date: a.updated_date,
}));
await must("articles", db.from("articles").upsert(artRows, { onConflict: "slug" }));

await must(
  "pages",
  db.from("pages").upsert(
    data.PAGES.map(({ slug, title, content, meta_title, meta_description, status }) => ({ slug, title, content, meta_title, meta_description, status })),
    { onConflict: "slug" },
  ),
);

console.log(
  `Seed ok: ${swRows.length} Programme, ${CATEGORY_SEED.length} Kategorien, ${cmpRows.length} Vergleiche, ${altRows.length} Alternativen, ${artRows.length} Ratgeber, ${data.PAGES.length} Seiten.`,
);
