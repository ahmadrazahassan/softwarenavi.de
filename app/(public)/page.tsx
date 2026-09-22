import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Landmark, Scale, ShieldCheck } from "lucide-react";
import {
  getCategories,
  getLatestArticles,
  getLatestReviews,
  getPublishedComparisons,
  getSiteStats,
  getMostReviewedSoftware,
  getSoftwareList,
  getTopRatedSoftware,
} from "@/lib/supabase/queries";
import type { Software } from "@/lib/types";
import { SectionHeader, Eyebrow } from "@/components/public/Layout";
import { ArticleCard } from "@/components/public/ArticleCard";
import { GlossyButton } from "@/components/public/GlossyButton";
import { HomepageExplore } from "@/components/home/HomepageExplore";
import { SoftwareSpotlight } from "@/components/home/SoftwareSpotlight";
import { LandscapeHero } from "@/components/home/LandscapeHero";
import { ComparisonShowcase } from "@/components/home/ComparisonShowcase";
import { ReviewMarquee } from "@/components/home/ReviewMarquee";
import { EditorialReviews } from "@/components/home/EditorialReviews";
import { RatingsPanel } from "@/components/home/FinanceVisuals";
import { VendorMarquee } from "@/components/home/VendorMarquee";
import { CategoryRail } from "@/components/home/CategoryRail";
import { ComplianceAccordion } from "@/components/home/ComplianceAccordion";
import { FaqAccordion } from "@/components/profile/FaqAccordion";
import { JsonLd } from "@/components/public/JsonLd";
import { formatCount } from "@/lib/utils/format";
import { absoluteUrl, CONTACT_EMAIL, siteUrl } from "@/lib/site";
import { seedReviewsEnabled } from "@/lib/seedMode";

export const revalidate = 3600;

const STEPS = [
  { n: "01", t: "Pflichtpunkte festlegen", d: "Braucht Ihre Kanzlei einen DATEV-Export? Müssen die Daten in Deutschland liegen? Setzen Sie die Filter, bevor Sie sich Oberflächen ansehen." },
  { n: "02", t: "Bewertungen aus Ihrer Branche lesen", d: "Filtern Sie nach Branche, Betriebsgröße und Rechtsform. Eine GmbH mit 40 Beschäftigten hat andere Sorgen als ein Einzelunternehmen." },
  { n: "03", t: "Zwei Kandidaten gegenüberstellen", d: "Preise netto, Teilnoten und Compliance nebeneinander. Danach wissen Sie, welche zwei Anbieter Sie zur Demo einladen." },
];

const FEATURES = [
  { icon: Scale, t: "Rangfolge nach Nutzerurteil", d: "Wer oben steht, entscheiden die Bewertungen. Ob ein Anbieter Provision zahlt, spielt dafür keine Rolle. So steht es in unseren Grundsätzen." },
  { icon: ShieldCheck, t: "Geprüft für das deutsche Steuerrecht", d: "GoBD, DATEV-Schnittstelle, E-Rechnung nach EN 16931 und AV-Vertrag. Fehlt eine Angabe des Herstellers, schreiben wir das dazu." },
  { icon: Landmark, t: "Preise, mit denen Sie kalkulieren können", d: "Die Listenpreise der Anbieter, netto zuzüglich 19 % Umsatzsteuer. Also genau die Zahl, die später in Ihrer Kostenstelle steht." },
];

