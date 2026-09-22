# Backend Build Prompt — **Softwarenavi** (Germany Edition)

> **Role for the AI receiving this prompt:** You are a senior backend engineer. Build the **complete data
> layer, server logic and admin CMS** for an independent business-software review and comparison platform
> for the **German market**. This document specifies the Postgres schema, Row Level Security, triggers,
> storage, Supabase access layers, server actions, route handlers, the admin panel, migrations, seed data
> and the DSGVO data architecture. The companion `PROMPT_FRONTEND_GERMANY.md` describes the UI that consumes
> this data — read it too.
>
> **Prime directive:** Same architecture and data contracts as the reference build (Stack Match, UK), but
> every data-level market signal — default currency, text-search configuration, tax terminology, reviewer
> geography, pricing, compliance fields, retention rules — must be **German**. Beyond localisation, Germany
> adds real obligations the reference build does not carry: **DSGVO** (EU hosting, Auftragsverarbeitung,
> Löschkonzept, Rechenschaftspflicht), **TDDDG § 25** consent logging, and a stricter double-opt-in
> newsletter regime. Build those in from the start; they are not a retrofit.
>
> **Language directive:** Schema, columns, functions, types and code stay **English**. Seeded *content* and
> all admin-UI labels are **German**. Formal `Sie` in every user-facing string.

Brand: **Softwarenavi** · domain `softwarenavi.de` · contact `hallo@softwarenavi.de`.

---

## 1. Architecture

- **Runtime:** Next.js 16 App Router (server components, server actions, route handlers) + Supabase
  (PostgreSQL, RLS, Storage, Auth). TypeScript throughout.
- **Trust boundary:**
  - *Public reads* — browser and server components read **published** rows through an anon client
    constrained by RLS.
  - *Privileged writes* — review submission, newsletter signup, contact messages, consent logging,
    affiliate-click logging and **all** admin mutations run server-side (server actions / route handlers)
    with a **service-role** client that is never shipped to the browser.
- **Aggregates by trigger:** product star ratings and review counts are recomputed by a database trigger
  whenever reviews change, so read paths stay trivial and always consistent. Never write an aggregate by hand.
- **Single-admin auth model:** any authenticated Supabase user is *the* admin. Public sign-ups disabled;
  create exactly one account. RLS: anon reads published content, `authenticated` has full access.

### 1.1 🇩🇪 Hosting & data residency — decide this before you create the project

**The Supabase project must be created in an EU region — `eu-central-1` (Frankfurt).** This is not a
preference. The site stores reviewer names, e-mail addresses, IP-derived hashes and consent records, and it
will publish a Datenschutzerklärung naming its processors. Getting the region wrong means a third-country
transfer you then have to justify under Art. 44 ff. DSGVO, and you cannot change a Supabase project's region
after creation — only migrate to a new project.

Checklist:
- Supabase project region **`eu-central-1` (Frankfurt)**; verify in the dashboard before seeding.
- Sign Supabase's **DPA / Auftragsverarbeitungsvertrag (Art. 28 DSGVO)** and file it.
- Same for the hosting platform (Vercel: choose an EU function region, `fra1`, and sign their DPA) and the
  transactional-mail provider — prefer an EU sender (Brevo, Mailjet EU, Postmark EU, or self-hosted SMTP).
- Maintain a **Verzeichnis von Verarbeitungstätigkeiten (VVT, Art. 30 DSGVO)** listing: website visitors,
  review submitters, newsletter subscribers, contact-form senders, admin users. One markdown file in the
  repo is sufficient to start; it must exist.
- Storage buckets are in the same region by construction — do not add a non-EU CDN in front of them.

### 1.2 Supabase client modules (`lib/supabase/`)
- `client.ts` — browser client (anon key).
- `server.ts` — server-component client, cookies via `@supabase/ssr`.
- `public.ts` — `createPublicClient()` + `isSupabaseConfigured()`; used by read fetchers, degrades gracefully.
- `admin.ts` — service-role client, **server-only** (`import "server-only"` at the top of the file).
- `queries.ts` — all public read fetchers (§6).

### 1.3 Environment variables (`.env.local`)

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | project URL (EU project) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | RLS-constrained public key |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | **server-only**, never `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | yes | canonical URL; fallback `https://softwarenavi.de` |
| `IP_HASH_SALT` | yes | server-only pepper for all IP hashing (§5.1). Rotate quarterly. |
| `SMTP_*` / `MAIL_API_KEY` | yes | EU transactional mail for double opt-in + contact |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | no | self-hosted Plausible/Matomo host; loaded only after consent |

Node utility/migration scripts load `.env.local` with a small hand-rolled parser and instantiate a
service-role client with `{ auth: { persistSession: false, autoRefreshToken: false } }`.

---

## 2. Database schema (Postgres / Supabase SQL)

Enable `uuid-ossp` and `unaccent`. **German defaults and German-specific columns are in bold.**

### 2.1 `categories`
`id uuid pk default uuid_generate_v4()`, `name text not null`, `slug text unique not null`, `icon text`,
`description text`, `software_count int default 0`, `display_order int default 0`,
`created_at timestamptz default now()`.

### 2.2 `software`

**Identity:** `id uuid pk`, `name text not null`, `slug text unique not null`, `tagline text`,
`description_short text not null`, `description_full text not null`, `logo_url text`,
`screenshots jsonb default '[]'`, `category_id uuid references categories(id)`.

**Pricing:** `starting_price numeric`, **`price_currency text default 'EUR'`**,
`billing_period text default 'month'`, **`price_is_net boolean default true`**,
**`price_unit text default 'account'` — one of `account` | `user` | `employee` | `client` | `once`**
(German products routinely price per *Mitarbeiter* or per *Mandant*; the UI needs to know which),
`free_trial boolean default false`, `free_version boolean default false`,
`pricing_plans jsonb default '[]'`.

**Features:** `features jsonb default '[]'`, `top_features jsonb default '[]'`,
`integrations jsonb default '[]'`, `brand_color text`.

**🇩🇪 German compliance block — new, and the reason this site beats a translated UK clone.**
Every field is nullable so an unknown value renders as „keine Angabe" rather than a false claim:

```sql
gobd_compliant        TEXT CHECK (gobd_compliant IN ('ja','teilweise','nein')),
datev_interface       TEXT CHECK (datev_interface IN ('vollintegriert','export','nein')),
e_invoicing           JSONB DEFAULT '[]',   -- ['XRechnung','ZUGFeRD','Peppol']
elster_submission     BOOLEAN,              -- UStVA/LStA direct from the product
hosting_location      TEXT CHECK (hosting_location IN ('Deutschland','EU','Drittland','on-premise')),
dpa_available         BOOLEAN,              -- AV-Vertrag nach Art. 28 DSGVO
iso27001              BOOLEAN,
tse_certified         BOOLEAN,              -- KassenSichV, only meaningful for POS-adjacent products
skr_support           JSONB DEFAULT '[]',   -- ['SKR03','SKR04']
german_support        BOOLEAN,              -- deutschsprachiger Support
vendor_country        TEXT,                 -- 'Deutschland' | 'Österreich' | 'USA' | …
compliance_checked_at DATE                  -- drives the „zuletzt geprüft am" footnote
```

