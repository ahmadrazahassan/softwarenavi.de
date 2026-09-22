# Frontend Build Prompt — **Softwarenavi** (Germany Edition)

> **Role for the AI receiving this prompt:** You are a senior full-stack engineer and product designer.
> Build the **complete public-facing frontend** of an independent business-software review and comparison
> platform for the **German market (DACH-focused, Germany-first)**, in the **German language**. This document
> is the single source of truth for the UI: brand, stack, design tokens, fonts, colours, layout system,
> component inventory, route map, German copy and market localisation.
> A companion document, `PROMPT_BACKEND_GERMANY.md`, specifies the database, server logic and data model —
> read it too, because every page consumes that data.
>
> **Prime directive:** Reproduce the design, structure and quality of the reference platform (Stack Match, UK)
> *pixel-for-pixel in spirit* — same layout system, same component anatomy, same motion, same polish. But every
> market signal — language, currency, tax terminology, geography, compliance, legal pages, reviewer identities,
> product roster, pricing — must be **German, not British**. Where this document names a UK artefact, it is
> telling you what to replace, never what to keep.
>
> **Language directive:** The entire user-facing site is in **German**. Not translated-English German —
> *native* German written for German business readers. Code, identifiers, comments, file names, component
> names and database columns stay in **English**. Only user-facing strings, routes/slugs and content are German.

---

## 0. Brand identity

| | |
| --- | --- |
| **Name** | **Softwarenavi** |
| **Wordmark** | `Software` in ink, `lotse` in brand teal — one word, no space, no camel-case in prose |
| **Domain** | `softwarenavi.de` (canonical, `https://`, no `www`) |
| **Contact** | `hallo@softwarenavi.de`, `hallo@softwarenavi.de`, `hallo@softwarenavi.de` |
| **Tagline** | „Deutschlands unabhängiges Vergleichsportal für Unternehmenssoftware." |
| **Short tagline (nav/OG)** | „Unabhängige Software-Vergleiche für den Mittelstand" |
| **Claim under the logo** | „Unabhängig. Geprüft. Deutsch." |
| **Legal seat (Impressum)** | Berlin or Hamburg — the operator fills the real address; the build must render it |

**Why the name works:** *Lotse* = pilot/navigator (Hafenlotse, Fluglotse) — a licensed expert who comes aboard
and steers you safely through unfamiliar water, then leaves. It is warm, sober, unmistakably German, and it
signals exactly the promise of the product: independent guidance, not sales. It also gives the whole design
system a coherent motif — **compass, bearing, channel markers, sounding depth** — which replaces the reference
site's generic floating 3D blobs with something ownable.

**Alternative names** (if the operator rejects Softwarenavi — pick one and apply it consistently everywhere):
`Kontorwerk` (kontorwerk.de) · `Prüfstand Software` (pruefstand.software) · `Klarsicht Software` (klarsicht-software.de)

**Voice:** independent, expert, plain-spoken, sober, precise. German business readers reward specificity and
punish hype. No exclamation marks. No „revolutionär", „genial", „einfach WOW". Do write „GoBD-konform",
„DATEV-Schnittstelle vorhanden", „Serverstandort Frankfurt" — concrete facts are the tone.

**Address form: „Sie" throughout.** Formal `Sie` on every public page, every form label, every error message,
every button, every legal page, every email. Never `du`. This is not optional — `du` reads as a consumer
startup and destroys credibility with the Mittelstand finance/HR audience.

---

## 1. Product overview

Softwarenavi is a server-rendered directory of business software for German companies — Buchhaltung,
Lohnabrechnung, HR, CRM, ERP/Warenwirtschaft, Projektmanagement, Zeiterfassung and Dokumentenmanagement.
Each product has a rich profile page with pricing tiers (in **Euro, netto**), features, integrations,
screenshots, aggregated star ratings, German compliance badges, and verified user reviews. The site also
offers side-by-side comparisons, an editorial Ratgeber (guides), a newsletter, a complete German legal suite
and outbound affiliate-tracked vendor links.

Two route groups in one codebase:

- **`(public)`** — the marketing + directory site, in German (this document).
- **`(admin)`** — an authenticated CMS (covered in the backend document).

**Audience:** Geschäftsführer, Kaufmännische Leitung, Buchhaltung, Personalabteilung, Steuerfachangestellte and
IT-Verantwortliche at German KMU (1–250 employees), plus Steuerberater advising them.

---

## 2. Technology stack (use these exact versions/idioms)

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack, React Server Components by default) |
| Language | **TypeScript** (strict) |
| UI runtime | **React 19** |
| Styling | **Tailwind CSS v4** with CSS design tokens declared in `app/globals.css` (`@theme inline`) |
| Component primitives | **Radix UI** + shadcn-style components in `components/ui` |
| Data + auth | **Supabase** (Postgres, RLS, Storage, Auth) via `@supabase/ssr` and `@supabase/supabase-js` — **EU region (Frankfurt) is mandatory**, see backend doc |
| Data grids (admin) | **TanStack Table** |
| Charts | **Recharts** |
| Rich text (admin) | **Tiptap** |
| Toasts | **Sonner** |
| Icons | **Lucide** + in-house SVG brand marks |
| Carousels | **embla-carousel-react** |
| Lightbox | **yet-another-react-lightbox** |
| Command palette | **cmdk** |
| Theming | **next-themes** (class-based dark mode) |
| Analytics | **self-hosted Plausible or Matomo** — see §11.3. **Do not ship Vercel Analytics or GA without a consent gate.** |

Server components + server actions are the default. Client components only where interactivity requires it
(`"use client"`). Never expose the Supabase service-role key to the browser.

**IMPORTANT — this is not the Next.js in your training data.** Next 16 has breaking changes. Consult
`node_modules/next/dist/docs/` before writing routing/metadata/caching code. `params`/`searchParams` in pages
are async (**await them**). Use `export const revalidate = <seconds>` for ISR.

---

## 3. Design system

### 3.1 Fonts (Google Fonts via `next/font/google`, loaded in `app/layout.tsx`)

| Font | CSS variable | Role |
| --- | --- | --- |
| **DM Sans** (400/500/700) | `--font-dm-sans` | Primary body/UI sans (`font-sans`) |
| **Inter** (400/500/600/700) | `--font-inter` | Fallback sans, secondary |
| **Inter Tight** (400–900) | `--font-inter-tight` | Headings (`font-heading`) |

All three must load `subsets: ["latin", "latin-ext"]` — **`latin-ext` is required** so `ä ö ü Ä Ö Ü ß`
render from the webfont and not a fallback. Verify every heading weight renders `ß` and `Ü` correctly.

Token wiring in `@theme inline`:
```css
--font-sans:    var(--font-dm-sans), var(--font-inter), sans-serif;
--font-heading: var(--font-inter-tight), var(--font-inter), sans-serif;
--font-mono:    ui-monospace, monospace;
```
All `h1–h6` use `font-family: var(--font-heading)`. Body uses `font-sans`. `html { scroll-behavior: smooth }`.

### 3.2 German typography rules (this section is load-bearing — the reference build has none of it)

German runs **15–25 % longer than English** and produces compound nouns like
`Umsatzsteuer-Voranmeldung`, `Lohnsteuerbescheinigung`, `Sozialversicherungsbeiträge`,
`Barrierefreiheitsstärkungsgesetz`. If you lay this out like English it will overflow every card, button
and table cell you build. Therefore:

```css
html { hyphens: auto; }               /* with lang="de" set, the browser hyphenates German correctly */
h1, h2, h3 { text-wrap: balance; hyphens: auto; }
p, li { overflow-wrap: break-word; }
.card-title, .nav-label, td, th { overflow-wrap: anywhere; }
```

