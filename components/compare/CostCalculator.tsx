"use client";

import { useId, useState } from "react";
import type { Software } from "@/lib/types";
import { formatMoney } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

type Side = Pick<Software, "id" | "name" | "starting_price" | "price_currency" | "price_unit" | "billing_period" | "pricing_note" | "free_trial" | "trial_days">;

const UNIT_TEXT: Record<Software["price_unit"], string> = {
  account: "Pauschalpreis je Konto",
  user: "je Nutzer",
  employee: "je Mitarbeitendem",
  client: "je Mandant",
  once: "einmalige Lizenz",
};

/**
 * Richtwert-Rechner: what the entry plan costs for a given team size over 1, 12 and 36 months.
 * Deliberately simple and transparent: entry price × seats (for per-seat pricing), otherwise the flat price.
 * It never guesses prices the vendor does not publish.
 */
function monthly(s: Side, seats: number): number | null {
  if (s.starting_price === null) return null;
  if (s.starting_price === 0) return 0;
  const perMonth = s.billing_period === "year" ? s.starting_price / 12 : s.starting_price;
  if (s.price_unit === "user" || s.price_unit === "employee") return perMonth * seats;
  return perMonth;
}

export function CostCalculator({ a, b }: { a: Side; b: Side }) {
  const [seats, setSeats] = useState(5);
  const id = useId();
  const rows = [a, b].map((s) => {
    const once = s.billing_period === "once" || s.price_unit === "once";
    const m = once ? null : monthly(s, seats);
    return { s, once, m };
  });
  const comparable = rows.every((r) => r.m !== null && !r.once);
  const cheaper = comparable ? (rows[0].m! < rows[1].m! ? 0 : rows[1].m! < rows[0].m! ? 1 : -1) : -1;

  const fmt = (v: number | null, s: Side) => (v === null ? "auf Anfrage" : v === 0 ? "kostenlos" : formatMoney(Math.round(v * 100) / 100, s.price_currency));

  return (
    <div className="rounded-2xl border border-border bg-white">
      <div className="flex flex-col gap-4 border-b border-border p-6 md:flex-row md:items-end md:justify-between md:p-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Kostenrechner</p>
          <p className="mt-2 font-heading text-xl font-medium tracking-[-0.02em]">Was kostet der Einstiegstarif für Ihr Team?</p>
        </div>
        <div className="w-full md:w-80">
          <label htmlFor={id} className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">Nutzer bzw. Mitarbeitende</span>
            <span className="font-heading text-2xl font-medium tabular-nums">{seats}</span>
          </label>
          <input
            id={id}
            type="range"
            min={1}
            max={100}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-ink)]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>1</span>
            <span>25</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2">
        {rows.map(({ s, once, m }, i) => (
          <div key={s.id} className={cn("p-6 md:p-8", i === 0 && "border-b border-border md:border-b-0 md:border-r")}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-heading text-lg font-medium">{s.name}</p>
              {cheaper === i && <span className="rounded-full bg-lime px-2.5 py-0.5 text-[11.5px] font-semibold text-ink">günstiger</span>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {UNIT_TEXT[s.price_unit]}
              {s.pricing_note ? ` · ${s.pricing_note}` : ""}
            </p>
            {once ? (
              <dl className="mt-5">
                <dt className="text-xs text-muted-foreground">Einmalig</dt>
                <dd className="font-heading text-3xl font-medium tracking-[-0.03em] tabular-nums">{fmt(s.starting_price, s)}</dd>
              </dl>
            ) : (
              <dl className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["pro Monat", m],
                  ["pro Jahr", m === null ? null : m * 12],
                  ["in 3 Jahren", m === null ? null : m * 36],
                ].map(([label, v]) => (
                  <div key={label as string}>
                    <dt className="text-xs text-muted-foreground">{label as string}</dt>
                    <dd className="mt-0.5 font-heading text-xl font-medium tracking-[-0.02em] tabular-nums md:text-2xl">{fmt(v as number | null, s)}</dd>
                  </div>
                ))}
              </dl>
            )}
            {s.free_trial && (
              <p className="mt-4 text-sm text-muted-foreground">
                Vorher testen: {s.trial_days ? `${s.trial_days} Tage kostenlos` : "kostenlose Testphase verfügbar"}.
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="border-t border-border px-6 py-4 text-xs leading-relaxed text-muted-foreground md:px-8">
        Richtwert auf Basis des veröffentlichten Einstiegspreises, netto zzgl. 19 % Umsatzsteuer. Pauschaltarife enthalten nur eine begrenzte Zahl an
        Nutzern, größere Teams brauchen oft einen höheren Tarif. Einrichtung, Zusatzmodule und Aktionsrabatte sind nicht berücksichtigt.
      </p>
    </div>
  );
}
