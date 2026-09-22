import type { Review, Software } from "@/lib/types";
import { DURATIONS } from "@/lib/i18n/options";

/**
 * Seed reviews for testing and internal previews (SEED_REVIEWS=true).
 * Deterministic per product slug: 100 to 200 reviews each, the same on every build.
 *
 * Guard rails: never active on Vercel Production, never written to Supabase (scripts/seed.mjs reads
 * `REVIEWS` from lib/data, which stays empty), no verification badges, no vendor responses.
 */
export { seedReviewsEnabled } from "@/lib/seedMode";

// ───────────── randomness ─────────────

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rnd = () => number;
const pick = <T,>(rnd: Rnd, arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
const gauss = (rnd: Rnd) => (rnd() + rnd() + rnd() + rnd() - 2) / 1.15; // ≈ N(0, 1), bounded
const clamp5 = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

// ───────────── text lines with requirements ─────────────

/** de: only for German reviewers · datev/elster/erech/dehost: only if the product supports it */
type Req = "de" | "datev" | "elster" | "erech" | "dehost";
type Line = string | { t: string; req: Req[] };

interface Ctx {
  s: Software;
  german: boolean;
}

function allowed(line: Line, c: Ctx): boolean {
  if (typeof line === "string") return true;
  return line.req.every((r) => {
    switch (r) {
      case "de":
        return c.german;
      case "datev":
        return c.s.datev_interface === "export" || c.s.datev_interface === "vollintegriert";
      case "elster":
        return c.s.elster_submission === true;
      case "erech":
        return (c.s.e_invoicing ?? []).length > 0;
      case "dehost":
        return c.s.hosting_location === "Deutschland";
    }
  });
}

const text = (l: Line) => (typeof l === "string" ? l : l.t);
const pickLine = (rnd: Rnd, lines: readonly Line[], c: Ctx, avoid: string[] = []) => {
  const ok = lines.filter((l) => allowed(l, c) && !avoid.includes(text(l)));
  return ok.length ? text(pick(rnd, ok)) : null;
};

// ───────────── people & companies ─────────────

const FEMALE = [
  "Katrin", "Sabine", "Julia", "Stefanie", "Anna", "Laura", "Nicole", "Melanie", "Sandra", "Claudia",
  "Petra", "Lena", "Birgit", "Jana", "Miriam", "Kerstin", "Anja", "Susanne", "Carina", "Nina",
  "Ayşe", "Katarzyna", "Ines", "Özlem", "Franziska", "Sarah", "Christina", "Tanja", "Heike", "Vanessa",
  "Lisa", "Maria", "Elena", "Johanna", "Simone", "Daniela", "Martina", "Svenja", "Leonie", "Sophie",
];
const MALE = [
  "Thomas", "Michael", "Andreas", "Markus", "Christian", "Tobias", "Stefan", "Jan", "Daniel", "Florian",
  "Matthias", "Sebastian", "Alexander", "Frank", "Jörg", "Philipp", "Lukas", "Martin", "Holger", "Dirk",
  "Mehmet", "Dimitrios", "Björn", "Uwe", "Ralf", "Kai", "Oliver", "Sven", "Patrick", "Timo",
  "Benjamin", "Marco", "Nils", "Jens", "Torsten", "David", "Moritz", "Fabian", "Emre", "Piotr",
];
const LAST_INITIAL = "ABBBDEFFGGHHHJKKKLLMMMMNOPRRSSSSSTTWWWZ";

const CITIES_DE = [
  "Berlin", "Hamburg", "München", "Köln", "Frankfurt am Main", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund",
  "Essen", "Bremen", "Dresden", "Hannover", "Nürnberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn",
  "Münster", "Mannheim", "Karlsruhe", "Augsburg", "Wiesbaden", "Mainz", "Kiel", "Freiburg im Breisgau", "Regensburg",
  "Osnabrück", "Rostock", "Erfurt", "Kassel", "Würzburg", "Ulm", "Heidelberg", "Potsdam", "Lübeck", "Magdeburg",
  "Oldenburg", "Paderborn", "Ingolstadt", "Saarbrücken", "Göttingen", "Trier", "Koblenz", "Aachen", "Chemnitz",
];
const CITIES_AT = ["Wien", "Graz", "Linz", "Salzburg", "Innsbruck", "Klagenfurt"];
const CITIES_CH = ["Zürich", "Basel", "Bern", "St. Gallen", "Luzern", "Winterthur"];

const COMPANY_STEMS = [
  "Hofmann Haustechnik", "Nordlicht Medien", "Weber Logistik", "Brandt Elektrotechnik", "Kaiser Feinkost",
  "Lindner Consulting", "Vogel Metallbau", "Seidel Immobilien", "Alpenblick Hotellerie", "Fischer Druckerei",
  "Rheinufer Digital", "Hanse Kontor", "Sommer Gartenbau", "Kraus Handelshaus", "Elbtal IT-Service",
  "Bergmann Tischlerei", "Werner Pflegedienst", "Mainblick Architekten", "Lorenz Optik", "Albrecht Dentaltechnik",
  "Nordsee Fahrzeugbau", "Kessler Sanitär", "Heidebrand Kommunikation", "Wagner & Söhne", "Stadtwerk Kreativ",
  "Schuster Messebau", "Brückner Verpackung", "Talblick Bäckerei", "Körner Elektronik", "Sonnenhof Reisen",
];

type LegalForm = "GmbH" | "UG (haftungsbeschränkt)" | "GbR" | "Einzelunternehmen" | "e. K." | "GmbH & Co. KG" | "AG" | "Freiberuflich";

function legalFormFor(rnd: Rnd, size: string, country: string): LegalForm {
  if (country !== "Deutschland") return rnd() < 0.85 ? "GmbH" : "AG";
  const r = rnd();
  switch (size) {
    case "1–9":
      return r < 0.3 ? "GmbH" : r < 0.48 ? "Einzelunternehmen" : r < 0.62 ? "Freiberuflich" : r < 0.76 ? "UG (haftungsbeschränkt)" : r < 0.88 ? "GbR" : "e. K.";
    case "10–49":
      return r < 0.68 ? "GmbH" : r < 0.84 ? "GmbH & Co. KG" : r < 0.92 ? "e. K." : "UG (haftungsbeschränkt)";
    case "50–249":
      return r < 0.64 ? "GmbH" : r < 0.92 ? "GmbH & Co. KG" : "AG";
    default:
      return r < 0.5 ? "GmbH" : r < 0.8 ? "GmbH & Co. KG" : "AG";
  }
}

const SIZE_RANGE: Record<string, [number, number]> = {
  "1–9": [2, 9],
  "10–49": [10, 49],
  "50–249": [50, 240],
  "250–499": [250, 480],
  "500+": [500, 1800],
};

const SINCE: Record<string, string[]> = {
  "weniger als 6 Monate": ["seit ein paar Monaten", "seit einigen Wochen", "seit Jahresbeginn"],
  "6–12 Monate": ["seit knapp einem Jahr", "seit gut einem halben Jahr"],
  "1–2 Jahre": ["seit gut einem Jahr", "seit anderthalb Jahren", "seit fast zwei Jahren"],
  "2–5 Jahre": ["seit drei Jahren", "seit einigen Jahren", "seit vier Jahren"],
  "mehr als 5 Jahre": ["seit über fünf Jahren", "seit vielen Jahren", "schon lange"],
};

// ───────────── category profiles ─────────────

interface Profile {
  industries: string[];
  jobs: [m: string, f: string][];
  sizes: number[]; // weights for 1–9, 10–49, 50–249, 250–499, 500+
  contexts: Line[];
  titles: Line[];
  pros: Line[];
  cons: Line[];
}

const PROFILES: Record<string, Profile> = {
  buchhaltungssoftware: {
    industries: ["Handwerk", "Einzelhandel", "E-Commerce", "IT & Software", "Agentur & Marketing", "Gastronomie & Hotellerie", "Immobilien", "Bauwesen"],
    jobs: [["Geschäftsführer", "Geschäftsführerin"], ["Inhaber", "Inhaberin"], ["Buchhalter", "Buchhalterin"], ["Kaufmännischer Leiter", "Kaufmännische Leiterin"], ["Office-Manager", "Office-Managerin"], ["Selbstständiger Berater", "Selbstständige Beraterin"]],
    sizes: [44, 34, 16, 4, 2],
    contexts: [
      "Wir machen unsere Buchhaltung {since} mit {name}.",
      "Rechnungen, Belege und Kontoabgleich laufen bei uns {since} über {name}.",
      { t: "Wir buchen {since} mit {name} und geben die Daten monatlich an unsere Steuerkanzlei.", req: ["datev"] },
      "Vorher hatten wir Excel und einen Ordner voller Papierbelege, {since} nutzen wir {name}.",
      "Als Betrieb mit {n} Leuten erledigen wir die laufende Buchhaltung {since} selbst.",
      { t: "Wir erledigen die Buchhaltung und die UStVA {since} selbst mit {name}.", req: ["elster"] },
    ],
    titles: [
      { t: "Die UStVA ist jetzt in zehn Minuten erledigt", req: ["elster"] },
      "Belege digital statt Schuhkarton",
      { t: "Unsere Steuerberaterin ist begeistert", req: ["datev"] },
      "Buchhaltung, die man versteht",
      "Bankabgleich spart uns jeden Monat Stunden",
      { t: "E-Rechnung ohne Stress umgesetzt", req: ["erech"] },
      "Rechnungen schreiben in zwei Minuten",
      "Endlich Überblick über offene Posten",
    ],
    pros: [
      { t: "Die Umsatzsteuer-Voranmeldung geht mit wenigen Klicks per ELSTER raus.", req: ["elster", "de"] },
      "Belege fotografiere ich mit dem Handy, Betrag und Steuersatz werden meist richtig erkannt.",
      { t: "Der DATEV-Export klappt reibungslos, unsere Kanzlei bekommt alles mit Belegbild.", req: ["datev", "de"] },
      "Kontoumsätze werden automatisch den offenen Rechnungen zugeordnet.",
      { t: "E-Rechnungen im ZUGFeRD- und XRechnung-Format können wir empfangen und selbst erstellen.", req: ["erech"] },
      "Rechnungsvorlagen sind schnell angelegt und sehen professionell aus.",
      "Das Mahnwesen läuft automatisch, unsere Außenstände sind deutlich gesunken.",
      "Die Kontierungsvorschläge sind nach kurzer Zeit erstaunlich treffsicher.",
      "Die Auswertungen zeigen auf einen Blick, wie der Monat gelaufen ist.",
      "Wiederkehrende Rechnungen werden automatisch erstellt und verschickt.",
      { t: "Die Belegablage ist GoBD-konform, darum müssen wir uns nicht mehr kümmern.", req: ["de"] },
    ],
    cons: [
      "Rechnungsvorlagen lassen sich nur eingeschränkt anpassen.",
      "Bei Sonderfällen wie Reverse-Charge musste ich mehrmals in der Hilfe nachlesen.",
      "Eine frei konfigurierbare BWA fehlt.",
      "Die Anlagenverwaltung gibt es erst im größeren Paket.",
      "Die Belegerkennung liest Lieferantennamen gelegentlich falsch aus.",
      "Die Bankverbindung muss alle paar Monate neu bestätigt werden.",
      "Für Bilanzierer ist der Funktionsumfang zu knapp.",
    ],
  },

  lohnabrechnung: {
    industries: ["Handwerk", "Produktion & Fertigung", "Steuerberatung", "Gesundheitswesen", "Bauwesen", "Logistik & Transport", "Gastronomie & Hotellerie", "Einzelhandel"],
    jobs: [["Lohnbuchhalter", "Lohnbuchhalterin"], ["Personalsachbearbeiter", "Personalsachbearbeiterin"], ["Steuerfachangestellter", "Steuerfachangestellte"], ["Kaufmännischer Leiter", "Kaufmännische Leiterin"], ["Geschäftsführer", "Geschäftsführerin"], ["Leiter Personal", "Leiterin Personal"]],
    sizes: [14, 42, 32, 8, 4],
    contexts: [
      "Wir rechnen {since} rund {n} Mitarbeitende mit {name} ab, inklusive Minijobs und Azubis.",
      "Die Lohnabrechnung machen wir {since} selbst statt über die Kanzlei.",
      "Wir nutzen {name} {since} für die monatliche Entgeltabrechnung.",
      "{since} laufen Abrechnung und Meldewesen bei uns über {name}.",
    ],
    titles: [
      "Lohnabrechnung zuverlässig und pünktlich",
      { t: "Meldewesen läuft praktisch von allein", req: ["de"] },
      { t: "ELStAM-Abruf und DEÜV ohne Probleme", req: ["de"] },
      "Keine Säumniszuschläge mehr",
      "Solide Lohnsoftware für unseren Betrieb",
      "Monatsabschluss in einem halben Tag",
    ],
    pros: [
      "Lohnsteueranmeldung und Beitragsnachweise gehen pünktlich raus, Fristen haben wir seitdem nicht mehr verpasst.",
      { t: "Der ELStAM-Abruf funktioniert automatisch, Steuerklassenwechsel kommen zuverlässig an.", req: ["de"] },
      "Gesetzliche Änderungen zum Jahreswechsel sind immer rechtzeitig eingespielt.",
      { t: "DEÜV-Meldungen bei Ein- und Austritten sind in wenigen Minuten erledigt.", req: ["de"] },
      { t: "Die Lohnjournale übergeben wir per DATEV-Schnittstelle an die Finanzbuchhaltung.", req: ["datev"] },
      { t: "Erstattungsanträge nach U1 und U2 stellen wir direkt aus der Software.", req: ["de"] },
      "Die Mitarbeitenden bekommen ihre Abrechnungen digital, das Drucken und Kuvertieren entfällt.",
      "Minijobs und Übergangsbereich rechnet die Software ohne Nacharbeit korrekt.",
      "Die Abrechnungsvorschau zeigt Fehler, bevor etwas übermittelt wird.",
    ],
    cons: [
      "Die Oberfläche ist nicht mehr zeitgemäß.",
      "Für Sonderfälle wie Kurzarbeit braucht man Erfahrung.",
      "Ohne Lohn-Vorkenntnisse kommt man schnell an Grenzen.",
      "Die Hotline ist zum Monatsende oft überlastet.",
      "Das Mitarbeiterportal könnte moderner sein.",
      "Rückrechnungen über mehrere Monate sind unübersichtlich.",
    ],
  },

  "hr-software": {
    industries: ["IT & Software", "Produktion & Fertigung", "Gesundheitswesen", "Logistik & Transport", "Einzelhandel", "Agentur & Marketing", "E-Commerce"],
    jobs: [["HR-Manager", "HR-Managerin"], ["Personalleiter", "Personalleiterin"], ["People & Culture Lead", "People & Culture Lead"], ["HR-Generalist", "HR-Generalistin"], ["Geschäftsführer", "Geschäftsführerin"], ["Recruiter", "Recruiterin"]],
    sizes: [6, 34, 42, 12, 6],
    contexts: [
      "Wir verwalten {since} rund {n} Mitarbeitende mit {name}.",
      "Vorher lief die Personalverwaltung über Excel und Papierakten, {since} nutzen wir {name}.",
      { t: "Die Einführung von {name} haben wir gemeinsam mit dem Betriebsrat geplant.", req: ["de"] },
      "{name} ist bei uns {since} das zentrale HR-System für Akten, Abwesenheiten und Onboarding.",
    ],
    titles: [
      "Personalakte endlich digital",
      "Urlaubsanträge ohne Papier und Excel",
      "Onboarding läuft jetzt strukturiert",
      { t: "Der Betriebsrat war schnell überzeugt", req: ["de"] },
      "Gutes Rechtekonzept, viele Funktionen",
      "HR-Arbeit spürbar entlastet",
    ],
    pros: [
      "Abwesenheiten werden per App beantragt und genehmigt, der Resturlaub ist immer aktuell.",
      { t: "Das Rollen- und Rechtekonzept hat die Abstimmung mit dem Betriebsrat erleichtert.", req: ["de"] },
      { t: "Lohnrelevante Daten gehen per DATEV-Schnittstelle an unsere Kanzlei, Rückfragen sind selten geworden.", req: ["datev"] },
      "Onboarding-Checklisten sorgen dafür, dass am ersten Arbeitstag alles bereitliegt.",
      "Verträge und Bescheinigungen liegen zentral in der digitalen Personalakte.",
      "Stellenanzeigen veröffentlichen wir direkt auf mehreren Jobbörsen.",
      "Führungskräfte sehen im Dashboard sofort, wer im Team abwesend ist.",
      "Mitarbeitende pflegen ihre Stammdaten selbst, das spart uns viele E-Mails.",
    ],
    cons: [
      "Die Berichte sind nicht so flexibel wie gewünscht.",
      "Die Einrichtung der Workflows hat länger gedauert als geplant.",
      "Für kleinere Teams ist der Preis recht hoch.",
      "Manche Übersetzungen in der Oberfläche wirken holprig.",
      "Zeiterfassung gibt es nur als Zusatzmodul.",
      "Leistungsbeurteilungen lassen sich kaum an eigene Abläufe anpassen.",
    ],
  },

  "crm-software": {
    industries: ["IT & Software", "Agentur & Marketing", "Produktion & Fertigung", "Immobilien", "E-Commerce", "Rechtsberatung", "Logistik & Transport"],
    jobs: [["Vertriebsleiter", "Vertriebsleiterin"], ["Key Account Manager", "Key Account Managerin"], ["Geschäftsführer", "Geschäftsführerin"], ["Marketing-Manager", "Marketing-Managerin"], ["Sales Manager", "Sales Managerin"], ["Mitarbeiter Vertriebsinnendienst", "Mitarbeiterin Vertriebsinnendienst"]],
    sizes: [16, 38, 30, 10, 6],
    contexts: [
      "Unser Vertrieb arbeitet {since} mit {name}.",
      "Nach Jahren mit Excel-Listen haben wir den Vertrieb {since} auf {name} umgestellt.",
      "Wir nutzen {name} {since} im Innen- und Außendienst.",
      "{name} ist bei uns mit E-Mail, Kalender und Buchhaltung verbunden.",
    ],
    titles: [
      "Unser Vertrieb hat endlich den Überblick",
      "Die Pipeline-Ansicht macht den Unterschied",
      "Das Team nutzt es gern, das sagt viel",
      "Kontakte zentral statt in fünf Listen",
      "Angebote direkt aus dem CRM",
      "Kein Lead geht mehr verloren",
    ],
    pros: [
      "Die Pipeline zeigt auf einen Blick, wo jede Verkaufschance steht.",
      "E-Mails aus Outlook werden automatisch dem richtigen Kontakt zugeordnet.",
      "Wiedervorlagen sorgen dafür, dass kein Angebot unbeantwortet liegen bleibt.",
      "Newsletter-Einwilligungen werden sauber mit Zeitstempel dokumentiert.",
      "Die mobile App ist im Außendienst sehr praktisch.",
      "Dashboards für die Vertriebsleitung sind schnell eingerichtet.",
      "Automatisierungen übernehmen viele Routineschritte, etwa Follow-up-Mails.",
      "Die Umsatzprognose ist deutlich verlässlicher geworden.",
    ],
    cons: [
      "Die höheren Tarife werden schnell teuer.",
      "Viele Automatisierungen gibt es nur in den großen Paketen.",
      "Die Datenmigration aus dem Altsystem war mühsam.",
      "Manche Menüs sind nur teilweise übersetzt.",
      "Berichte lassen sich nur eingeschränkt anpassen.",
      "Dubletten muss man regelmäßig von Hand bereinigen.",
    ],
  },

  "erp-warenwirtschaft": {
    industries: ["Produktion & Fertigung", "E-Commerce", "Einzelhandel", "Logistik & Transport", "Handwerk", "Bauwesen"],
    jobs: [["Leiter Einkauf", "Leiterin Einkauf"], ["Kaufmännischer Leiter", "Kaufmännische Leiterin"], ["Geschäftsführer", "Geschäftsführerin"], ["IT-Leiter", "IT-Leiterin"], ["Logistikleiter", "Logistikleiterin"], ["Produktionsplaner", "Produktionsplanerin"]],
    sizes: [8, 34, 38, 12, 8],
    contexts: [
      "Wir steuern Einkauf, Lager, Versand und Rechnungen {since} über {name}.",
      "{name} hat bei uns drei Einzellösungen und viele Excel-Listen abgelöst.",
      "Als Betrieb mit {n} Mitarbeitenden arbeiten wir {since} mit {name}.",
      "Wir verwalten mit {name} {since} mehrere tausend Artikel.",
    ],
    titles: [
      "Warenwirtschaft und Buchhaltung aus einem Guss",
      "Lagerbestände stimmen jetzt",
      "Die Shop-Anbindung läuft stabil",
      "Solides ERP für unseren Betrieb",
      "Einführung braucht Zeit, lohnt sich aber",
      "Endlich ein System statt fünf",
    ],
    pros: [
      "Bestellungen aus dem Onlineshop landen automatisch im System, Lieferschein und Rechnung folgen ohne Handarbeit.",
      "Der Lagerbestand ist endlich in Echtzeit korrekt.",
      { t: "Die Übergabe an die Steuerkanzlei per DATEV-Export klappt jeden Monat problemlos.", req: ["datev"] },
      { t: "E-Rechnungen im XRechnung-Format für öffentliche Auftraggeber sind kein Problem mehr.", req: ["erech"] },
      "Stücklisten und Fertigungsaufträge sind gut abgebildet.",
      "Die Versandanbindung an DHL und DPD spart täglich Zeit.",
      "Mindestbestände lösen automatisch Bestellvorschläge aus.",
      "Preise und Konditionen je Kunde sind sauber hinterlegt.",
    ],
    cons: [
      "Die Einführung hat deutlich länger gedauert als geplant.",
      "Ohne Partner ist die Konfiguration schwierig.",
      "Manche Auswertungen bauen wir weiterhin in Excel nach.",
      "Die Oberfläche wirkt in Teilen überladen.",
      "Die Lizenzkosten pro Nutzer summieren sich.",
      "Individuelle Anpassungen machen Updates aufwendiger.",
    ],
  },

  projektmanagement: {
    industries: ["Agentur & Marketing", "IT & Software", "Bauwesen", "Bildung", "Verein & Non-Profit", "Produktion & Fertigung"],
    jobs: [["Projektmanager", "Projektmanagerin"], ["Teamleiter", "Teamleiterin"], ["Agenturinhaber", "Agenturinhaberin"], ["Leiter PMO", "Leiterin PMO"], ["Abteilungsleiter", "Abteilungsleiterin"], ["Product Owner", "Product Owner"]],
    sizes: [20, 40, 26, 8, 6],
    contexts: [
      "Wir planen {since} alle Projekte in {name}.",
      "{name} hat bei uns eine Mischung aus Excel, E-Mail und Whiteboard ersetzt.",
      "Unser Team mit {n} Leuten arbeitet {since} täglich mit {name}.",
      "Wir steuern mit {name} Kundenprojekte und interne Vorhaben.",
    ],
    titles: [
      "Endlich weiß jeder, wer woran arbeitet",
      "Die Auslastungsplanung ist Gold wert",
      "Übersichtlich und schnell eingeführt",
      "Unsere Projekte laufen strukturierter",
      "Ersetzt bei uns das E-Mail-Pingpong",
      "Deadlines haben wir jetzt im Griff",
    ],
    pros: [
      "Die Auslastung im Team ist jederzeit sichtbar, Engpässe erkennen wir früh.",
      "Zeiten buchen wir direkt auf Aufgaben, die Abrechnung an Kunden ist viel einfacher.",
      { t: "Der Serverstandort in Deutschland hat unseren Datenschutzbeauftragten überzeugt.", req: ["dehost"] },
      "Kunden geben per Gastzugang Feedback direkt an den Aufgaben.",
      "Vorlagen für wiederkehrende Projekte sparen viel Zeit.",
      "Die Oberfläche ist so intuitiv, dass kaum Schulung nötig war.",
      "Kommentare und Dateien hängen direkt an der Aufgabe, nichts geht verloren.",
      "Die Kanban-Ansicht macht den Stand der Dinge sofort sichtbar.",
    ],
    cons: [
      "Das Gantt-Diagramm ist für komplexe Abhängigkeiten zu einfach.",
      "Budget-Controlling ist nur rudimentär.",
      "Die mobile App kann weniger als die Web-Version.",
      "Bei vielen parallelen Projekten wird es unübersichtlich.",
      "Einige Integrationen fehlen noch.",
      "Benachrichtigungen muss man erst mühsam einstellen, sonst wird es zu viel.",
    ],
  },

  zeiterfassung: {
    industries: ["Handwerk", "Gastronomie & Hotellerie", "Gesundheitswesen", "Einzelhandel", "IT & Software", "Bauwesen", "Logistik & Transport"],
    jobs: [["Inhaber", "Inhaberin"], ["Betriebsleiter", "Betriebsleiterin"], ["Personalsachbearbeiter", "Personalsachbearbeiterin"], ["Geschäftsführer", "Geschäftsführerin"], ["Filialleiter", "Filialleiterin"], ["Teamleiter", "Teamleiterin"]],
    sizes: [26, 44, 22, 5, 3],
    contexts: [
      "Wir erfassen {since} die Arbeitszeit aller {n} Mitarbeitenden mit {name}.",
      "Vorher hatten wir Stundenzettel auf Papier, {since} nutzen wir {name}.",
      { t: "Nach dem BAG-Beschluss zur Arbeitszeiterfassung haben wir {name} eingeführt.", req: ["de"] },
      "Unsere Leute arbeiten an verschiedenen Einsatzorten und stempeln per App.",
    ],
    titles: [
      "Stempeln per App klappt super",
      "Einfach, günstig, erfüllt die Pflicht",
      "Überstunden endlich nachvollziehbar",
      "Gute Lösung für unsere Schichtplanung",
      "Der Lohnexport spart jeden Monat Zeit",
      { t: "Arbeitszeiterfassung unkompliziert umgesetzt", req: ["de"] },
    ],
    pros: [
      "Mitarbeitende stempeln per App oder Terminal, die Erfassung ist lückenlos dokumentiert.",
      { t: "Pausen und Höchstarbeitszeiten nach dem Arbeitszeitgesetz werden automatisch geprüft.", req: ["de"] },
      "Überstunden- und Urlaubskonten sind immer aktuell.",
      "Der Export der Stunden an die Lohnabrechnung funktioniert reibungslos.",
      "Die Einrichtung hat nur einen Nachmittag gedauert.",
      "Projektzeiten nutzen wir direkt für die Abrechnung.",
      "Korrekturen laufen über einen Freigabeprozess, das schafft Vertrauen im Team.",
    ],
    cons: [
      "Auswertungen könnten flexibler sein.",
      "Manche Funktionen gibt es nur als kostenpflichtiges Add-on.",
      "Die Terminal-Hardware ist nicht ganz günstig.",
      "Die Offline-Erfassung in der App funktioniert nicht immer zuverlässig.",
      "Die Schichtplanung ist für kurzfristige Tauschwünsche etwas umständlich.",
    ],
  },

  dokumentenmanagement: {
    industries: ["Steuerberatung", "Rechtsberatung", "Produktion & Fertigung", "Gesundheitswesen", "Immobilien", "Logistik & Transport"],
    jobs: [["IT-Leiter", "IT-Leiterin"], ["Buchhalter", "Buchhalterin"], ["Kaufmännischer Leiter", "Kaufmännische Leiterin"], ["Kanzleimanager", "Kanzleimanagerin"], ["Qualitätsmanager", "Qualitätsmanagerin"], ["Geschäftsführer", "Geschäftsführerin"]],
    sizes: [12, 38, 34, 10, 6],
    contexts: [
      "Wir archivieren {since} Belege, Verträge und Personalunterlagen in {name}.",
      "Mit {name} haben wir unser Papierarchiv mit Hunderten Ordnern abgelöst.",
      "Wir nutzen {name} {since} vor allem für den digitalen Rechnungseingang.",
      "{name} ist bei uns {since} das zentrale Archiv für alle Abteilungen.",
    ],
    titles: [
      { t: "Die Betriebsprüfung war entspannt", req: ["de"] },
      "Papierarchiv endlich abgeschafft",
      "Rechnungseingang läuft jetzt digital",
      { t: "GoBD-konforme Ablage ohne Kopfzerbrechen", req: ["de"] },
      "Die Volltextsuche findet alles",
      "Leistungsstark, wenn es einmal eingerichtet ist",
    ],
    pros: [
      { t: "Die revisionssichere Archivierung nach GoBD hat sich bei der letzten Betriebsprüfung bewährt.", req: ["de"] },
      { t: "Eingangsrechnungen werden erfasst, digital freigegeben und an DATEV übergeben.", req: ["datev"] },
      "Die Volltextsuche findet jedes Dokument in Sekunden.",
      "Aufbewahrungsfristen werden automatisch überwacht.",
      "E-Mails werden automatisch und revisionssicher archiviert.",
      "Freigabe-Workflows für Rechnungen laufen jetzt ohne Laufzettel.",
      "Dokumente lassen sich direkt aus Outlook und dem Scanner ablegen.",
    ],
    cons: [
      "Die Einführung braucht ein ordentliches Projekt.",
      "Die Oberfläche ist nicht die modernste.",
      "Zusätzliche Module treiben die Lizenzkosten.",
      "Workflows einzurichten erfordert Schulung.",
      "Die Verschlagwortung muss man anfangs sehr sorgfältig planen.",
    ],
  },
};

const FALLBACK = PROFILES.buchhaltungssoftware;

// ───────────── shared pools ─────────────

const GENERIC_PROS: Line[] = [
  "Die Oberfläche ist aufgeräumt, neue Kolleginnen und Kollegen finden sich schnell zurecht.",
  "Der Support antwortet meist am selben Tag und kennt sich aus.",
  "Die Einrichtung war an einem Nachmittag erledigt.",
  "Updates kommen regelmäßig und ohne Ausfallzeiten.",
  "Das Preis-Leistungs-Verhältnis passt für unsere Betriebsgröße.",
  "Die Hilfeartikel sind verständlich und aktuell.",
  { t: "Die Daten liegen in einem deutschen Rechenzentrum, das war uns beim Datenschutz wichtig.", req: ["dehost"] },
  "Die Rechteverwaltung trennt Zugriffe sauber nach Rollen.",
  "Seit wir mit {name} arbeiten, sind viele Excel-Listen überflüssig.",
  "Die Software läuft stabil, Ausfälle hatten wir praktisch keine.",
];

const GENERIC_CONS: Line[] = [
  "Der telefonische Support ist zu Stoßzeiten schwer erreichbar.",
  "Einige nützliche Funktionen gibt es nur im teureren Tarif.",
  "Die Preise sind zuletzt spürbar gestiegen.",
  "Die mobile App kann deutlich weniger als die Browser-Version.",
  "Individuelle Auswertungen sind nur eingeschränkt möglich.",
  "Bei größeren Datenmengen wird die Oberfläche spürbar langsamer.",
  "Manche Menüs sind verschachtelt, bis man alles findet, dauert es.",
  "Die Datenübernahme aus dem Altsystem war mühsam.",
  "Neue Funktionen kommen manchmal ohne ausreichende Erklärung.",
];

const WEAK_PROS: Line[] = [
  "Die Grundfunktionen laufen stabil.",
  "Die Oberfläche sieht modern aus.",
  "Der Einstieg ist günstig.",
  "Einzelne Funktionen sind durchaus gut gelöst.",
];

const HARD_CONS: Line[] = [
  "Auf Support-Anfragen haben wir teils über eine Woche gewartet.",
  "Nach Updates funktionierten mehrfach Abläufe nicht mehr, die vorher liefen.",
  "Für unsere Anforderungen fehlen zu viele Funktionen, wir arbeiten mit Umwegen.",
  "Die Kosten sind mit jedem zusätzlichen Nutzer deutlich gestiegen.",
  "Die Kündigung war umständlicher als der Abschluss.",
  "Die Einarbeitung hat viel länger gedauert, als uns im Vertrieb versprochen wurde.",
];

const TITLES: Record<"top" | "good" | "mid" | "bad", Line[]> = {
  top: [
    "Klare Empfehlung",
    "Genau das, was wir gesucht haben",
    "Hat unseren Alltag spürbar vereinfacht",
    "Würden wir sofort wieder wählen",
    "Spart uns jede Woche mehrere Stunden",
    "Zuverlässig und durchdacht",
    "{name} ist aus unserem Alltag nicht mehr wegzudenken",
    "Der Wechsel zu {name} hat sich gelohnt",
  ],
  good: [
    "Gute Lösung mit kleinen Schwächen",
    "Im Alltag sehr hilfreich",
    "Solide Software, fairer Preis",
    "Nach kurzer Einarbeitung ein echter Gewinn",
    "Macht, was es soll, und das zuverlässig",
    "Mit {name} endlich Ordnung",
  ],
  mid: ["Solide, aber nicht perfekt", "Erfüllt den Zweck, mehr nicht", "Gute Ansätze, Luft nach oben", "Für den Alltag in Ordnung", "Licht und Schatten"],
  bad: ["Hat unsere Erwartungen nicht erfüllt", "Für uns nicht die richtige Lösung", "Zu viele Baustellen im Alltag", "Mehr Aufwand als Nutzen", "Leider enttäuscht"],
};

const VERDICTS: Record<1 | 2 | 3 | 4 | 5, string[]> = {
  5: ["Klare Empfehlung.", "Wir würden uns jederzeit wieder dafür entscheiden.", "Für uns genau die richtige Wahl.", "Wir sind rundum zufrieden."],
  4: ["Insgesamt sind wir zufrieden und bleiben dabei.", "Kleine Schwächen, unterm Strich aber eine gute Lösung.", "Wir können {name} guten Gewissens empfehlen."],
  3: ["Erfüllt seinen Zweck, begeistert aber nicht.", "Solide, aber mit Luft nach oben.", "Für den Alltag in Ordnung, bei Sonderfällen wird es mühsam."],
  2: ["Wir schauen uns derzeit nach Alternativen um.", "Im Alltag kostet es uns mehr Zeit, als es spart."],
  1: ["Für uns leider ein Fehlgriff.", "Wir haben den Vertrag inzwischen gekündigt."],
};

// ───────────── generator ─────────────

const START = Date.UTC(2024, 1, 1);
const END = Date.UTC(2026, 8, 19);
const SIZES = ["1–9", "10–49", "50–249", "250–499", "500+"] as const;
const DURATION_WEIGHTS = [10, 16, 28, 32, 14];

function weighted<T>(rnd: Rnd, items: readonly T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rnd() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
}

/**
 * Star shares for a product whose reviews should average t: a realistic tail of 1 to 3 stars that grows as
 * the score drops, and the 4/5 split solved so the expected mean is exactly t.
 */
function starDistribution(t: number): number[] {
  const p1 = Math.max(0.01, 0.015 + (4.5 - t) * 0.03);
  const p2 = Math.max(0.015, 0.025 + (4.5 - t) * 0.05);
  const p3 = Math.max(0.04, 0.07 + (4.5 - t) * 0.13);
  const m = 1 - p1 - p2 - p3;
  const p5 = Math.min(m - 0.05, Math.max(0.05, t - p1 - 2 * p2 - 3 * p3 - 4 * m));
  return [p1, p2, p3, m - p5, p5];
}

const trimDot = (s: string) => s.replace(/[.\s]+$/, "");

export function generateSeedReviews(s: Software): Review[] {
  const rnd = mulberry32(hash(`seed:${s.slug}`));
  const p = PROFILES[s.category?.slug ?? ""] ?? FALLBACK;
  const ed = s.editorial;
  const target = ed?.rating ?? 4.1;
  const offsets = ed
    ? { ease: ed.ease - ed.rating, value: ed.value - ed.rating, service: ed.service - ed.rating, functionality: ed.functionality - ed.rating }
    : { ease: 0, value: 0, service: 0, functionality: 0 };
  const dist = starDistribution(target);

  const count = 100 + Math.floor(rnd() * 101);
  const out: Review[] = [];

  for (let i = 0; i < count; i++) {
    const overall = weighted(rnd, [1, 2, 3, 4, 5] as const, dist);
    const dim = (off: number) => clamp5(overall + off + gauss(rnd) * 0.55);

    const cr = rnd();
    const country = cr < 0.88 ? "Deutschland" : cr < 0.96 ? "Österreich" : "Schweiz";
    const city = country === "Deutschland" ? pick(rnd, CITIES_DE) : country === "Österreich" ? pick(rnd, CITIES_AT) : pick(rnd, CITIES_CH);
    const c: Ctx = { s, german: country === "Deutschland" };

    const size = weighted(rnd, SIZES, p.sizes);
    const [lo, hi] = SIZE_RANGE[size];
    const n = lo + Math.floor(rnd() * (hi - lo + 1));
    const legal = legalFormFor(rnd, size, country);
    const soloForm = legal === "Einzelunternehmen" || legal === "Freiberuflich";
    const company = !soloForm && rnd() < 0.4 ? `${pick(rnd, COMPANY_STEMS)} ${legal}` : null;

    const female = rnd() < 0.5;
    const first = pick(rnd, female ? FEMALE : MALE);
    const initial = LAST_INITIAL[Math.floor(rnd() * LAST_INITIAL.length)];
    const job = pick(rnd, p.jobs)[female ? 1 : 0];

    const duration = weighted(rnd, DURATIONS, overall <= 2 ? [34, 30, 22, 11, 3] : DURATION_WEIGHTS);
    const since = pick(rnd, SINCE[duration]);
    const fill = (t: string) =>
      t.replace(/\{name\}/g, s.name).replace(/\{n\}/g, String(n)).replace(/\{since\}/g, since);
    const sentence = (t: string) => fill(t).replace(/^./, (ch) => ch.toUpperCase());

    // title
    const tier = overall === 5 ? "top" : overall === 4 ? "good" : overall === 3 ? "mid" : "bad";
    const titlePool = overall >= 4 && rnd() < 0.55 ? p.titles : TITLES[tier];
    const title = fill(pickLine(rnd, titlePool, c) ?? pick(rnd, TITLES.good) as string);

    // summary
    const context = pickLine(rnd, p.contexts, c) ?? "Wir nutzen {name} {since}.";
    const summary = `${sentence(context)} ${fill(pick(rnd, VERDICTS[overall]))}`;

    // pros
    const pros: string[] = [];
    const proCount = overall <= 2 ? 1 : rnd() < 0.7 ? 2 : 1;
    for (let k = 0; k < proCount; k++) {
      let line: string | null;
      const r = rnd();
      if (overall <= 2) line = pickLine(rnd, WEAK_PROS, c, pros);
      else if (r < 0.12 && s.top_features.length) line = `Größter Pluspunkt für uns: ${trimDot(pick(rnd, s.top_features))}.`;
      else if (r < 0.2 && s.integrations.length) line = `Die Anbindung an ${pick(rnd, s.integrations)} läuft bei uns stabil.`;
      else if (r < 0.4) line = pickLine(rnd, GENERIC_PROS, c, pros);
      else line = pickLine(rnd, p.pros, c, pros);
      if (line && !pros.includes(fill(line))) pros.push(fill(line));
    }

    // cons
    const r = rnd();
    let con: string | null;
    if (overall <= 2) con = pickLine(rnd, HARD_CONS, c);
    else if (r < 0.15 && (s.cons ?? []).length) con = `${overall === 5 ? "" : "Kritikpunkt: "}${trimDot(pick(rnd, s.cons ?? []))}.`;
    else if (r < 0.45) con = pickLine(rnd, GENERIC_CONS, c);
    else con = pickLine(rnd, p.cons, c);
    if (con && overall === 5 && rnd() < 0.6) con = `Nur Kleinigkeiten: ${con}`;

    const t = END - (END - START) * Math.pow(rnd(), 1.35);
    const date = new Date(t).toISOString().slice(0, 10);

    out.push({
      id: `rv-${s.slug}-${i + 1}`,
      software_id: s.id,
      reviewer_name: `${first} ${initial}.`,
      reviewer_job_title: job,
      reviewer_company: company,
      reviewer_industry: pick(rnd, p.industries),
      reviewer_company_size: size,
      reviewer_country: country,
      reviewer_city: city,
      reviewer_legal_form: legal,
      reviewer_avatar_url: null,
      verified_linkedin: false,
      verified_badge: null,
      used_for_duration: duration,
      overall_rating: overall,
      ease_of_use: dim(offsets.ease),
      value_for_money: dim(offsets.value),
      customer_service: dim(offsets.service),
      functionality: dim(offsets.functionality),
      review_title: title,
      summary,
      pros: pros.join(" ") || null,
      cons: con ? fill(con) : null,
      vendor_response: null,
      vendor_response_date: null,
      review_date: date,
      helpful_count: Math.floor(Math.pow(rnd(), 2.4) * 42),
      status: "published",
      created_at: `${date}T09:00:00.000Z`,
    });
  }
  return out.sort((a, b) => b.review_date.localeCompare(a.review_date));
}

// ───────────── applying to the dataset ─────────────

const cache = new Map<string, Review[]>();
const round1 = (x: number) => Math.round(x * 10) / 10;
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** Replaces the dataset's reviews with seed reviews and recomputes every product's aggregates from them. */
export function applySeedReviews<D extends { software: Software[]; reviews: Review[] }>(
  d: D,
  withDisplayScores: (s: Software) => Software,
): D {
  const reviews: Review[] = [];
  const software = d.software.map((s) => {
    const key = `${s.id}|${s.slug}`;
    let rs = cache.get(key);
    if (!rs) cache.set(key, (rs = generateSeedReviews(s)));
    reviews.push(...rs);
    return withDisplayScores({
      ...s,
      overall_rating: round1(avg(rs.map((r) => r.overall_rating))),
      ease_of_use_rating: round1(avg(rs.map((r) => r.ease_of_use ?? 0))),
      value_for_money_rating: round1(avg(rs.map((r) => r.value_for_money ?? 0))),
      customer_service_rating: round1(avg(rs.map((r) => r.customer_service ?? 0))),
      functionality_rating: round1(avg(rs.map((r) => r.functionality ?? 0))),
      review_count: rs.length,
    });
  });
  return { ...d, software, reviews: reviews.sort((a, b) => b.review_date.localeCompare(a.review_date)) };
}
