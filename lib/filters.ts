import type { HostingLocation, SoftwareFilters, SoftwareSort } from "@/lib/types";

/** German URL parameters for the directory — part of the localisation, like the slugs. */
export const FILTER_PARAMS = {
  category: "kategorie",
  hosting: "serverstandort",
  datev: "datev",
  gobd: "gobd",
  einv: "erechnung",
  dpa: "avv",
  support: "support",
  rating: "bewertung",
  price: "preis",
  size: "groesse",
  sort: "sortierung",
  view: "ansicht",
  page: "seite",
} as const;

export const SORT_OPTIONS: { value: SoftwareSort; label: string }[] = [
  { value: "reviews", label: "Meiste Bewertungen" },
  { value: "rating", label: "Beste Bewertung" },
  { value: "recent", label: "Zuletzt aktualisiert" },
  { value: "price_asc", label: "Preis aufsteigend" },
];

export const HOSTING_OPTIONS: { value: HostingLocation; label: string }[] = [
  { value: "Deutschland", label: "Deutschland" },
  { value: "EU", label: "EU" },
  { value: "on-premise", label: "On-Premise" },
  { value: "Drittland", label: "Drittland" },
];

export const PRICE_OPTIONS = [
  { value: "testphase", label: "Kostenlose Testphase" },
  { value: "kostenlos", label: "Kostenlose Version" },
  { value: "kostenpflichtig", label: "Nur kostenpflichtig" },
] as const;

export const RATING_OPTIONS = [
  { value: "4.5", label: "4,5 und besser" },
  { value: "4", label: "4,0 und besser" },
  { value: "3.5", label: "3,5 und besser" },
] as const;

export const SIZE_OPTIONS = [
  { value: "klein", label: "Kleinunternehmen (1 bis 49)" },
  { value: "mittel", label: "Mittelstand (50 bis 249)" },
  { value: "gross", label: "Großunternehmen (250+)" },
] as const;

export type SP = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseSoftwareFilters(sp: SP, perPage = 12): SoftwareFilters & { view: "grid" | "list"; categorySlug?: string; size?: string } {
  const p = FILTER_PARAMS;
  const sort = one(sp[p.sort]) as SoftwareSort | undefined;
  const hosting = one(sp[p.hosting]) as HostingLocation | undefined;
  const price = one(sp[p.price]);
  const rating = Number(one(sp[p.rating]));
  const page = Math.max(1, Number(one(sp[p.page])) || 1);
  return {
    categorySlug: one(sp[p.category]),
    hostingLocation: HOSTING_OPTIONS.some((h) => h.value === hosting) ? hosting : undefined,
    datevInterface: one(sp[p.datev]) === "ja" ? "any" : undefined,
    gobdCompliant: one(sp[p.gobd]) === "ja" || undefined,
    eInvoicing: one(sp[p.einv]) === "ja" ? "XRechnung" : undefined,
    dpaAvailable: one(sp[p.dpa]) === "ja" || undefined,
    germanSupport: one(sp[p.support]) === "de" || undefined,
    minRating: rating > 0 && rating <= 5 ? rating : undefined,
    freeTrial: price === "testphase" || undefined,
    freeVersion: price === "kostenlos" || undefined,
    paidOnly: price === "kostenpflichtig" || undefined,
    size: one(sp[p.size]),
    companySize: SIZE_OPTIONS.some((s) => s.value === one(sp[p.size])) ? one(sp[p.size]) : undefined,
    sort: SORT_OPTIONS.some((s) => s.value === sort) ? sort : "reviews",
    view: one(sp[p.view]) === "liste" ? "list" : "grid",
    page,
    perPage,
  };
}

/** Flattens search params for pagination links. */
export function flatParams(sp: SP): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(sp)) out[k] = one(v);
  return out;
}

export function activeFilterCount(sp: SP) {
  const p = FILTER_PARAMS;
  return [p.category, p.hosting, p.datev, p.gobd, p.einv, p.dpa, p.support, p.rating, p.price, p.size].filter((k) => one(sp[k])).length;
}
