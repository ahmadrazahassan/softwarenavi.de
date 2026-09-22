# Softwarenavi

Deutschlands unabhängiges Vergleichsportal für Unternehmenssoftware — Next.js 16 (App Router, Turbopack),
React 19, Tailwind CSS v4, Radix UI. Specs: [`PROMPT_FRONTEND_GERMANY.md`](PROMPT_FRONTEND_GERMANY.md) and
[`PROMPT_BACKEND_GERMANY.md`](PROMPT_BACKEND_GERMANY.md).

## Status

**Phase 1 — Frontend: complete.** Every public route renders with German copy and German slugs.
**Phase 2 — Backend (Supabase, admin CMS, migrations): next.**

Until the backend exists, all reads resolve against an in-memory demo dataset in `lib/data/`
(58 products, ~1.000 generated demo reviews marked „(Demo)", 10 Ratgeber articles, the 7 legal pages).
Aggregate ratings and category counts are derived exactly as the future DB triggers will derive them.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (116 prerendered pages)
```

No environment variables are required for the frontend; see `.env.example` for the backend phase.

**Seed reviews:** `SEED_REVIEWS=true` fills every product with 100–200 generated German reviews
(`lib/data/seedReviews.ts`, deterministic per slug) and recomputes all ratings from them, including on Vercel
Production. They are never written to Supabase.

## Structure

| Path | Purpose |
| --- | --- |
| `app/(public)/` | All public routes (German slugs: `/software`, `/kategorie/[slug]`, `/vergleich/[paar]`, `/ratgeber`, `/impressum`, …) |
| `app/api/` | `search`, `track-click` (affiliate redirect), `consent` (TDDDG log), `og` (OpenGraph PNG), `screenshot` (placeholder UI mock) |
| `components/public/` | Navbar, Footer, cards, consent gate, compliance badges, affiliate CTA + Werbekennzeichnung |
| `components/profile/`, `components/compare/`, `components/forms/` | Profile sections, comparison charts, forms (server actions) |
| `lib/supabase/queries.ts` | **The only data-access layer.** Swap the bodies for Supabase reads in phase 2 — signatures stay. |
| `lib/utils/format.ts` | `de-DE` number/currency/date formatting — never call `toLocaleString` inline |
| `lib/utils/hyphenate.ts` | Soft hyphens for long German compounds (browsers without a German hyphenation dictionary) |
| `lib/i18n/` | German option pools and the UK→DE terminology scrub map |

## Before launch — operator checklist

- [ ] Fill every `{{PLATZHALTER}}` in the Impressum and Datenschutzerklärung; have the legal suite reviewed, then clear `requires_legal_review`.
- [ ] Verify every price and compliance value against the vendor's German pages; set `compliance_checked_at`.
- [ ] Sample vendor brand colours from their logo SVGs (`lib/brandColors.ts`, block marked `TODO(brand)`).
- [ ] Replace placeholder author names in `lib/data/articles.ts` with the real Redaktion.
- [ ] Replace demo reviews and mock screenshots with real content.
