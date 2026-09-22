"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { NativeSelect } from "@/components/ui/form-controls";
import { COMPANY_SIZES, COUNTRIES, DURATIONS, INDUSTRIES, LEGAL_FORMS, rangeLabel } from "@/lib/i18n/options";

const FIELDS = [
  { key: "land", label: "Land", all: "Alle Länder", options: COUNTRIES.map((c) => ({ value: c, label: c })) },
  { key: "branche", label: "Branche", all: "Alle Branchen", options: INDUSTRIES.map((c) => ({ value: c, label: c })) },
  { key: "groesse", label: "Unternehmensgröße", all: "Alle Größen", options: COMPANY_SIZES.map((c) => ({ value: c.value, label: c.label })) },
  { key: "rechtsform", label: "Rechtsform", all: "Alle Rechtsformen", options: LEGAL_FORMS.map((c) => ({ value: c, label: c })) },
  { key: "dauer", label: "Nutzungsdauer", all: "Beliebig", options: DURATIONS.map((c) => ({ value: c, label: rangeLabel(c) })) },
  {
    key: "sterne",
    label: "Sterne",
    all: "Alle Sterne",
    options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} ${n === 1 ? "Stern" : "Sterne"}` })),
  },
  {
    key: "sortierung",
    label: "Sortierung",
    all: "Neueste zuerst",
    options: [
      { value: "hilfreich", label: "Hilfreichste zuerst" },
      { value: "beste", label: "Beste Bewertung zuerst" },
      { value: "kritischste", label: "Kritischste zuerst" },
    ],
  },
] as const;

export function ReviewFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const set = (k: string, v: string) => {
    const q = new URLSearchParams(params.toString());
    if (v) q.set(k, v);
    else q.delete(k);
    q.delete("seite");
    const s = q.toString();
    start(() => router.push(s ? `${pathname}?${s}` : pathname, { scroll: false }));
  };
  const active = FIELDS.some((f) => params.get(f.key));
  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {FIELDS.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label htmlFor={`rf-${f.key}`} className="text-xs font-semibold text-muted-foreground">
              {f.label}
            </label>
            <NativeSelect id={`rf-${f.key}`} value={params.get(f.key) ?? ""} onChange={(e) => set(f.key, e.target.value)} className="h-10 text-sm">
              <option value="">{f.all}</option>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </NativeSelect>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-5 items-center gap-3 text-xs">
        {pending && (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Loader2 className="size-3 animate-spin" aria-hidden="true" /> Wird geladen …
          </span>
        )}
        {active && (
          <button type="button" onClick={() => start(() => router.push(pathname, { scroll: false }))} className="inline-flex items-center gap-1 font-semibold text-brand-dark hover:underline">
            <RotateCcw className="size-3" aria-hidden="true" /> Filter zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
}