const HOME_FAQ = [
  {
    q: "Wie finanziert sich Softwarenavi?",
    a: "Über Partnerlinks. Schließen Sie über einen als Anzeige gekennzeichneten Link einen Vertrag ab, erhalten wir unter Umständen eine Provision vom Anbieter. Ihr Preis bleibt derselbe. Auf Bewertungen und Rangfolgen hat das keinen Einfluss: Auch Anbieter ohne Partnerprogramm stehen ganz oben, wenn die Nutzer sie gut bewerten.",
  },
  {
    q: "Wie werden Bewertungen geprüft?",
    a: "Unsere Redaktion liest jede Bewertung vor der Veröffentlichung. Wir achten auf Plausibilität, doppelte Einreichungen und Hinweise darauf, dass ein Anbieter sich selbst oder einen Wettbewerber bewertet. Wie wir dabei vorgehen, steht in unseren redaktionellen Grundsätzen.",
  },
  {
    q: "Sind die Preise netto oder brutto?",
    a: "Netto. Wir übernehmen die veröffentlichten deutschen Listenpreise der Anbieter, zuzüglich 19 % Umsatzsteuer, wie es im Geschäftskundenbereich üblich ist. Für ein vorsteuerabzugsberechtigtes Unternehmen ist das die Zahl, die tatsächlich belastet.",
  },
  {
    q: "Welche Software hat eine DATEV-Schnittstelle?",
    a: "Im Softwareverzeichnis gibt es dafür einen eigenen Filter. Im Profil jedes Programms steht außerdem, ob es nur einen Export im DATEV-Format erzeugt oder vollständig integriert ist. Für die Zusammenarbeit mit Ihrer Steuerberatung macht das einen spürbaren Unterschied.",
  },
  {
    q: "Warum fehlen QuickBooks und Xero?",
    a: "Weil beide nicht für Deutschland gebaut sind. Es fehlen unter anderem eine DATEV-Schnittstelle, Nachweise zur GoBD und die deutschen E-Rechnungsformate XRechnung und ZUGFeRD. Für eine Buchhaltung nach deutschem Recht listen wir sie deshalb nicht.",
  },
];

