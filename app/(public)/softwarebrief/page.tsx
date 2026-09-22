import type { Metadata } from "next";
import { CalendarClock, MailCheck, ShieldCheck, Undo2 } from "lucide-react";
import { Breadcrumb } from "@/components/public/Layout";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: "Softwarebrief: der Newsletter von Softwarenavi",
  description: "Neue Softwarevergleiche, Fristen wie die E-Rechnungspflicht und Preisänderungen. Höchstens zweimal im Monat, mit Double-Opt-in.",
  alternates: { canonical: "/softwarebrief" },
};

export default function NewsletterPage() {
  return (
    <div className="container-site pt-8">
      <Breadcrumb items={[{ label: "Softwarebrief" }]} />
      <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h1 className="font-heading text-[2rem] font-medium tracking-tight sm:text-4xl md:text-5xl">Der Softwarebrief</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Für Geschäftsführung, Buchhaltung und Personalabteilung: Was sich bei Unternehmenssoftware in Deutschland ändert, kurz gefasst und ohne Werbegetöse.
          </p>
          <ul className="mt-8 flex flex-col gap-5">
            {[
              { icon: CalendarClock, t: "Fristen im Blick", d: "E-Rechnungspflicht, GoBD-Änderungen, Arbeitszeiterfassung. Rechtzeitig und verständlich erklärt." },
              { icon: MailCheck, t: "Höchstens zweimal im Monat", d: "Neue Vergleiche, Tests und Preisänderungen. Kein Spam." },
              { icon: ShieldCheck, t: "Double-Opt-in", d: "Sie erhalten zunächst eine Bestätigungsmail. Erst nach Ihrem Klick senden wir den Newsletter." },
              { icon: Undo2, t: "Jederzeit abbestellbar", d: "Jede Ausgabe enthält einen Abmeldelink. Ein Klick genügt." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg text-brand-dark">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{t}</span>
                  <span className="text-sm text-muted-foreground">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)] md:p-8 lg:self-start">
          <h2 className="font-heading text-xl font-semibold">Jetzt anmelden</h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">Zweck: Versand des Newsletters. Rechtsgrundlage: Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).</p>
          <NewsletterForm variant="full" source="softwarebrief-seite" />
        </div>
      </div>
    </div>
  );
}
