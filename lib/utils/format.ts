export const LOCALE = "de-DE";
const NBSP = "\u00A0";

/** 1.234 · 12.480 */
export const formatCount = (n: number) => n.toLocaleString(LOCALE);

/** 1.234,56 € — symbol after the number, non-breaking space before it */
export const formatEuro = (n: number) =>
  new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR" }).format(n);

export const CURRENCIES = ["EUR", "CHF", "USD", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];
export const CURRENCY_SYMBOLS: Record<Currency, string> = { EUR: "€", CHF: "CHF", USD: "US$", GBP: "£" };

export const formatMoney = (v: number, currency: string = "EUR") => {
  const digits = Number.isInteger(v) ? 0 : 2;
  const num = v.toLocaleString(LOCALE, { minimumFractionDigits: digits, maximumFractionDigits: 2 });
  const sym = CURRENCY_SYMBOLS[currency as Currency] ?? currency;
  return `${num}${NBSP}${sym}`;
};

export type BillingPeriod = "month" | "year" | "once";
export type PriceUnit = "account" | "user" | "employee" | "client" | "once";

export const PERIOD_LABEL: Record<string, string> = {
  month: "Monat",
  year: "Jahr",
  once: "einmalig",
};

export const UNIT_LABEL: Record<PriceUnit, string> = {
  account: "",
  user: "Nutzer",
  employee: "Mitarbeitende",
  client: "Mandant",
  once: "",
};

/** „/ Nutzer / Monat“, „/ Monat“, „einmalig“ */
export const formatPeriod = (period: string = "month", unit: PriceUnit = "account") => {
  if (period === "once" || unit === "once") return "einmalig";
  const u = UNIT_LABEL[unit];
  const p = PERIOD_LABEL[period] ?? period;
  return u ? `/${NBSP}${u} /${NBSP}${p}` : `/${NBSP}${p}`;
};

/** „ab 12,90 € / Monat“ — or „Preis auf Anfrage“ */
export const formatPrice = (
  v: number | null | undefined,
  currency = "EUR",
  period: string = "month",
  unit: PriceUnit = "account",
) => {
  if (v === null || v === undefined) return "Preis auf Anfrage";
  if (v === 0) return "Kostenlos";
  return `ab ${formatMoney(v, currency)} ${formatPeriod(period, unit)}`;
};

/** 2. August 2026 */
export const formatDateLong = (d: string | Date) =>
  new Date(d).toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });

/** 02.08.2026 */
export const formatDateShort = (d: string | Date) =>
  new Date(d).toLocaleDateString(LOCALE, { day: "2-digit", month: "2-digit", year: "numeric" });

/** August 2026 */
export const formatMonthYear = (d: string | Date) =>
  new Date(d).toLocaleDateString(LOCALE, { month: "long", year: "numeric" });

/** 4,6 — German decimal comma, one place */
export const formatRating = (n: number) =>
  n.toLocaleString(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** 78 % — non-breaking space before % */
export const formatPercent = (n: number) => `${Math.round(n).toLocaleString(LOCALE)}${NBSP}%`;

export const NET_PRICE_NOTE = `Alle Preise verstehen sich netto zzgl. 19${NBSP}% Umsatzsteuer.`;
