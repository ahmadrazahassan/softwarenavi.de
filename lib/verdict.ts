import type { Software } from "@/lib/types";
import { formatMoney, formatRating } from "@/lib/utils/format";

/**
 * Data-driven comparison verdict. No vendor is favoured by code: the text is derived from ratings,
 * review volume, price and compliance flags only. An editor's `custom_verdict` takes precedence.
 */
export function buildVerdict(a: Software, b: Software): { summary: string; pointsA: string[]; pointsB: string[] } {
  const pts = (x: Software, y: Software) => {
    const out: string[] = [];
    if (x.overall_rating - y.overall_rating >= 0.2) out.push(`bessere Gesamtbewertung (${formatRating(x.overall_rating)} gegenüber ${formatRating(y.overall_rating)})`);
    if (x.ease_of_use_rating - y.ease_of_use_rating >= 0.2) out.push("wird als einfacher zu bedienen bewertet");
    if (x.value_for_money_rating - y.value_for_money_rating >= 0.2) out.push("besseres Preis-Leistungs-Verhältnis");
    if (x.customer_service_rating - y.customer_service_rating >= 0.2) out.push("stärker bewerteter Kundenservice");
    if (x.functionality_rating - y.functionality_rating >= 0.2) out.push("größerer Funktionsumfang");
    if (x.starting_price !== null && (y.starting_price === null || x.starting_price < y.starting_price))
      out.push(`günstigerer Einstieg ab ${formatMoney(x.starting_price, x.price_currency)} netto`);
    if (x.free_version && !y.free_version) out.push("kostenlose Version verfügbar");
    if (x.hosting_location === "Deutschland" && y.hosting_location !== "Deutschland") out.push("Serverstandort in Deutschland");
    if ((x.datev_interface === "vollintegriert" || x.datev_interface === "export") && !(y.datev_interface === "vollintegriert" || y.datev_interface === "export"))
      out.push("DATEV-Schnittstelle vorhanden");
    if (x.datev_interface === "vollintegriert" && y.datev_interface === "export") out.push("tiefere DATEV-Integration");
    if (x.gobd_compliant === "ja" && y.gobd_compliant !== "ja") out.push("GoBD-Konformität laut Hersteller");
    if ((x.e_invoicing?.length ?? 0) > (y.e_invoicing?.length ?? 0)) out.push("breitere Unterstützung für E-Rechnungsformate");
    if (x.features.length - y.features.length >= 2) out.push("deckt mehr der erfassten Kernfunktionen ab");
    if (x.review_count >= y.review_count * 1.5 && x.review_count - y.review_count >= 8) out.push("deutlich mehr Erfahrungsberichte als Entscheidungsgrundlage");
    return out;
  };
  const pointsA = pts(a, b);
  const pointsB = pts(b, a);

  // Only call it a user rating when both scores really come from published user reviews.
  const bothUsers = a.rating_source !== "redaktion" && b.rating_source !== "redaktion" && a.review_count > 0 && b.review_count > 0;
  const noun = bothUsers ? "Nutzerbewertung" : "Bewertung";
  let summary: string;
  const diff = a.overall_rating - b.overall_rating;
  if (Math.abs(diff) < 0.2) {
    summary = `${a.name} und ${b.name} liegen in der ${noun} nahezu gleichauf. Die Entscheidung hängt daher vor allem von Ihren Anforderungen ab, insbesondere von Preis, Funktionsumfang und den Compliance-Merkmalen, die für Ihr Unternehmen zählen.`;
  } else {
    const [w, l] = diff > 0 ? [a, b] : [b, a];
    summary = `${w.name} erreicht mit ${formatRating(w.overall_rating)} von 5 Punkten die höhere ${noun} als ${l.name} (${formatRating(l.overall_rating)}). Das heißt nicht, dass ${w.name} für jedes Unternehmen die bessere Wahl ist. Prüfen Sie die Unterschiede bei Preis, Funktionen und Compliance unten.`;
  }
  return { summary, pointsA, pointsB };
}