- Set `<html lang="de">` — hyphenation and hyphenation dictionaries key off this. Without it `hyphens: auto`
  does nothing useful.
- Insert soft hyphens (`&shy;`) manually in the few brand-critical long words that still break badly
  (e.g. `Barriere&shy;freiheit`, `Doku&shy;menten&shy;management`).
- Where a compound is genuinely too long for a chip or tab, use the accepted German short form
  (`UStVA`, `LSt-Anmeldung`, `SV-Meldung`, `DMS`, `bAV`) — **not** an English word.
- **Every fixed-width or `whitespace-nowrap` element from the reference build must be re-checked.**
  Nav links, filter chips, card badges, table headers, stat labels, tab pills and buttons need ~20 % more
  horizontal room or must be allowed to wrap.
- **German quotation marks: „so" (U+201E … U+201C)**, not "so" and not «so». Nested: ‚so'.
- Non-breaking space (`&nbsp;` / U+00A0) between number and unit and before `€`: `1.234,56 €`,
  `19 %`, `12 Monate`, `§ 19 UStG`, `Abs. 1`. German typography always spaces the percent sign.
- Never break `z. B.`, `d. h.`, `u. a.`, `Nr. 5`, `S. 12` across lines — use `&nbsp;` inside them.
- Capitalise all nouns. Sentence-case headings — **do not Title Case German headings**, it is wrong.
- Use `ß` correctly (`Straße`, `Maß`, `außerdem`) but `ss` after short vowels (`dass`, `muss`). Never
  use `ss` as a global substitute for `ß`, and never use the Swiss convention.
- `–` (en dash, U+2013) for ranges and parentheticals; never `-` for a range. `10–49 Mitarbeitende`.

### 3.3 Colour tokens (light theme `:root`, plus a `.dark` variant)

Softwarenavi takes the reference build's token *architecture* verbatim and gives it a **maritime-navigator
identity** so it is not a visual clone of the UK site. Brand palette:

```css
--color-brand:       #0E7C86;  /* Lotsen-Petrol — primary. CTAs, active states, accents, links */
--color-brand-dark:  #0A626A;  /* hover / pressed */
--color-brand-light: #E6F4F5;  /* tinted surfaces, badge backgrounds */
--color-navy:        #132238;  /* Tiefsee — secondary, footer, admin sidebar, headings on light */
--color-amber:       #F5A623;  /* Leuchtfeuer — stars, highlights */
--color-amber-dark:  #E0941A;
--color-success:     #10B981;
--color-warning:     #F59E0B;
--color-error:       #EF4444;
--color-star:        #F5A623;
```

> **One-token swap:** if the operator prefers the reference green, set `--color-brand: #00A86B`,
> `--color-brand-dark: #008F5B`, `--color-brand-light: #E6F7F0` and change nothing else. The whole system
> is token-driven; no component hardcodes the accent except `LIST_CTA_COLOR` in the navbar, which must read
> from the same constant.

Semantic tokens (light):
`--background #ffffff`, `--foreground #111827`, `--card #ffffff`, `--card-foreground #111827`,
`--popover #ffffff`, `--popover-foreground #111827`, `--primary #0E7C86`, `--primary-foreground #ffffff`,
`--secondary #132238`, `--secondary-foreground #ffffff`, `--muted #f9fafb`, `--muted-foreground #6b7280`,
`--accent #f3f4f6`, `--accent-foreground #111827`, `--destructive #ef4444`, `--border #e5e7eb`,
`--input #e5e7eb`, `--ring #0E7C86`.

Charts: `--chart-1 #0E7C86`, `--chart-2 #132238`, `--chart-3 #F5A623`, `--chart-4 #10B981`, `--chart-5 #6B7280`.

Admin sidebar: `--sidebar #132238`, `--sidebar-foreground #e5e7eb`, `--sidebar-primary #0E7C86`,
`--sidebar-primary-foreground #ffffff`, `--sidebar-accent #1E3350`, `--sidebar-accent-foreground #ffffff`,
`--sidebar-border #1E3350`, `--sidebar-ring #0E7C86`.

Radius scale from `--radius: 0.5rem`:
`sm ×0.6`, `md ×0.8`, `lg ×1`, `xl ×1.4`, `2xl ×1.8`, `3xl ×2.2`, `4xl ×2.6`.

### 3.4 Per-product brand accent

Each software product carries its own accent colour (`software.brand_color`, hex). Resolution precedence,
implemented in `lib/brandColors.ts` as `brandColorFor({ slug, brand_color }, fallback?)`:

1. admin-set `brand_color` column,
2. hardcoded slug→colour map,
3. site brand teal (`DEFAULT_BRAND_COLOR = "#0E7C86"`).

Re-key the hardcoded map to the German roster (§9). Where a vendor's exact hex is not certain, **sample it
from the vendor's own logo SVG** rather than guessing — a wrong brand colour on a product page is the kind of
detail German readers notice.

The accent drives: the sticky `ProfileNav` active pill, the pricing "Beliebteste Wahl" card border and badge,
the affiliate CTA, the radar chart series, rating bars, and the profile hero glow.

### 3.5 Motion & signature styling (carry these over exactly)

- `--animate-float` / `--animate-float-delayed`: gentle 6 s / 8 s `translateY(±12px) rotate(±3deg)` loop on
  decorative hero shapes. For Softwarenavi the shapes are **navigation objects** — a compass rose, a channel
  buoy, a sounding weight, a folded chart — rendered as soft 3D PNGs, not generic blobs.
- `.reveal-on-scroll`: scroll-driven reveal via `animation-timeline: view()`, wrapped in
  `@supports (animation-timeline: view())` **and** `@media (prefers-reduced-motion: no-preference)`.
  Progressive enhancement, zero JS. `animation-range: entry 0% entry 55%`, `translateY(32px) → none`.
- `.animate-fill-bar`: rating bars fill from `width: 0%` with `cubic-bezier(0.16, 1, 0.3, 1)` over 1 s.
- Cards: `rounded-3xl`, soft shadow `shadow-[0_10px_30px_-18px_rgba(0,0,0,0.22)]`, hover
  `-translate-y-1` + `shadow-[0_22px_44px_-22px_rgba(0,0,0,0.28)]`, 300 ms transition.
- **Dashed hairline borders** (`border-dashed border-zinc-200 dark:border-zinc-800`) are the recurring motif —
  on the hero slab, popular-tag chips, empty states and section dividers. Keep them.
- Section eyebrow label: `<span className="h-1.5 w-3.5 bg-brand" />` + `text-[10px] font-black tracking-widest
  uppercase text-muted-foreground` — e.g. `▬ TOP BEWERTET`, `▬ AKTUELLE BEWERTUNGEN`, `▬ RATGEBER`.
- `.container-site` = `mx-auto w-full max-w-[1440px] px-4 md:px-8 lg:px-12`.
- Prose systems in `globals.css`, all three required:
  - `.prose-content` — rendered rich text (15px/1.75, brand-underlined links, `rounded-lg` images).
  - `.legal-content` — policy pages: 15.5px/2, custom `::before` bullet dots in brand, bold `h3` at
    `mt-9`, brand-underlined links. **Germany has six-plus legal pages; this system does a lot of work.**
  - `.article-content` — long-form Ratgeber: 17px/1.85, larger 19px first paragraph, `h2` at `mt-14`
    `text-[1.7rem]`, brand `marker:` on ordered lists, `border-l-2 border-brand` blockquotes,
    `rounded-2xl` images, `scroll-mt-28` on headings for anchor links.

### 3.6 Dark mode

