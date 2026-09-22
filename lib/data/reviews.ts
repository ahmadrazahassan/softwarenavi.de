/** UNUSED since 22.09.2026: the site no longer generates reviews. Kept only as a reference; do not import. */
import type { Review } from "@/lib/types";
import type { ProductDef } from "./define";
import { COMPANY_SIZES, DURATIONS } from "@/lib/i18n/options";

/**
 * Deterministic demo-review generator. Every seeded reviewer carries the „(Demo)“ suffix
 * (backend doc §8) so real content stays distinguishable. Names follow the data-minimisation
 * rule: first name + initial of the surname.
 */

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
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = [
  "Katrin", "Thomas", "Sabine", "Michael", "Julia", "Andreas", "Stefanie", "Markus", "Anna", "Christian",
  "Laura", "Tobias", "Nicole", "Stefan", "Melanie", "Jan", "Sandra", "Daniel", "Claudia", "Florian",
  "Petra", "Matthias", "Lena", "Sebastian", "Birgit", "Alexander", "Jana", "Frank", "Miriam", "Jörg",
  "Kerstin", "Philipp", "Anja", "Lukas", "Susanne", "Martin", "Carina", "Holger", "Nina", "Dirk",
  "Ayşe", "Mehmet", "Katarzyna", "Dimitrios", "Ines", "Björn", "Özlem", "Uwe", "Franziska", "Ralf",
];
const LAST_INITIAL = "ABBDEFGHHJKKLLMMMNPRSSSSTWWWZ";

const CITIES_DE = [
  "München", "Hamburg", "Köln", "Frankfurt am Main", "Stuttgart", "Düsseldorf", "Leipzig", "Nürnberg",
  "Bremen", "Dortmund", "Hannover", "Essen", "Berlin", "Dresden", "Münster", "Freiburg im Breisgau",
  "Mannheim", "Augsburg", "Regensburg", "Kiel",
];
const CITIES_AT = ["Wien", "Graz", "Linz", "Salzburg"];
const CITIES_CH = ["Zürich", "Basel", "Bern", "St. Gallen"];

const COMPANY_STEMS = [
  "Müller Haustechnik", "Schneider & Partner", "Nordlicht Medien", "Weber Logistik", "Brandt Elektro",
  "Hofmann Bau", "Kaiser Feinkost", "Lindner Consulting", "Vogel Metallbau", "Seidel Immobilien",
  "Krüger Dental", "Alpenblick Hotels", "Fischer Druck", "Becker Maschinenbau", "Rheinwerk Digital",
  "Hanse Kontor", "Sommer Gartenbau", "Wagner Steuerberatung", "Kraus Handelshaus", "Elbe IT-Service",
  "Bergmann Tischlerei", "Werner Pflegedienst", "Mainufer Architekten", "Schwarz Autohaus", "Lorenz Optik",
];
const LEGAL = ["GmbH", "GmbH", "GmbH", "GmbH & Co. KG", "UG (haftungsbeschränkt)", "e. K.", "AG", "GbR"];

const INDUSTRIES_BY_CAT: Record<string, string[]> = {
  "cat-buchhaltung": ["Handwerk", "Einzelhandel", "E-Commerce", "IT & Software", "Agentur & Marketing", "Steuerberatung", "Gastronomie & Hotellerie", "Immobilien"],
  "cat-lohn": ["Handwerk", "Produktion & Fertigung", "Steuerberatung", "Gesundheitswesen", "Bauwesen", "Logistik & Transport", "Gastronomie & Hotellerie"],
  "cat-hr": ["IT & Software", "Produktion & Fertigung", "Gesundheitswesen", "Logistik & Transport", "Einzelhandel", "Agentur & Marketing"],
  "cat-crm": ["IT & Software", "Agentur & Marketing", "Produktion & Fertigung", "Immobilien", "E-Commerce", "Rechtsberatung"],
  "cat-erp": ["Produktion & Fertigung", "E-Commerce", "Einzelhandel", "Logistik & Transport", "Handwerk", "Bauwesen"],
  "cat-pm": ["Agentur & Marketing", "IT & Software", "Bauwesen", "Bildung", "Verein & Non-Profit", "Produktion & Fertigung"],
  "cat-zeit": ["Handwerk", "Gastronomie & Hotellerie", "Gesundheitswesen", "Einzelhandel", "IT & Software", "Bauwesen"],
  "cat-dms": ["Steuerberatung", "Rechtsberatung", "Produktion & Fertigung", "Gesundheitswesen", "Immobilien", "Logistik & Transport"],
};

