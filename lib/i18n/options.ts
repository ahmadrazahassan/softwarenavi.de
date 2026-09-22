/** Shared German option pools — used by forms, filters and (later) the admin panel. */

export const COUNTRIES = ["Deutschland", "Österreich", "Schweiz", "Luxemburg", "Sonstige"] as const;
export const DEFAULT_COUNTRY = "Deutschland";

/** EU KMU definition (Empfehlung 2003/361/EG) */
export const COMPANY_SIZES = [
  { value: "1–9", label: "1 bis 9 Mitarbeitende", hint: "Kleinstunternehmen" },
  { value: "10–49", label: "10 bis 49 Mitarbeitende", hint: "Kleinunternehmen" },
  { value: "50–249", label: "50 bis 249 Mitarbeitende", hint: "Mittleres Unternehmen" },
  { value: "250–499", label: "250 bis 499 Mitarbeitende", hint: "Großunternehmen" },
  { value: "500+", label: "ab 500 Mitarbeitende", hint: "Großunternehmen" },
] as const;

export const INDUSTRIES = [
  "Handwerk",
  "Einzelhandel",
  "E-Commerce",
  "Produktion & Fertigung",
  "IT & Software",
  "Gesundheitswesen",
  "Steuerberatung",
  "Bauwesen",
  "Logistik & Transport",
  "Gastronomie & Hotellerie",
  "Bildung",
  "Rechtsberatung",
  "Immobilien",
  "Agentur & Marketing",
  "Verein & Non-Profit",
  "Sonstige",
] as const;

export const DURATIONS = [
  "weniger als 6 Monate",
  "6–12 Monate",
  "1–2 Jahre",
  "2–5 Jahre",
  "mehr als 5 Jahre",
] as const;

export const LEGAL_FORMS = [
  "GmbH",
  "UG (haftungsbeschränkt)",
  "GbR",
  "Einzelunternehmen",
  "e. K.",
  "GmbH & Co. KG",
  "AG",
  "Freiberuflich",
  "Verein",
  "Sonstige",
] as const;

export const RATING_DIMENSIONS = [
  { key: "ease_of_use", ratingKey: "ease_of_use_rating", label: "Bedienbarkeit" },
  { key: "value_for_money", ratingKey: "value_for_money_rating", label: "Preis-Leistung" },
  { key: "customer_service", ratingKey: "customer_service_rating", label: "Kundenservice" },
  { key: "functionality", ratingKey: "functionality_rating", label: "Funktionsumfang" },
] as const;

/** Stored values keep the en dash (data contract); anything shown to people reads „1 bis 9". */
export const rangeLabel = (v: string) => v.replace(/\s*–\s*/g, " bis ").replace(/^(\d+)\+$/, "ab $1");

/** Profile page „Wer nutzt es?“ buckets */
export const USER_BUCKETS = [
  { key: "klein", label: "Kleinunternehmen", range: "1 bis 49", sizes: ["1–9", "10–49"] },
  { key: "mittel", label: "Mittelstand", range: "50 bis 249", sizes: ["50–249"] },
  { key: "gross", label: "Großunternehmen", range: "ab 250", sizes: ["250–499", "500+"] },
] as const;