Full dark theme via `next-themes` (class strategy, `@custom-variant dark (&:is(.dark *))`). Zinc is the
neutral ramp: `dark:bg-zinc-950`, `dark:border-zinc-800`, `dark:text-zinc-50` / `dark:text-zinc-400`.
**Every** surface, border, chart, badge and prose system needs a `dark:` treatment. Ship a theme toggle in
the footer labelled „Design: Hell / Dunkel / System".

---

## 4. Global layout & locale

### 4.1 `app/layout.tsx`
- Loads DM Sans, Inter, Inter Tight with `latin-ext`.
- `<html lang="de">` with `suppressHydrationWarning`, `className="… h-full antialiased"`.
- `<body className="min-h-full flex flex-col font-sans">`.
- `<Toaster position="top-right" richColors />`, theme provider, and the **consent gate** (§10.2).
- Metadata: `metadataBase: new URL(siteUrl)`, title template `"%s — Softwarenavi"`, default
  `"Softwarenavi — Unternehmenssoftware unabhängig vergleichen"`, description
  `"Verifizierte Bewertungen, unabhängige Vergleiche und transparente Bewertungen für Buchhaltung, Lohnabrechnung, HR, CRM und ERP — für den deutschen Mittelstand."`
- OpenGraph: `siteName: "Softwarenavi"`, `locale: "de_DE"`, `type: "website"`.
- **Remove** the reference build's `impact-site-verification` meta tag entirely. Only add a verification
  meta if the German affiliate network (Awin/Belboon) actually issues one.

### 4.2 `app/(public)/layout.tsx`
Wraps every public page with `<Navbar>` + `<Footer>`, both fed live data from Supabase
(`getCategories()`, `getTopRatedSoftware()`, `getSiteSettings()`).

### 4.3 Number, date and currency formatting — **`de-DE` everywhere**

Build `lib/utils/format.ts` and use it universally. Never call `toLocaleString` inline with a locale string
scattered through JSX.

```ts
export const LOCALE = "de-DE";

/** 1.234  ·  12.480 */
export const formatCount = (n: number) => n.toLocaleString(LOCALE);

/** 1.234,56 € — symbol AFTER the number, non-breaking space before it */
export const formatEuro = (n: number) =>
  new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR" }).format(n);

/** „ab 12,90 € / Monat (netto)" */
export const formatPrice = (v: number | null, currency = "EUR", period = "month") => …

/** 2. August 2026 */
export const formatDateLong = (d: string) =>
  new Date(d).toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });

/** 02.08.2026 */
export const formatDateShort = (d: string) =>
  new Date(d).toLocaleDateString(LOCALE, { day: "2-digit", month: "2-digit", year: "numeric" });

/** 4,6 — German decimal comma, one place */
export const formatRating = (n: number) => n.toLocaleString(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
```

Hard rules:
- **Decimal separator is a comma, thousands separator is a dot.** `4,6 von 5`. `1.284 Bewertungen`.
  A rating rendered as `4.6` is a bug.
- **The € sign goes after the number**, separated by a non-breaking space: `12,90 €`. Never `€12.90`.
- **All B2B prices are net (netto).** Every price on the site is followed by a `zzgl. MwSt.` note —
  as a suffix on the pricing table header and a footnote under pricing cards:
  „Alle Preise verstehen sich netto zzgl. 19 % Umsatzsteuer."
  This is a legal and cultural expectation (PAngV); showing gross B2B prices marks the site as foreign.
- Currency map: `{ EUR: "€", CHF: "CHF", USD: "US$", GBP: "£" }` with **EUR first and default**.
  `CHF` matters because Swiss vendors appear in the DACH roster.
- Dates: `02.08.2026` in tables and metadata, `2. August 2026` in prose. Ordinal is a plain dot.
- Percentages: `78 %` — always a non-breaking space before `%`.

### 4.4 `app/api/og/route.tsx`
Dynamic OpenGraph image, 1200×630, edge runtime. Brand mark + product name + rating (`4,6 / 5`) +
review count + the domain string **`softwarenavi.de`**. Must render umlauts — bundle a font that has
`latin-ext` glyphs, do not rely on the default.

### 4.5 `app/robots.ts` + `app/sitemap.ts`
Generated from the shared `siteUrl` helper. Sitemap includes all software, categories, comparisons,
articles and static pages. `robots.ts` disallows `/admin`, `/api/track-click` and `/suche`.

### 4.6 `app/icon.svg`
Transparent brand mark — a stylised compass rose / bearing chevron in `--color-brand`.

---

## 5. Component inventory (build all of these)

### 5.1 Public chrome & primitives
- **`Navbar`** (`components/public/Navbar.tsx`, client): sticky `top-0 z-50`; height animates `h-16 → h-14`
  once `scrollY > 8`, at which point it gains `bg-white/80 backdrop-blur-xl` frosting, a hairline bottom
  border and a two-layer shadow. An **animated highlight pill** measures each link's `getBoundingClientRect`
  relative to the nav and slides between them on hover, resting on the active route
  (`transition-[transform,width,height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`).
  Links: **Software · Kategorien · Vergleich · Ratgeber**.
  Right side: an icon-only search button that expands a `cmdk` search panel via a `grid-rows-[0fr] → [1fr]`
  animation, a **`GlossyButton`** CTA „Software eintragen" (mailto), and a mobile hamburger opening a drawer
  with per-item `transitionDelay: i * 40ms` stagger. `Escape` closes both overlays.
  **No ⌘K hint text and no nav underline dots** — the header stays premium-minimal. This is a standing
  design preference and it applies here too.