const JOBS_BY_CAT: Record<string, string[]> = {
  "cat-buchhaltung": ["Geschäftsführerin", "Geschäftsführer", "Buchhalterin", "Buchhalter", "Kaufmännische Leitung", "Inhaberin", "Inhaber", "Office-Managerin", "Steuerfachangestellte"],
  "cat-lohn": ["Lohnbuchhalterin", "Lohnbuchhalter", "Personalsachbearbeiterin", "Steuerfachangestellte", "Kaufmännische Leitung", "Geschäftsführer"],
  "cat-hr": ["HR-Managerin", "HR-Manager", "Personalleiterin", "Personalleiter", "People & Culture Lead", "Geschäftsführerin"],
  "cat-crm": ["Vertriebsleiter", "Vertriebsleiterin", "Key Account Manager", "Geschäftsführer", "Marketing-Managerin", "Vertriebsinnendienst"],
  "cat-erp": ["Leiter Einkauf", "Kaufmännische Leitung", "Geschäftsführer", "IT-Leiterin", "Logistikleiter", "Produktionsplanerin"],
  "cat-pm": ["Projektmanagerin", "Projektmanager", "Teamleiterin", "Agenturinhaber", "PMO-Leitung", "Abteilungsleiter"],
  "cat-zeit": ["Inhaber", "Betriebsleiterin", "Personalsachbearbeiterin", "Geschäftsführer", "Filialleiterin", "Teamleiter"],
  "cat-dms": ["IT-Leiter", "Buchhalterin", "Kaufmännische Leitung", "Kanzleimanagerin", "Qualitätsmanagerin", "Geschäftsführer"],
};

interface TextPool {
  titles: string[];
  pros: string[];
  cons: string[];
  summaries: string[];
}