**Affiliate:** `affiliate_url text`, `vendor_website text`, `affiliate_network text` (`awin` | `belboon` |
`direkt` | `keins`).

**Vendor:** `vendor_name text`, `founded_year int`, `vendor_hq text`, `support_types jsonb default '[]'`,
`countries_available jsonb default '[]'`, `languages jsonb default '[]'`.

**Ratings (trigger-maintained, never written by hand):** `overall_rating numeric(3,1) default 0`,
`ease_of_use_rating`, `value_for_money_rating`, `customer_service_rating`, `functionality_rating`
(all `numeric(3,1) default 0`), `review_count int default 0`.

**SEO:** `meta_title text`, `meta_description text`, `og_image_url text`.

**Status:** `status text default 'draft' check (status in ('published','draft'))`,
`featured boolean default false`, `created_at timestamptz default now()`,
`updated_at timestamptz default now()`.

**🇩🇪 Search — use the `german` configuration, not `english`:**
```sql
search_vector TSVECTOR GENERATED ALWAYS AS (
  to_tsvector('german',
    coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' ||
    coalesce(description_short,'') || ' ' || coalesce(vendor_name,'')
  )
) STORED
```
This matters more than it looks. The `german` dictionary stems German inflection (`Rechnungen` → `rechnung`)
and, crucially, **decompounds** German compound nouns, so a search for `Lohn` finds `Lohnabrechnung` and
`Buchhaltung` finds `Buchhaltungssoftware`. With `english` it finds neither. Also add a trigram index for
typo-tolerant vendor-name lookup:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_software_search ON software USING GIN (search_vector);
CREATE INDEX idx_software_name_trgm ON software USING GIN (name gin_trgm_ops);
CREATE INDEX idx_software_category ON software (category_id) WHERE status = 'published';
CREATE INDEX idx_software_status ON software (status);
CREATE INDEX idx_software_hosting ON software (hosting_location) WHERE status = 'published';
CREATE INDEX idx_software_datev ON software (datev_interface) WHERE status = 'published';
```

### 2.3 `reviews`
`id uuid pk`, `software_id uuid references software(id) on delete cascade`.

**Reviewer:** `reviewer_name text not null`, `reviewer_job_title text`, `reviewer_company text`,
`reviewer_industry text`, `reviewer_company_size text`, **`reviewer_country text default 'Deutschland'`**,
**`reviewer_legal_form text`** (`GmbH`, `UG (haftungsbeschränkt)`, `GbR`, `Einzelunternehmen`, `e. K.`,
`GmbH & Co. KG`, `AG`, `Freiberuflich`, `Verein`, `Sonstige` — a genuinely useful German facet),
`reviewer_avatar_url text`, `verified_linkedin boolean default false`, `verified_badge text`.

**Usage:** `used_for_duration text`.

**Ratings:** `overall_rating int not null check (overall_rating between 1 and 5)`, plus `ease_of_use`,
`value_for_money`, `customer_service`, `functionality`, each `int check (… between 1 and 5)`.

**Content:** `review_title text not null`, `summary text`, `pros text`, `cons text`.

**Vendor response:** `vendor_response text`, `vendor_response_date date`.

**Meta:** `review_date date not null default current_date`, `helpful_count int default 0`,
`status text default 'pending' check (status in ('pending','published','hidden'))`,
`created_at timestamptz default now()`.

> **Note the changed default:** the reference build publishes reviews immediately. For Germany, default to
> **`pending`** and moderate before publication. Under UWG § 5b Abs. 3 a platform that publishes consumer
> reviews must state whether and how it verifies that they come from real users — and if you state that you
> verify them, you must actually do it. Unmoderated auto-publish makes the `/redaktionelle-grundsaetze`
> page a false statement. The ratings trigger only counts `status = 'published'` rows, so pending reviews
> never move an aggregate.

**🇩🇪 Consent trail** (Art. 7 Abs. 1 DSGVO Nachweispflicht):
`consent_given boolean not null default false`, `consent_text_version text`,
`consent_ip_hash text`, `consent_at timestamptz`.

Indexes: `(software_id) where status='published'`, `(review_date desc)`, `(status)`.

### 2.4 `articles`
`id`, `title text not null`, `slug text unique not null`, `excerpt text`, `content text not null`,
`featured_image_url`, `category_tag`, `related_software_id uuid references software(id) on delete set null`,
author block (`author_name text not null`, `author_bio`, `author_avatar_url`, `author_title`),
SEO block (`meta_title`, `meta_description`, `og_image_url`), `read_time_minutes int default 5`,
`status`, `featured`, `published_date date`, `updated_date date` (German readers and Google both want a
visible „zuletzt aktualisiert"), timestamps, and
`search_vector` over `title || excerpt` using **`to_tsvector('german', …)`** with a GIN index.

### 2.5 `software_alternatives`
`id`, `software_id`, `alternative_id` (both fk → `software`, cascade), `display_order int default 0`,
`unique(software_id, alternative_id)`.

### 2.6 `comparisons`
`id`, `software_a_id`, `software_b_id` (fk → `software`, cascade), `custom_verdict text`, SEO block,
`status text default 'published'`, `created_at`. Slug is derived (`{a.slug}-vs-{b.slug}`), not stored.

### 2.7 `affiliate_clicks`
`id`, `software_id uuid references software(id) on delete set null`, `software_name text`,
`affiliate_url text`, `clicked_at timestamptz default now()`, **`ip_hash text`** (never a raw IP),
`user_agent text`, `referrer text`, `country_code text`.
Indexes on `(software_id, clicked_at desc)` and `(clicked_at desc)`.
**No anon or authenticated writes — service role only.**

### 2.8 `site_settings`
`id`, `key text unique not null`, `value text`, `updated_at timestamptz default now()`.
Seed keys (German values):
```
site_name        = 'Softwarenavi'
tagline          = 'Deutschlands unabhängiges Vergleichsportal für Unternehmenssoftware'
footer_tagline   = 'Unabhängige Bewertungen und Vergleiche der besten Unternehmenssoftware für den deutschen Mittelstand.'
footer_text      = 'Softwarenavi hilft deutschen Unternehmen, die passende Software zu finden — mit verifizierten Bewertungen und unabhängigen Vergleichen.'
contact_email    = 'hallo@softwarenavi.de'
editorial_email  = 'hallo@softwarenavi.de'
contact_phone    = ''
contact_city     = 'Berlin, Deutschland'
social_linkedin  = ''
social_xing      = ''
social_twitter   = ''
social_facebook  = ''
years_active     = '1'
items_per_page   = '12'
analytics_domain = ''
vat_rate_standard = '19'
vat_rate_reduced  = '7'
```

### 2.9 Added by later migrations (build them natively)
- **`pages`** — editable static pages: `slug unique`, `title`, `content`, SEO block, `status`, timestamps.
  Seeded with the full German legal suite (§8.5).
- **`audit_log`** — `table_name`, `record_id`, `action`, `actor`, `changed_at`, `diff jsonb`. Populated by
  triggers on `software`, `reviews`, `articles`, `pages`, `site_settings`. This doubles as part of the
  DSGVO Rechenschaftspflicht.
- **`redirects`** — `from_path unique`, `to_path`, `status_code int default 301`, `active boolean`.
- **`media_library`** — `bucket`, `path`, `filename`, `mime_type`, `size_bytes`, `alt_text`, `uploaded_at`.
- **`newsletter_subscribers`** — §5.3.
- **`contact_messages`** — §5.4.
- **`consent_log`** — §5.6.

---

## 3. Triggers & functions

1. **`update_software_ratings()`** — `AFTER INSERT OR UPDATE OR DELETE ON reviews FOR EACH ROW`.
   Recomputes the five averaged ratings (`ROUND(AVG(...)::numeric, 1)`, `status='published'` only) and
   `review_count` for `COALESCE(NEW.software_id, OLD.software_id)`, and stamps `updated_at = NOW()`.
   Returns `COALESCE(NEW, OLD)` so DELETE works. `COALESCE(..., 0)` on every aggregate so the last deleted
   review resets the product to zero rather than NULL.
2. **`update_category_counts()`** — `AFTER INSERT OR UPDATE OF category_id, status OR DELETE ON software`.
   Keeps `categories.software_count` in sync with published software across **both** the old and the new
   category.
3. **`set_updated_at()`** — `BEFORE UPDATE` on `software`, `articles`, `pages`; sets `NEW.updated_at = NOW()`.
4. **`write_audit_log()`** — `AFTER INSERT/UPDATE/DELETE` on the audited tables; writes a row to `audit_log`
   with `to_jsonb(NEW)`/`to_jsonb(OLD)` diff and `auth.uid()` as actor.
5. **`purge_expired_personal_data()`** — a callable function (run nightly via `pg_cron` or a Vercel cron
   route) implementing the Löschkonzept in §9.

---

## 4. Row Level Security & Storage

Enable RLS on **every** table. Policies:

**Public read (anon):**
- `categories` — all rows
- `software` — `status = 'published'`
- `reviews` — `status = 'published'`
- `articles` — `status = 'published'`
- `software_alternatives` — all rows
- `comparisons` — `status = 'published'`
- `pages` — `status = 'published'`
- `site_settings` — all rows

**No anon read at all** on: `affiliate_clicks`, `newsletter_subscribers`, `contact_messages`,
`consent_log`, `audit_log`, `media_library`, `redirects`. These hold personal data; they are written by
the service role and read only by the admin.

**Admin (`authenticated`):** `FOR ALL USING (TRUE) WITH CHECK (TRUE)` on `categories`, `software`,
`reviews`, `articles`, `software_alternatives`, `comparisons`, `pages`, `site_settings`, `redirects`,
`media_library`. **Read-only (`FOR SELECT`)** on `affiliate_clicks`, `consent_log` and `audit_log` —
these are evidentiary records; an admin who can rewrite them defeats the point. Newsletter and contact
tables get `SELECT` + `UPDATE`(status) + `DELETE` for the admin, so Auskunfts- and Löschungsanfragen can
be served from the panel.

**Storage buckets** (public read, authenticated write): `logos`, `screenshots`, `avatars`, `articles`.
Policies: public `SELECT` on those buckets; `authenticated` `INSERT` / `UPDATE` / `DELETE`.
Reviewer avatars: prefer generated initial-tiles over uploaded photos — an uploaded face is biometric-adjacent
personal data you then have to justify keeping.

---

## 5. Server actions & route handlers

### 5.1 Affiliate click tracking — `app/api/track-click/route.ts`
Service-role client. Looks up `software (id, name, affiliate_url, vendor_website)`;
destination = `affiliate_url || vendor_website`; if neither exists, redirect to the profile page rather
than erroring. Inserts an `affiliate_clicks` row with:
- **`ip_hash`** = `sha256(ip + IP_HASH_SALT)` truncated — **never store or log a raw IP.** A raw IP is
  personal data under DSGVO; a salted hash with a rotating pepper is defensible as pseudonymised.
- `user_agent`, `referrer`, `country_code` (from the platform geo header), `clicked_at`.
Then `redirect(destination, 307)`.
This is the **single source of truth for affiliate URLs** — the frontend never hardcodes a vendor link.
Route is `noindex` and disallowed in `robots.ts`.

### 5.2 Review submission — `app/(public)/software/[slug]/bewertungen/neu/actions.ts`
Server action. Validates (title 5–120 chars, summary ≤ 2.000, rating 1–5 on each dimension, honeypot field,
per-IP-hash rate limit of 3/hour), then inserts a `reviews` row with:
- `reviewer_country` defaulting to **`'Deutschland'`**,
- **`status = 'pending'`** (moderated, per §2.3),
- `consent_given`, `consent_text_version`, `consent_ip_hash`, `consent_at` filled from the submitted
  consent checkbox — reject the submission outright if `consent_given` is false.
Returns a German success message: „Vielen Dank — Ihre Bewertung wird geprüft und in der Regel innerhalb von
zwei Werktagen veröffentlicht." Do **not** claim instant publication.

### 5.3 Newsletter — `app/(public)/newsletter/actions.ts`

Table `newsletter_subscribers`:
`id`, `email citext not null unique`, `status text default 'pending' check (status in ('pending','confirmed','unsubscribed'))`,
`interests text[] default '{}'`, `confirm_token text unique`, `confirm_token_expires_at timestamptz`,
`confirmed_at timestamptz`, `unsubscribed_at timestamptz`, `consent_ip_hash text`,
`consent_source text`, `consent_text_version text`, `user_agent text`, `created_at timestamptz default now()`.

**Double opt-in is mandatory in Germany** — single opt-in is not defensible and is routinely abgemahnt.
Flow:
1. Signup writes a `pending` row with a random `confirm_token`, a **48-hour** expiry, the hashed consent IP,
   the source page and the version string of the consent text shown.
2. A confirmation mail goes out immediately: „Bitte bestätigen Sie Ihre Anmeldung zum Softwarenavi-Newsletter"
   with a single confirm link. No content, no marketing, no tracking pixel in this mail.
3. `/newsletter/bestaetigen?token=…` verifies the token, sets `status='confirmed'`, `confirmed_at=now()`,
   and clears the token.
4. Unconfirmed rows are **deleted** after 48 hours by the purge job — an unconfirmed address is data you have
   no legal basis to keep.
5. Every mail carries a one-click Abmelde-Link to `/newsletter/abmelden?token=…`; unsubscribing sets
   `status='unsubscribed'` and `unsubscribed_at`, keeping only the address hash needed to honour the
   objection (§9).
Compliance copy references **DSGVO** and **UWG § 7 Abs. 2 Nr. 3** — never UK GDPR or PECR.

### 5.4 Contact — `app/(public)/kontakt/actions.ts`
Table `contact_messages`: `id`, `name`, `email`, `subject`, `message`, `consent_given boolean not null`,
`consent_ip_hash`, `user_agent`, `status text default 'neu' check (status in ('neu','beantwortet','archiviert'))`,
`created_at`. Server action with length caps (name ≤ 120, subject ≤ 160, message ≤ 4.000), a honeypot,
a per-IP-hash rate limit, and a required consent checkbox. Persists the row **and** forwards it to
`contact_email`. Retention: 6 months after `status='beantwortet'`, then purged (§9).

### 5.5 Static pages
`getPageBySlug(slug)` backs `/impressum`, `/datenschutz`, `/cookie-richtlinie`, `/agb`,
`/affiliate-hinweis`, `/redaktionelle-grundsaetze`, `/barrierefreiheit` from the `pages` table, so the
operator can complete them without a deploy. Ship each one seeded with a **complete German draft plus a
visible „Bitte vor Veröffentlichung durch die Rechtsberatung prüfen" banner** the operator must remove.
`/impressum` additionally renders `status='draft'` with a loud placeholder if the operator's address fields
are still empty — an incomplete Impressum is worse than an obviously unfinished one.

### 5.6 Consent logging — `app/api/consent/route.ts`
Table `consent_log`: `id`, `consent_id text` (the random id stored in the `sl_consent` cookie),
`categories jsonb` (`{"notwendig":true,"statistik":false,"externe_medien":false}`), `action text`
(`granted` | `denied` | `updated` | `withdrawn`), `policy_version text`, `ip_hash text`,
`user_agent text`, `created_at timestamptz default now()`.

Art. 7 Abs. 1 DSGVO puts the burden of proof on you: you must be able to demonstrate *that* and *for what*
a given user consented. Log every banner interaction server-side with the hashed IP and the version of the
consent text — not the user's identity. Retention: 3 years, then purge. The frontend must be able to read
the current state back so the „Cookie-Einstellungen" dialog opens pre-filled.

### 5.7 Admin auth — `app/(admin)/admin/actions.ts` + `lib/hooks/useAuth.ts`
Supabase e-mail/password login at `/admin/login`; middleware guards every `(admin)` route and redirects
unauthenticated requests. Login form in German („E-Mail-Adresse", „Passwort", „Anmelden"), placeholder
`hallo@softwarenavi.de`. Disable public sign-up in the Supabase dashboard.

### 5.8 Search — `app/api/search/route.ts`
Full-text over `software` + `articles` with
`textSearch('search_vector', q, { type: 'websearch', config: 'german' })`, falling back to a
`pg_trgm` similarity query on `name` when the tsquery returns nothing (catches typos and vendor names the
German dictionary mangles). Cap at 8 results per type. Debounced from the `cmdk` overlay.

---

## 6. Public read fetchers (`lib/supabase/queries.ts`)

Every fetcher wrapped in `safe(fallback, fn)` — returns the fallback if Supabase is unconfigured or throws,
so the site always builds. Include expand/contract-safe column probing: attempt the full column set, and on
Postgres error **`42703`** (undefined column) retry with a base set. This must cover `brand_color`,
`integrations` **and the entire compliance block** so a half-applied migration never white-screens a page.

```
getCategories(limit?)                     getCategoryBySlug(slug)
getFeaturedSoftware(limit)                getTopRatedSoftware(limit)
getRecentlyUpdatedSoftware(limit)         getSoftwareBySlug(slug)
getSoftwareList(filters)                  getReviewsForSoftware(id, filters)
getRatingDistribution(id)                 getAlternatives(id, limit)
getCategoryPeers(id, categoryId, limit)   getComparisonRecord(aId, bId)
getPublishedComparisons()                 getArticles(page, perPage)
getArticleBySlug(slug)                    getLatestArticles(limit)
getPageBySlug(slug)                       getSiteStats()
searchContent(query)                      getSiteSettings()
```

`getSoftwareList(filters)` accepts — and this is where the German facets land:
`categoryId`, `minRating`, `freeTrial`, `freeVersion`, `paidOnly`, **`hostingLocation`**,
**`datevInterface`**, **`gobdCompliant`**, **`eInvoicing`** (array-contains), **`germanSupport`**,
`sort` (`reviews` | `rating` | `recent` | `price_asc`), `page`, `perPage` → `{ items, total }`.

`getReviewsForSoftware(id, filters)` accepts `country`, `industry`, `companySize`, **`legalForm`**,
`duration`, `sort` (`helpful` | `recent`), `page`, `perPage`.

`getSiteStats()` → `{ reviews, software, categories }`.

Shared domain types live in `lib/types.ts`: `Category`, `Software` (including the compliance fields as an
optional block so the probe fallback type-checks), `PricingPlan`, `Review`, `Article`, `Page`, `Comparison`,
`AffiliateClick`, `SiteSetting`, `NewsletterSubscriber`, `ContactMessage`, `ConsentLogEntry`, and the
`Status` / `ReviewStatus` unions. `ReviewStatus` is now `"pending" | "published" | "hidden"`.

---

## 7. Admin CMS (`app/(admin)/admin/(panel)/`)

Authenticated, single-admin. Navy sidebar from the `--sidebar` tokens (`#132238`).
**All admin UI labels in German**, formal `Sie`. Full CRUD per resource: a TanStack-Table list
(`components/admin/DataTable`) plus a form.

