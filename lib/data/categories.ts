import type { Category } from "@/lib/types";

/**
 * Demo seed — mirrors backend §8.1. Replaced by Supabase reads in the backend phase.
 * `software_count` is recomputed from the roster in lib/data/index.ts (the DB trigger does this later).
 */
export const CATEGORY_SEED: Omit<Category, "software_count" | "created_at">[] = [
  {
    id: "cat-buchhaltung",
    slug: "buchhaltungssoftware",
    name: "Buchhaltungssoftware",
    icon: "calculator",
    display_order: 1,
    description:
      "Buchhaltung, Rechnungsstellung, Umsatzsteuer-Voranmeldung und Auswertungen. GoBD-konform und mit DATEV-Schnittstelle für die Zusammenarbeit mit Ihrer Steuerkanzlei.",
  },
  {
    id: "cat-lohn",
    slug: "lohnabrechnung",
    name: "Lohnabrechnung",
    icon: "wallet",
    display_order: 2,
    description:
      "Entgeltabrechnung, Lohnsteueranmeldung, DEÜV-Meldungen und Lohnsteuerbescheinigungen für deutsche Arbeitgeber.",
  },
  {
    id: "cat-hr",
    slug: "hr-software",
    name: "HR-Software",
    icon: "users",
    display_order: 3,
    description:
      "Personalverwaltung, Abwesenheiten, Onboarding, Zeugnisse und digitale Personalakte. DSGVO-konform und betriebsratstauglich.",
  },
  {
    id: "cat-crm",
    slug: "crm-software",
    name: "CRM-Software",
    icon: "handshake",
    display_order: 4,
    description: "Kontakte, Leads, Angebote und Vertriebsprozesse für den deutschen Mittelstand.",
  },
  {
    id: "cat-erp",
    slug: "erp-warenwirtschaft",
    name: "ERP & Warenwirtschaft",
    icon: "boxes",
    display_order: 5,
    description:
      "Warenwirtschaft, Einkauf, Produktion und Finanzen in einem System, vom Handwerksbetrieb bis zum Mittelständler.",
  },
  {
    id: "cat-pm",
    slug: "projektmanagement",
    name: "Projektmanagement",
    icon: "kanban",
    display_order: 6,
    description:
      "Aufgaben, Zeitpläne und Auslastung im Team, inklusive Anbieter mit Serverstandort in Deutschland.",
  },
  {
    id: "cat-zeit",
    slug: "zeiterfassung",
    name: "Zeiterfassung",
    icon: "clock",
    display_order: 7,
    description: "Arbeitszeiterfassung nach dem BAG-Beschluss: mobil, manipulationssicher und auswertbar.",
  },
  {
    id: "cat-dms",
    slug: "dokumentenmanagement",
    name: "Dokumentenmanagement",
    icon: "folder-archive",
    display_order: 8,
    description: "Revisionssichere Archivierung nach GoBD, Belegablage und Freigabeprozesse.",
  },
];

/**
 * Feature catalogue per category — the profile's FeatureChecklist renders this list with ✓/✗
 * against the product's `features`. German copy lives in data, never hardcoded in components.
 */