const POOLS: Record<string, TextPool> = {
  "cat-buchhaltung": {
    titles: [
      "Die UStVA ist jetzt in zehn Minuten erledigt",
      "Endlich GoBD-konforme Belegablage ohne Papierstapel",
      "Solide Buchhaltung, die Kanzlei ist zufrieden",
      "Guter Funktionsumfang, bei Details noch Luft nach oben",
      "Für unsere EÜR genau das Richtige",
      "DATEV-Export spart unserer Steuerberaterin viel Zeit",
      "Umstellung auf die E-Rechnung ohne Stress",
      "Für den Preis eine sehr ordentliche Lösung",
      "Bankabgleich funktioniert zuverlässig",
      "Nach der Einarbeitung ein echter Zeitgewinn",
    ],
    pros: [
      "Die Umsatzsteuer-Voranmeldung geht mit wenigen Klicks per ELSTER raus. Rechtzeitig vor dem 10. und ohne Nacharbeit.",
      "Belege fotografiere ich direkt mit dem Handy, Betrag und Steuersatz werden meist korrekt erkannt.",
      "Der DATEV-Export klappt reibungslos; unsere Kanzlei bekommt die Buchungsstapel mit Belegbildern.",
      "Der automatische Abgleich der Kontoumsätze mit offenen Rechnungen spart jeden Monat Stunden.",
      "E-Rechnungen im ZUGFeRD-Format können wir empfangen und selbst ausstellen.",
      "Die Oberfläche ist aufgeräumt, auch Kolleginnen ohne Buchhaltungserfahrung finden sich zurecht.",
      "SKR 04 ist sauber hinterlegt, Kontierungsvorschläge sind meist treffend.",
      "Das Mahnwesen läuft automatisch, unsere Außenstände sind deutlich gesunken.",
    ],
    cons: [
      "Individuelle Anpassungen der Rechnungsvorlagen sind nur eingeschränkt möglich.",
      "Der telefonische Support ist nicht in allen Tarifen enthalten.",
      "Bei Sonderfällen wie Reverse-Charge musste ich mehrmals nachlesen.",
      "Die Preise sind in den letzten Jahren merklich gestiegen.",
      "Auswertungen könnten flexibler sein, eine frei konfigurierbare BWA fehlt.",
      "Die App ist langsamer als die Browser-Version.",
      "Anlagenverwaltung erst im teureren Paket.",
    ],
    summaries: [
      "Wir nutzen die Software für die laufende Buchhaltung und übergeben die Daten monatlich an unsere Steuerkanzlei.",
      "Als kleines Unternehmen erledigen wir Rechnungen, Belegerfassung und UStVA komplett selbst.",
      "Nach dem Wechsel von Excel und Papierordnern ist unsere Buchhaltung deutlich strukturierter.",
      "Die Software begleitet uns seit der Gründung und ist mit uns gewachsen.",
    ],
  },
  "cat-lohn": {
    titles: [
      "Lohnabrechnung zuverlässig und rechtssicher",
      "Meldewesen läuft praktisch von allein",
      "Gute Software, aber Einarbeitung nötig",
      "ELStAM-Abruf und DEÜV ohne Probleme",
      "Unsere Kanzlei arbeitet gern damit",
      "Beitragsnachweise pünktlich, keine Säumniszuschläge mehr",
      "Solide Lohnsoftware für unseren Betrieb",
    ],
    pros: [
      "Lohnsteueranmeldung und Beitragsnachweise werden pünktlich übermittelt, wir hatten keine Fristversäumnisse mehr.",
      "Der ELStAM-Abruf funktioniert automatisch, Änderungen der Steuerklasse kommen zuverlässig an.",
      "Gesetzliche Änderungen zum Jahreswechsel werden rechtzeitig eingespielt.",
      "Die DEÜV-Meldungen bei Ein- und Austritten sind in wenigen Minuten erledigt.",
      "Die Übergabe der Lohnjournale an die Finanzbuchhaltung per DATEV klappt problemlos.",
      "Umlageanträge U1 und U2 lassen sich direkt aus der Software stellen.",
    ],
    cons: [
      "Die Oberfläche ist nicht mehr zeitgemäß.",
      "Für Sonderfälle wie Kurzarbeit braucht man Erfahrung.",
      "Ohne Lohn-Vorkenntnisse kommt man schnell an Grenzen.",
      "Das Mitarbeiterportal könnte moderner sein.",
      "Support-Hotline zum Monatsende oft überlastet.",
    ],
    summaries: [
      "Wir rechnen monatlich rund 40 Mitarbeitende ab, inklusive Minijobbern und Auszubildenden.",
      "Die Lohnabrechnung erledigen wir seit einigen Jahren selbst statt über die Kanzlei.",
      "Als Lohnbüro betreuen wir mehrere Mandanten mit der Software.",
    ],
  },
  "cat-hr": {
    titles: [
      "Personalakte endlich digital und aufgeräumt",
      "Urlaubsanträge ohne Papier und Excel",
      "Gute HR-Software, der Betriebsrat war schnell überzeugt",
      "Onboarding läuft jetzt strukturiert",
      "Viele Funktionen, gutes Rechtekonzept",
      "Die Lohnvorbereitung für die Kanzlei ist viel einfacher",
      "Solide Plattform mit kleinen Schwächen im Reporting",
    ],
    pros: [
      "Abwesenheiten werden per App beantragt und genehmigt, Resturlaub ist immer aktuell.",
      "Das Rollen- und Rechtekonzept hat die Abstimmung mit dem Betriebsrat nach § 87 BetrVG sehr erleichtert.",
      "Die Übergabe der lohnrelevanten Daten an unsere Kanzlei per DATEV-Schnittstelle spart viele Rückfragen.",
      "Onboarding-Checklisten sorgen dafür, dass am ersten Tag alles bereitliegt.",
      "Verträge und Bescheinigungen liegen zentral in der digitalen Personalakte.",
      "Das Recruiting-Modul veröffentlicht Stellen direkt auf mehreren Jobbörsen.",
    ],
    cons: [
      "Die Berichte sind nicht so flexibel, wie wir es uns wünschen würden.",
      "Die Einrichtung der Workflows hat länger gedauert als geplant.",
      "Für kleine Teams ist der Preis recht hoch.",
      "Manche Übersetzungen in der Oberfläche wirken holprig.",
      "Zeiterfassung ist nur ein Zusatzmodul.",
    ],
    summaries: [
      "Wir verwalten rund 120 Mitarbeitende an drei Standorten mit der Software.",
      "Die Einführung haben wir gemeinsam mit dem Betriebsrat geplant und eine Betriebsvereinbarung abgeschlossen.",
      "Vorher lief die Personalverwaltung über Excel und Papierakten.",
    ],
  },
  "cat-crm": {
    titles: [
      "Unser Vertrieb hat endlich den Überblick",
      "Pipeline-Ansicht macht den Unterschied",
      "Gutes CRM, das Team nutzt es gern",
      "Viele Funktionen, manchmal zu viele",
      "Angebote direkt aus dem CRM, sehr praktisch",
      "Solide Lösung für den Mittelstand",
      "Kontakte zentral statt in fünf Excel-Listen",
    ],
    pros: [
      "Die Pipeline zeigt auf einen Blick, wo jede Verkaufschance steht.",
      "E-Mails aus Outlook werden automatisch dem richtigen Kontakt zugeordnet.",
      "Wiedervorlagen sorgen dafür, dass kein Angebot mehr unbeantwortet liegen bleibt.",
      "Einwilligungen für Newsletter werden sauber mit Zeitstempel dokumentiert.",
      "Die mobile App ist im Außendienst sehr hilfreich.",
      "Dashboards für die Vertriebsleitung sind schnell eingerichtet.",
    ],
    cons: [
      "Die höheren Tarife werden schnell teuer.",
      "Einige Automatisierungen gibt es nur in den großen Paketen.",
      "Die Datenmigration aus dem Altsystem war mühsam.",
      "Manche Menüs sind nur teilweise übersetzt.",
      "Berichte lassen sich nur eingeschränkt anpassen.",
    ],
    summaries: [
      "Wir nutzen das CRM im Vertriebsinnendienst und im Außendienst mit zwölf Nutzerinnen und Nutzern.",
      "Nach Jahren mit Excel-Listen haben wir unseren Vertrieb auf ein richtiges CRM umgestellt.",
      "Das CRM ist bei uns mit Buchhaltung und Newsletter-Tool verbunden.",
    ],
  },
  "cat-erp": {
    titles: [
      "Warenwirtschaft und Buchhaltung endlich aus einem Guss",
      "Guter Funktionsumfang, Einführung braucht Zeit",
      "Lagerbestände stimmen jetzt",
      "Die Shop-Anbindung läuft stabil",
      "Solides ERP für unseren Betrieb",
      "E-Rechnung und DATEV-Export funktionieren zuverlässig",
      "Viel Potenzial, aber auch viel Konfiguration",
    ],
    pros: [
      "Bestellungen aus dem Onlineshop landen automatisch im System, Lieferscheine und Rechnungen folgen ohne Handarbeit.",
      "Der Lagerbestand ist endlich in Echtzeit korrekt.",
      "Die Übergabe an unsere Steuerkanzlei per DATEV-Export klappt jeden Monat problemlos.",
      "E-Rechnungen im XRechnung-Format für öffentliche Auftraggeber sind kein Problem mehr.",
      "Stücklisten und Fertigungsaufträge sind gut abgebildet.",
      "Die Versandanbindung an DHL und DPD spart täglich Zeit.",
    ],
    cons: [
      "Die Einführung hat deutlich länger gedauert als geplant.",
      "Ohne Partner ist die Konfiguration schwierig.",
      "Manche Auswertungen müssen wir weiterhin in Excel nachbauen.",
      "Die Oberfläche wirkt in Teilen überladen.",
      "Lizenzkosten pro Nutzer summieren sich.",
    ],
    summaries: [
      "Wir steuern Einkauf, Lager, Versand und Rechnungsstellung für rund 3.000 Artikel über das System.",
      "Das ERP hat bei uns drei Einzellösungen und viele Excel-Listen abgelöst.",
      "Wir sind ein produzierender Betrieb mit 80 Mitarbeitenden.",
    ],
  },
  "cat-pm": {
    titles: [
      "Endlich wissen alle, wer woran arbeitet",
      "Auslastungsplanung ist Gold wert",
      "Übersichtlich und schnell eingeführt",
      "Gutes Tool, der Serverstandort war für uns entscheidend",
      "Unsere Projekte laufen strukturierter",
      "Solide, aber Gantt könnte besser sein",
      "Ersetzt bei uns E-Mail-Pingpong",
    ],
    pros: [
      "Die Auslastung im Team ist jederzeit sichtbar, Überlastungen erkennen wir früh.",
      "Zeiten werden direkt auf Aufgaben gebucht, die Abrechnung an Kunden ist viel einfacher.",
      "Der Serverstandort in Deutschland hat unseren Datenschutzbeauftragten überzeugt.",
      "Kunden können per Gastzugang Feedback direkt an Aufgaben geben.",
      "Vorlagen für wiederkehrende Projekte sparen viel Zeit.",
      "Die Oberfläche ist so intuitiv, dass kaum Schulung nötig war.",
    ],
    cons: [
      "Das Gantt-Diagramm ist für komplexe Abhängigkeiten zu einfach.",
      "Budget-Controlling ist nur rudimentär.",
      "Die mobile App kann weniger als die Web-Version.",
      "Bei vielen Projekten wird es unübersichtlich.",
      "Einige Integrationen fehlen noch.",
    ],
    summaries: [
      "Wir sind eine Agentur mit 25 Mitarbeitenden und planen alle Kundenprojekte im Tool.",
      "Das Tool hat bei uns eine Mischung aus Excel, E-Mail und Whiteboard ersetzt.",
      "Wir steuern damit interne Projekte in Verwaltung und IT.",
    ],
  },
  "cat-zeit": {
    titles: [
      "Arbeitszeiterfassung nach dem BAG-Beschluss unkompliziert umgesetzt",
      "Stempeln per App klappt super",
      "Einfach, günstig, erfüllt die Pflicht",
      "Überstunden endlich nachvollziehbar",
      "Gute Lösung für unsere Schichtplanung",
      "Lohnexport spart jeden Monat Zeit",
    ],
    pros: [
      "Mitarbeitende stempeln per App oder Terminal, die Erfassung ist manipulationssicher dokumentiert.",
      "Pausen und Höchstarbeitszeiten nach dem Arbeitszeitgesetz werden automatisch geprüft.",
      "Überstunden- und Urlaubskonten sind immer aktuell.",
      "Der Export der Stunden an die Lohnabrechnung funktioniert reibungslos.",
      "Die Einrichtung hat nur einen Nachmittag gedauert.",
      "Projektzeiten lassen sich direkt für die Abrechnung nutzen.",
    ],
    cons: [
      "Auswertungen könnten flexibler sein.",
      "Manche Funktionen gibt es nur als kostenpflichtiges Add-on.",
      "Die Terminal-Hardware ist nicht ganz günstig.",
      "Offline-Erfassung in der App funktioniert nicht immer zuverlässig.",
    ],
    summaries: [
      "Seit dem BAG-Beschluss erfassen wir die Arbeitszeit aller 35 Mitarbeitenden mit der Software.",
      "Wir sind ein Handwerksbetrieb mit Mitarbeitenden auf verschiedenen Baustellen.",
      "Vorher hatten wir Stundenzettel auf Papier.",
    ],
  },
  "cat-dms": {
    titles: [
      "Revisionssicheres Archiv, die Betriebsprüfung war entspannt",
      "Papierarchiv endlich abgeschafft",
      "Rechnungseingang läuft jetzt digital",
      "Leistungsstark, aber komplex",
      "GoBD-konforme Ablage ohne Kopfzerbrechen",
      "Volltextsuche findet alles",
    ],
    pros: [
      "Die revisionssichere Archivierung nach GoBD hat sich bei der letzten Betriebsprüfung bewährt.",
      "Eingangsrechnungen werden erfasst, digital freigegeben und an DATEV übergeben.",
      "Die Volltextsuche findet jedes Dokument in Sekunden.",
      "Aufbewahrungsfristen von acht und zehn Jahren werden automatisch überwacht.",
      "E-Mails werden automatisch und revisionssicher archiviert.",
      "Die Vorlagen für die Verfahrensdokumentation waren sehr hilfreich.",
    ],
    cons: [
      "Die Einführung braucht ein ordentliches Projekt.",
      "Die Oberfläche ist nicht die modernste.",
      "Lizenzkosten für zusätzliche Module summieren sich.",
      "Die Einrichtung von Workflows erfordert Schulung.",
    ],
    summaries: [
      "Wir archivieren sämtliche Belege, Verträge und Personalunterlagen im DMS.",
      "Mit dem DMS haben wir unser Papierarchiv mit über 400 Ordnern abgelöst.",
      "Wir nutzen das System vor allem für den digitalen Rechnungseingang.",
    ],
  },
};

