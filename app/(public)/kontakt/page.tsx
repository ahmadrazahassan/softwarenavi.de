import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Newspaper, PenSquare, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/supabase/queries";
import { Breadcrumb } from "@/components/public/Layout";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT_LOCATION, CONTACT_PHONE, EDITORIAL_EMAIL, PRESS_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "So erreichen Sie die Redaktion von Softwarenavi: für Fragen, Korrekturen, Presseanfragen und das Eintragen von Software.",
  alternates: { canonical: "/kontakt" },
};

export default async function ContactPage() {
  const s = await getSiteSettings();
  const email = s.contact_email || "hallo@softwarenavi.de";
  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Kontakt" }]} />
      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div className="max-w-2xl">
          <h1 className="font-heading text-[2rem] font-medium tracking-tight sm:text-4xl md:text-5xl">Kontakt</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Sie haben eine Frage, einen Hinweis auf eine fehlerhafte Angabe oder möchten Ihre Software eintragen? Schreiben Sie uns. Wir antworten in der Regel
            innerhalb von zwei Werktagen.
          </p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </div>
        <aside className="flex flex-col gap-4 lg:pt-20">
          {[
            { icon: Mail, t: "Allgemein", v: email, href: `mailto:${email}` },
            { icon: PenSquare, t: "Redaktion & Korrekturen", v: EDITORIAL_EMAIL, href: `mailto:${EDITORIAL_EMAIL}` },
            { icon: Newspaper, t: "Presse", v: PRESS_EMAIL, href: `mailto:${PRESS_EMAIL}` },
            { icon: Phone, t: "Telefon", v: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}` },
          ].map(({ icon: Icon, t, v, href }) => (
            <a key={t} href={href} className="flex items-start gap-3 rounded-lg border border-border p-4 hover:border-brand">
              <Icon className="mt-0.5 size-5 text-brand-dark" aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold">{t}</span>
                <span className="text-sm text-muted-foreground">{v}</span>
              </span>
            </a>
          ))}
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <MapPin className="mt-0.5 size-5 text-brand-dark" aria-hidden="true" />
            <span className="text-sm">
              <span className="block font-semibold">Anschrift</span>
              <span className="text-muted-foreground">
                Die vollständige Anschrift finden Sie im{" "}
                <Link href="/impressum" className="underline underline-offset-2">
                  Impressum
                </Link>
                .<br />
                {CONTACT_LOCATION}
              </span>
            </span>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <Clock className="mt-0.5 size-5 text-brand-dark" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">Antwort in der Regel innerhalb von zwei Werktagen (Montag bis Freitag).</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
