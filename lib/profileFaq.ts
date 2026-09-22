import type { Software } from "@/lib/types";
import { formatMoney, formatPeriod } from "@/lib/utils/format";

/**
 * Generated profile FAQ (frontend §7.3). The last three questions are German-market specific and are
 * answered strictly from the compliance columns — an unknown value produces „keine Angabe", never a guess.
 */
export function buildProfileFaq(s: Software): { q: string; a: string }[] {
  const vendor = s.vendor_name ?? "der Anbieter";
  const price =
    s.starting_price === null
      ? `${vendor} veröffentlicht für ${s.name} keine Listenpreise; der Preis wird auf Anfrage individuell kalkuliert.`
      : s.starting_price === 0
        ? `${s.name} ist in einer kostenlosen Version erhältlich.`
        : `${s.name} kostet ab ${formatMoney(s.starting_price, s.price_currency)} ${formatPeriod(s.billing_period, s.price_unit)} (netto zzgl. 19 % Umsatzsteuer).${s.free_trial ? " Eine kostenlose Testphase ist verfügbar." : ""}${s.free_version ? " Zusätzlich gibt es eine kostenlose Version." : ""}`;

  const gobd =
    s.gobd_compliant === "ja"
      ? `Laut Herstellerangaben ist ${s.name} GoBD-konform. Beachten Sie, dass die GoBD-Konformität immer auch von Ihrer eigenen Verfahrensdokumentation abhängt.`
      : s.gobd_compliant === "teilweise"
        ? `${s.name} erfüllt die GoBD laut Herstellerangaben teilweise. Prüfen Sie im Einzelfall, welche Module oder Konfigurationen erforderlich sind.`
        : s.gobd_compliant === "nein"
          ? `Nach Herstellerangaben ist ${s.name} nicht GoBD-konform.`
          : `Zur GoBD-Konformität von ${s.name} liegen uns keine Angaben vor.`;

  const datev =
    s.datev_interface === "vollintegriert"
      ? `Ja. ${s.name} arbeitet direkt auf der DATEV-Datenbasis bzw. ist vollständig in DATEV integriert.`
      : s.datev_interface === "export"
        ? `Ja. ${s.name} bietet einen DATEV-Export, mit dem Buchungsdaten an die Steuerkanzlei übergeben werden können.`
        : s.datev_interface === "nein"
          ? `Nein, ${s.name} bietet keine DATEV-Schnittstelle.`
          : `Zu einer DATEV-Schnittstelle liegen uns für ${s.name} keine Angaben vor.`;

  const host =
    s.hosting_location === "Deutschland"
      ? `Die Daten werden in Rechenzentren in Deutschland gespeichert.`
      : s.hosting_location === "EU"
        ? `Die Daten werden in Rechenzentren innerhalb der EU gespeichert.`
        : s.hosting_location === "on-premise"
          ? `${s.name} wird im eigenen Rechenzentrum bzw. auf eigenen Servern betrieben. Die Daten bleiben bei Ihnen.`
          : s.hosting_location === "Drittland"
            ? `Die Daten werden standardmäßig außerhalb der EU gespeichert. Für eine DSGVO-konforme Nutzung sind zusätzliche Garantien erforderlich.`
            : `Zum Serverstandort liegen uns keine Angaben vor.`;
  const dpa = s.dpa_available === true ? " Ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO ist verfügbar." : "";

  return [
    { q: `Was ist ${s.name}?`, a: s.description_short },
    { q: `Was kostet ${s.name}?`, a: price },
    {
      q: `Welche Funktionen bietet ${s.name}?`,
      a: `Zu den wichtigsten Funktionen gehören: ${s.top_features.join(", ")}. Insgesamt deckt ${s.name} ${s.features.length} der von uns erfassten Kernfunktionen ab.`,
    },
    {
      q: `Mit welchen Programmen lässt sich ${s.name} verbinden?`,
      a: s.integrations.length ? `${s.name} bietet unter anderem Integrationen mit ${s.integrations.join(", ")}.` : `Zu Integrationen liegen uns keine Angaben vor.`,
    },
    {
      q: `Welchen Support bietet ${vendor}?`,
      a: `Support erhalten Sie über ${s.support_types.join(", ")}.${s.german_support ? " Der Support ist deutschsprachig." : ""}`,
    },
    { q: `Ist ${s.name} GoBD-konform?`, a: gobd },
    { q: `Gibt es eine DATEV-Schnittstelle?`, a: datev },
    { q: `Wo werden die Daten gespeichert?`, a: host + dpa },
  ];
}
