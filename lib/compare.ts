import type { Software } from "@/lib/types";
import { formatMoney, formatPeriod, formatRating } from "@/lib/utils/format";
import { complianceRows } from "@/components/public/ComplianceBadges";

/**
 * Everything the detailed comparison page derives from two products. Pure functions over the stored data:
 * no product is favoured by code, every statement can be traced back to a field in the dataset.
 */

export const priceText = (s: Software) =>
  s.starting_price === null
    ? "auf Anfrage"
    : s.starting_price === 0
      ? "kostenlos"
      : `ab ${formatMoney(s.starting_price, s.price_currency)} ${formatPeriod(s.billing_period, s.price_unit)}`;

export const UNIT_TEXT: Record<Software["price_unit"], string> = {
  account: "Pauschal je Konto",
  user: "je Nutzer",
  employee: "je Mitarbeitendem",
  client: "je Mandant",
  once: "Einmalige Lizenz",
};

const HOSTING_TEXT: Record<string, string> = {
  Deutschland: "Rechenzentren in Deutschland",
  EU: "Rechenzentren in der EU",
  Drittland: "außerhalb der EU",
  "on-premise": "auf eigenen Rechnern (lokal)",
};

const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} und ${xs[xs.length - 1]}`);
const norm = (x: string) => x.trim().toLowerCase();

export const trialText = (s: Software) => (s.free_trial ? (s.trial_days ? `${s.trial_days} Tage kostenlos` : "ja, kostenlos") : "nein");

/** Share of the category's feature catalogue a product covers. */
export function featureCoverage(s: Software, catalogue: { name: string }[]) {
  const hit = catalogue.filter((f) => s.features.includes(f.name)).length;
  return { hit, total: catalogue.length };
}

// ───────────── Kurzprofil ─────────────

export type FactRow = { label: string; a: string; b: string };

export function factRows(a: Software, b: Software, catalogue: { name: string }[]): FactRow[] {
  const row = (label: string, f: (s: Software) => string | null | undefined): FactRow => ({ label, a: f(a) || "keine Angabe", b: f(b) || "keine Angabe" });
  return [
    row("Anbieter", (s) => s.vendor_name),
    row("Firmensitz", (s) => [s.vendor_hq, s.vendor_country].filter(Boolean).join(", ")),
    row("Gegründet", (s) => (s.founded_year ? String(s.founded_year) : null)),
    row("Kategorie", (s) => s.category?.name),
    row("Einstiegspreis", priceText),
    row("Abrechnung", (s) => UNIT_TEXT[s.price_unit]),
    row("Tarife", (s) => (s.pricing_plans.length ? `${s.pricing_plans.length} Tarife` : null)),
    row("Kostenlos testen", trialText),
    row("Kostenlose Demo", (s) => (s.free_demo ? "ja" : "nein")),
    row("Gratis-Version", (s) => (s.free_version ? "ja" : "nein")),
    row("Datenhaltung", (s) => (s.hosting_location ? HOSTING_TEXT[s.hosting_location] : null)),
    row("Abgedeckte Funktionen", (s) => {
      const c = featureCoverage(s, catalogue);
      return c.total ? `${c.hit} von ${c.total}` : null;
    }),
    row("Integrationen", (s) => (s.integrations.length ? `${s.integrations.length} erfasst` : null)),
    row("Sprachen", (s) => s.languages.join(", ")),
    row("Verfügbar in", (s) => s.countries_available.join(", ")),
    row("Support", (s) => s.support_types.join(", ")),
  ];
}

// ───────────── Sieger je Kategorie ─────────────

export type Round = { label: string; detail: string; a: string; b: string; winner: 0 | 1 | null };

const compScore = (s: Software) => complianceRows(s).filter((r) => r.ok === true).length;
const offerScore = (s: Software) => (s.free_version ? 2 : 0) + (s.free_trial ? 1 : 0) + (s.free_demo ? 1 : 0);
const supportScore = (s: Software) => s.support_types.length + (s.german_support ? 1 : 0);

function duel(av: number, bv: number, higherWins = true, margin = 0): 0 | 1 | null {
  if (Math.abs(av - bv) <= margin) return null;
  return (av > bv) === higherWins ? 0 : 1;
}

export function rounds(a: Software, b: Software, catalogue: { name: string }[]): Round[] {
  const fa = featureCoverage(a, catalogue);
  const fb = featureCoverage(b, catalogue);
  const pa = a.starting_price;
  const pb = b.starting_price;
  const sameUnit = a.price_unit === b.price_unit && a.billing_period === b.billing_period;
  const priceWinner: 0 | 1 | null =
    pa === null && pb === null ? null : pa === null ? 1 : pb === null ? 0 : duel(pa, pb, false, 0.001);
  const offers = (s: Software) => [s.free_version && "Gratis-Version", s.free_trial && "Testphase", s.free_demo && "Demo"].filter(Boolean).join(", ") || "keine";
  return [
    {
      label: "Gesamtbewertung",
      detail: "Durchschnitt aus Bedienbarkeit, Preis-Leistung, Service und Funktionsumfang",
      a: formatRating(a.overall_rating),
      b: formatRating(b.overall_rating),
      winner: duel(a.overall_rating, b.overall_rating, true, 0.05),
    },
    {
      label: "Einstiegspreis",
      detail: sameUnit ? "gleiches Preismodell, direkt vergleichbar" : "unterschiedliche Preismodelle, siehe Kostenrechner",
      a: priceText(a),
      b: priceText(b),
      winner: priceWinner,
    },
    {
      label: "Funktionsumfang",
      detail: "Anteil der für die Kategorie wichtigen Kernfunktionen",
      a: fa.total ? `${fa.hit} von ${fa.total}` : `${a.features.length}`,
      b: fb.total ? `${fb.hit} von ${fb.total}` : `${b.features.length}`,
      winner: duel(fa.hit, fb.hit),
    },
    {
      label: "Integrationen",
      detail: "Anzahl der erfassten Anbindungen an andere Programme",
      a: String(a.integrations.length),
      b: String(b.integrations.length),
      winner: duel(a.integrations.length, b.integrations.length),
    },
    {
      label: "Compliance",
      detail: "erfüllte Merkmale wie GoBD, DATEV, E-Rechnung, AVV und Serverstandort",
      a: `${compScore(a)} Merkmale`,
      b: `${compScore(b)} Merkmale`,
      winner: duel(compScore(a), compScore(b)),
    },
    {
      label: "Ausprobieren",
      detail: "Gratis-Version, Testphase und Demo",
      a: offers(a),
      b: offers(b),
      winner: duel(offerScore(a), offerScore(b)),
    },
    {
      label: "Support",
      detail: "Kontaktwege und Support auf Deutsch",
      a: `${a.support_types.length} Kanäle`,
      b: `${b.support_types.length} Kanäle`,
      winner: duel(supportScore(a), supportScore(b)),
    },
  ];
}

// ───────────── Wählen Sie …, wenn ─────────────

export function chooseIf(x: Software, y: Software, catalogue: { name: string }[]): string[] {
  const out: string[] = [];
  if (x.free_version && !y.free_version) out.push("Sie zunächst mit einer kostenlosen Version starten möchten");
  if (x.starting_price !== null && x.starting_price > 0 && y.starting_price !== null && y.starting_price > 0 && x.starting_price < y.starting_price && x.price_unit === y.price_unit)
    out.push(`ein niedriger Einstiegspreis zählt (${formatMoney(x.starting_price, x.price_currency)} statt ${formatMoney(y.starting_price, y.price_currency)})`);
  if (x.price_unit === "account" && (y.price_unit === "user" || y.price_unit === "employee"))
    out.push("mehrere Personen mitarbeiten sollen, ohne dass für jeden Zugang extra bezahlt wird");
  if ((x.price_unit === "user" || x.price_unit === "employee") && y.price_unit === "account")
    out.push("Sie die Kosten genau an die Zahl der Nutzer koppeln möchten");
  if (x.hosting_location === "Deutschland" && y.hosting_location !== "Deutschland") out.push("Ihre Daten ausschließlich auf Servern in Deutschland liegen sollen");
  if (x.hosting_location === "on-premise" && y.hosting_location !== "on-premise") out.push("Sie die Daten lieber im eigenen Haus auf eigenen Rechnern behalten");
  if (x.hosting_location !== "on-premise" && y.hosting_location === "on-premise") out.push("Sie ohne Installation im Browser arbeiten und keine Updates einspielen möchten");
  if (x.datev_interface === "vollintegriert" && y.datev_interface !== "vollintegriert") out.push("Ihre Steuerkanzlei mit DATEV arbeitet und die Daten direkt übernehmen soll");
  if (featureCoverage(x, catalogue).hit - featureCoverage(y, catalogue).hit >= 2) out.push("Sie viele Kernfunktionen in einem Programm brauchen");
  if (x.ease_of_use_rating - y.ease_of_use_rating >= 0.2) out.push("eine einfache Bedienung ohne lange Einarbeitung Vorrang hat");
  if (x.customer_service_rating - y.customer_service_rating >= 0.2) out.push("Ihnen ein gut erreichbarer Support besonders wichtig ist");
  if ((x.trial_days ?? 0) > (y.trial_days ?? 0) && x.free_trial) out.push(`Sie länger testen möchten (${x.trial_days} Tage)`);
  if (x.features.includes("Mobile App") && !y.features.includes("Mobile App")) out.push("Sie auch unterwegs per App arbeiten möchten");
  if (x.languages.length > y.languages.length) out.push(`Mitarbeitende auch auf ${list(x.languages.filter((l) => !y.languages.includes(l)))} arbeiten`);
  const own = integrationSplit(x, y).onlyA.slice(0, 3);
  if (own.length) out.push(`Sie ${list(own)} anbinden möchten`);
  return out.slice(0, 6);
}

// ───────────── Integrationen ─────────────

export function integrationSplit(a: Software, b: Software) {
  const bSet = new Set(b.integrations.map(norm));
  const aSet = new Set(a.integrations.map(norm));
  return {
    both: a.integrations.filter((i) => bSet.has(norm(i))),
    onlyA: a.integrations.filter((i) => !bSet.has(norm(i))),
    onlyB: b.integrations.filter((i) => !aSet.has(norm(i))),
  };
}

// ───────────── FAQ ─────────────

export function pairFaq(a: Software, b: Software, catalogue: { name: string }[]): { q: string; a: string }[] {
  const both = [a, b];
  const faq: { q: string; a: string }[] = [];
  const source = both.some((s) => s.rating_source === "redaktion" || s.review_count === 0)
    ? " Solange für ein Programm noch keine veröffentlichten Nutzerbewertungen vorliegen, zeigen wir die Note aus unserem Redaktionstest und kennzeichnen sie entsprechend."
    : "";

  // price
  {
    const parts = both.map((s) => `${s.name} kostet ${priceText(s)}${s.pricing_note ? ` (${s.pricing_note})` : ""}`);
    const sameUnit = a.price_unit === b.price_unit;
    const tail = sameUnit
      ? " Da beide gleich abrechnen, lassen sich die Einstiegspreise direkt vergleichen."
      : ` Die Preismodelle unterscheiden sich: ${a.name} rechnet ${UNIT_TEXT[a.price_unit].toLowerCase()} ab, ${b.name} ${UNIT_TEXT[b.price_unit].toLowerCase()}. Mit dem Kostenrechner auf dieser Seite sehen Sie, was das für Ihre Teamgröße bedeutet.`;
    faq.push({ q: `Was ist günstiger, ${a.name} oder ${b.name}?`, a: `${parts.join(", ")}. Alle Preise netto zzgl. Umsatzsteuer.${tail}` });
  }

  // trial
  faq.push({
    q: `Kann ich ${a.name} und ${b.name} kostenlos testen?`,
    a: both
      .map((s) => {
        const o = [
          s.free_version && "eine dauerhaft kostenlose Version",
          s.free_trial && (s.trial_days ? `eine ${s.trial_days} Tage lange Testphase` : "eine kostenlose Testphase"),
          s.free_demo && "eine kostenlose Demo",
        ].filter(Boolean) as string[];
        return o.length ? `${s.name} bietet ${list(o)}.` : `${s.name} bietet laut Hersteller keine kostenlose Testmöglichkeit an.`;
      })
      .join(" "),
  });

  // rating
  {
    const diff = a.overall_rating - b.overall_rating;
    const lead = Math.abs(diff) < 0.1 ? `Beide liegen mit ${formatRating(a.overall_rating)} und ${formatRating(b.overall_rating)} von 5 Punkten praktisch gleichauf.` : `${diff > 0 ? a.name : b.name} liegt mit ${formatRating(Math.max(a.overall_rating, b.overall_rating))} von 5 Punkten vorn, ${diff > 0 ? b.name : a.name} erreicht ${formatRating(Math.min(a.overall_rating, b.overall_rating))}.`;
    faq.push({ q: `Welches Programm schneidet in der Bewertung besser ab?`, a: `${lead}${source}` });
  }

  // DATEV
  if (both.some((s) => s.datev_interface)) {
    const t = (s: Software) =>
      s.datev_interface === "vollintegriert"
        ? `${s.name} ist direkt mit DATEV verbunden, die Kanzlei kann Buchungsdaten und Belege ohne Umweg übernehmen`
        : s.datev_interface === "export"
          ? `${s.name} bietet einen DATEV-Export, den Sie an die Kanzlei übergeben`
          : s.datev_interface === "nein"
            ? `${s.name} hat keine DATEV-Schnittstelle`
            : `zu ${s.name} liegt uns keine Angabe vor`;
    faq.push({ q: `Haben ${a.name} und ${b.name} eine DATEV-Schnittstelle?`, a: `${t(a)}. ${t(b).charAt(0).toUpperCase()}${t(b).slice(1)}.` });
  }

  // hosting
  if (both.some((s) => s.hosting_location)) {
    faq.push({
      q: "Wo werden die Daten gespeichert?",
      a: `${both.map((s) => `${s.name}: ${s.hosting_location ? HOSTING_TEXT[s.hosting_location] : "keine Angabe"}`).join(". ")}. ${both.some((s) => s.dpa_available) ? `Einen Auftragsverarbeitungsvertrag nach Art. 28 DSGVO stellt ${list(both.filter((s) => s.dpa_available).map((s) => s.name))} bereit.` : ""}`.trim(),
    });
  }

  // e-invoicing
  if (both.some((s) => (s.e_invoicing ?? []).length || s.category_id === "cat-buchhaltung")) {
    faq.push({
      q: "Sind beide Programme für die E-Rechnungspflicht gerüstet?",
      a: `${both.map((s) => ((s.e_invoicing ?? []).length ? `${s.name} unterstützt ${list(s.e_invoicing!)}` : `für ${s.name} sind keine E-Rechnungsformate erfasst`)).join(". ")}. Seit dem 1. Januar 2025 müssen Unternehmen E-Rechnungen empfangen können, die Pflicht zum Ausstellen folgt ab 2027 für Unternehmen mit mehr als 800.000 € Vorjahresumsatz und ab 2028 für alle.`,
    });
  }

  // features
  if (catalogue.length) {
    const fa = catalogue.filter((f) => a.features.includes(f.name) && !b.features.includes(f.name)).map((f) => f.name);
    const fb = catalogue.filter((f) => b.features.includes(f.name) && !a.features.includes(f.name)).map((f) => f.name);
    const ca = featureCoverage(a, catalogue);
    const cb = featureCoverage(b, catalogue);
    faq.push({
      q: "Worin unterscheiden sich die Funktionen?",
      a: `Von ${ca.total} wichtigen Funktionen der Kategorie deckt ${a.name} ${ca.hit} ab, ${b.name} ${cb.hit}.${fa.length ? ` Nur ${a.name} bietet ${list(fa.slice(0, 4))}.` : ""}${fb.length ? ` Nur ${b.name} bietet ${list(fb.slice(0, 4))}.` : ""}${!fa.length && !fb.length ? " Bei den Kernfunktionen gibt es keine Unterschiede." : ""}`,
    });
  }

  // support
  faq.push({
    q: "Welchen Support bieten die Hersteller?",
    a: both
      .map((s) => `${s.name} ist per ${list(s.support_types.length ? s.support_types : ["keine Angabe"])} erreichbar${s.german_support ? ", Support auf Deutsch" : ""}`)
      .join(". ")
      .concat("."),
  });

  // who for
  if (a.ideal_for || b.ideal_for) {
    faq.push({
      q: `Für wen eignet sich ${a.name}, für wen ${b.name}?`,
      a: both.map((s) => (s.ideal_for ? `${s.name}: ${s.ideal_for}` : "")).filter(Boolean).join(" "),
    });
  }
  return faq;
}
