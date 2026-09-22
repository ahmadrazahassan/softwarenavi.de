// Builds supabase/seed/*.sql from the authored dataset in lib/data (the single source for seed content).
// Usage: node scripts/export-seed.mjs
// References are resolved by slug inside SQL, so the database keeps generating its own UUIDs.
import { createJiti } from "jiti";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, { alias: { "@": root }, interopDefault: true });
const data = await jiti.import(path.join(root, "lib/data/index.ts"));
const { CATEGORY_SEED } = await jiti.import(path.join(root, "lib/data/categories.ts"));

const q = (v) => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "null";
  return `'${String(v).replace(/'/g, "''")}'`;
};
const j = (v) => `${q(JSON.stringify(v ?? []))}::jsonb`;

const catSlug = new Map(CATEGORY_SEED.map((c) => [c.id, c.slug]));
const swSlug = new Map(data.SOFTWARE.map((s) => [s.id, s.slug]));
const catRef = (id) => (id && catSlug.get(id) ? `(select id from public.categories where slug = ${q(catSlug.get(id))})` : "null");
const swRef = (id) => `(select id from public.software where slug = ${q(swSlug.get(id))})`;

const out = path.join(root, "supabase", "seed");
mkdirSync(out, { recursive: true });

// ── categories ──
const cats = CATEGORY_SEED.map(
  (c) =>
    `(${q(c.name)}, ${q(c.slug)}, ${q(c.icon)}, ${q(c.description)}, ${q(c.display_order)})`,
).join(",\n");
writeFileSync(
  path.join(out, "01_categories.sql"),
  `insert into public.categories (name, slug, icon, description, display_order) values\n${cats}\non conflict (slug) do update set name = excluded.name, icon = excluded.icon, description = excluded.description, display_order = excluded.display_order;\n`,
);

// ── software (split in chunks so each statement stays small) ──
const cols = [
  "name", "slug", "tagline", "description_short", "description_full", "logo_url", "category_id",
  "starting_price", "price_currency", "billing_period", "price_is_net", "price_unit", "free_trial", "trial_days",
  "free_version", "free_demo", "pricing_plans", "pricing_note", "features", "top_features", "integrations", "pros", "cons",
  "ideal_for", "brand_color", "gobd_compliant", "datev_interface", "e_invoicing", "elster_submission", "hosting_location",
  "dpa_available", "iso27001", "tse_certified", "skr_support", "german_support", "vendor_country", "compliance_checked_at",
  "affiliate_url", "vendor_website", "affiliate_network", "vendor_name", "founded_year", "vendor_hq", "support_types",
  "countries_available", "languages", "editorial_rating", "editorial_ease", "editorial_value", "editorial_service",
  "editorial_functionality", "editorial_verdict", "editorial_review", "editorial_author", "editorial_tested_at",
  "status", "featured",
];
const row = (s) => {
  const e = s.editorial ?? {};
  return `(${[
    q(s.name), q(s.slug), q(s.tagline), q(s.description_short), q(s.description_full),
    q(s.logo_url && s.logo_url.startsWith("http") ? s.logo_url : null), catRef(s.category_id),
    q(s.starting_price), q(s.price_currency), q(s.billing_period), q(s.price_is_net), q(s.price_unit), q(s.free_trial), q(s.trial_days),
    q(s.free_version), q(s.free_demo ?? false), j(s.pricing_plans), q(s.pricing_note), j(s.features), j(s.top_features), j(s.integrations),
    j(s.pros), j(s.cons), q(s.ideal_for), q(s.brand_color), q(s.gobd_compliant), q(s.datev_interface), j(s.e_invoicing),
    q(s.elster_submission), q(s.hosting_location), q(s.dpa_available), q(s.iso27001), q(s.tse_certified), j(s.skr_support),
    q(s.german_support), q(s.vendor_country), q(s.compliance_checked_at), q(s.affiliate_url), q(s.vendor_website),
    q(s.affiliate_network ?? "keins"), q(s.vendor_name), q(s.founded_year), q(s.vendor_hq), j(s.support_types),
    j(s.countries_available), j(s.languages), q(e.rating), q(e.ease), q(e.value), q(e.service), q(e.functionality),
    q(e.verdict), q(e.body), q(e.author), q(e.tested_at), q("published"), q(s.featured),
  ].join(", ")})`;
};
const update = cols.filter((c) => c !== "slug").map((c) => `${c} = excluded.${c}`).join(", ");
const chunk = 8;
for (let i = 0; i < data.SOFTWARE.length; i += chunk) {
  const part = data.SOFTWARE.slice(i, i + chunk);
  writeFileSync(
    path.join(out, `02_software_${String(i / chunk + 1).padStart(2, "0")}.sql`),
    `insert into public.software (${cols.join(", ")}) values\n${part.map(row).join(",\n")}\non conflict (slug) do update set ${update};\n`,
  );
}

// ── comparisons + alternatives ──
const cmp = data.COMPARISONS.map(
  (c) => `(${swRef(c.software_a_id)}, ${swRef(c.software_b_id)}, ${q(c.custom_verdict)}, 'published')`,
).join(",\n");
const alts = Object.entries(data.ALTERNATIVES).flatMap(([sid, list]) =>
  list.map((aid, i) => `(${swRef(sid)}, ${swRef(aid)}, ${i})`),
);
writeFileSync(
  path.join(out, "03_relations.sql"),
  `insert into public.comparisons (software_a_id, software_b_id, custom_verdict, status) values\n${cmp}\non conflict (software_a_id, software_b_id) do update set custom_verdict = excluded.custom_verdict;\n\n` +
    (alts.length
      ? `insert into public.software_alternatives (software_id, alternative_id, display_order) values\n${alts.join(",\n")}\non conflict (software_id, alternative_id) do update set display_order = excluded.display_order;\n`
      : ""),
);

// ── articles ──
const art = data.ARTICLES.map(
  (a) =>
    `(${[
      q(a.title), q(a.slug), q(a.excerpt), q(a.content), q(a.featured_image_url), q(a.category_tag),
      a.related_software_id && swSlug.get(a.related_software_id) ? swRef(a.related_software_id) : "null",
      q(a.author_name), q(a.author_bio), q(a.author_title), q(a.meta_title), q(a.meta_description), q(a.read_time_minutes),
      q(a.status), q(a.featured), q(a.published_date), q(a.updated_date),
    ].join(", ")})`,
).join(",\n");
writeFileSync(
  path.join(out, "04_articles.sql"),
  `insert into public.articles (title, slug, excerpt, content, featured_image_url, category_tag, related_software_id, author_name, author_bio, author_title, meta_title, meta_description, read_time_minutes, status, featured, published_date, updated_date) values\n${art}\non conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, related_software_id = excluded.related_software_id, updated_date = excluded.updated_date, status = excluded.status;\n`,
);

// ── pages ──
const pages = data.PAGES.map(
  (p) => `(${q(p.slug)}, ${q(p.title)}, ${q(p.content)}, ${q(p.meta_title)}, ${q(p.meta_description)}, ${q(p.status)})`,
).join(",\n");
writeFileSync(
  path.join(out, "05_pages.sql"),
  `insert into public.pages (slug, title, content, meta_title, meta_description, status) values\n${pages}\non conflict (slug) do update set title = excluded.title, content = excluded.content, meta_title = excluded.meta_title, meta_description = excluded.meta_description;\n`,
);

console.log(`software: ${data.SOFTWARE.length}, categories: ${CATEGORY_SEED.length}, comparisons: ${data.COMPARISONS.length}, articles: ${data.ARTICLES.length}, pages: ${data.PAGES.length}`);