- **`Footer`**: dark `rounded-t-3xl` slab (`bg-zinc-950`) with an `inset` top hairline sheen. Blocks:
  newsletter row (heading „Bleiben Sie beim Thema Unternehmenssoftware auf dem Laufenden" + compact form),
  brand block (logo, `footer_tagline`, socials), then four link columns —
  **Entdecken** (Startseite, Software, Kategorien, Vergleich, Ratgeber, Newsletter),
  **Unternehmen** (Über uns, Redaktionelle Grundsätze, Affiliate-Hinweis, Kontakt, Barrierefreiheit),
  **Beliebte Software** (top 5 by review count, live from DB),
  **Kontakt** (phone, `hallo@softwarenavi.de`, and the location line — **`Berlin, Deutschland`**, never
  „London, United Kingdom").
  Bottom bar: `© {year} Softwarenavi. Alle Rechte vorbehalten.` plus
  **Impressum · Datenschutz · Cookie-Einstellungen · AGB** and a „Software vorschlagen" mailto with an
  `ArrowUpRight` that nudges on hover.
  **`Impressum` must appear in the footer of every single page** — see §10.1.
- **`GlossyButton`** — pill CTA with an inner top highlight and a coloured drop shadow derived from
  `brandColor`; `variant: "brand" | "neutral"`, `fullWidth` prop.
- **`SearchBar`** — `size: "sm" | "lg"`, rounded-full, `cmdk`-backed suggestions hitting `/api/search`.
  Placeholder: „Software, Kategorie oder Anbieter suchen …".
- **`BrandLogo` / `LogoMark`**, **`SocialIcons`** (LinkedIn, XING, X, Facebook — **include XING**, it still
  matters to German HR/finance professionals), **`Breadcrumb`**, **`Pagination`** („Zurück" / „Weiter",
  „Seite 2 von 9"), **`StarRating`**, **`CircularRating`**, **`RatingBar`**, **`StatusBadge`**.

### 5.2 Directory & cards
- **`SoftwareCard`** — logo tile, name, category chip, star rating + `formatRating`, review count,
  one-line `description_short`, „ab 12,90 € / Monat" price line, compliance badge row (§8.4),
  hover lift.
- **`SoftwareListRow`** — dense horizontal variant for list view.
- **`SoftwareLogo`** — `next/image` with initial-letter fallback tile tinted with `brandColorFor`.
- **`CategoryCard`**, **`AlternativeCard`**, **`ComparisonCard`**.
- **`FilterSidebar`** — see §8.4 for the German facet set. Sticky on desktop, a Radix `Dialog` sheet on mobile
  with a „Filter (3)" trigger and a „Filter zurücksetzen" action.

### 5.3 Product profile
- **`ProfileShell`** — hero: breadcrumb, logo, name, vendor, tagline, star block, „Zum Anbieter" affiliate CTA,
  a soft radial glow in the product's accent colour behind the logo.
- **`ProfileNav`** — sticky (`top-[76px]`) dark glassmorphic pill bar with `IntersectionObserver` scroll-spy
  (`rootMargin: "-120px 0px -55% 0px"`); active pill is tinted `${brandColor}20` with an inset white
  highlight. Sections: **Überblick · Funktionen · Preise · Integrationen · Support · Bewertungen ·
  Alternativen · FAQ**. Horizontally scrollable with hidden scrollbar on mobile — **essential here, the
  German labels are longer than the English ones**.
- **`PricingCards`** / **`PricingTable`** — highlight the middle of three plans („Beliebteste Wahl") or the
  higher of two. Net-price footnote mandatory.
- **`FeaturesSection`** / **`FeatureChecklist`** — **do not hardcode UK feature copy.** The reference build
  ships a hardcoded HMRC/VAT paragraph in `FeaturesSection.tsx`; German feature descriptions must come from
  the database (`features`, `top_features`) or from a German copy map keyed by feature slug.
- **`ScreenshotCarousel`** — embla + lightbox, keyboard navigable, German `aria-label`s.
- **`SoftwareSidebar`** — vendor facts (Anbieter, Gegründet, Hauptsitz, Sprachen, Support, Serverstandort),
  affiliate CTA, `AffiliateDisclosureNote`.
- **`AffiliateCTAButton`** — always routes through `/api/track-click?id=…`, `rel="sponsored nofollow noopener"`,
  `target="_blank"`. **Never hardcode a vendor URL in JSX.**
- **`AffiliateDisclosureNote`** — the German ad label, see §10.3.
- **`SoftwareRatingsChart`**, **`SentimentBar`**, **`CompanySizeChart`**, **`DonutChart`**,
  **`FaqAccordion`**, **`VerifiedBadges`**, **`ReviewCard`**, **`ComplianceBadges`** (new, §8.4).

### 5.4 Compare
- **`CompareSelector`** (two comboboxes + „Vergleichen" CTA), **`CompareStickyBar`**, **`CompareCharts`**,
  **`ComparisonRadarChart`** (five axes: Bedienbarkeit, Preis-Leistung, Kundenservice, Funktionsumfang,
  Gesamt), **`ComparisonTable`**, **`ComparisonMatrix`**, **`HomepageCompare`**.

### 5.5 Reviews & forms
- **`ReviewCard`**, **`ReviewFilters`**, review submission form (client) with per-dimension `StarSelector`,
  **`ContactForm`**, **`NewsletterForm`** / **`NewsletterSection`** / **`NewsletterUnsubscribeForm`**,
  **`CookieBanner`** + **`CookieSettingsDialog`** (§10.2).
- Every form: German labels, German validation messages, `Sie` form, required-field marking with
  `aria-required` and a visible `*` explained by „Pflichtfeld", and a DSGVO consent checkbox where personal
  data is collected (see §10.4).

### 5.6 Home
- **`HomepageExplore`** — category-tabbed explorer, client-side tab state, 6 products per tab.
- **`HomepageCompare`** — trending head-to-head strip.
- Hero with floating navigator shapes + a three-cell stats bar.

### 5.7 UI primitives (`components/ui`, shadcn-style, Radix-backed)
`alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button`, `card`, `checkbox`, `command`, `dialog`,
`dropdown-menu`, `input`, `input-group`, `label`, `navigation-menu`, `popover`, `progress`, `scroll-area`,
`select`, `separator`, `skeleton`, `sonner`, `switch`, `table`, `tabs`, `textarea`.

---

## 6. Route map — **German slugs**

URLs are part of the localisation. German users and German SEO both expect German paths. Build these exact
routes; the English route names from the reference build are what you are replacing.

| Route | Page | Notes |
| --- | --- | --- |
| `/` | Startseite | hero + Suche + beliebte Tags, Statistik-Leiste, Kategorie-Explorer, Vergleichs-Strip, Top bewertet, Newsletter, Neu bewertet, Ratgeber-Vorschau |
| `/software` | Software-Verzeichnis | Filter-Sidebar, Sortierung, Pagination |
| `/software/[slug]` | Produktprofil | volle Profilseite + JSON-LD |
| `/software/[slug]/bewertungen` | Alle Bewertungen | Filter + Sortierung |
| `/software/[slug]/bewertungen/neu` | Bewertung schreiben | Server Action |
| `/software/[slug]/alternativen` | Alternativen zu X | gerankte Wettbewerber |
| `/kategorien` | Alle Kategorien | Grid |
| `/kategorie/[slug]` | Kategorie-Landingpage | H1: „Die beste {Kategorie} in Deutschland 2026" |
| `/vergleich` | Vergleichs-Hub | Trend-Duelle + Selector |
| `/vergleich/[paar]` | A vs. B | Radar, Matrix, Preise, Fazit, JSON-LD. Slug form `sevdesk-vs-lexware-office` |
| `/ratgeber` | Ratgeber-Index | paginiert |
| `/ratgeber/[slug]` | Ratgeber-Artikel | Autorenbox, verwandte Software, `.article-content` |
| `/suche` | Suchergebnisse | Volltextsuche über Software + Artikel; `noindex` |
| `/newsletter` | Newsletter-Anmeldung | Double-Opt-in |
| `/newsletter/bestaetigen` | Bestätigung | Token-Link aus der Opt-in-Mail |
| `/newsletter/abmelden` | Abmeldung | Ein-Klick |
| `/kontakt` | Kontakt | Formular + Unternehmensdaten |
| `/ueber-uns` | Über uns | Mission, „für deutsche Unternehmen geschrieben", Team, Zahlen |
| **`/impressum`** | **Impressum** | **gesetzlich verpflichtend — §5 DDG.** See §10.1 |
| **`/datenschutz`** | Datenschutzerklärung | DSGVO Art. 13/14 |
| `/cookie-richtlinie` | Cookie-Richtlinie | TDDDG §25, lists every cookie |
| `/agb` | Allgemeine Geschäftsbedingungen | Nutzungsbedingungen |
| `/affiliate-hinweis` | Affiliate-Hinweis / Werbekennzeichnung | UWG §5a Abs. 4 |
| `/redaktionelle-grundsaetze` | Redaktionelle Grundsätze | how reviews are moderated |
| `/barrierefreiheit` | Erklärung zur Barrierefreiheit | BFSG / EN 301 549 |

Every page sets its own `metadata` (title, description, `alternates.canonical`, OpenGraph). Add
`alternates.languages` only if an `at`/`ch` variant is actually built — do not fabricate hreflang.

SEO: JSON-LD `SoftwareApplication` + `AggregateRating` + `Offer` on profiles, `FAQPage` on profiles,
`BreadcrumbList` sitewide, `Article` on Ratgeber posts, `Organization` on the homepage. All JSON-LD text
values in German. `inLanguage: "de-DE"`.

---

## 7. Page-by-page German copy (use these strings, they set the register)

### 7.1 Startseite
- H1: **„Die richtige Software für Ihr Unternehmen finden"**
- Sub: „Vergleichen Sie Buchhaltung, Lohnabrechnung, HR und ERP — unabhängig, geprüft und mit echten
  Erfahrungen aus deutschen Unternehmen."
- Beliebte Tags: `Buchhaltungssoftware`, `Lohnabrechnung`, `HR-Software`, `CRM`, `ERP`, `Zeiterfassung`
- Stats bar: `{n} Verifizierte Bewertungen` · `{n}+ Gelistete Programme` · `{n} Jahre Erfahrung`
- Section: `▬ TOP BEWERTET` → H2 „Die bestbewertete Software in Deutschland" / sub „Die am besten
  bewerteten Lösungen — beurteilt von verifizierten Nutzerinnen und Nutzern aus deutschen Unternehmen."
- Section: `▬ AKTUELLE BEWERTUNGEN` → H2 „Zuletzt bewertete Software"
- Section: `▬ RATGEBER` → H2 „Fachbeiträge und Vergleiche" + CTA „Alle Beiträge ansehen"
- Empty state: „Sobald Produkte im Admin-Bereich veröffentlicht sind, erscheinen sie hier."

### 7.2 Verzeichnis `/software`
- H1 „Unternehmenssoftware im Vergleich", sub mentions „Preise in Euro (netto)".
- Sort labels: „Meiste Bewertungen" · „Beste Bewertung" · „Zuletzt aktualisiert" · „Preis aufsteigend".
- Result count: „**148** Programme gefunden" (`formatCount`).
- Empty: „Keine Programme entsprechen Ihren Filtern. Setzen Sie einzelne Filter zurück."

### 7.3 Produktprofil
Section headings, in order:
„Überblick" · „Für wen ist {Name} geeignet?" · „Vor- und Nachteile" · „Funktionen" · „Preise & Tarife" ·
„Integrationen" · „Support" · „Bewertungen" · „Alternativen zu {Name}" · „Häufige Fragen".
- Rating block: „Gesamtbewertung", „Basierend auf {n} Bewertungen", sub-dimensions
  **„Bedienbarkeit" · „Preis-Leistung" · „Kundenservice" · „Funktionsumfang"**.
- Pros/Cons: „Das gefällt Nutzern" / „Das wird kritisiert".
- Who-uses-it buckets: „Kleinunternehmen" (1–49) · „Mittelstand" (50–249) · „Großunternehmen" (250+).
- CTA: „Zum Anbieter" / „Kostenlos testen" / „Preis anfragen" (when `starting_price` is null).
- Price line: „ab **12,90 €** / Monat · netto zzgl. MwSt." — or „Preis auf Anfrage".
- FAQ questions, generated: „Was ist {Name}?" · „Was kostet {Name}?" · „Welche Funktionen bietet {Name}?" ·
  „Mit welchen Programmen lässt sich {Name} verbinden?" · „Welchen Support bietet {Anbieter}?" ·
  „Ist {Name} GoBD-konform?" · „Gibt es eine DATEV-Schnittstelle?" · „Wo werden die Daten gespeichert?"
  — the last three are German-market-specific and answered from the compliance columns (§8.4).

### 7.4 Vergleich `/vergleich/[paar]`
- H1 „{A} vs. {B}: Der Vergleich 2026"
- „Auf einen Blick" · „Bewertungen im Vergleich" · „Funktionen im Vergleich" · „Preise im Vergleich" ·
  „Compliance & Datenschutz" (German-specific row block) · „Unser Fazit".
- „Zuletzt aktualisiert am 02.08.2026" (`formatDateShort`).
- The reference build hardcodes a Sage-favouring verdict string. **Delete it.** German verdicts are generated
  from the data (ratings, price, compliance flags) or written by an editor into `custom_verdict`. A hardcoded
  bias toward one vendor is both an editorial and a UWG problem here.

### 7.5 Bewertung schreiben
Fields with German labels: „Ihr Name", „Position", „Unternehmen", „Branche", „Unternehmensgröße",
„Land", „Nutzungsdauer", „Titel der Bewertung", „Zusammenfassung", „Was gefällt Ihnen?",
„Was gefällt Ihnen nicht?", plus the five star dimensions. Consent checkbox per §10.4.
Submit: „Bewertung absenden". Success toast: „Vielen Dank — Ihre Bewertung wurde übermittelt."

### 7.6 Über uns
Pillars: „Unabhängig" („Wir werden über Partnerlinks vergütet, nie über Platzierungen."),
„Für den deutschen Markt geschrieben" („Von GoBD und ELSTER über die DATEV-Schnittstelle bis zur
E-Rechnungspflicht achten wir auf die Details, die in Deutschland tatsächlich zählen."),
„Verifizierte Erfahrungen" („Jede Bewertung wird vor der Veröffentlichung geprüft.").

---

## 8. 🇩🇪 GERMANY LOCALISATION — the part that actually matters

The reference build is British. Treat **any** lingering UK signal as a bug.

### 8.1 Currency & pricing
- Default currency **`EUR`**, symbol **`€`** rendered **after** the number: `12,90 €`.
- Currency map order: `["EUR", "CHF", "USD", "GBP"]`, default `EUR`.
- **All prices net.** `zzgl. MwSt.` footnote everywhere a price appears in a pricing context.
- German vendors publish real EUR list prices — use the published German price, never a GBP conversion.
  See the backend doc §8 for the seeded numbers.
- Billing period labels: „/ Monat", „/ Jahr", „/ Nutzer / Monat", „/ Mitarbeitende / Monat", „einmalig".
  Many German products price **per Mandant** or **per Mitarbeiter** — support both.

### 8.2 Tax, payroll & compliance vocabulary — replace every UK term

| UK term (remove) | German term (use) |
| --- | --- |
| HM Revenue & Customs / HMRC | **Finanzamt** (local) / **Bundeszentralamt für Steuern**; the filing portal is **ELSTER** |
| Making Tax Digital / MTD | no equivalent. Use **ELSTER-Übermittlung** and **E-Rechnungspflicht (§ 14 UStG)** |
| VAT return | **Umsatzsteuer-Voranmeldung (UStVA)**, annual **Umsatzsteuererklärung** |
| VAT at 20 % | **Umsatzsteuer 19 %** (Regelsatz), **7 %** (ermäßigter Satz) |
| RTI submissions | **Lohnsteueranmeldung** (bis zum 10. des Folgemonats) + **DEÜV-Meldungen** |
| National Insurance (NI) | **Sozialversicherungsbeiträge** — KV, PV, RV, AV; paritätisch AG/AN |
| NI number | **Sozialversicherungsnummer** / **Steuer-Identifikationsnummer (Steuer-ID)** |
| the Apprenticeship Levy | no equivalent — use **Berufsgenossenschaft**, **Umlage U1/U2/U3** |
| P60 | **Lohnsteuerbescheinigung** (jährlich) |
| P45 | **Arbeitsbescheinigung** / **Meldebescheinigung zur Sozialversicherung** |
| PAYE | **Lohnsteuerabzugsverfahren**, Merkmale über **ELStAM** |
| pension auto-enrolment | **betriebliche Altersvorsorge (bAV)** / **Entgeltumwandlung** — an entitlement, not auto-enrolment |
| Companies House | **Handelsregister** (Amtsgericht) / **Unternehmensregister** |
| ICO | **BfDI** und die **Landesdatenschutzbehörden** |
| UK GDPR / PECR / DPA 2018 | **DSGVO**, **BDSG**, **TDDDG** |
| CIS (Construction Industry Scheme) | **Bauabzugsteuer (§ 48 EStG)**, **Freistellungsbescheinigung** |
| chart of accounts | **Kontenrahmen SKR 03 / SKR 04** |
| year-end accounts | **Jahresabschluss** (Bilanz + GuV nach HGB) bzw. **EÜR** (§ 4 Abs. 3 EStG) |
| bookkeeping compliance | **GoBD** (+ **Verfahrensdokumentation**, 8/10-jährige Aufbewahrungsfrist) |
| accountant | **Steuerberaterin / Steuerberater** — protected title under StBerG; „Buchhalter" is not the same thing |
| payroll bureau | **Lohnbüro** / **Steuerkanzlei** |
| small-business VAT scheme | **Kleinunternehmerregelung (§ 19 UStG)** — 25.000 € Vorjahr / 100.000 € laufendes Jahr |
| direct debit / BACS | **SEPA-Lastschrift**, **IBAN/BIC** |
| e-invoicing (voluntary) | **E-Rechnung** — **XRechnung** und **ZUGFeRD** (EN 16931). Empfangspflicht seit 01.01.2025; Ausstellungspflicht ab 01.01.2027 (> 800.000 € Vorjahresumsatz), ab 01.01.2028 für alle |
| till / EPOS compliance | **Kassensicherungsverordnung (KassenSichV)**, **TSE**, **Belegausgabepflicht** |
| works council | **Betriebsrat** — has a genuine say in HR-software rollouts (§ 87 BetrVG); worth an editorial angle |
| time tracking (optional) | **Arbeitszeiterfassung** — verpflichtend nach BAG-Beschluss 2022 / § 3 ArbSchG |

Keep this as a reusable text-scrub map in `lib/i18n/terms.ts` so editorial tooling can lint for stray UK terms.

### 8.3 Geography & identity
- Tagline: „Deutschlands unabhängiges Vergleichsportal für Unternehmenssoftware."
- Footer/contact location: **`Berlin, Deutschland`** (or the operator's real seat — it must match the Impressum).
- Copy references: „für deutsche Unternehmen", „im deutschen Mittelstand", „in Deutschland", „KMU".
- Reviewer country pool (forms + filters):
  **`["Deutschland", "Österreich", "Schweiz", "Luxemburg", "Sonstige"]`**, default **`Deutschland`**.
- Reviewer names, companies, cities and industries must read as authentically German —
  München, Hamburg, Köln, Frankfurt am Main, Stuttgart, Düsseldorf, Leipzig, Nürnberg, Bremen, Dortmund,
  and Mittelstand-typical company forms (`… GmbH`, `… GmbH & Co. KG`, `… UG (haftungsbeschränkt)`, `… e. K.`).
- Company sizes follow the **EU KMU definition**, not the UK buckets:
  `1–9` (Kleinstunternehmen) · `10–49` (Kleinunternehmen) · `50–249` (Mittleres Unternehmen) ·
  `250–499` · `500+`. Label the select „Unternehmensgröße" and suffix „Mitarbeitende".
- Industries: `Handwerk`, `Einzelhandel`, `E-Commerce`, `Produktion & Fertigung`, `IT & Software`,
  `Gesundheitswesen`, `Steuerberatung`, `Bauwesen`, `Logistik & Transport`, `Gastronomie & Hotellerie`,
  `Bildung`, `Rechtsberatung`, `Immobilien`, `Agentur & Marketing`, `Verein & Non-Profit`, `Sonstige`.
- Durations: `weniger als 6 Monate`, `6–12 Monate`, `1–2 Jahre`, `2–5 Jahre`, `mehr als 5 Jahre`.

### 8.4 German trust signals — surface them as first-class UI

This is the single biggest product improvement over the reference build. German software buyers filter on
compliance before they filter on price. Model these as columns (backend doc §2.2) and expose them as
**filter facets**, **card badges** and a **profile compliance block**.

| Facet | Values | UI |
| --- | --- | --- |
| **GoBD-konform** | ja / nein / teilweise | green shield badge „GoBD-konform" |
| **DATEV-Schnittstelle** | ja / Export / nein | badge „DATEV-Export" — *the* decisive feature in German accounting |
| **E-Rechnung** | XRechnung, ZUGFeRD, beide, keine | badge „E-Rechnung: ZUGFeRD + XRechnung" |
| **Serverstandort** | Deutschland / EU / Drittland | badge „Serverstandort Deutschland" with a small flag-free pin icon |
| **AV-Vertrag (DSGVO Art. 28)** | verfügbar / nicht verfügbar | badge „AV-Vertrag verfügbar" |
| **ELSTER-Übermittlung** | ja / nein | badge „ELSTER-Anbindung" |
| **Sprache** | Deutsch / Englisch / weitere | badge „Deutschsprachiger Support" |
| **Kassensicherung (TSE)** | ja / n. z. | only shown for POS-relevant products |
| **Preismodell** | kostenlose Testphase · kostenlose Version · nur kostenpflichtig | existing facets, German labels |

Component `ComplianceBadges` renders up to four badges per card (priority order:
Serverstandort → DATEV → GoBD → E-Rechnung) and the full set on the profile page in a bordered
„Compliance & Datenschutz" block with a short explanatory line under each. Add a footnote:
„Angaben nach Herstellerinformation, zuletzt geprüft am {Datum}. Keine Rechtsberatung." — accuracy claims
about tax compliance need that hedge in Germany.

Filter sidebar section order: **Kategorie · Serverstandort · Compliance · Bewertung · Preis · Unternehmensgröße**.

### 8.5 Category descriptions (German, market-flavoured)
- **Buchhaltungssoftware** — „Buchhaltung, Rechnungsstellung, Umsatzsteuer-Voranmeldung und Auswertungen —
  GoBD-konform und mit DATEV-Schnittstelle für die Zusammenarbeit mit Ihrer Steuerkanzlei."
- **Lohnabrechnung** — „Entgeltabrechnung, Lohnsteueranmeldung, DEÜV-Meldungen und Lohnsteuerbescheinigungen
  für deutsche Arbeitgeber."
- **HR-Software** — „Personalverwaltung, Abwesenheiten, Onboarding, Zeugnisse und digitale Personalakte —
  DSGVO-konform und betriebsratstauglich."
- **CRM-Software** — „Kontakte, Leads, Angebote und Vertriebsprozesse für den deutschen Mittelstand."
- **ERP & Warenwirtschaft** — „Warenwirtschaft, Einkauf, Produktion und Finanzen in einem System —
  vom Handwerksbetrieb bis zum Mittelständler."
- **Projektmanagement** — „Aufgaben, Zeitpläne und Auslastung im Team — inklusive Anbieter mit
  Serverstandort in Deutschland."
- **Zeiterfassung** — „Arbeitszeiterfassung nach dem BAG-Beschluss: mobil, manipulationssicher und
  auswertbar."
- **Dokumentenmanagement** — „Revisionssichere Archivierung nach GoBD, Belegablage und Freigabeprozesse."

### 8.6 Locale flags to flip (grep for these before shipping)
- `lang="en-GB"` → `lang="de"`; `locale: "en_GB"` → `"de_DE"`.
- Every `toLocaleString("en-GB")` / `toLocaleDateString("en-GB", …)` → the `lib/utils/format.ts` helpers.
- `GBP` / `£` → `EUR` / `€` (and the symbol moves to the right of the number).
- `stackmatch.uk`, `hello@stackmatch.uk` → `softwarenavi.de`, `hallo@softwarenavi.de` — including the
  admin login placeholder, the OG image domain string, the `siteUrl` fallback and every hardcoded `mailto:`.
- `impact-site-verification` meta → remove.
- Any hardcoded `"United Kingdom"`, `"Ireland"`, `"London"`, `"HMRC"`, `"Making Tax Digital"`, `"VAT"`,
  `"RTI"`, `"P60"`, `"National Insurance"` string in `.tsx` — the reference build has these in
  `FeaturesSection.tsx`, `about/page.tsx`, `editorial-policy/page.tsx`, `contact/page.tsx`,
  `privacy-policy/page.tsx`, `compare/[pair]/page.tsx`, `ReviewFormClient.tsx`, `ReviewFilters.tsx`
  and `admin/reviews/ReviewForm.tsx`. Every one must be replaced, not translated word-for-word.

---

## 9. Product roster & brand accents

Feature software with a **genuine German-market presence**. Two hard exclusions to note, because the
reference build features both:

- **QuickBooks** — Intuit never localised QuickBooks for Germany: no German UI, no DATEV export, no GoBD
  certification, no ZUGFeRD/XRechnung. **Do not list it as a German accounting option.** It may appear only
  in an editorial „für Deutschland ungeeignet" comparison note.
- **Xero** — no German localisation and no German payroll. Same treatment.

Seed roster (full details and pricing in the backend doc §8.2):

| Kategorie | Produkte |
| --- | --- |
| **Buchhaltung** | DATEV Unternehmen online · Lexware Office · sevdesk · Sage Active · Sage 50 Connected · BuchhaltungsButler · FastBill · Papierkram · easybill · Scopevisio · Pennylane · Candis |
| **Lohnabrechnung** | DATEV Lohn und Gehalt · DATEV LODAS · Lexware lohn+gehalt · Sage Lohnabrechnung · edlohn (eurodata) · Personio Payroll · Paychex Deutschland |
| **HR** | Personio · HRworks · Sage HR Suite · rexx systems · Factorial · Kenjo · softgarden |
| **CRM** | HubSpot · Salesforce · Pipedrive · Zoho CRM · CentralStationCRM · CAS genesisWorld · Microsoft Dynamics 365 Sales |
| **ERP / Warenwirtschaft** | SAP Business One · Microsoft Dynamics 365 Business Central · weclapp · Xentral · Odoo · Sage 100 · myfactory · Haufe X360 |
| **Projektmanagement** | awork · factro · Stackfield · OpenProject · InLoox · MeisterTask · monday.com · Asana |
| **Zeiterfassung** | clockodo · Papershift · ZEP · TimeTac · Crewmeister |
| **DMS** | DocuWare · d.velop documents · ecoDMS · ELO |

German-vendor products (awork, factro, Stackfield, OpenProject, InLoox, weclapp, Xentral, clockodo,
Papershift, CentralStationCRM, CAS, DocuWare, ecoDMS, sevdesk, Lexware, DATEV, Scopevisio, HRworks,
Personio, rexx) should carry the **„Serverstandort Deutschland"** badge where true — that badge is a genuine
buying signal and a real differentiator for this site.

**`lib/brandColors.ts`** — re-key to German slugs. Confident values:
`odoo: #714B67`, `zoho-crm: #F0483E`, `salesforce: #00A1E0`, `hubspot: #FF7A59`, `pipedrive: #017737`,
`monday-com: #FF3D57`, `asana: #F06A6A`, `sap-business-one: #0070F2`.
For every German vendor (`datev`, `lexware-office`, `sevdesk`, `personio`, `weclapp`, `awork`, `factro`,
`stackfield`, `xentral`, `clockodo`, `docuware`, …) **sample the hex from the vendor's own logo SVG** and
record it in the map — do not invent one. `DEFAULT_BRAND_COLOR = "#0E7C86"`.

Affiliate URLs come **only** from `software.affiliate_url` in the database, surfaced via `/api/track-click`.
German programmes typically run through **Awin**, **Belboon** or the vendor's own partner programme
(Lexware, sevdesk, Personio and DATEV all operate one). Never hardcode a vendor link in a component.

---

## 10. German legal & compliance UI — **not optional, and absent from the reference build**

### 10.1 Impressum (§ 5 DDG)
A dedicated `/impressum` page, linked from the footer of **every** page with the literal link text
**„Impressum"** (not „Legal", not „Imprint"), reachable in **at most two clicks** from anywhere, and never
behind a modal or accordion. Contents:

- Name and full postal address of the operator (a P.O. box is not sufficient)
- Legal form and, for a GmbH/UG/AG, the Geschäftsführer / Vorstand by name
- Handelsregister court and registration number (`Amtsgericht … , HRB …`)
- Umsatzsteuer-Identifikationsnummer per § 27a UStG, if held
- E-mail address **and** a second fast contact channel (telephone or a contact form with a response SLA)
- „Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV" with name and address (the site is journalistic —
  this line is required, and it is the one most sites forget)
- EU-Streitschlichtung: link to the ODR platform and a statement on Verbraucherschlichtungsstelle participation
- A short „Haftung für Inhalte / Haftung für Links / Urheberrecht" block

Missing or incomplete: up to **50.000 €** under § 33 DDG, plus abmahnfähig under UWG § 3a. Build the page
as an editable `pages` record so the operator can complete it without a deploy — but ship it with a visible
placeholder banner („Bitte vor Veröffentlichung vervollständigen") that the operator must clear.

### 10.2 Cookie-Consent (TDDDG § 25) — a real gate, not a banner

`§ 25 TDDDG` requires **prior opt-in** for any storage or read of information on the user's device that is
not strictly necessary to deliver the service. Implement it properly:

- `CookieBanner` renders on first visit, **before** any non-essential script is loaded.
- Three equally prominent buttons: **„Alle akzeptieren" · „Nur notwendige" · „Einstellungen"**.
  „Nur notwendige" must be visually equal to „Alle akzeptieren" — same size, same contrast, same level.
  A greyed-out reject button is the single most-abmahnt pattern in Germany.
- No pre-ticked boxes. No cookie wall. No „by continuing to browse you agree".
- `CookieSettingsDialog` with per-category switches: **Notwendig** (always on, disabled),
  **Statistik**, **Externe Medien**. Each category lists its cookies, purpose, provider, storage duration
  and legal basis.
- The decision is stored in a first-party cookie (`sl_consent`, 6 months) and is **withdrawable** —
  a permanent „Cookie-Einstellungen" link in the footer re-opens the dialog.
- Analytics, embeds and any third-party asset load **only** after the matching consent flips true.
  Prefer **cookieless, self-hosted Plausible or Matomo with IP anonymisation** so the default state still
  yields useful numbers; even then, document it in the Datenschutzerklärung.
- The consent event is logged server-side for the DSGVO Rechenschaftspflicht — see backend doc §5.6.

### 10.3 Werbekennzeichnung (affiliate disclosure, UWG § 5a Abs. 4)
- A visible disclosure **above the fold on every page that carries affiliate links** — not only on a
  dedicated policy page. On profile pages, place it directly under the primary CTA:
  „**Anzeige:** Dieser Link ist ein Partnerlink. Bei einem Abschluss erhalten wir eine Provision.
  Für Sie ändert sich der Preis dadurch nicht. Unsere Bewertungen bleiben davon unberührt."
- Every affiliate link carries `rel="sponsored nofollow noopener"` and `target="_blank"` with an
  `aria-label` that names the destination („Zum Anbieter sevdesk — Partnerlink, öffnet in neuem Tab").
- Comparison and „Beste …" list pages state the ranking methodology and confirm that commercial
  relationships do not influence order. This must be true in the data as well as the copy.
- `/affiliate-hinweis` explains the model in full.

### 10.4 DSGVO in forms
- Every form that collects personal data shows, before the submit button, a consent line with a checkbox:
  „Ich habe die [Datenschutzerklärung](/datenschutz) gelesen und willige in die Verarbeitung meiner Daten
  zu diesem Zweck ein." — unchecked by default, `required`.
- **Data minimisation:** do not ask for anything you do not need. The review form must not require a
  company name or a full name; offer „Vorname + erster Buchstabe des Nachnamens" and make employer optional.
- Newsletter is **double opt-in** with a confirmation e-mail — single opt-in is not defensible in Germany.
  The form states purpose, sender, frequency and the right of withdrawal, and every mail carries a
  one-click Abmelde-Link.
- The Datenschutzerklärung covers, per Art. 13 DSGVO: controller identity, DPO contact (if appointed),
  each processing purpose with its legal basis, recipients (Supabase/Vercel/mail provider as
  Auftragsverarbeiter), third-country transfers and their safeguards, retention periods, and the full list
  of data-subject rights including the Beschwerderecht bei einer Aufsichtsbehörde.

### 10.5 Barrierefreiheit (BFSG, in force since 28 June 2025)
The BFSG applies to electronic services offered to consumers and points at **EN 301 549 → WCAG 2.1 AA**.
Whether this site falls in scope depends on the operator's size and business model (there is a
Kleinstunternehmen exemption: < 10 employees **and** ≤ 2 m € turnover/balance sheet) — but build to
**WCAG 2.1 AA regardless**, and ship an honest `/barrierefreiheit` page that states:
the conformance target, known limitations, the accessibility feedback channel, and the date of last review.
Do not claim full conformance you have not tested for.

---

## 11. Accessibility, performance, SEO

### 11.1 Accessibility (WCAG 2.1 AA — see §10.5)
- Semantic landmarks (`header`/`nav`/`main`/`footer`/`section` with `aria-label`), a „Zum Inhalt springen"
  skip link as the first focusable element, and a logical heading order with exactly one `h1` per page.
- German `aria-label` on every icon-only button („Suche öffnen", „Menü öffnen", „Bewertung: 4 von 5 Sternen").
- Visible `focus-visible` rings from `--ring` on every interactive element — never `outline: none` alone.
- Contrast ≥ 4.5:1 for body text and ≥ 3:1 for large text and UI boundaries, in **both** themes.
  Verify `--muted-foreground #6b7280` on `--muted #f9fafb` and the dark-mode `zinc-400` on `zinc-950`.
- `prefers-reduced-motion` honoured by every animation, including the scroll-reveal and the float loops.
- Escape closes overlays; the search overlay and mobile drawer trap focus and restore it on close.
- Charts (Recharts) carry a text alternative — a visually-hidden table or an `aria-label` summarising the data.
- Forms: `<label for>` on every input, errors announced via `aria-live="polite"` and linked with
  `aria-describedby`, error text in German that says how to fix the problem.

### 11.2 Performance
- `next/image` everywhere with correct `sizes`; hero image `priority`; product logos lazy.
- `export const revalidate = 3600` on home, directory, category and profile routes.
- Self-host fonts through `next/font` (this also keeps Google Fonts off the DSGVO critical path — serving
  Google Fonts from Google's CDN has already produced German damages rulings; `next/font` self-hosts by
  default, so do not add a `<link>` to `fonts.googleapis.com` anywhere).
- No third-party script loads before consent.

### 11.3 SEO
- German keyword targeting per page: „Buchhaltungssoftware Vergleich", „Lohnabrechnung Software",
  „DATEV Schnittstelle", „GoBD konform", „sevdesk vs Lexware Office", „HR-Software Mittelstand".
- Category H1 pattern: „Die beste {Kategorie} in Deutschland 2026" — with the year driven by a constant,
  not hardcoded in copy in ten places.
- JSON-LD in German with `inLanguage: "de-DE"`; `Organization` with the Impressum address.
- Clean German slugs, umlauts transliterated (`ä→ae`, `ö→oe`, `ü→ue`, `ß→ss`) —
  `lohnbuchhaltung-fuer-kleinunternehmen`, never `%C3%BC` in a URL.
- `sitemap.ts` with `lastModified` from `updated_at`; `/suche` and `/admin` excluded and `noindex`.

---

## 12. Data access pattern (frontend side)

- Public reads go through `lib/supabase/queries.ts` using an anon, RLS-constrained client.
  Every fetcher is wrapped in `safe(fallback, fn)` and degrades to empty/placeholder when Supabase is
  unset — the site must always build and render.
- Expand/contract-safe column probing: detect Postgres error `42703` and fall back to a base column set,
  so a missing `brand_color` / compliance column never white-screens a page.
- Pages fetch in parallel with `Promise.all`.
- Full-text search uses the **`german`** text-search configuration, not `english` — see backend doc §2.2.
  German stemming and compound handling are the whole point.

---

## 13. Acceptance checklist

- [ ] Every public route from §6 renders with German slugs and German copy.
- [ ] `lang="de"`, `locale: "de_DE"`, `hyphens: auto`, and fonts loaded with `latin-ext`; `ä ö ü ß` render
      correctly at every heading weight and in the OG image.
- [ ] Numbers `1.234,56`, ratings `4,6`, prices `12,90 €` with the symbol **after** the number, dates
      `02.08.2026`, percentages `19 %` with a non-breaking space. No `en-GB` call sites remain.
- [ ] All prices net, with a visible `zzgl. MwSt.` note wherever a price appears.
- [ ] German quotation marks „…" in all editorial and UI copy. Formal **Sie** everywhere — zero `du`.
- [ ] No layout breaks from long compounds: check `Umsatzsteuer-Voranmeldung`,
      `Lohnsteuerbescheinigung`, `Dokumentenmanagement`, `Barrierefreiheitserklärung` in nav, chips, cards,
      table headers and buttons at 360 px, 768 px and 1440 px.
- [ ] Fonts DM Sans / Inter / Inter Tight; headings Inter Tight; brand `#0E7C86` is the accent throughout.
- [ ] Light **and** dark themes complete on every surface and all three prose systems.
- [ ] **Impressum** linked in the footer of every page and complete per § 5 DDG + § 18 Abs. 2 MStV.
- [ ] Cookie consent is genuine opt-in per § 25 TDDDG: equal-weight reject button, no pre-ticked boxes,
      withdrawable, and **nothing non-essential loads before consent**.
- [ ] Affiliate links labelled „Anzeige"/Partnerlink above the fold, `rel="sponsored nofollow noopener"`,
      resolved from DB `affiliate_url` via `/api/track-click` — no hardcoded vendor URL in any component.
- [ ] Newsletter is double opt-in; every personal-data form has an unchecked DSGVO consent box.
- [ ] WCAG 2.1 AA verified: skip link, focus rings, contrast in both themes, keyboard-only pass,
      screen-reader pass on the profile page; `/barrierefreiheit` states the real conformance status.
- [ ] Compliance facets (GoBD, DATEV, E-Rechnung, Serverstandort, AV-Vertrag) are filterable, shown as
      card badges and expanded in a profile block with the „Angaben nach Herstellerinformation" footnote.
- [ ] Reviewer country pool DACH with `Deutschland` default; company sizes on the EU KMU buckets;
      reviewer identities, cities and company forms read as authentically German.
- [ ] **Zero** UK signals remain: no `£`/GBP default, no HMRC / Making Tax Digital / „VAT return" / RTI /
      National Insurance / P60 / ICO / PECR / „United Kingdom" / London / `stackmatch.uk` / `en-GB` / `en_GB`.
- [ ] QuickBooks and Xero are **not** presented as viable German accounting options.
- [ ] No `fonts.googleapis.com` link tag; no analytics or third-party script outside the consent gate.
- [ ] Site builds and renders with Supabase unset (graceful placeholders).

**Deliver the frontend to match the reference platform's structure and polish exactly — the market, the
language and the compliance surface are what change.**
