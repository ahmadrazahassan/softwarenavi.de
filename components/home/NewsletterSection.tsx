import { MailCheck, ShieldCheck, Undo2 } from "lucide-react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const TRUST = [
  { icon: ShieldCheck, t: "Double-Opt-in" },
  { icon: MailCheck, t: "Höchstens 2× im Monat" },
  { icon: Undo2, t: "1 Klick zum Abbestellen" },
];

/** Homepage email capture: one dark, quiet break in an otherwise white page. No stats, no hype. */
export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-title" className="mt-28 px-3 md:px-6">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[1.25rem] bg-ink px-4 py-16 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:px-8 md:py-20">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <span className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-white/50">
            <span className="size-2 bg-brand" aria-hidden="true" />
            Newsletter
          </span>
          <h2 id="newsletter-title" className="mt-4 text-balance font-heading text-[2rem] font-medium leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">
            Was sich ändert, bevor es zum Problem wird
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65 md:text-base">
            Neue Vergleiche, Testberichte und Fristen wie die E-Rechnungspflicht. Kurz gefasst, ohne Werbegetöse.
          </p>
          <div className="mt-8 w-full max-w-md">
            <NewsletterForm variant="dark" source="homepage-newsletter" />
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {TRUST.map(({ icon: Icon, t }) => (
              <li key={t} className="inline-flex items-center gap-1.5 text-xs text-white/45">
                <Icon className="size-3.5" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