export default async function HomePage() {
  const [categories, comparisons, stats, articles, latestReviews, bySoftware, overall, mostReviewed] = await Promise.all([
    getCategories(),
    getPublishedComparisons(),
    getSiteStats(),
    getLatestArticles(3),
    getLatestReviews(600),
    getSoftwareList({ perPage: 200 }),
    getTopRatedSoftware(24),
    getMostReviewedSoftware(9),
  ]);

  const byCategory: Record<string, Software[]> = {};
  await Promise.all(
    categories.map(async (c) => {
      byCategory[c.id] = await getTopRatedSoftware(12, c.id);
    }),
  );

  // Reviews marquee: newest review per product, so every tile shows a different vendor.
  const seen = new Set<string>();
  const reviews = latestReviews.filter((r) => !seen.has(r.software.slug) && seen.add(r.software.slug)).slice(0, 24);
  const editorialReviews = overall.filter((s) => s.editorial).slice(0, 3);

  // Marquee: vendors with a real logo first, then the best-known German vendors by review count.
  const withLogo = bySoftware.items.filter((s) => s.logo_url);
  const rest = bySoftware.items.filter((s) => !s.logo_url).slice(0, 14);
  const marquee = [...withLogo, ...rest].map(({ name, slug, logo_url }) => ({ name, slug, logo_url }));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Softwarenavi",
          url: siteUrl,
          logo: absoluteUrl("/icon.svg"),
          email: CONTACT_EMAIL,
          description: "Deutschlands unabhängiges Vergleichsportal für Unternehmenssoftware.",
          address: { "@type": "PostalAddress", addressLocality: "Neu-Isenburg", postalCode: "63263", addressCountry: "DE" },
          inLanguage: "de-DE",
        }}
      />

      {/* ───────────── Hero ───────────── */}
      <LandscapeHero softwareCount={stats.software} reviewCount={stats.reviews} editorialCount={stats.editorial} />

      {/* ───────────── Anbieter ───────────── */}
      <section aria-label="Anbieter im Vergleich" className="relative -mt-20 md:-mt-24">
        <p className="mb-6 text-center text-sm text-muted-foreground">Wir vergleichen die Software, mit der Deutschlands Mittelstand arbeitet</p>
        <VendorMarquee items={marquee} />
      </section>

      {/* ───────────── Kennzahlen ───────────── */}
      <section aria-labelledby="facts-title" className="container-site mt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="facts-title" className="font-heading text-[2rem] font-medium leading-[1.05] tracking-[-0.03em] text-balance md:text-5xl">
            Ein Vergleich, auf den sich auch Ihre Steuer&shy;kanzlei verlassen kann
          </h2>
        </div>
        <dl className="mt-14 grid grid-cols-2 gap-y-10 border-y border-border py-10 lg:grid-cols-4">
          {[
            stats.reviews > 0 ? [formatCount(stats.reviews), seedReviewsEnabled() ? "Nutzerbewertungen" : "geprüfte Nutzerbewertungen"] : [formatCount(stats.editorial), "redaktionelle Bewertungen"],
            [formatCount(stats.software), "Programme im Vergleich"],
            [formatCount(bySoftware.items.filter((s) => s.datev_interface === "export" || s.datev_interface === "vollintegriert").length), "mit DATEV-Schnittstelle"],
            [formatCount(bySoftware.items.filter((s) => s.hosting_location === "Deutschland").length), "mit Serverstandort Deutschland"],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col-reverse items-center gap-1 px-2 text-center">
              <dt className="text-sm text-muted-foreground">{l}</dt>
              <dd className="font-heading text-5xl font-medium tracking-[-0.04em] tabular-nums md:text-6xl">{v}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {FEATURES.map(({ icon: Icon, t, d }) => (
            <li key={t} className="flex flex-col">
              <Icon className="size-8 text-brand-dark" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-6 font-heading text-xl font-medium tracking-[-0.015em]">{t}</h3>
              <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── Kategorien (Rail) ───────────── */}
      <section id="entdecken" aria-labelledby="rail-title" className="container-site mt-28 scroll-mt-24">
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <Eyebrow>Kategorien</Eyebrow>
              <h2 id="rail-title" className="mt-4 font-heading text-[2.5rem] font-medium leading-[1] tracking-[-0.04em] md:text-6xl">
                Acht Bereiche, ein Maßstab
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4">
              <GlossyButton href="/kategorien" variant="neutral" size="sm">
                Alle Kategorien <ArrowUpRight aria-hidden="true" />
              </GlossyButton>
              <p className="max-w-[15rem] text-sm text-muted-foreground">Von der Finanzbuchhaltung über die Lohnabrechnung bis zur revisionssicheren Ablage.</p>
            </div>
          </div>
          <div className="min-w-0">
            <CategoryRail categories={categories} />
          </div>
        </div>
      </section>

      {/* ───────────── Top bewertet (Explorer) ───────────── */}
      <section aria-labelledby="explore-title" className="mt-28 px-3 md:px-6">
        <div className="mx-auto max-w-[1400px] rounded-[1.25rem] border border-border bg-paper/70 px-4 py-14 sm:px-8 md:px-12 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16">
            <div>
              <p className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <span className="size-2 rounded-full bg-lime ring-1 ring-lime-dark/30" aria-hidden="true" />
                Rangliste · {formatCount(stats.software)} Programme
              </p>
              <h2 id="explore-title" className="mt-5 font-heading text-[2.4rem] font-medium leading-[0.98] tracking-[-0.045em] md:text-[4.25rem]">
                Die bestbewerteten Programme <span className="text-muted-foreground/60">in Deutschland.</span>
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground md:text-base">
              Sobald geprüfte Nutzerbewertungen vorliegen, bestimmen sie die Reihenfolge, gewichtet nach ihrer Anzahl. Bis dahin gilt die Redaktionsnote,
              und wir kennzeichnen bei jedem Programm, welche der beiden Sie sehen.{" "}
              <Link href="/redaktionelle-grundsaetze" className="text-ink underline decoration-brand underline-offset-4">
                Zur Methodik
              </Link>
            </p>
          </div>
          <div className="mt-12">
            <HomepageExplore categories={categories} byCategory={byCategory} overall={overall} />
          </div>
        </div>
      </section>

      {/* ───────────── Meistgewählt (Bento) ───────────── */}
      <section aria-labelledby="spotlight-title" className="container-site mt-28">
        <SectionHeader
          id="spotlight-title"
          eyebrow="Redaktionelle Auswahl"
          title="Starke Programme für den deutschen Mittelstand"
          sub="Ausgewählt nach Bewertung, Preis und Compliance. Mit Teilnoten, Einstiegspreis und der Information, ob Sie kostenlos testen können."
          action={
            <GlossyButton href="/software" variant="neutral" size="sm">
              Alle Programme <ArrowUpRight aria-hidden="true" />
            </GlossyButton>
          }
        />
        <div className="mt-10">
          <SoftwareSpotlight items={mostReviewed} />
        </div>
      </section>

      {/* ───────────── Split: Unabhängig geprüft ───────────── */}
      <section aria-labelledby="split-title" className="container-site mt-28">
        <div className="grid gap-3 rounded-xl border border-border p-3 lg:grid-cols-2">
          <RatingsPanel className="min-h-[320px] rounded-lg" />
          <div className="flex flex-col justify-between gap-10 p-5 md:p-8">
            <div>
              <Eyebrow>Unser Ansatz</Eyebrow>
              <h2 id="split-title" className="mt-4 font-heading text-[2rem] font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
                Geschrieben für den Alltag in deutschen Buchhaltungen
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground md:text-base">
                Die Umsatzsteuer-Voranmeldung zum Zehnten, der Buchungsstapel für die Kanzlei, die erste XRechnung im Posteingang: Wir beurteilen Software danach,
                ob sie diese Aufgaben zuverlässig erledigt. Nicht danach, wer die höchste Provision zahlt.
              </p>
            </div>
            <ul className="flex flex-col gap-3 border-t border-border pt-6 text-[15px]">
              {["Jede Bewertung wird vor der Veröffentlichung gelesen", "Teilnoten für Bedienung, Service, Funktionen und Preis-Leistung", "Anbieter dürfen öffentlich antworten"].map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="size-1.5 shrink-0 bg-brand" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              <GlossyButton href="/software">Software durchsuchen</GlossyButton>
              <GlossyButton href="/redaktionelle-grundsaetze" variant="neutral">
                Unsere Methodik
              </GlossyButton>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── So funktioniert's ───────────── */}
      <section aria-labelledby="steps-title" className="container-site mt-28">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Vorgehen</Eyebrow>
          <h2 id="steps-title" className="mt-4 font-heading text-[2rem] font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
            So treffen Sie die Auswahl in einer Woche statt in drei Monaten
          </h2>
        </div>
        <ol className="mt-12 grid gap-3 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col rounded-xl border border-border p-6">
              <span className="font-heading text-sm font-medium tabular-nums text-brand-dark">{s.n}</span>
              <h3 className="mt-10 font-heading text-xl font-medium tracking-[-0.015em]">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── Compliance-Accordion ───────────── */}
      <section aria-labelledby="comp-title" className="container-site mt-28">
        <SectionHeader
          id="comp-title"
          eyebrow="Compliance"
          title="Vier Fragen, die Ihre Steuerkanzlei stellen wird"
          sub="Bevor Oberfläche und Preis eine Rolle spielen, muss die Software diese Punkte erfüllen. Wir haben sie bei jedem Programm nachgesehen."
        />
        <div className="mt-10">
          <ComplianceAccordion />
        </div>
      </section>

      {/* ───────────── Vergleiche ───────────── */}
      {comparisons.length > 0 && (
        <section aria-labelledby="compare-title" className="container-site mt-28">
          <SectionHeader
            id="compare-title"
            eyebrow="Im direkten Vergleich"
            title="Direkt gegenübergestellt"
            sub="Die meistgesuchten Paarungen mit Teilnoten und Nettopreisen. Wer in einem Kriterium vorne liegt, ist farbig markiert."
            action={
              <GlossyButton href="/vergleich" variant="neutral" size="sm">
                Alle {comparisons.length} Vergleiche <ArrowUpRight aria-hidden="true" />
              </GlossyButton>
            }
          />
          <div className="mt-10">
            <ComparisonShowcase comparisons={comparisons} limit={6} />
          </div>
        </section>
      )}

      {/* ───────────── Published user reviews, or clearly labelled editorial assessments ───────────── */}
      {(reviews.length > 0 || editorialReviews.length > 0) && (
      <section aria-labelledby="voices-title" className="mt-28">
        <div className="container-site">
          <SectionHeader
            id="voices-title"
            eyebrow={reviews.length > 0 ? "Aus der Praxis" : "Redaktionelle Bewertungen"}
            title={reviews.length > 0 ? "Was Anwender über ihre Software schreiben" : "Unsere Bewertungen im Überblick"}
            sub={reviews.length > 0
              ? `Auszüge aus ${formatCount(stats.reviews)} ${seedReviewsEnabled() ? "" : "geprüften "}Bewertungen. Geschrieben von Steuerkanzleien, Handwerksbetrieben, Agenturen und Mittelständlern.`
              : "Unabhängige Redaktionsnoten auf Basis von Produktdokumentation und geprüften Preislisten. Keine Nutzerbewertungen."}
            action={
              <GlossyButton href="/software" variant="neutral" size="sm">
                Alle Programme <ArrowUpRight aria-hidden="true" />
              </GlossyButton>
            }
          />
        </div>
        <div className="mt-10">
          {reviews.length > 0 ? <ReviewMarquee reviews={reviews} /> : <EditorialReviews software={editorialReviews} />}
        </div>
      </section>
      )}

      {/* ───────────── Ratgeber ───────────── */}
      {articles.length > 0 && (
        <section aria-labelledby="guides-title" className="container-site mt-28">
          <SectionHeader
            id="guides-title"
            eyebrow="Ratgeber"
            title="Ratgeber aus der Redaktion"
            action={
              <GlossyButton href="/ratgeber" variant="neutral" size="sm">
                Alle Beiträge ansehen <ArrowUpRight aria-hidden="true" />
              </GlossyButton>
            }
          />
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-4">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* ───────────── FAQ ───────────── */}
      <section aria-labelledby="faq-title" className="container-site mt-28">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Eyebrow>FAQ</Eyebrow>
            <h2 id="faq-title" className="mt-4 font-heading text-[2rem] font-medium leading-[1.05] tracking-[-0.03em] md:text-5xl">
              Häufige Fragen
            </h2>
          </div>
          <div className="mt-10">
            <FaqAccordion items={HOME_FAQ} />
          </div>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              inLanguage: "de-DE",
              mainEntity: HOME_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            }}
          />
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section aria-labelledby="cta-title" className="px-3 md:px-6">
        <div className="relative mx-auto mt-28 flex min-h-[560px] max-w-[1400px] items-center justify-center overflow-hidden rounded-xl px-4 py-16">
          <Image src="/images/hero-huegel.webp" alt="" fill sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover" />
          <div className="relative w-full max-w-2xl rounded-xl bg-white px-6 py-12 text-center md:px-14 md:py-16">
            <h2 id="cta-title" className="font-heading text-[2.2rem] font-medium leading-[1.02] tracking-[-0.04em] text-balance text-ink md:text-6xl">
              Eine Buchhaltungssoftware wechselt man nicht jedes Jahr.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground md:text-base">
              Nehmen Sie sich zehn Minuten für den Vergleich von {formatCount(stats.software)} Programmen. Kostenlos, ohne Anmeldung und ohne Anruf eines Vertriebsteams.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <GlossyButton href="/software" size="lg">
                Programme vergleichen
              </GlossyButton>
              <GlossyButton href="/kontakt" variant="neutral" size="lg">
                Redaktion kontaktieren
              </GlossyButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
