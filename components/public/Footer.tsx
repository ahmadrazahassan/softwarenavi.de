import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteSettings, Software } from "@/lib/types";
import { BrandLogo } from "./BrandLogo";
import { SocialIcons } from "./SocialIcons";
import { CookieSettingsLink } from "./Consent";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { CONTACT_LOCATION, CONTACT_PHONE, EDITORIAL_EMAIL } from "@/lib/site";

const EXPLORE = [
  { href: "/", label: "Startseite" },
  { href: "/software", label: "Software" },
  { href: "/kategorien", label: "Kategorien" },
  { href: "/vergleich", label: "Vergleich" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/softwarebrief", label: "Softwarebrief" },
];

const COMPANY = [
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/redaktionelle-grundsaetze", label: "Redaktionelle Grundsätze" },
  { href: "/affiliate-hinweis", label: "Affiliate-Hinweis" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/barrierefreiheit", label: "Barrierefreiheit" },
];

const linkCls = "text-[14.5px] text-ink transition-colors hover:text-brand-dark";
const headCls = "text-[12px] font-medium uppercase tracking-[0.14em] text-muted-foreground";

/** Two-card footer (reference „Kresna"): violet brand card + light navigation card, oversized wordmark behind. */
export function Footer({ settings, popular }: { settings: SiteSettings; popular: Pick<Software, "name" | "slug">[] }) {
  const year = new Date().getFullYear();
  const email = settings.contact_email || "hallo@softwarenavi.de";
  const phone = settings.contact_phone || CONTACT_PHONE;
  return (
    <footer className="relative mt-28 overflow-hidden px-3 pb-3 md:px-6 md:pb-6">
      <div className="relative z-[1] mx-auto grid max-w-[1400px] gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)]">
        {/* Brand card */}
        <div className="flex min-h-[22rem] flex-col justify-between rounded-xl bg-brand p-7 text-ink md:p-9">
          <BrandLogo monochrome />
          <div>
            <p className="font-heading text-[1.7rem] font-medium leading-[1.1] tracking-[-0.02em]">
              Unabhängige Software-Vergleiche <span className="text-ink/60">für den deutschen Mittelstand.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/80">{settings.footer_tagline}</p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-medium">Bleiben Sie in Kontakt</span>
              <SocialIcons
                links={{
                  linkedin: settings.social_linkedin,
                  xing: settings.social_xing,
                  twitter: settings.social_twitter,
                  facebook: settings.social_facebook,
                }}
              />
              <a href={`mailto:${email}`} className="text-sm font-medium underline decoration-ink/40 underline-offset-4 hover:decoration-ink">
                {email}
              </a>
            </div>
          </div>
        </div>

        {/* Navigation card */}
        <div className="flex flex-col justify-between gap-10 rounded-xl bg-paper p-7 md:p-9">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <nav aria-labelledby="f-entdecken">
              <h2 id="f-entdecken" className={headCls}>
                Entdecken
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {EXPLORE.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-labelledby="f-unternehmen">
              <h2 id="f-unternehmen" className={headCls}>
                Unternehmen
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {COMPANY.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-labelledby="f-beliebt">
              <h2 id="f-beliebt" className={headCls}>
                Beliebte Software
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {popular.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/software/${s.slug}`} className={linkCls}>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h2 className={headCls}>Kontakt</h2>
              <ul className="mt-4 flex flex-col gap-2.5 text-[14.5px]">
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className={linkCls}>
                      {phone}
                    </a>
                  </li>
                )}
                <li>
                  <a href={`mailto:${email}`} className={linkCls}>
                    {email}
                  </a>
                </li>
                <li className="text-muted-foreground">{CONTACT_LOCATION}</li>
                <li>
                  <a
                    href={`mailto:${EDITORIAL_EMAIL}?subject=${encodeURIComponent("Software vorschlagen")}`}
                    className="group inline-flex items-center gap-1 font-medium text-ink hover:text-brand-dark"
                  >
                    Software vorschlagen
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end">
            <div className="flex flex-col gap-4 text-[13px] text-muted-foreground">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <li>
                  <Link href="/impressum" className="font-medium text-ink hover:text-brand-dark">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="hover:text-ink">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <CookieSettingsLink className="hover:text-ink" />
                </li>
                <li>
                  <Link href="/agb" className="hover:text-ink">
                    AGB
                  </Link>
                </li>
              </ul>
              <p>© {year} Softwarenavi. Alle Rechte vorbehalten.</p>
            </div>
            <section aria-labelledby="footer-newsletter">
              <h2 id="footer-newsletter" className="font-heading text-lg font-medium leading-snug tracking-[-0.01em]">
                <span className="text-muted-foreground">Software ändert sich schnell.</span>
                <br />
                Bleiben Sie mit Softwarenavi auf dem Laufenden.
              </h2>
              <div className="mt-4">
                <NewsletterForm variant="compact" source="footer" />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Oversized wordmark behind the cards */}
      <p
        aria-hidden="true"
        className="pointer-events-none mx-auto mt-10 max-w-[1400px] select-none overflow-hidden px-4 pb-6 text-center font-heading text-[12vw] font-semibold leading-[0.85] tracking-[-0.055em] text-paper md:mt-14 lg:text-[9.5rem]"
      >
        Softwarenavi
      </p>
    </footer>
  );
}