| Route | German label | Notes |
| --- | --- | --- |
| `/admin` | Übersicht | stat tiles + Recharts; counts via `formatCount` (`de-DE`) |
| `/admin/software` | Software | see below |
| `/admin/reviews` | Bewertungen | **moderation queue first**: default filter `status = 'pending'`, with „Freigeben" / „Ablehnen" bulk actions. This is the most-used screen on a German review site. |
| `/admin/categories` | Kategorien | inline `CategoriesManager` |
| `/admin/comparisons` | Vergleiche | `ComparisonForm` + `SoftwareCombobox` |
| `/admin/articles` | Ratgeber | `ArticleForm` with Tiptap `RichTextEditor` |
| `/admin/pages` | Seiten | `PageForm` — the legal suite lives here |
| `/admin/newsletter` | Newsletter | stats, status control, CSV export, **DSGVO-Löschung** per subscriber |
| `/admin/contact` | Nachrichten | contact inbox, status workflow, delete |
| `/admin/consent` | Einwilligungen | read-only consent log, filterable by date and policy version |
| `/admin/analytics` | Auswertung | affiliate-click charts, top products, referrers |
| `/admin/settings` | Einstellungen | `SettingsForm` over `site_settings` |

**Software form** — pricing-plan editor, `TagInput` for features/top-features/integrations, `brand_color`
picker, SEO block, screenshots via `ImageUploader`, status/featured toggles, and a dedicated
**„Compliance & Datenschutz" fieldset** for the §2.2 German block with a `compliance_checked_at` date
picker. Currency dropdown **`["EUR", "CHF", "USD", "GBP"]` default `EUR`**; a `price_is_net` switch
labelled „Preise sind Nettopreise (zzgl. MwSt.)" defaulting to **on**; `price_unit` select
(„pro Konto" / „pro Nutzer" / „pro Mitarbeitenden" / „pro Mandant" / „einmalig");
country placeholder „z. B. Deutschland".

**Review form** — `StarSelector` per dimension; country dropdown default **`Deutschland`**, pool
**`["Deutschland","Österreich","Schweiz","Luxemburg","Sonstige"]`**; company-size pool
**`["1–9","10–49","50–249","250–499","500+"]`**; legal-form and industry pools per frontend §8.3;
status select `Ausstehend / Veröffentlicht / Ausgeblendet`.

Shared admin components: `AdminHeader`, `ConfirmDialog`, `DataTable`, `ImageUploader`, `RichTextEditor`,
`SoftwareCombobox`, `StarSelector`, `StatusBadge`, `TagInput`. All dialog copy in German
(„Wirklich löschen?", „Diese Aktion kann nicht rückgängig gemacht werden.", „Abbrechen", „Löschen").

---

## 8. Migrations & seed (apply in order, each idempotent)

1. `migrations.sql` — extensions, core schema (with **German** `to_tsvector` and EUR/Deutschland defaults),
   triggers, RLS, storage buckets, default `site_settings`.
2. `migration_002_pages_and_settings.sql` — `pages` + extra settings keys.
3. `migration_003_enterprise_additions.sql` — `audit_log`, `redirects`, `media_library`.
4. `migration_004_software_brand_color.sql` — `brand_color` + `integrations`.
5. `migration_005_newsletter.sql` — `newsletter_subscribers` with the double-opt-in consent trail.
6. **`migration_006_de_compliance_fields.sql`** — the German compliance block on `software`
   (§2.2) plus its indexes.
7. **`migration_007_de_software_roster.sql`** — the German product roster (§8.2), categories,
   alternatives and comparisons.
8. `migration_008_contact_messages.sql` — contact inbox.
9. **`migration_009_consent_log.sql`** — TDDDG consent logging.
10. **`migration_010_data_retention.sql`** — `purge_expired_personal_data()` and its schedule (§9).

Idempotency throughout: `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`,
`INSERT … ON CONFLICT (slug) DO UPDATE`, `DROP POLICY IF EXISTS` before `CREATE POLICY`. Every migration
must be safe to re-run. Seeded demo reviewers are suffixed `(Demo)` so real content is distinguishable.

### 8.1 Categories (seed, German)

| slug | name | Beschreibung |
| --- | --- | --- |
| `buchhaltungssoftware` | Buchhaltungssoftware | Buchhaltung, Rechnungsstellung, Umsatzsteuer-Voranmeldung und Auswertungen — GoBD-konform und mit DATEV-Schnittstelle. |
| `lohnabrechnung` | Lohnabrechnung | Entgeltabrechnung, Lohnsteueranmeldung, DEÜV-Meldungen und Lohnsteuerbescheinigungen für deutsche Arbeitgeber. |
| `hr-software` | HR-Software | Personalverwaltung, Abwesenheiten, Onboarding und digitale Personalakte — DSGVO-konform. |
| `crm-software` | CRM-Software | Kontakte, Leads, Angebote und Vertriebsprozesse für den deutschen Mittelstand. |
| `erp-warenwirtschaft` | ERP & Warenwirtschaft | Warenwirtschaft, Einkauf, Produktion und Finanzen in einem System. |
| `projektmanagement` | Projektmanagement | Aufgaben, Zeitpläne und Auslastung im Team — inklusive Anbieter mit Serverstandort in Deutschland. |
| `zeiterfassung` | Zeiterfassung | Arbeitszeiterfassung nach dem BAG-Beschluss: mobil, manipulationssicher und auswertbar. |
| `dokumentenmanagement` | Dokumentenmanagement | Revisionssichere Archivierung nach GoBD, Belegablage und Freigabeprozesse. |

### 8.2 Product roster (German market) — with real EUR list pricing

> **Pricing guidance.** All figures below are **net (zzgl. MwSt.)** German list prices as researched in
> **August 2026** and are seed values, not gospel. German SaaS pricing changes at least annually — Sage,
> for example, raised Sage 50 / Sage 100 / Sage HR Suite by 5,9 % on 01.01.2026 — and long-term contracts,
> introductory offers and Mandanten-Staffeln move the effective price a lot. **Verify each price against
> the vendor's own German pricing page before publishing, and set `compliance_checked_at` to the date you
> checked.** Never convert a GBP or USD figure; use the published German price or record `NULL` and show
> „Preis auf Anfrage".

**Buchhaltungssoftware**

| Produkt | Anbieter | ab (netto) | Einheit | Kernsignale |
| --- | --- | --- | --- | --- |
| DATEV Unternehmen online | DATEV eG (Nürnberg, Genossenschaft) | Preis auf Anfrage / über die Kanzlei | pro Mandant | Der De-facto-Standard: rund 40.000 Steuerkanzleien arbeiten mit DATEV. `datev_interface='vollintegriert'`, `gobd='ja'`, `hosting='Deutschland'` |
| Lexware Office | Haufe-Lexware (Freiburg) | ab **7,90 €**/Monat (Paket S); M ≈ 12,90–13,90 €; L ≈ 19,90–21,90 € | pro Konto | EÜR, UStVA via ELSTER, Kassenbuch, Anlagenverwaltung ab Paket L; DATEV-Export; deutscher Serverstandort |
| sevdesk | sevdesk GmbH (Offenburg) | Rechnung **12,90 €**, Buchhaltung **17,90 €**, Warenwirtschaft **32,90 €**/Monat; ab ca. 9 € im 2-Jahres-Abo | pro Konto | GoBD-konform, DATEV-Export, E-Rechnung, deutscher Serverstandort |
| Sage Active | Sage GmbH (Frankfurt) | Starter **25,00 €**, Essentials **49,00 €**/Monat | pro Konto | Essentials umfasst Lohn & HR |
| Sage 50 Connected | Sage GmbH | auf Anfrage (Lizenz + Wartung) | pro Arbeitsplatz | Lokal installiert, ZUGFeRD-Ausgangsrechnungen, Warenwirtschaft + FiBu |
| BuchhaltungsButler | BuchhaltungsButler GmbH (Berlin) | ab ca. 15 €/Monat | pro Konto | Automatisierte Belegzuordnung, DATEV-Export |
| FastBill | FastBill GmbH (Frankfurt) | ab ca. 9 €/Monat | pro Konto | Rechnungen + Belegerfassung, DATEV-Export |
| Papierkram | Papierkram GmbH (Osnabrück) | kostenlose Version + ab ca. 8 €/Monat | pro Konto | Freiberufler und Kleinunternehmen, Projektzeiterfassung integriert |
| easybill | easybill GmbH (Sulingen) | ab ca. 9 €/Monat | pro Konto | E-Commerce-Anbindungen, GoBD |
| Scopevisio | Scopevisio AG (Bonn) | auf Anfrage | pro Nutzer | Cloud-ERP mit FiBu für den Mittelstand |
| Pennylane | Pennylane (DE-Niederlassung) | auf Anfrage | pro Mandant | Kanzlei-zentrierte Plattform, DATEV-Anbindung |
| Candis | Candis GmbH (Berlin) | auf Anfrage | pro Konto | Rechnungsfreigabe / AP-Automation, DATEV-Export |

**Lohnabrechnung**

| Produkt | Anbieter | ab (netto) | Einheit | Kernsignale |
| --- | --- | --- | --- | --- |
| DATEV Lohn und Gehalt | DATEV eG | über die Kanzlei | pro Abrechnung | Marktstandard, ELStAM, DEÜV, Beitragsnachweise |
| DATEV LODAS | DATEV eG | über die Kanzlei | pro Abrechnung | Für komplexe Abrechnungen und Lohnbüros |
| Lexware lohn+gehalt | Haufe-Lexware | ab ca. 15 €/Monat | pro Mandant | Für die eigene Lohnbuchhaltung im KMU |
| Sage Lohnabrechnung | Sage GmbH | auf Anfrage | pro Mitarbeitenden | Online-Abrechnung mit automatisierten Meldungen |
| edlohn | eurodata AG (Saarbrücken) | auf Anfrage | pro Abrechnung | Weit verbreitet bei Lohnbüros und Kanzleien |
| Personio (vorbereitende Lohnabrechnung) | Personio SE (München) | ab ca. 8–15 € | pro Mitarbeitenden/Monat | Übergabe per DATEV-Schnittstelle an die Kanzlei |
| Paychex Deutschland | Paychex Deutschland GmbH | auf Anfrage | pro Abrechnung | Outsourcing-Modell |

**HR-Software**

| Produkt | ab (netto) | Einheit | Hinweise |
| --- | --- | --- | --- |
| Personio | ab ca. 94,05 € (5 Mitarbeitende); ca. **8–15 €** | pro Mitarbeitenden/Monat | Marktführer im DACH-Mittelstand, Listenpreise nur auf Anfrage |
| HRworks | ca. **6–12 €** | pro Mitarbeitenden/Monat | Stark ab ca. 20 Mitarbeitenden, Reisekosten integriert |
| Sage HR Suite | ab ca. **4,50 €** | pro Mitarbeitenden/Monat | Modularer Baukasten |
| rexx systems | auf Anfrage | pro Modul | Oberer Mittelstand und Konzerne |
| Factorial · Kenjo · softgarden | auf Anfrage | pro Mitarbeitenden/Monat | Recruiting-Schwerpunkt bei softgarden |

> Personio, HRworks und rexx systems decken zusammen über 70 % der Neuinstallationen im deutschsprachigen
> Mittelstand ab — das ist die Aussage, um die herum die Kategorieseite geschrieben wird.

**CRM:** HubSpot · Salesforce · Pipedrive · Zoho CRM · **CentralStationCRM** (DE) · **CAS genesisWorld**
(DE, Karlsruhe) · Microsoft Dynamics 365 Sales.
**ERP / Warenwirtschaft:** SAP Business One · Microsoft Dynamics 365 Business Central · **weclapp**
(DE, ISO 27001, redundant in Deutschland gehostet) · **Xentral** (DE, Augsburg) · Odoo · Sage 100 ·
myfactory · Haufe X360.
**Projektmanagement:** **awork** (Hamburg) · **factro** (Bochum) · **Stackfield** (München) ·
**OpenProject** (Berlin, Open Source) · **InLoox** (München) · MeisterTask · monday.com · Asana.
**Zeiterfassung:** clockodo · Papershift · ZEP · TimeTac · Crewmeister.
**DMS:** DocuWare · d.velop documents · ecoDMS · ELO.

**Two products the reference build features that must NOT be seeded as German accounting options:**
- **QuickBooks** — Intuit never localised it for Germany: no German UI, no native DATEV export, no GoBD
  certification, no ZUGFeRD/XRechnung support, and Intuit has signalled that this will not change.
- **Xero** — no German localisation and no German payroll.
Both may appear only inside an editorial „Warum QuickBooks und Xero in Deutschland kaum eine Rolle spielen"
article. Seeding them as viable options destroys the site's credibility with exactly the audience it needs.

For every seeded product set: `price_currency='EUR'`, `price_is_net=true`, the correct `price_unit`,
`countries_available` led by `Deutschland`, `languages` including `Deutsch`, `vendor_country`,
`vendor_hq`, the full compliance block, and `description_full` / `description_short` written in **German**
using the real vocabulary — GoBD, ELSTER, UStVA, DATEV-Schnittstelle, SKR 03/04, E-Rechnung, ZUGFeRD,
XRechnung, ELStAM, DEÜV, Lohnsteueranmeldung, Kleinunternehmerregelung.

### 8.3 Reviews (seed)
Authentically German reviewer identities: names common across Germany, cities (München, Hamburg, Köln,
Frankfurt am Main, Stuttgart, Düsseldorf, Leipzig, Nürnberg, Bremen, Dortmund, Hannover, Essen), and
Mittelstand company forms (`… GmbH`, `… GmbH & Co. KG`, `… UG (haftungsbeschränkt)`, `… e. K.`).
Review bodies must reference the actual daily work of German finance and HR teams: die UStVA bis zum 10.,
der Abgleich mit der Steuerkanzlei über DATEV, GoBD-konforme Belegablage, ELStAM-Abruf, DEÜV-Meldungen,
Beitragsnachweise, die Umstellung auf die E-Rechnung, SKR 04.
`reviewer_country` mostly `Deutschland` with a minority `Österreich` / `Schweiz`.
Seed reviews at `status='published'` (they are demo content), but leave the column default at `'pending'`
so real submissions queue for moderation. **Never hardcode aggregate ratings — the trigger derives them.**

### 8.4 Articles (seed, German Ratgeber)
- „Buchhaltungssoftware für kleine Unternehmen: Worauf es 2026 wirklich ankommt"
- „sevdesk, Lexware Office oder DATEV — welche Lösung passt zu Ihrem Unternehmen?"
- „E-Rechnungspflicht: Was ab 2027 und 2028 auf Ihr Unternehmen zukommt"
- „GoBD in der Praxis: Verfahrensdokumentation, Aufbewahrungsfristen und typische Fehler"
- „Lohnabrechnung selbst machen oder an die Kanzlei geben? Eine Entscheidungshilfe"
- „DATEV-Schnittstelle: Warum sie bei der Softwareauswahl den Ausschlag gibt"
- „Arbeitszeiterfassung: Was der BAG-Beschluss für Ihre Softwareauswahl bedeutet"
- „HR-Software und Betriebsrat: Mitbestimmung nach § 87 BetrVG richtig einplanen"
- „Serverstandort Deutschland: Wann er zählt — und wann EU-Hosting genügt"
- „Kleinunternehmerregelung nach § 19 UStG: Welche Software reicht aus?"

Each with a German `author_name`, an `author_title` („Fachredaktion Buchhaltung"), a real
`published_date`, an `updated_date`, and `related_software_id` set.

### 8.5 Legal pages (seed into `pages`, German, marked for legal review)
`impressum`, `datenschutz`, `cookie-richtlinie`, `agb`, `affiliate-hinweis`,
`redaktionelle-grundsaetze`, `barrierefreiheit`. Content requirements are specified in the frontend doc §10.
Seed each with a complete, usable German draft **and** the „Bitte vor Veröffentlichung durch die
Rechtsberatung prüfen" banner. The Impressum draft carries `{{PLATZHALTER}}` tokens for the operator's
name, address, Handelsregister number, USt-IdNr. and the § 18 Abs. 2 MStV responsible person.

---

## 9. 🇩🇪 Löschkonzept — data retention (Art. 5 Abs. 1 lit. e DSGVO)

Storage limitation is an obligation, not a nicety, and „wir speichern alles für immer" is the most common
finding in a German data-protection audit. Implement `purge_expired_personal_data()` and run it nightly:

| Data | Retention | Action on expiry |
| --- | --- | --- |
| `newsletter_subscribers` where `status='pending'` | 48 hours | **DELETE** — no confirmed consent, no legal basis |
| `newsletter_subscribers` where `status='unsubscribed'` | keep only `email` hash + `unsubscribed_at` | anonymise the row; retain the hash on a suppression list to honour the objection |
| `newsletter_subscribers` where `status='confirmed'` | until unsubscribe | retain the consent trail for 3 years after unsubscribe as proof (Art. 7 Abs. 1) |
| `contact_messages` | 6 months after `status='beantwortet'` | DELETE |
| `reviews` where `status='pending'` and untouched | 90 days | DELETE (not published, not moderated → drop it) |
| `reviews` published | indefinite — but pseudonymised | store display name only; no e-mail, no raw IP |
| `affiliate_clicks` | 14 months | DELETE (aggregate into a monthly rollup table first if analytics need history) |
| `consent_log` | 3 years | DELETE |
| `audit_log` | 3 years | DELETE |
| Server/access logs | 7 days | platform-level configuration |

Also implement the **Betroffenenrechte** as admin actions, because a manual SQL console is not an
acceptable process:
- **Auskunft (Art. 15)** — an admin action that exports everything held for a given e-mail address across
  `reviews`, `newsletter_subscribers`, `contact_messages` and `consent_log` as JSON.
- **Löschung (Art. 17)** — one action that anonymises or deletes the same set, logged to `audit_log`.
- **Widerspruch (Art. 21)** — the newsletter suppression list above.
Both must complete within one month of the request; build them now rather than when the first request lands.

---

## 10. Terminology scrub map (data layer)

If you migrate the existing UK dataset rather than seeding fresh, run `scrubUKtoDE(text)` over every text
field — `description_full`, `description_short`, `tagline`, `meta_title`, `meta_description`, article
`title`/`excerpt`/`content`, `custom_verdict`, `pricing_plans[].features`, `features`, `top_features`,
category descriptions and `site_settings` values.

| Replace (UK) | With (DE) |
| --- | --- |
| HM Revenue and Customs / HMRC | Finanzamt / Bundeszentralamt für Steuern; Portal: **ELSTER** |
| Making Tax Digital / MTD-ready | **ELSTER-Übermittlung** / **E-Rechnung (§ 14 UStG)** |
| VAT return(s) | **Umsatzsteuer-Voranmeldung (UStVA)** |
| VAT at 20 % / 5 % | **Umsatzsteuer 19 %** / **7 %** |
| RTI (and year end) | **Lohnsteueranmeldung** und **DEÜV-Meldungen** |
| National Insurance (NI) | **Sozialversicherungsbeiträge** (KV/PV/RV/AV) |
| the Apprenticeship Levy | **Umlage U1/U2/U3**, Berufsgenossenschaft |
| P60(s) / P45 | **Lohnsteuerbescheinigung(en)** / **Arbeitsbescheinigung** |
| PAYE | **Lohnsteuerabzugsverfahren (ELStAM)** |
| pension auto-enrolment | **betriebliche Altersvorsorge (bAV)** |
| Companies House | **Handelsregister** |
| ICO | **BfDI** / Landesdatenschutzbehörden |
| UK GDPR / PECR / Data Protection Act 2018 | **DSGVO** / **TDDDG** / **BDSG** |
| CIS (Construction Industry Scheme) | **Bauabzugsteuer (§ 48 EStG)** |
| chart of accounts | **Kontenrahmen SKR 03 / SKR 04** |
| year-end accounts | **Jahresabschluss** (HGB) bzw. **EÜR** |
| bookkeeping compliance | **GoBD** |
| accountant | **Steuerberaterin / Steuerberater** |
| the United Kingdom / UK / British | **Deutschland / DE / deutsch** |
| in the UK / based in the UK / across the UK | **in Deutschland / mit Sitz in Deutschland / bundesweit** |
| GBP / the pound / pound-based | **EUR / der Euro / in Euro** |
| London, United Kingdom | **Berlin, Deutschland** |
| stackmatch.uk / hello@stackmatch.uk | **softwarenavi.de / hallo@softwarenavi.de** |
| en-GB / en_GB | **de-DE / de_DE** |
| Stack Match | **Softwarenavi** |

Also flip at the column level:
- `price_currency` `'GBP'` → `'EUR'`, **and reprice `starting_price` + `pricing_plans` from German list
  prices** — a currency relabel is not a localisation.
- `price_is_net` → `true` for every B2B product.
- `reviewer_country` UK/Ireland pool → **DACH pool**, default `'Deutschland'`.
- `reviewer_company_size` UK buckets → **EU KMU buckets** (`1–9`, `10–49`, `50–249`, `250–499`, `500+`).
- `search_vector` regenerated with `to_tsvector('german', …)` — you must **drop and recreate** the
  generated column, an `ALTER` will not change the expression.
- `site_settings` tagline, footer, contact, city.
- Every `description_full` rewritten, not translated: a machine translation of British VAT copy reads as
  foreign to a German finance manager within one sentence, and that is the whole credibility of the site.

---

## 11. Acceptance checklist

- [ ] Supabase project is in **`eu-central-1` (Frankfurt)**; DPAs signed with Supabase, the host and the
      mail provider; a VVT file exists in the repo.
- [ ] Schema, triggers, RLS and storage buckets created; `price_currency` defaults to **`EUR`**,
      `price_is_net` to **`true`**, `reviewer_country` to **`Deutschland`**, `reviews.status` to
      **`pending`**.
- [ ] `search_vector` on `software` **and** `articles` uses `to_tsvector('german', …)`; `pg_trgm` fallback
      in place. Verify that searching `Lohn` returns `Lohnabrechnung` products and `Buchhaltung` returns
      `Buchhaltungssoftware`.
- [ ] The German compliance block exists on `software`, is filterable in `getSoftwareList`, and every
      fetcher survives its absence via the `42703` probe.
- [ ] Ratings and category counts are trigger-maintained, never hardcoded; DELETE recomputes correctly and
      resets to 0 when the last review goes.
- [ ] Public reads are RLS-limited to published rows; `affiliate_clicks`, `newsletter_subscribers`,
      `contact_messages`, `consent_log` and `audit_log` have **no anon policy at all**.
- [ ] `/api/track-click` stores a salted **hash** of the IP — a raw IP appears nowhere in the database or
      in any log — and redirects to `affiliate_url || vendor_website`.
- [ ] Newsletter is **double opt-in** with a 48-hour token, a full consent trail (`ip_hash`,
      `consent_text_version`, source, timestamp) and one-click unsubscribe; unconfirmed rows are purged.
- [ ] Consent events are logged server-side to `consent_log` with the policy version — Art. 7 Abs. 1
      Nachweispflicht is satisfiable on demand.
- [ ] `purge_expired_personal_data()` exists, is scheduled, and each retention rule in §9 is implemented.
- [ ] Auskunft- and Löschungs-Aktionen exist in the admin panel and are audit-logged.
- [ ] Review moderation queue works: `pending` is the default admin filter, aggregates only count
      `published`, and the public copy honestly describes the moderation process.
- [ ] Seeded categories, German product roster with **real EUR net pricing**, German reviewer identities,
      German Ratgeber articles, and the full German legal page suite are present.
- [ ] `site_settings` tagline, footer, contact and city reflect Germany and `softwarenavi.de`.
- [ ] QuickBooks and Xero are not seeded as German accounting options.
- [ ] **Zero** UK data signals remain: no HMRC / Making Tax Digital / „VAT return" / RTI / National
      Insurance / P60 / ICO / PECR / GBP / „United Kingdom" / London / `stackmatch.uk` / `en-GB`.
- [ ] Every read fetcher degrades gracefully when Supabase is unconfigured; the site builds with an empty
      `.env.local`.
- [ ] Every migration is idempotent and has been re-run twice against a seeded database without error.

**Deliver the backend to match the reference platform's architecture and data contracts exactly — the
market is Germany, and the DSGVO/TDDDG obligations in §1.1, §5.6 and §9 are part of the build, not a
follow-up ticket.**

---

## Sources consulted for the German market research

- [sevdesk — Buchhaltungssoftware-Vergleich 2026](https://sevdesk.de/ratgeber/buchhaltung-finanzen/rechnung-buchhaltung-programme/buchhaltungssoftware-vergleich/)
- [buchhaltungssoftware-test.de — Lexware Office Preise](https://buchhaltungssoftware-test.de/lexware-office.html)
- [gruenderkonten.de — sevDesk Erfahrungen, Preise 2026](https://gruenderkonten.de/sevdesk-erfahrungen/)
- [OMR Reviews — Sage Active Preise 2026](https://omr.com/en/reviews/product/sage-active/pricing)
- [Sage Business Software — Preisanpassung zum 01.01.2026](https://sage-software.desk-firm.de/blog/preisanpassung-bei-bestandsvertraegen-zum-01-01-2026/)
- [taxmaro — Lohnabrechnung-Software 2026, DATEV-Schnittstelle und Preise](https://www.taxmaro.com/post/lohnabrechnung-software)
- [find-your-software.de — HR-System Kosten 2026](https://find-your-software.de/software-kategorien/hr-software/hr-system-kosten-2026-was-hr-software-wirklich-kostet/)
- [trusted.de — Personio Kosten 2026](https://trusted.de/personio-hr-betriebssystem-kosten)
- [e-rechnungen.org — E-Rechnungspflicht: Fristen 2025, 2027, 2028](https://www.e-rechnungen.org/e-rechnung-pflicht-fristen)
- [IHK Darmstadt — E-Rechnung (B2B) seit 2025](https://www.ihk.de/darmstadt/produktmarken/recht-und-fair-play/steuerinfo/bmf-plant-verpflichtende-erechnung-und-meldesystem-5784882)
- [IT-Recht Kanzlei — Impressum nach dem DDG](https://www.it-recht-kanzlei.de/eroeffnen-onlineshop-impressum.html)
- [eRecht24 — Impressumspflicht: rechtssichere Pflichtangaben](https://www.e-recht24.de/artikel/datenschutz/209.html)
- [eRecht24 — Barrierefreiheitsstärkungsgesetz (BFSG)](https://www.e-recht24.de/ecommerce/13236-barrierefreiheitsstaerkungsgesetz.html)
- [Cortina Consult — TDDDG: Cookie-Einwilligung, § 25 & Bußgelder](https://cortina-consult.com/web-compliance/wissen/tdddg/)
- [openproject.org — Projektmanagement-Software mit Servern in der EU](https://www.openproject.org/blog/pm-software-germany/)
- [InvoiceLeaf — Die besten QuickBooks-Alternativen in Europa (2026)](https://invoiceleaf.com/de/blog/beste-quickbooks-alternativen-europa/)
- [Projecter — Affiliate-Netzwerke in Europa](https://www.projecter.de/blog/affiliate-marketing/affiliate-netzwerke-in-europa/)
