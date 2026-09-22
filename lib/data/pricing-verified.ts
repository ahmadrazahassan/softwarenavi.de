import type { PricingPlan } from "@/lib/types";
import type { PriceUnit } from "@/lib/utils/format";

/**
 * Prices, trials and demos checked on the vendors' own German pricing pages on 22.09.2026.
 * Listed prices are regular net list prices (zzgl. MwSt.). Launch promotions are deliberately ignored,
 * because they expire and would leave the site showing a price nobody gets any more.
 * Anything not listed here falls back to the roster value. Re-check quarterly.
 */
export const PRICES_CHECKED_AT = "2026-09-22";

export interface PriceFacts {
  price?: number | null;
  unit?: PriceUnit;
  period?: "month" | "year" | "once";
  plans?: PricingPlan[];
  trial?: boolean;
  trialDays?: number | null;
  demo?: boolean;
  free?: boolean;
  website?: string;
  note?: string | null;
}

const plan = (name: string, price: number | null, unit: PriceUnit, features: string[], extra: Partial<PricingPlan> = {}): PricingPlan => ({
  name,
  price,
  period: "month",
  unit,
  features,
  ...extra,
});

export const VERIFIED: Record<string, PriceFacts> = {
  // ───────────── Sage ─────────────
  "sage-active": {
    price: 25,
    trial: true,
    trialDays: 30,
    demo: true,
    website: "https://www.sage.com/de-de/produkte/sage-active/",
    plans: [
      plan("Starter", 25, "account", ["1 Unternehmen, 5 Nutzer", "Angebote und Rechnungen", "KI-Belegerfassung inkl. E-Rechnung", "Bankabgleich", "Sage Copilot"]),
      plan("Essentials", 49, "account", ["10 Nutzer, 2 Mitarbeitende in der Lohnabrechnung", "Doppelte Buchführung SKR03/SKR04", "EÜR, Bilanz, GuV", "UStVA per ELSTER", "Lohnabrechnung und HR"], { highlighted: true }),
    ],
  },
  "sage-50-connected": {
    price: 30,
    unit: "user",
    trial: true,
    trialDays: 30,
    demo: true,
    website: "https://www.sage.com/de-de/produkte/sage-50connected/",
    note: "pro Arbeitsplatz",
    plans: [
      plan("Standard", 30, "user", ["Angebote und Rechnungen", "Integriertes Onlinebanking", "Warenwirtschaft", "Digitale Belegarchivierung", "EÜR oder Bilanz", "DATEV-Schnittstelle, E-Rechnung"]),
      plan("Comfort", 35, "user", ["Alles aus Standard", "Anlagenbuchhaltung", "Bestellwesen", "ab 2 Arbeitsplätzen"], { highlighted: true }),
      plan("Professional", 40, "user", ["Alles aus Comfort", "Erweiterte Warenwirtschaft", "ab 3 Arbeitsplätzen"]),
    ],
  },
  "sage-50-handwerk": {
    price: 19.9,
    trial: false,
    demo: true,
    website: "https://www.sage.com/de-de/produkte/sage-50-handwerk/",
    note: "bei jährlicher Zahlung, 12 Monate Laufzeit",
    plans: [
      plan("Essential", 19.9, "account", ["1 Benutzer", "Angebote, Aufträge, Rechnungen", "E-Rechnung (ZUGFeRD 2.1, XRechnung)", "Projektverwaltung"]),
      plan("Enterprise", 59, "account", ["Unbegrenzte Benutzer", "Teil- und Schlussrechnungen", "Terminkalender", "Optional: Nachkalkulation, Wartung und Service, Fibu"], { highlighted: true }),
    ],
  },
  "sage-100": {
    price: 56,
    unit: "user",
    trial: false,
    demo: true,
    website: "https://www.sage.com/de-de/produkte/sage-100/",
    note: "je Modul, bei jährlicher Zahlung, 12 Monate Laufzeit",
    plans: [
      plan("Warenwirtschaft", 56, "user", ["Kunden- und Lieferantenverwaltung", "Bestellwesen und Kommissionierung", "Lager und Inventur", "Seriennummern und Chargen"]),
      plan("Rechnungswesen", 58, "user", ["Finanz- und Anlagenbuchhaltung", "Controlling und Dashboard", "Mahnwesen, offene Posten", "UStVA per ELSTER"], { highlighted: true }),
      plan("Produktion", 90, "user", ["Einzel-, Projekt- und Serienfertigung", "Kalkulation und BDE", "Grafische Ressourcenplanung"]),
    ],
  },
  "sage-hr-payroll": {
    price: 40,
    trial: true,
    trialDays: 30,
    demo: true,
    website: "https://www.sage.com/de-de/produkte/sage-hr-payroll/",
    note: "inkl. 5 Mitarbeitende, jeder weitere ab 7 €",
    plans: [
      plan("Essentials", 40, "account", ["Cloud HR und Cloud Payroll", "5 Mitarbeitende inklusive", "weitere ab 7 € je Monat", "Export an Sage und DATEV"]),
      plan("Standard", 60, "account", ["Alles aus Essentials", "Personalabrechnung für komplexere Fälle", "Mehrmandantenfähig, Sonderlöhne", "weitere Mitarbeitende ab 9 €"], { highlighted: true }),
      plan("Premium", 80, "account", ["Alles aus Standard", "Umfassende HR-Prozesse"]),
    ],
  },
  "sage-hr-suite": {
    price: 39,
    trial: false,
    demo: true,
    website: "https://www.sage.com/de-de/produkte/sage-hr-suite-personal-software/",
    note: "je Modul, Lizenz in 25er Mitarbeiterpaketen, jährliche Zahlung",
    plans: [
      plan("Personalabrechnung", 39, "account", ["Stammdatenverwaltung", "Einzel- und Massenabrechnung, Rückrechnung", "Bescheinigungen und Auswertungen"], { highlighted: true }),
      plan("Zeitmanagement", 21, "account", ["Zeiterfassung ortsunabhängig", "Zeitbewertung über die Personalabrechnung"]),
      plan("Bewerbermanagement", 19, "account", ["Stellenausschreibung", "Jobportale ab Professional"]),
    ],
  },
  "sage-sales-management": {
    price: 55,
    unit: "user",
    trial: true,
    demo: true,
    website: "https://www.sage.com/de-de/produkte/sage-sales-management/",
    note: "mindestens 5 Nutzer",
    plans: [plan("Professional", 55, "user", ["Mindestens 5 Nutzer", "Bis zu 100.000 Accounts und Kontakte", "ERP-Integration", "Mobile Apps, offline nutzbar", "Microsoft 365 und Google Workspace"], { highlighted: true })],
  },
  "sage-b7": {
    price: null,
    trial: false,
    demo: true,
    website: "https://www.sage.com/de-de/produkte/sage-b7-warenwirtschaftssystem/",
  },

  // ───────────── Buchhaltung ─────────────
  "lexware-office": {
    price: 7.9,
    trial: true,
    trialDays: 30,
    website: "https://www.lexware.de/",
    plans: [
      plan("S", 7.9, "account", ["Belegerfassung und GoBD-Belegarchiv", "E-Rechnungen empfangen", "App mit Belegscanner"]),
      plan("M", 12.9, "account", ["Alles aus S", "Angebote, E-Rechnungen und Mahnungen"]),
      plan("L", 21.9, "account", ["Alles aus M", "Buchhaltung, EÜR und Umsatzsteuer", "UStVA und Zusammenfassende Meldung", "BWA, GuV, Kassenbuch"], { highlighted: true }),
      plan("XL", 32.9, "account", ["Alles aus L", "EU- und Abschlagsrechnungen", "Public API"]),
    ],
  },
  sevdesk: {
    price: 0,
    free: true,
    trial: true,
    website: "https://sevdesk.de/",
    note: "Buchhaltungstarife ab 22,90 € bei jährlicher Zahlung",
    plans: [
      plan("Kostenlos", 0, "account", ["3 Rechnungen pro Monat", "Unbegrenzt Kontakte und Produkte"]),
      plan("Rechnung", 11.9, "account", ["Unbegrenzt Rechnungen und Angebote", "Mahnungen", "Steuerberater-Zugang"]),
      plan("Buchhaltung", 25.9, "account", ["KI-Belegerfassung", "Bankanbindung", "EÜR und GuV", "UStVA per ELSTER"], { highlighted: true }),
      plan("Buchhaltung Pro", 34.9, "account", ["Alles aus Buchhaltung", "Kostenstellen", "REST-API", "BWA in Echtzeit"]),
    ],
  },
  papierkram: {
    price: 0,
    free: true,
    trial: false,
    website: "https://www.papierkram.de/",
    note: "bei monatlicher Zahlung; jährlich ab 9,90 €",
    plans: [
      plan("Free", 0, "account", ["1 Nutzer, 100 MB", "Rechnungen, Belege, Kontakte", "Ohne Bankanbindung und Steuerberichte"]),
      plan("S", 12.9, "account", ["Bankabgleich für 2 Konten", "Zeiterfassung", "1.000 MB Speicher"]),
      plan("M", 24.9, "account", ["Unbegrenzte Nutzer", "EÜR, UStVA und BWA", "Team-Zeiterfassung, Kundenportal"], { highlighted: true }),
      plan("L", 49.9, "account", ["Alles aus M", "REST-API", "Unbegrenzte Bankkonten"]),
    ],
  },
  buchhaltungsbutler: {
    price: 29.9,
    trial: true,
    trialDays: 14,
    website: "https://www.buchhaltungsbutler.de/",
    note: "bei monatlicher Zahlung",
    plans: [
      plan("Light", 29.9, "account", ["Sie buchen vor, die Kanzlei schließt ab", "BWA, SuSa, Kontenblätter"]),
      plan("Smart", 34.9, "account", ["Voller Funktionsumfang für EÜR und Bilanz", "Automatische Buchungsvorschläge"], { highlighted: true }),
      plan("Premium", 59.9, "account", ["Alles aus Smart", "Für bilanzierende Unternehmen mit hohem Belegvolumen"]),
    ],
  },
  easybill: {
    price: 0,
    free: true,
    trial: true,
    trialDays: 7,
    website: "https://www.easybill.de/",
    note: "bei monatlicher Zahlung; jährlich ab 9 €",
    plans: [
      plan("Free", 0, "account", ["50 Dokumente im Monat inkl. E-Rechnung", "1 Nutzer"]),
      plan("Starter", 12, "account", ["250 Dokumente im Monat", "KI-Belegerfassung", "Eigenes Briefpapier"]),
      plan("Professional", 39, "account", ["Unbegrenzte Kunden", "Wiederkehrende Rechnungen", "Versand über DHL, DPD, Hermes, GLS", "Marktplatz-Anbindungen"], { highlighted: true }),
      plan("Premium", 45, "account", ["Automatisches Mahnwesen", "Projekte und Zeiterfassung", "Automatisierung per API"]),
    ],
  },
  fastbill: {
    price: 10,
    trial: true,
    trialDays: 14,
    website: "https://www.fastbill.com/",
    note: "bei monatlicher Zahlung; jährlich ab 9 €",
    plans: [
      plan("Solo", 10, "account", ["1 Nutzer, 1 Bankkonto"]),
      plan("Plus", 15, "account", ["5 Bankkonten", "Unbegrenzte Vorlagen"], { highlighted: true }),
      plan("Pro", 30, "account", ["3 Nutzer, unbegrenzte Bankkonten", "Wiederkehrende Rechnungen"]),
      plan("Premium", 59, "account", ["5 Nutzer", "Automatische Belegerfassung", "Automatisches Mahnwesen"]),
    ],
  },
  "wiso-meinbuero": {
    price: 10.9,
    trial: true,
    trialDays: 14,
    website: "https://www.meinbuero.de/",
    plans: [
      plan("Rechnungen & Angebote", 10.9, "account", ["1 Nutzer", "bis 25.000 € Jahresumsatz"]),
      plan("Buchhaltung", 19.9, "account", ["1 Nutzer", "bis 120.000 € Jahresumsatz", "EÜR und UStVA"], { highlighted: true }),
      plan("Auftragswesen", 39.9, "account", ["2 Nutzer", "Umsatz unbegrenzt"]),
      plan("Warenwirtschaft", 69.9, "account", ["5 Nutzer", "Lager und Bestellwesen"]),
    ],
  },
  orgamax: {
    price: 49,
    trial: true,
    website: "https://www.orgamax.de/",
    note: "Cloud, bei jährlicher Zahlung",
    plans: [
      plan("Start", 49, "account", ["Angebot, Auftrag, Rechnung inkl. E-Rechnung", "Lieferscheine"]),
      plan("Dienstleister", 69, "account", ["Projektmanagement und Projektzeiten", "CRM mit Lead-Status", "Teil-, Abschlags- und Schlussrechnungen"], { highlighted: true }),
      plan("Handel", 99, "account", ["Warenwirtschaft und Lager", "Automatische Bestellvorschläge"]),
      plan("Produktion", 119, "account", ["Mehrstufige Stücklisten", "Kalkulation aus Herstellkosten"]),
    ],
  },
  billomat: {
    price: 19,
    trial: true,
    trialDays: 14,
    website: "https://www.billomat.com/",
    note: "bei jährlicher Zahlung; monatlich ab 29 €",
    plans: [
      plan("Professional", 19, "account", ["1 Nutzer", "30 Dokumente im Monat", "Ohne Bankanbindung und DATEVconnect"]),
      plan("Business", 29, "account", ["Unbegrenzte Dokumente", "Bankanbindung", "DATEVconnect und Steuerberater-Zugang"], { highlighted: true }),
      plan("Enterprise", 99, "account", ["5 Nutzer inklusive", "Sandbox und erweiterte API", "Persönlicher Ansprechpartner"]),
    ],
  },
  collmex: {
    price: 0,
    free: true,
    trial: true,
    trialDays: 30,
    website: "https://www.collmex.de/",
    plans: [
      plan("Buchhaltung free", 0, "account", ["Kostenlose Einstiegsversion"]),
      plan("Buchhaltung basic", 11.95, "account", ["Finanzbuchhaltung mit UStVA"]),
      plan("Collmex basic", 16.95, "account", ["Komplettpaket Buchhaltung und Rechnung"], { highlighted: true }),
      plan("Collmex pro", 46.95, "account", ["Komplettpaket mit erweitertem Umfang"]),
    ],
  },
  candis: {
    price: 389,
    trial: true,
    trialDays: 30,
    demo: true,
    note: "Preis richtet sich nach dem Belegvolumen",
    plans: [
      plan("Basis", 389, "account", ["Unbegrenzt Nutzer und Gesellschaften", "Implementierung und Onboarding inklusive"]),
      plan("Plus", 599, "account", ["Erweiterte Freigabe-Workflows"], { highlighted: true }),
      plan("Max", 789, "account", ["Voller Funktionsumfang"]),
    ],
  },
  scopevisio: { price: null, trial: true, trialDays: 30, demo: true, note: "modular nach Plattform, Modulen und Nutzern" },
  "datev-unternehmen-online": { price: null, trial: false, demo: true, note: "Lizenz in der Regel über die Steuerkanzlei" },
  pennylane: { price: null, demo: true },

  // ───────────── Lohn & HR ─────────────
  personio: {
    price: 7.6,
    unit: "employee",
    trial: false,
    demo: true,
    website: "https://www.personio.de/",
    note: "HR ab 50 Mitarbeitenden; bis 49 Mitarbeitende HR mit Payroll ab 14 €",
  },
  "personio-payroll": { price: 5, unit: "employee", trial: false, demo: true, note: "zusätzlich zur HR-Lizenz" },
  hrworks: { demo: true, note: "mindestens 20 Nutzer werden berechnet" },
  factorial: { price: 8, unit: "user", trial: true, demo: true, website: "https://factorialhr.de/" },
  kenjo: { price: null, trial: true, trialDays: 14, demo: true },
  "rexx-systems": { price: null, trial: false, demo: true },
  softgarden: { price: null, trial: false, demo: true },
  "datev-lohn-und-gehalt": { price: null, trial: false, demo: true, note: "Lizenz über die Steuerkanzlei" },
  "datev-lodas": { price: null, trial: false, demo: true, note: "Lizenz über die Steuerkanzlei" },
  edlohn: { price: null, trial: false, demo: true, note: "Abrechnung über die Steuerkanzlei" },
  "paychex-deutschland": { price: null, trial: false, demo: true },

  // ───────────── CRM ─────────────
  hubspot: {
    price: 0,
    free: true,
    unit: "user",
    trial: true,
    demo: true,
    website: "https://www.hubspot.de/",
    plans: [
      plan("Free", 0, "user", ["Bis zu 2 Nutzer"]),
      plan("Starter", 20, "user", ["jährlich ab 7 € je Lizenz"]),
      plan("Professional", 100, "user", ["einmalige Onboarding-Gebühr 1.470 €"], { highlighted: true }),
      plan("Enterprise", 150, "user", ["einmalige Onboarding-Gebühr 3.420 €"]),
    ],
  },
  pipedrive: {
    price: 14,
    unit: "user",
    trial: true,
    trialDays: 14,
    website: "https://www.pipedrive.com/de",
    plans: [
      plan("Lite", 14, "user", []),
      plan("Growth", 24, "user", []),
      plan("Premium", 49, "user", [], { highlighted: true }),
      plan("Ultimate", 69, "user", []),
    ],
  },
  salesforce: {
    price: 25,
    unit: "user",
    trial: true,
    demo: true,
    plans: [
      plan("Starter Suite", 25, "user", []),
      plan("Pro Suite", 100, "user", [], { highlighted: true }),
      plan("Core", 195, "user", []),
      plan("Advanced", 395, "user", []),
    ],
  },
  "zoho-crm": { free: true, trial: true, demo: true, note: "kostenlose Edition für bis zu 3 Nutzer" },
  centralstationcrm: {
    price: 0,
    free: true,
    trial: true,
    trialDays: 30,
    website: "https://centralstationcrm.de/",
    plans: [
      plan("Starter", 0, "account", ["3 Nutzer, 200 Kontakte"]),
      plan("Team", 24, "account", ["3 Nutzer, 3.000 Kontakte"], { highlighted: true }),
      plan("Small Office", 75, "account", ["10 Nutzer, 10.000 Kontakte"]),
      plan("Business", 149, "account", ["20 Nutzer, 20.000 Kontakte"]),
      plan("Enterprise", 289, "account", ["40 Nutzer, 40.000 Kontakte"]),
    ],
  },
  "cas-genesisworld": { price: null, demo: true },
  "dynamics-365-sales": {
    price: 56.3,
    unit: "user",
    trial: true,
    demo: true,
    note: "bei jährlicher Zahlung",
    plans: [
      plan("Sales Professional", 56.3, "user", ["Kernfunktionen des Vertriebs"]),
      plan("Sales Enterprise", 91, "user", ["Erweiterte Prognosen und Anpassung"], { highlighted: true }),
      plan("Sales Premium", 130, "user", ["KI-gestützter Vertrieb"]),
    ],
  },

  // ───────────── ERP ─────────────
  weclapp: {
    price: 39,
    unit: "user",
    trial: true,
    trialDays: 30,
    plans: [
      plan("ERP Starter", 39, "user", []),
      plan("ERP Dienstleistung", 95, "user", ["jährlich 86 €"], { highlighted: true }),
      plan("ERP Handel", 179, "user", ["jährlich 163 €"]),
    ],
  },
  xentral: {
    price: 99,
    trial: true,
    trialDays: 14,
    demo: true,
    note: "unbegrenzte Nutzer; Launch bis 500.000 € Jahresumsatz",
    plans: [
      plan("Launch", 99, "account", ["Bis 500.000 € Jahresumsatz", "Bis 1.200 Aufträge im Monat"]),
      plan("Starter", 349, "account", ["500 Aufträge im Monat inklusive"]),
      plan("Business", 649, "account", ["Automatisierung und API"], { highlighted: true }),
      plan("Pro", 849, "account", ["Komplexe Workflows"]),
    ],
  },
  odoo: {
    price: 0,
    free: true,
    unit: "user",
    trial: true,
    website: "https://www.odoo.com/de_DE",
    plans: [
      plan("One App Free", 0, "user", ["Eine App, unbegrenzte Nutzer"]),
      plan("Standard", 8.95, "user", ["Alle Apps in Odoo Online", "jährlich 7,25 €"], { highlighted: true }),
      plan("Custom", 13.6, "user", ["Odoo Studio, Multi-Company, API", "jährlich 10,90 €"]),
    ],
  },
  "dynamics-365-business-central": {
    price: 69.3,
    unit: "user",
    trial: true,
    trialDays: 30,
    demo: true,
    note: "bei jährlicher Zahlung",
    plans: [
      plan("Essentials", 69.3, "user", ["Finanzen, Vertrieb, Einkauf, Lager"], { highlighted: true }),
      plan("Premium", 95.3, "user", ["Zusätzlich Service und Fertigung"]),
      plan("Team Members", 6.9, "user", ["Lesen, Freigaben, einfache Bearbeitung"]),
    ],
  },
  "haufe-x360": { price: 49, unit: "user", trial: false, demo: true, note: "Mindestumsatz 449 € im Monat, Preis nach Konfiguration" },
  "sap-business-one": { price: null, trial: false, demo: true },
  myfactory: { price: null, demo: true },
  "jtl-wawi": {
    price: 0,
    free: true,
    trial: false,
    demo: true,
    website: "https://www.jtl-software.com/de",
    plans: [
      plan("JTL Start", 0, "account", ["Dauerhaft kostenlos", "Unbegrenzte Nutzer", "Shop bis 500 Artikel"]),
      plan("JTL Advanced", 119, "account", ["1 professioneller Shop", "Unbegrenzte Artikel"], { highlighted: true }),
      plan("JTL Pro", 369, "account", ["3 Shops", "Workflow-Automatisierung"]),
    ],
  },

  // ───────────── Projektmanagement ─────────────
  awork: {
    price: 8,
    unit: "user",
    trial: true,
    plans: [
      plan("Basic", 8, "user", ["jährlich 5 €"]),
      plan("Standard", 16, "user", ["jährlich 12 €"], { highlighted: true }),
      plan("Professional", 29, "user", ["jährlich 22 €"]),
    ],
  },
  factro: {
    price: 0,
    free: true,
    unit: "user",
    trial: true,
    plans: [
      plan("Basic", 0, "user", ["Kostenlos für bis zu 3 Nutzer"]),
      plan("Business", 19.99, "user", ["ab 3 Nutzern"], { highlighted: true }),
      plan("Professional", 29.99, "user", ["ab 3 Nutzern"]),
    ],
  },
  stackfield: {
    price: 9,
    unit: "user",
    trial: true,
    trialDays: 14,
    plans: [
      plan("Starter", 9, "user", ["bis 10 Nutzer"]),
      plan("Business", 14, "user", ["unbegrenzte Nutzer"]),
      plan("Premium", 18, "user", ["unbegrenzte Nutzer"], { highlighted: true }),
      plan("Enterprise", 28, "user", ["unbegrenzte Nutzer"]),
    ],
  },
  openproject: {
    price: 0,
    free: true,
    unit: "user",
    trial: true,
    trialDays: 14,
    plans: [
      plan("Community", 0, "user", ["Open Source, selbst gehostet"]),
      plan("Basic", 5.95, "user", ["Cloud oder On-Premise"]),
      plan("Professional", 10.95, "user", ["Cloud oder On-Premise"], { highlighted: true }),
      plan("Premium", 15.95, "user", ["Cloud oder On-Premise"]),
    ],
  },
  inloox: { price: null, trial: true, trialDays: 14, demo: true },
  meistertask: {
    price: 0,
    free: true,
    unit: "user",
    trial: true,
    plans: [
      plan("Basic", 0, "user", ["Bis zu 3 Projekte"]),
      plan("Pro", 7, "user", ["Unbegrenzte Projekte"], { highlighted: true }),
      plan("Business", 12.5, "user", ["Zeitleiste, Rollen, Berichte"]),
    ],
  },
  "monday-com": {
    price: 0,
    free: true,
    unit: "user",
    trial: true,
    note: "bei jährlicher Zahlung",
    plans: [
      plan("Free", 0, "user", ["Bis zu 2 Nutzer"]),
      plan("Basic", 9, "user", ["Grundlegende Boards"]),
      plan("Standard", 12, "user", ["Zeitleiste, Automatisierungen"], { highlighted: true }),
      plan("Pro", 19, "user", ["Zeiterfassung, erweiterte Automatisierung"]),
    ],
  },
  asana: {
    price: 0,
    free: true,
    unit: "user",
    trial: true,
    plans: [
      plan("Personal", 0, "user", ["Bis zu 2 Nutzer"]),
      plan("Starter", 13.49, "user", ["jährlich 10,99 €"], { highlighted: true }),
      plan("Advanced", 30.49, "user", ["jährlich 24,99 €"]),
    ],
  },

  // ───────────── Zeiterfassung ─────────────
  clockodo: {
    price: 4,
    unit: "user",
    trial: true,
    trialDays: 14,
    plans: [
      plan("Solo", 0, "user", ["Kostenlos für eine Person"]),
      plan("Basic", 4, "user", []),
      plan("Pro", 10, "user", [], { highlighted: true }),
      plan("Pro Plus", 12, "user", []),
    ],
  },
  papershift: { price: 64, trial: true, trialDays: 14, note: "für 16 Mitarbeitende, zzgl. 39 € Grundgebühr" },
  zep: {
    price: 2,
    unit: "user",
    trial: true,
    trialDays: 14,
    plans: [
      plan("ZEP Clock", 2, "user", ["Digitale Stempeluhr"]),
      plan("ZEP Compact", 7, "user", ["Projekt- und Kundenzeiten"], { highlighted: true }),
      plan("ZEP Professional", 18, "user", ["Controlling und Reisekosten"]),
    ],
  },
  timetac: { price: null, trial: true, trialDays: 30, demo: true },
  crewmeister: {
    price: 1.5,
    unit: "user",
    trial: true,
    trialDays: 14,
    note: "bei jährlicher Zahlung",
    plans: [
      plan("Go", 1.5, "user", ["Zeiterfassung per App und Terminal"]),
      plan("Easy", 2, "user", ["Urlaubsplaner und Abwesenheiten"], { highlighted: true }),
      plan("Pro", 3, "user", ["Zuschläge, erweiterte Projektzeiten"]),
    ],
  },
  clockin: {
    price: 3.99,
    unit: "user",
    trial: true,
    trialDays: 14,
    website: "https://www.clockin.de/",
    note: "bis 4 Nutzer zzgl. 10 € Plattformpauschale",
    plans: [
      plan("Starter", 3.99, "user", []),
      plan("Pro", 6.99, "user", [], { highlighted: true }),
      plan("Expert", 9.99, "user", []),
    ],
  },

  // ───────────── DMS ─────────────
  ecodms: { price: 74.79, period: "once", unit: "once", trial: true, note: "einmalige Lizenz, ab 89 € inkl. MwSt." },
  docuware: { price: null, demo: true },
  "d-velop-documents": { price: null, demo: true },
  elo: { price: null, trial: false, demo: true },
};
