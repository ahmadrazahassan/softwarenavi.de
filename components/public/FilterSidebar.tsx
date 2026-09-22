"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Dialog as D } from "radix-ui";
import { LayoutGrid, List, Loader2, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import {
  FILTER_PARAMS as P,
  HOSTING_OPTIONS,
  PRICE_OPTIONS,
  RATING_OPTIONS,
  SIZE_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/filters";
import { cn } from "@/lib/utils";
import { NativeSelect } from "@/components/ui/form-controls";

type Cat = { slug: string; name: string; software_count: number };

function useFilterNav() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const set = (updates: Record<string, string | null>) => {
    const q = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "") q.delete(k);
      else q.set(k, v);
    }
    if (!(P.page in updates)) q.delete(P.page);
    const s = q.toString();
    start(() => router.push(s ? `${pathname}?${s}` : pathname, { scroll: false }));
  };
  const reset = () => {
    const q = new URLSearchParams();
    const keep = [P.sort, P.view];
    for (const k of keep) {
      const v = params.get(k);
      if (v) q.set(k, v);
    }
    const s = q.toString();
    start(() => router.push(s ? `${pathname}?${s}` : pathname, { scroll: false }));
  };
  return { params, set, reset, pending };
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="py-4 first:pt-1">
      <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{title}</legend>
      <div className="flex flex-col gap-0.5">{children}</div>
    </fieldset>
  );
}

function Option({
  type,
  name,
  checked,
  onChange,
  label,
  count,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="-mx-2 flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-ink/85 transition-colors hover:bg-paper hover:text-ink has-[:checked]:font-medium has-[:checked]:text-ink">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 accent-[var(--color-brand)]"
      />
      <span className="min-w-0 flex-1">{label}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-muted-foreground">{count}</span>}
    </label>
  );
}

function FilterFields({ categories, hideCategory }: { categories: Cat[]; hideCategory?: boolean }) {
  const { params, set } = useFilterNav();
  const val = (k: string) => params.get(k) ?? "";
  const toggle = (k: string, v: string) => set({ [k]: val(k) === v ? null : v });

  return (
    <div>
      {!hideCategory && (
        <Group title="Kategorie">
          <Option type="radio" name="f-kat" checked={!val(P.category)} onChange={() => set({ [P.category]: null })} label="Alle Kategorien" />
          {categories.map((c) => (
            <Option key={c.slug} type="radio" name="f-kat" checked={val(P.category) === c.slug} onChange={() => set({ [P.category]: c.slug })} label={c.name} count={c.software_count} />
          ))}
        </Group>
      )}
      <Group title="Serverstandort">
        <Option type="radio" name="f-host" checked={!val(P.hosting)} onChange={() => set({ [P.hosting]: null })} label="Beliebig" />
        {HOSTING_OPTIONS.map((h) => (
          <Option key={h.value} type="radio" name="f-host" checked={val(P.hosting) === h.value} onChange={() => set({ [P.hosting]: h.value })} label={h.label} />
        ))}
      </Group>
      <Group title="Compliance">
        <Option type="checkbox" name="f-datev" checked={val(P.datev) === "ja"} onChange={() => toggle(P.datev, "ja")} label="DATEV-Schnittstelle" />
        <Option type="checkbox" name="f-gobd" checked={val(P.gobd) === "ja"} onChange={() => toggle(P.gobd, "ja")} label="GoBD-konform" />
        <Option type="checkbox" name="f-einv" checked={val(P.einv) === "ja"} onChange={() => toggle(P.einv, "ja")} label="E-Rechnung (XRechnung)" />
        <Option type="checkbox" name="f-avv" checked={val(P.dpa) === "ja"} onChange={() => toggle(P.dpa, "ja")} label="AV-Vertrag verfügbar" />
        <Option type="checkbox" name="f-de" checked={val(P.support) === "de"} onChange={() => toggle(P.support, "de")} label="Deutschsprachiger Support" />
      </Group>
      <Group title="Bewertung">
        <Option type="radio" name="f-rat" checked={!val(P.rating)} onChange={() => set({ [P.rating]: null })} label="Alle Bewertungen" />
        {RATING_OPTIONS.map((r) => (
          <Option key={r.value} type="radio" name="f-rat" checked={val(P.rating) === r.value} onChange={() => set({ [P.rating]: r.value })} label={r.label} />
        ))}
      </Group>
      <Group title="Preis">
        <Option type="radio" name="f-price" checked={!val(P.price)} onChange={() => set({ [P.price]: null })} label="Alle Preismodelle" />
        {PRICE_OPTIONS.map((p) => (
          <Option key={p.value} type="radio" name="f-price" checked={val(P.price) === p.value} onChange={() => set({ [P.price]: p.value })} label={p.label} />
        ))}
      </Group>
      <Group title="Unternehmensgröße">
        <Option type="radio" name="f-size" checked={!val(P.size)} onChange={() => set({ [P.size]: null })} label="Alle Größen" />
        {SIZE_OPTIONS.map((s) => (
          <Option key={s.value} type="radio" name="f-size" checked={val(P.size) === s.value} onChange={() => set({ [P.size]: s.value })} label={s.label} />
        ))}
      </Group>
    </div>
  );
}

