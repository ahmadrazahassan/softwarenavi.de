import { Check, FileText, Landmark, Receipt, Send, ShieldCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatEuro } from "@/lib/utils/format";

/**
 * Finance product visuals drawn in code (reference „Duna" product panels):
 * paper frame, white UI cards, hairlines, violet accents. Decorative — each carries an aria-label summary.
 */

function Frame({ children, className, label }: { children: React.ReactNode; className?: string; label: string }) {
  return (
    <figure role="img" aria-label={label} className={cn("relative overflow-hidden rounded-xl bg-paper p-5 md:p-8", className)}>
      {children}
    </figure>
  );
}

const card = "rounded-lg border border-border bg-white";

/** E-Rechnung inbox: XRechnung/ZUGFeRD invoices with validation state. */
export function EInvoicePanel({ className }: { className?: string }) {
  const rows = [
    { n: "RE-2026-0418", from: "Druckerei Weber GmbH", fmt: "XRechnung", amt: 1284.5, ok: true },
    { n: "RE-2026-0419", from: "Nordlicht Medien UG", fmt: "ZUGFeRD", amt: 642, ok: true },
    { n: "RE-2026-0420", from: "Brandt Elektro e. K.", fmt: "PDF", amt: 318.9, ok: false },
  ];
  return (
    <Frame className={className} label="Beispielansicht: Eingang von E-Rechnungen mit Formatprüfung">
      <div className={cn(card, "p-4")}>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Receipt className="size-4 text-brand-dark" aria-hidden="true" /> Rechnungseingang
          </p>
          <span className="rounded-sm border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">EN 16931</span>
        </div>
        <ul className="mt-3 divide-y divide-border text-[13px]">
          {rows.map((r) => (
            <li key={r.n} className="grid grid-cols-[1fr_auto] items-center gap-2 py-2.5">
              <span className="min-w-0">
                <span className="block truncate font-medium">{r.from}</span>
                <span className="text-muted-foreground">
                  {r.n} · {r.fmt}
                </span>
              </span>
              <span className="text-right">
                <span className="block font-medium tabular-nums">{formatEuro(r.amt)}</span>
                <span className={cn("text-[11px]", r.ok ? "text-success" : "text-destructive")}>{r.ok ? "gültig" : "keine E-Rechnung"}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className={cn(card, "ml-auto mt-3 flex w-[78%] items-center gap-3 p-3.5")}>
        <ShieldCheck className="size-5 shrink-0 text-brand-dark" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-[13px] leading-snug">
          <span className="font-medium">2 von 3 Belegen</span> <span className="text-muted-foreground">im Originalformat GoBD-konform archiviert</span>
        </p>
      </div>
    </Frame>
  );
}

/** DATEV hand-over: booking batch steps. */
export function DatevExportPanel({ className }: { className?: string }) {
  const steps = [
    { t: "Belege zugeordnet", d: "214 von 214" },
    { t: "Buchungsstapel erstellt", d: "SKR 04 · Juli 2026" },
    { t: "An DATEV übertragen", d: "Kanzlei Wagner & Partner" },
  ];
  return (
    <Frame className={className} label="Beispielansicht: Übergabe eines Buchungsstapels an DATEV">
      <div className={cn(card, "p-4")}>
        <p className="flex items-center gap-2 text-sm font-medium">
          <Send className="size-4 text-brand-dark" aria-hidden="true" /> DATEV-Export
        </p>
        <ol className="mt-4 flex flex-col gap-3">
          {steps.map((s, i) => (
            <li key={s.t} className="flex items-center gap-3 text-[13px]">
              <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-[1.5px]", i < 2 ? "border-brand-dark text-brand-dark" : "border-ink text-ink")}>
                <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="flex-1 font-medium">{s.t}</span>
              <span className="text-muted-foreground">{s.d}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className={cn(card, "p-3.5")}>
          <p className="text-[11px] text-muted-foreground">Umsatzsteuer-Voranmeldung</p>
          <p className="mt-1 font-heading text-lg font-medium tabular-nums">{formatEuro(3842.17)}</p>
          <p className="text-[11px] text-success">per ELSTER übermittelt</p>
        </div>
        <div className={cn(card, "p-3.5")}>
          <p className="text-[11px] text-muted-foreground">Offene Posten</p>
          <p className="mt-1 font-heading text-lg font-medium tabular-nums">{formatEuro(12480)}</p>
          <p className="text-[11px] text-muted-foreground">7 Rechnungen</p>
        </div>
      </div>
    </Frame>
  );
}

/** Compliance check list for a product. */
export function CompliancePanel({ className }: { className?: string }) {
  const items = [
    { t: "GoBD-konform", icon: ShieldCheck },
    { t: "DATEV-Schnittstelle", icon: Send },
    { t: "E-Rechnung: XRechnung + ZUGFeRD", icon: FileText },
    { t: "Serverstandort Deutschland", icon: Landmark },
  ];
  return (
    <Frame className={className} label="Beispielansicht: Compliance-Prüfung eines Programms">
      <div className={cn(card, "p-4")}>
        <p className="text-sm font-medium">Compliance-Prüfung</p>
        <p className="text-[12px] text-muted-foreground">zuletzt geprüft am 15.08.2026</p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {items.map(({ t, icon: Icon }) => (
            <li key={t} className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5 text-[13px]">
              <Icon className="size-4 shrink-0 text-brand-dark" strokeWidth={1.75} aria-hidden="true" />
              <span className="flex-1 font-medium">{t}</span>
              <Check className="size-4 text-success" strokeWidth={2.5} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/** Ratings dashboard: sub-scores as bars + a small trend line. */
export function RatingsPanel({ className }: { className?: string }) {
  const bars = [
    ["Bedienbarkeit", 4.6],
    ["Preis-Leistung", 4.3],
    ["Kundenservice", 4.1],
    ["Funktionsumfang", 4.5],
  ] as const;
  return (
    <Frame className={cn("flex flex-col justify-center", className)} label="Beispielansicht: Auswertung von Nutzerbewertungen">
      <div className={cn(card, "p-5")}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12px] text-muted-foreground">Gesamtbewertung</p>
            <p className="font-heading text-4xl font-medium tracking-[-0.03em] tabular-nums">4,5</p>
          </div>
          <p className="flex items-center gap-1 text-[12px] text-success">
            <TrendingUp className="size-3.5" aria-hidden="true" /> +0,2 in 12 Monaten
          </p>
        </div>
        <svg viewBox="0 0 300 60" className="mt-3 h-14 w-full" aria-hidden="true">
          <polyline points="0,48 40,44 80,46 120,36 160,34 200,26 240,22 300,14" fill="none" stroke="#8A7FFE" strokeWidth="2.5" />
          <line x1="0" y1="59" x2="300" y2="59" stroke="#E6E4EA" />
        </svg>
        <ul className="mt-4 flex flex-col gap-2.5">
          {bars.map(([l, v]) => (
            <li key={l} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-[13px]">
              <span className="text-muted-foreground">{l}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
                <span className="block h-full rounded-full bg-lime" style={{ width: `${(v / 5) * 100}%` }} />
              </span>
              <span className="text-right font-medium tabular-nums">{v.toLocaleString("de-DE", { minimumFractionDigits: 1 })}</span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/** Typographic finance cover for Ratgeber cards — replaces landscape photos. */
export function ArticleCover({ tag, variant = 0, className }: { tag: string | null; variant?: number; className?: string }) {
  const v = variant % 3;
  const bg = v === 0 ? "bg-brand-soft" : v === 1 ? "bg-paper" : "bg-brand";
  return (
    <div className={cn("relative flex h-full w-full flex-col justify-between overflow-hidden p-5", bg, className)} aria-hidden="true">
      <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink/70">{tag}</span>
      {v === 0 && (
        <svg viewBox="0 0 200 80" className="w-3/4 self-end">
          <polyline points="0,70 30,62 60,64 90,44 120,40 150,24 200,10" fill="none" stroke="#15131E" strokeWidth="2.5" />
          <circle cx="200" cy="10" r="4" fill="#15131E" />
        </svg>
      )}
      {v === 1 && (
        <div className="ml-auto w-2/3 rounded-md border border-border bg-white p-3 text-[10px] leading-relaxed text-ink">
          <p className="font-semibold">Rechnung RE-2026-0418</p>
          <p className="mt-1 flex justify-between text-muted-foreground">
            <span>Netto</span>
            <span>1.079,41 €</span>
          </p>
          <p className="flex justify-between text-muted-foreground">
            <span>USt. 19 %</span>
            <span>205,09 €</span>
          </p>
          <p className="mt-1 flex justify-between border-t border-border pt-1 font-semibold">
            <span>Brutto</span>
            <span>1.284,50 €</span>
          </p>
        </div>
      )}
      {v === 2 && (
        <div className="flex items-end gap-2 self-end">
          {[38, 56, 44, 70, 62, 88].map((h, i) => (
            <span key={i} className="w-5 bg-ink" style={{ height: h }} />
          ))}
        </div>
      )}
    </div>
  );
}
