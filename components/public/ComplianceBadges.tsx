import { FileCheck2, FileText, Languages, MapPin, ReceiptText, Send, ShieldCheck, ScrollText, BadgeCheck, Lock } from "lucide-react";
import type { ComplianceBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDateShort } from "@/lib/utils/format";

type BadgeDef = { key: string; label: string; icon: React.ElementType };

/** Card badges, priority order Serverstandort → DATEV → GoBD → E-Rechnung (frontend §8.4). */
export function complianceBadgesFor(s: ComplianceBlock): BadgeDef[] {
  const out: BadgeDef[] = [];
  if (s.hosting_location === "Deutschland") out.push({ key: "host", label: "Serverstandort Deutschland", icon: MapPin });
  else if (s.hosting_location === "EU") out.push({ key: "host", label: "Hosting in der EU", icon: MapPin });
  else if (s.hosting_location === "on-premise") out.push({ key: "host", label: "On-Premise", icon: MapPin });
  if (s.datev_interface === "vollintegriert") out.push({ key: "datev", label: "DATEV integriert", icon: Send });
  else if (s.datev_interface === "export") out.push({ key: "datev", label: "DATEV-Export", icon: Send });
  if (s.gobd_compliant === "ja") out.push({ key: "gobd", label: "GoBD-konform", icon: ShieldCheck });
  const e = s.e_invoicing ?? [];
  if (e.includes("XRechnung") && e.includes("ZUGFeRD")) out.push({ key: "einv", label: "E-Rechnung: ZUGFeRD + XRechnung", icon: ReceiptText });
  else if (e.length) out.push({ key: "einv", label: `E-Rechnung: ${e.join(" + ")}`, icon: ReceiptText });
  if (s.dpa_available) out.push({ key: "dpa", label: "AV-Vertrag verfügbar", icon: FileCheck2 });
  if (s.elster_submission) out.push({ key: "elster", label: "ELSTER-Anbindung", icon: Send });
  if (s.german_support) out.push({ key: "de", label: "Deutschsprachiger Support", icon: Languages });
  return out;
}

/** Hairline chips — icon inline in violet, no filled background. */
export function ComplianceBadges({ software, max = 4, className }: { software: ComplianceBlock; max?: number; className?: string }) {
  const badges = complianceBadgesFor(software).slice(0, max);
  if (!badges.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)} aria-label="Compliance-Merkmale">
      {badges.map(({ key, label, icon: Icon }) => (
        <li key={key} className="inline-flex items-center gap-1 rounded-sm border border-border px-1.5 py-0.5 text-[11.5px] font-medium text-ink">
          <Icon className="size-3 text-brand-dark" aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

const KA = "keine Angabe";

type Row = { label: string; value: string; ok: boolean | null; note: string; icon: React.ElementType };

export function complianceRows(s: ComplianceBlock): Row[] {
  const gobd = s.gobd_compliant;
  const datev = s.datev_interface;
  const e = s.e_invoicing ?? [];
  const host = s.hosting_location;
  const yn = (v: boolean | null | undefined) => (v === true ? "ja" : v === false ? "nein" : KA);
  const ok = (v: boolean | null | undefined) => (v === undefined ? null : v);
  return [
    {
      label: "Serverstandort",
      value: host ?? KA,
      ok: host ? host === "Deutschland" || host === "EU" || host === "on-premise" : null,
      note: "Wo die Daten gespeichert werden. Nach DSGVO ist ein Hosting in der EU gleichwertig; „Drittland“ erfordert zusätzliche Garantien.",
      icon: MapPin,
    },
    {
      label: "DATEV-Schnittstelle",
      value: datev === "vollintegriert" ? "vollintegriert" : datev === "export" ? "Export" : datev === "nein" ? "nein" : KA,
      ok: datev ? datev !== "nein" : null,
      note: "Entscheidend für die Zusammenarbeit mit der Steuerkanzlei.",
      icon: Send,
    },
    {
      label: "GoBD-konform",
      value: gobd ?? KA,
      ok: gobd ? gobd === "ja" : null,
      note: "Unveränderbare Buchungen und revisionssichere Archivierung nach den GoBD.",
      icon: ShieldCheck,
    },
    {
      label: "E-Rechnung",
      value: e.length ? e.join(" + ") : s.gobd_compliant || s.datev_interface ? "keine" : KA,
      ok: e.length ? true : s.gobd_compliant || s.datev_interface ? false : null,
      note: "Empfang seit 2025 Pflicht; Ausstellung ab 2027 (> 800.000 € Vorjahresumsatz) bzw. 2028.",
      icon: ReceiptText,
    },
    {
      label: "ELSTER-Übermittlung",
      value: yn(s.elster_submission),
      ok: ok(s.elster_submission),
      note: "UStVA bzw. Lohnsteueranmeldung direkt aus der Software an das Finanzamt.",
      icon: FileText,
    },
    {
      label: "AV-Vertrag (Art. 28 DSGVO)",
      value: s.dpa_available === true ? "verfügbar" : s.dpa_available === false ? "nicht verfügbar" : KA,
      ok: ok(s.dpa_available),
      note: "Pflicht, wenn der Anbieter personenbezogene Daten in Ihrem Auftrag verarbeitet.",
      icon: ScrollText,
    },
    {
      label: "ISO 27001",
      value: yn(s.iso27001),
      ok: ok(s.iso27001),
      note: "Zertifiziertes Informationssicherheits-Managementsystem.",
      icon: Lock,
    },
    {
      label: "Deutschsprachiger Support",
      value: yn(s.german_support),
      ok: ok(s.german_support),
      note: "Hilfe per Telefon, E-Mail oder Chat auf Deutsch.",
      icon: Languages,
    },
    ...(s.skr_support && s.skr_support.length
      ? [
          {
            label: "Kontenrahmen",
            value: s.skr_support.map((x) => x.replace("SKR", "SKR ")).join(" / "),
            ok: true,
            note: "Unterstützte DATEV-Standardkontenrahmen.",
            icon: BadgeCheck,
          },
        ]
      : []),
    ...(s.tse_certified !== null && s.tse_certified !== undefined
      ? [
          {
            label: "Kassensicherung (TSE)",
            value: yn(s.tse_certified),
            ok: s.tse_certified,
            note: "Zertifizierte technische Sicherheitseinrichtung nach KassenSichV.",
            icon: ShieldCheck,
          },
        ]
      : []),
  ];
}

export function ComplianceFootnote({ checkedAt }: { checkedAt?: string | null }) {
  return (
    <p className="text-xs text-muted-foreground">
      Angaben nach Herstellerinformation{checkedAt ? `, zuletzt geprüft am ${formatDateShort(checkedAt)}` : ""}. Keine Rechtsberatung.
    </p>
  );
}
