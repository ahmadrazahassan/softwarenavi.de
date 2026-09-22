import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Compass, Landmark, Mail, MapPin, Phone, Scale } from "lucide-react";
import { AUTHOR_NAME, CONTACT_EMAIL, CONTACT_LOCATION, CONTACT_PHONE } from "@/lib/site";
import { getSiteStats } from "@/lib/supabase/queries";
import { Breadcrumb, Eyebrow } from "@/components/public/Layout";
import Image from "next/image";
import { formatCount } from "@/lib/utils/format";
import { seedReviewsEnabled } from "@/lib/seedMode";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Softwarenavi vergleicht Unternehmenssoftware für den deutschen Markt. Unabhängig, mit geprüften Bewertungen und Nettopreisen.",
  alternates: { canonical: "/ueber-uns" },
};

export default async function AboutPage() {
  const stats = await getSiteStats();
  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Über uns" }]} />
      <header className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <Eyebrow>Über uns</Eyebrow>
          <h1 className="mt-3 font-heading text-[2rem] font-medium tracking-tight sm:text-4xl md:text-5xl">Wir navigieren Unternehmen zur passenden Software</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Ein Navi zeigt den Weg, wenn die Strecke unbekannt ist, und bringt Sie sicher ans Ziel. So verstehen wir unsere
            Aufgabe: unabhängige Orientierung bei der Softwareauswahl, nicht Verkauf.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src="/images/hero-gipfel.webp" alt="Drei Menschen stehen auf einem grünen Hügel unter blauem Himmel" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" priority />
        </div>
      </header>

      <section aria-labelledby="pillars" className="mt-20">
        <h2 id="pillars" className="sr-only">
          Unsere Grundsätze
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Scale, t: "Unabhängig", d: "Wir werden über Partnerlinks vergütet, nie über Platzierungen." },
            {
              icon: Landmark,
              t: "Für den deutschen Markt geschrieben",
              d: "Von GoBD und ELSTER über die DATEV-Schnittstelle bis zur E-Rechnungspflicht achten wir auf die Details, die in Deutschland tatsächlich zählen.",
            },
            { icon: BadgeCheck, t: "Verifizierte Erfahrungen", d: "Jede Bewertung wird vor der Veröffentlichung geprüft." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-xl border border-border bg-white p-6">
              <span className="grid size-12 place-items-center rounded-lg text-brand-dark">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="zahlen" className="mt-20 rounded-xl border border-border p-8 md:p-12">
        <h2 id="zahlen" className="font-heading text-2xl font-medium">
          Softwarenavi in Zahlen
        </h2>
        <dl className="mt-8 grid gap-8 sm:grid-cols-3">
          {[
            [formatCount(stats.software), "Programme im Vergleich"],
            stats.reviews > 0 ? [formatCount(stats.reviews), seedReviewsEnabled() ? "Nutzerbewertungen" : "geprüfte Nutzerbewertungen"] : [formatCount(stats.editorial), "redaktionelle Bewertungen"],
            [formatCount(stats.categories), "Kategorien"],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col-reverse">
              <dt className="text-sm text-muted-foreground">{l}</dt>
              <dd className="font-heading text-4xl font-medium tabular-nums text-brand-dark">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="wie" className="mt-20 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 id="wie" className="font-heading text-3xl font-medium tracking-tight">
            Wie wir arbeiten
          </h2>
          <div className="prose-content mt-5">
            <p>
              Wir recherchieren Preise, Funktionen und Compliance-Merkmale bei den Herstellern und prüfen sie regelmäßig. Unbekannte Werte kennzeichnen wir als
              „keine Angabe“, statt sie zu schätzen. Alle Preise geben wir netto an, wie im B2B-Bereich üblich.
            </p>
            <p>
              Die Reihenfolge in Listen ergibt sich aus Nutzerbewertungen, solange keine vorliegen aus der Redaktionsnote, oder aus der von Ihnen gewählten Sortierung. Unsere Finanzierung über
              Partnerlinks legen wir im <Link href="/affiliate-hinweis">Affiliate-Hinweis</Link> offen, die Prüfung von Bewertungen in den{" "}
              <Link href="/redaktionelle-grundsaetze">redaktionellen Grundsätzen</Link>.
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-brand p-8 text-ink">
          <Compass className="size-8 text-ink" strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-4 font-heading text-2xl font-semibold leading-snug">„Unabhängig. Geprüft. Deutsch.“</p>
          <p className="mt-3 text-sm leading-relaxed text-ink/80">
            Für Geschäftsführung, Kaufmännische Leitung, Buchhaltung, Personalabteilung und IT-Verantwortliche in kleinen und mittleren Unternehmen. Und für
            die Steuerkanzleien, die sie beraten.
          </p>
          <Link href="/kontakt" className="mt-6 inline-flex h-11 items-center rounded-[7px] btn-glossy px-5 text-sm font-medium">
            Kontakt aufnehmen
          </Link>
        </div>
      </section>

      <section aria-labelledby="team" className="mt-20 grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-border p-8">
          <h2 id="team" className="font-heading text-2xl font-medium">
            Wer hinter Softwarenavi steht
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Softwarenavi wird von {AUTHOR_NAME} als private, unabhängige Website betrieben. Alle Vergleiche, Testberichte und Ratgeber entstehen in Neu-Isenburg bei Frankfurt am Main. Jede
            Angabe wird anhand von Herstellerinformationen, Preislisten und Nutzerbewertungen geprüft.
          </p>
        </div>
        <ul className="flex flex-col gap-3 rounded-xl border border-border p-8 text-sm">
          <li className="flex items-center gap-3"><MapPin className="size-5 text-brand-dark" aria-hidden="true" />{CONTACT_LOCATION}</li>
          <li className="flex items-center gap-3"><Phone className="size-5 text-brand-dark" aria-hidden="true" /><a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="hover:underline">{CONTACT_PHONE}</a></li>
          <li className="flex items-center gap-3"><Mail className="size-5 text-brand-dark" aria-hidden="true" /><a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">{CONTACT_EMAIL}</a></li>
        </ul>
      </section>
    </div>
  );
}