const VENDOR_RESPONSES = [
  "Vielen Dank für Ihre ausführliche Bewertung. Ihr Hinweis zu den Auswertungen ist bei unserem Produktteam angekommen. Wir arbeiten an mehr Flexibilität.",
  "Herzlichen Dank für Ihr Feedback. Es freut uns, dass die Zusammenarbeit mit Ihrer Steuerkanzlei so reibungslos läuft.",
  "Danke für Ihre Rückmeldung. Gern zeigt Ihnen unser Support-Team in einer kurzen Schulung weitere Möglichkeiten. Melden Sie sich jederzeit.",
];

function pick<T>(rnd: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function gauss(rnd: () => number) {
  return (rnd() + rnd() + rnd() - 1.5) / 1.5; // ~N(0, 0.33)·… bounded
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

const START = Date.UTC(2024, 0, 15);
const END = Date.UTC(2026, 8, 12);

export function generateReviews(def: ProductDef): Review[] {
  const rnd = mulberry32(hash(def.slug));
  const pool = POOLS[def.category] ?? POOLS["cat-buchhaltung"];
  const industries = INDUSTRIES_BY_CAT[def.category] ?? ["Sonstige"];
  const jobs = JOBS_BY_CAT[def.category] ?? ["Geschäftsführer"];
  const base = 3.35 + (def.quality ?? 0.6) * 1.55;

  const out: Review[] = [];
  for (let i = 0; i < (def.reviews ?? 0); i++) {
    const overall = clamp(base + gauss(rnd) * 1.6);
    const dim = (bias: number) => clamp(overall + gauss(rnd) * 1.2 + bias);

    const countryRoll = rnd();
    const country = countryRoll < 0.82 ? "Deutschland" : countryRoll < 0.93 ? "Österreich" : "Schweiz";
    const city =
      country === "Deutschland" ? pick(rnd, CITIES_DE) : country === "Österreich" ? pick(rnd, CITIES_AT) : pick(rnd, CITIES_CH);

    const legal = pick(rnd, LEGAL);
    const showCompany = rnd() < 0.55; // employer optional (data minimisation)
    const sizeWeights = rnd();
    const size =
      sizeWeights < 0.28 ? COMPANY_SIZES[0].value :
      sizeWeights < 0.62 ? COMPANY_SIZES[1].value :
      sizeWeights < 0.88 ? COMPANY_SIZES[2].value :
      sizeWeights < 0.96 ? COMPANY_SIZES[3].value : COMPANY_SIZES[4].value;

    const date = new Date(START + rnd() * (END - START));
    const dateStr = date.toISOString().slice(0, 10);
    const hasResponse = rnd() < 0.14;
    const respDate = new Date(date.getTime() + (2 + Math.floor(rnd() * 12)) * 86400000).toISOString().slice(0, 10);

    const first = pick(rnd, FIRST);
    const initial = LAST_INITIAL[Math.floor(rnd() * LAST_INITIAL.length)];

    const pros = [pick(rnd, pool.pros), pick(rnd, pool.pros)].filter((v, idx, a) => a.indexOf(v) === idx).join(" ");
    const cons = pick(rnd, pool.cons);
    const title = overall <= 2 ? pick(rnd, ["Hat unsere Erwartungen leider nicht erfüllt", "Für uns nicht die richtige Lösung", "Zu viele Baustellen im Alltag"]) : pick(rnd, pool.titles);
    const summary = `${pick(rnd, pool.summaries)} ${overall >= 4 ? `Insgesamt sind wir mit ${def.name} sehr zufrieden und würden die Software weiterempfehlen.` : overall === 3 ? `${def.name} erfüllt seinen Zweck, es gibt aber Punkte, die besser sein könnten.` : `Wir prüfen derzeit Alternativen zu ${def.name}.`}`;

    out.push({
      id: `rv-${def.slug}-${i + 1}`,
      software_id: `sw-${def.slug}`,
      reviewer_name: `${first} ${initial}. (Demo)`,
      reviewer_job_title: pick(rnd, jobs),
      reviewer_company: showCompany ? `${pick(rnd, COMPANY_STEMS)} ${legal}` : null,
      reviewer_industry: pick(rnd, industries),
      reviewer_company_size: size,
      reviewer_country: country,
      reviewer_city: city,
      reviewer_legal_form: legal,
      reviewer_avatar_url: null,
      verified_linkedin: rnd() < 0.45,
      verified_badge: rnd() < 0.7 ? "Verifizierte Nutzung" : null,
      used_for_duration: pick(rnd, DURATIONS),
      overall_rating: overall,
      ease_of_use: dim(0.1),
      value_for_money: dim(-0.1),
      customer_service: dim(-0.2),
      functionality: dim(0.15),
      review_title: title,
      summary,
      pros,
      cons,
      vendor_response: hasResponse ? pick(rnd, VENDOR_RESPONSES) : null,
      vendor_response_date: hasResponse ? respDate : null,
      review_date: dateStr,
      helpful_count: Math.floor(rnd() * 38),
      status: "published",
      created_at: `${dateStr}T10:00:00.000Z`,
    });
  }
  return out.sort((a, b) => b.review_date.localeCompare(a.review_date));
}