export const FEATURE_CATALOGUE: Record<string, { name: string; description: string }[]> = {
  "cat-buchhaltung": [
    { name: "Rechnungen & Angebote", description: "Angebote, Auftragsbestätigungen und Rechnungen mit fortlaufender Nummerierung erstellen." },
    { name: "E-Rechnung (XRechnung/ZUGFeRD)", description: "E-Rechnungen nach EN 16931 empfangen, prüfen und ausstellen." },
    { name: "Belegerfassung per OCR", description: "Belege fotografieren oder hochladen; Betrag, Datum und Steuersatz werden automatisch ausgelesen." },
    { name: "Bankanbindung", description: "Kontoumsätze per FinTS/PSD2 abrufen und Zahlungen automatisch zuordnen." },
    { name: "UStVA per ELSTER", description: "Umsatzsteuer-Voranmeldung direkt aus der Software an das Finanzamt übermitteln." },
    { name: "EÜR", description: "Einnahmen-Überschuss-Rechnung nach § 4 Abs. 3 EStG inklusive Anlage EÜR." },
    { name: "Bilanz & GuV", description: "Doppelte Buchführung mit Jahresabschluss nach HGB." },
    { name: "DATEV-Export", description: "Buchungsstapel und Belege im DATEV-Format an die Steuerkanzlei übergeben." },
    { name: "Mahnwesen", description: "Zahlungserinnerungen und Mahnstufen automatisch versenden." },
    { name: "Kassenbuch", description: "GoBD-konformes Kassenbuch mit Festschreibung." },
    { name: "Anlagenverwaltung", description: "Anlagevermögen mit Abschreibungen (AfA) verwalten." },
    { name: "SEPA-Lastschrift", description: "Lastschriften und Überweisungen als SEPA-Datei erzeugen." },
    { name: "Mobile App", description: "Belege und Rechnungen unterwegs per App erfassen." },
  ],
  "cat-lohn": [
    { name: "Entgeltabrechnung", description: "Monatliche Lohn- und Gehaltsabrechnung inklusive Sonderzahlungen." },
    { name: "ELStAM-Abruf", description: "Lohnsteuerabzugsmerkmale elektronisch beim Bundeszentralamt für Steuern abrufen." },
    { name: "Lohnsteueranmeldung", description: "Lohnsteueranmeldung fristgerecht bis zum 10. des Folgemonats übermitteln." },
    { name: "DEÜV-Meldungen", description: "An-, Ab- und Jahresmeldungen an die Sozialversicherung." },
    { name: "Beitragsnachweise", description: "Beitragsnachweise an die Krankenkassen übermitteln." },
    { name: "Lohnsteuerbescheinigung", description: "Jährliche Lohnsteuerbescheinigungen elektronisch übermitteln." },
    { name: "bAV & Entgeltumwandlung", description: "Betriebliche Altersvorsorge und Entgeltumwandlung abbilden." },
    { name: "Umlagen U1/U2/U3", description: "Erstattungsanträge nach dem Aufwendungsausgleichsgesetz stellen." },
    { name: "Mitarbeiterportal", description: "Abrechnungen digital an Mitarbeitende bereitstellen." },
    { name: "DATEV-Schnittstelle", description: "Lohnjournale und Buchungen an die Finanzbuchhaltung übergeben." },
    { name: "Baulohn", description: "Branchenspezifische Abrechnung für das Baugewerbe (SOKA-BAU)." },
  ],
  "cat-hr": [
    { name: "Digitale Personalakte", description: "Verträge, Zeugnisse und Dokumente zentral und zugriffsgeschützt ablegen." },
    { name: "Abwesenheitsmanagement", description: "Urlaub, Krankheit und Sonderurlaub beantragen, genehmigen und auswerten." },
    { name: "Recruiting & Bewerbermanagement", description: "Stellen ausschreiben, Bewerbungen sichten und Einstellungen steuern." },
    { name: "Onboarding", description: "Checklisten und Workflows für neue Mitarbeitende." },
    { name: "Zeiterfassung", description: "Arbeitszeiten erfassen und mit Abwesenheiten verrechnen." },
    { name: "Vorbereitende Lohnabrechnung", description: "Lohnrelevante Daten gesammelt an Kanzlei oder Lohnbüro übergeben." },
    { name: "Performance & Feedback", description: "Zielvereinbarungen, Mitarbeitergespräche und Feedbackrunden." },
    { name: "Zeugnisgenerator", description: "Arbeitszeugnisse mit Textbausteinen erstellen." },
    { name: "Reisekosten", description: "Reisekostenabrechnung nach den Pauschalen des BMF." },
    { name: "Rollen & Rechte", description: "Fein abgestufte Berechtigungen, wichtig für die Abstimmung mit dem Betriebsrat." },
    { name: "Mitarbeiter-App", description: "Self-Service für Mitarbeitende per App." },
  ],
  "cat-crm": [
    { name: "Kontakt- & Firmenverwaltung", description: "Kontakte, Firmen und Ansprechpartner zentral pflegen." },
    { name: "Vertriebspipeline", description: "Verkaufschancen in Phasen verfolgen und prognostizieren." },
    { name: "Angebotserstellung", description: "Angebote direkt aus dem CRM erzeugen." },
    { name: "E-Mail-Integration", description: "E-Mails aus Outlook oder Gmail automatisch zuordnen." },
    { name: "Marketing-Automation", description: "Kampagnen, Newsletter und Lead-Scoring." },
    { name: "Aufgaben & Wiedervorlagen", description: "Termine, Aufgaben und Wiedervorlagen im Team." },
    { name: "Berichte & Dashboards", description: "Umsatz, Pipeline und Aktivitäten auswerten." },
    { name: "Double-Opt-in-Verwaltung", description: "Einwilligungen DSGVO-konform dokumentieren." },
    { name: "Mobile App", description: "Kundendaten unterwegs abrufen und pflegen." },
    { name: "Telefonie-Integration", description: "Anrufe aus dem CRM starten und protokollieren." },
  ],
  "cat-erp": [
    { name: "Warenwirtschaft", description: "Artikel, Lager, Chargen und Inventur verwalten." },
    { name: "Einkauf & Bestellwesen", description: "Bestellvorschläge, Lieferanten und Wareneingang." },
    { name: "Auftragsabwicklung", description: "Vom Angebot über den Lieferschein bis zur Rechnung." },
    { name: "Produktion & Stücklisten", description: "Stücklisten, Arbeitspläne und Fertigungsaufträge." },
    { name: "Finanzbuchhaltung", description: "Integrierte FiBu oder Übergabe an DATEV." },
    { name: "E-Commerce-Anbindung", description: "Shopify, Shopware, Amazon und weitere Marktplätze anbinden." },
    { name: "E-Rechnung (XRechnung/ZUGFeRD)", description: "E-Rechnungen im Ein- und Ausgang verarbeiten." },
    { name: "Kassensystem (TSE)", description: "Kasse mit zertifizierter technischer Sicherheitseinrichtung." },
    { name: "Mehrlager & Versand", description: "Mehrere Lager und Versanddienstleister (DHL, DPD, GLS) anbinden." },
    { name: "CRM-Funktionen", description: "Kundenverwaltung und Vertriebsfunktionen im ERP." },
    { name: "Controlling & Berichte", description: "Kennzahlen, Deckungsbeiträge und Auswertungen." },
  ],
  "cat-pm": [
    { name: "Aufgaben & Kanban", description: "Aufgaben in Listen und Boards organisieren." },
    { name: "Gantt-Diagramm", description: "Zeitpläne, Abhängigkeiten und Meilensteine planen." },
    { name: "Ressourcen & Auslastung", description: "Auslastung im Team sichtbar machen und planen." },
    { name: "Zeiterfassung", description: "Zeiten auf Projekte und Aufgaben buchen." },
    { name: "Budget & Controlling", description: "Projektbudgets und Ist-Kosten verfolgen." },
    { name: "Dokumente & Dateien", description: "Dateien an Projekten und Aufgaben ablegen." },
    { name: "Kommunikation & Chat", description: "Diskussionen direkt am Projekt führen." },
    { name: "Gastzugänge", description: "Kunden und externe Partner einbinden." },
    { name: "Vorlagen", description: "Wiederkehrende Projekte aus Vorlagen anlegen." },
    { name: "On-Premise-Option", description: "Betrieb im eigenen Rechenzentrum möglich." },
  ],
  "cat-zeit": [
    { name: "Mobile Zeiterfassung", description: "Arbeitszeiten per App, Browser oder Terminal erfassen." },
    { name: "Projektzeiten", description: "Zeiten auf Kunden und Projekte buchen." },
    { name: "Pausen- & ArbZG-Prüfung", description: "Pausen und Höchstarbeitszeiten nach dem Arbeitszeitgesetz prüfen." },
    { name: "Urlaubsverwaltung", description: "Urlaubsanträge und Resturlaub verwalten." },
    { name: "Schichtplanung", description: "Dienst- und Schichtpläne erstellen." },
    { name: "Terminal & NFC", description: "Stempeln per Terminal, Chip oder NFC." },
    { name: "Lohnexport", description: "Stunden und Zuschläge an die Lohnabrechnung übergeben." },
    { name: "Überstundenkonto", description: "Gleitzeit- und Überstundenkonten automatisch führen." },
    { name: "Manipulationsschutz", description: "Änderungen protokolliert und nachvollziehbar." },
  ],
  "cat-dms": [
    { name: "Revisionssichere Archivierung", description: "Unveränderbare Ablage nach GoBD mit Aufbewahrungsfristen." },
    { name: "Volltextsuche & OCR", description: "Dokumente per Texterkennung durchsuchbar machen." },
    { name: "Rechnungseingangsworkflow", description: "Eingangsrechnungen prüfen, freigeben und buchen." },
    { name: "E-Rechnung (XRechnung/ZUGFeRD)", description: "E-Rechnungen empfangen und archivieren." },
    { name: "Versionierung", description: "Dokumentversionen nachvollziehbar speichern." },
    { name: "Rollen & Rechte", description: "Zugriffe feingranular steuern." },
    { name: "DATEV-Anbindung", description: "Belege an DATEV Unternehmen online übergeben." },
    { name: "E-Mail-Archivierung", description: "E-Mails revisionssicher archivieren." },
    { name: "Mobile App", description: "Dokumente unterwegs erfassen und freigeben." },
    { name: "Verfahrensdokumentation", description: "Vorlagen für die GoBD-Verfahrensdokumentation." },
  ],
};

/**
 * Feature catalogue for a product. Looks up by category slug as well as by id, because categories
 * loaded from Supabase carry database UUIDs while the catalogue is keyed by the authored ids.
 */
export function featureCatalogueFor(s: { category_id: string | null; category?: { slug: string } | null }) {
  if (s.category_id && FEATURE_CATALOGUE[s.category_id]) return FEATURE_CATALOGUE[s.category_id];
  const local = CATEGORY_SEED.find((c) => c.slug === s.category?.slug);
  return (local && FEATURE_CATALOGUE[local.id]) ?? [];
}