/** Sticky on desktop; a Radix Dialog sheet on mobile with „Filter (3)" trigger. */
export function FilterSidebar({ categories, activeCount, hideCategory }: { categories: Cat[]; activeCount: number; hideCategory?: boolean }) {
  const { reset, pending } = useFilterNav();
  return (
    <>
      <aside aria-label="Filter" className="scrollbar-none sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto pb-6 lg:block">
        <div className="mb-4 flex h-10 items-center justify-between border-b border-border pb-3">
          <h2 className="flex items-center gap-2 font-heading text-sm font-semibold">
            <SlidersHorizontal className="size-4" aria-hidden="true" /> Filter
            {pending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-label="Wird geladen" />}
          </h2>
          {activeCount > 0 && (
            <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-dark hover:underline">
              <RotateCcw className="size-3" aria-hidden="true" /> Filter zurücksetzen
            </button>
          )}
        </div>
        <FilterFields categories={categories} hideCategory={hideCategory} />
      </aside>

      <D.Root>
        <D.Trigger className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-white px-4 text-sm font-semibold lg:hidden">
          <SlidersHorizontal className="size-4" aria-hidden="true" /> Filter{activeCount > 0 ? ` (${activeCount})` : ""}
        </D.Trigger>
        <D.Portal>
          <D.Overlay className="fixed inset-0 z-[70] bg-ink/40 lg:hidden" />
          <D.Content className="fixed inset-x-0 bottom-0 z-[71] flex max-h-[88dvh] flex-col rounded-t-xl bg-white shadow-2xl outline-none lg:hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <D.Title className="font-heading text-lg font-semibold">Filter{activeCount > 0 ? ` (${activeCount})` : ""}</D.Title>
              <D.Description className="sr-only">Ergebnisse nach Kategorie, Serverstandort, Compliance, Bewertung, Preis und Unternehmensgröße filtern</D.Description>
              <D.Close className="grid size-9 place-items-center rounded-md hover:bg-paper" aria-label="Filter schließen">
                <X className="size-5" />
              </D.Close>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterFields categories={categories} hideCategory={hideCategory} />
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
              <button type="button" onClick={reset} className="h-11 rounded-md border border-border text-sm font-semibold">
                Filter zurücksetzen
              </button>
              <D.Close className="h-11 rounded-[7px] btn-glossy text-sm font-medium">Ergebnisse anzeigen</D.Close>
            </div>
          </D.Content>
        </D.Portal>
      </D.Root>
    </>
  );
}

export function SortAndView({ view }: { view: "grid" | "list" }) {
  const { params, set } = useFilterNav();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sortierung" className="sr-only">
        Sortierung
      </label>
      <NativeSelect id="sortierung" value={params.get(P.sort) ?? "reviews"} onChange={(e) => set({ [P.sort]: e.target.value === "reviews" ? null : e.target.value })} className="h-10 w-auto rounded-md text-sm">
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </NativeSelect>
      <div className="hidden rounded-md border border-border p-1 sm:flex" role="group" aria-label="Ansicht">
        {(
          [
            ["grid", LayoutGrid, "Kachelansicht"],
            ["list", List, "Listenansicht"],
          ] as const
        ).map(([v, Icon, label]) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            aria-label={label}
            onClick={() => set({ [P.view]: v === "list" ? "liste" : null })}
            className={cn("grid size-8 place-items-center rounded-md", view === v ? "bg-ink text-white" : "text-muted-foreground hover:text-foreground")}
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
    </div>
  );
}
