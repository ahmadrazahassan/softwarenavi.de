import type { EditorialDef } from "./index";

/** Lohnabrechnung und HR-Software. Preise laut pricing-verified.ts, Stand 22.09.2026. */
export const PAYROLL_HR: Record<string, EditorialDef> = {
  // ───────────── Lohnabrechnung ─────────────
  "datev-lohn-und-gehalt": {
    r: [4.4, 3.5, 4.0, 4.3, 4.9],
    verdict:
      "DATEV Lohn und Gehalt ist der Maßstab für die Entgeltabrechnung in deutschen Steuerkanzleien. Kein anderes Programm bildet so viele Sonderfälle ab, dafür verlangt es Fachwissen und wird fast immer von der Kanzlei bedient.",
    sections: [
      [
        "Einordnung",
        [
          "Wenn Ihre Lohnabrechnung von der Steuerkanzlei erledigt wird, läuft sie mit hoher Wahrscheinlichkeit über DATEV. Lohn und Gehalt ist das Programm, mit dem Kanzleien und größere Lohnbüros monatlich abrechnen, Meldungen an Krankenkassen und Finanzamt übermitteln und Bescheinigungen erstellen.",
        ],
      ],
      [
        "Stärken",
        [
          "Die Abdeckung ist beeindruckend. Baulohn, Kurzarbeit, betriebliche Altersversorgung, Minijobs, Pfändungen und Sachbezüge sind abgebildet, und gesetzliche Änderungen kommen verlässlich zum Jahreswechsel. Wer einen komplizierten Personalbestand hat, ist hier am sichersten aufgehoben.",
          "Über DATEV Unternehmen online können Sie Bewegungsdaten wie Stunden, Zuschläge oder Abwesenheiten selbst erfassen und Lohnunterlagen digital abrufen. Beschäftigte erhalten ihre Abrechnungen auf Wunsch über das Portal DATEV Arbeitnehmer online.",
        ],
      ],
      [
        "Einschränkungen",
        [
          "Für die eigenständige Nutzung im Betrieb ist das Programm wenig geeignet. Die Oberfläche ist auf Fachleute zugeschnitten, und die Lizenz läuft in der Regel über die Kanzlei. Wer die Lohnabrechnung selbst in der Hand haben möchte, ist mit Lexware lohn+gehalt oder Sage HR & Payroll besser bedient.",
        ],
      ],
      [
        "Kosten",
        [
          "Öffentliche Preise gibt es nicht. Die Kosten werden meist pro Abrechnung über die Kanzlei in Rechnung gestellt und sind Teil des Lohnbuchhaltungshonorars.",
        ],
      ],
    ],
  },

  "datev-lodas": {
    r: [4.2, 3.3, 4.0, 4.2, 4.7],
    verdict:
      "LODAS ist die zweite Lohnlösung von DATEV und auf effiziente Massenabrechnung in Kanzleien ausgelegt. Für Unternehmen spielt der Unterschied zu Lohn und Gehalt kaum eine Rolle, entscheidend ist, womit Ihre Kanzlei arbeitet.",
    sections: [
      [
        "Worin sich LODAS unterscheidet",
        [
          "Während DATEV Lohn und Gehalt dialogorientiert arbeitet, ist LODAS auf Stapelverarbeitung ausgelegt. Daten werden erfasst und in einem Lauf abgerechnet. Das spart in Kanzleien mit vielen Mandanten Zeit, verlangt aber eine eingespielte Arbeitsweise.",
        ],
      ],
      [
        "Für Unternehmen",
        [
          "Als Mandant merken Sie von der Wahl zwischen LODAS und Lohn und Gehalt wenig. Sie liefern Bewegungsdaten über DATEV Unternehmen online oder per Vorerfassung, die Kanzlei rechnet ab, und die Unterlagen stehen digital bereit. Der Funktionsumfang bei Meldungen und Sonderfällen ist ähnlich umfassend.",
        ],
      ],
      [
        "Kosten und Fazit",
        [
          "Auch LODAS wird über die Kanzlei bereitgestellt und abgerechnet. Preise für Endkunden veröffentlicht DATEV nicht. Wenn Ihre Kanzlei LODAS nutzt, gibt es keinen Grund, daran etwas zu ändern.",
        ],
      ],
    ],
  },

  "lexware-lohn-gehalt": {
    r: [4.2, 4.0, 4.2, 4.0, 4.3],
    verdict:
      "Lexware lohn+gehalt ist die bewährte Lösung für Betriebe, die ihre Lohnabrechnung selbst erledigen wollen. Wer bereits Lexware Office nutzt, sollte zuerst das dort integrierte Lohnmodul prüfen.",
    sections: [
      [
        "Worum es geht",
        [
          "Das Programm aus Freiburg ist seit Jahren eine der meistgenutzten Lohnlösungen für kleine und mittlere Betriebe, die nicht über die Kanzlei abrechnen. Es führt durch die monatliche Abrechnung, übermittelt Beitragsnachweise, DEÜV-Meldungen und Lohnsteueranmeldungen und erstellt die Lohnsteuerbescheinigungen.",
        ],
      ],
      [
        "Stärken",
        [
          "Die Abrechnung ist gut geführt, auch für Anwender ohne Lohnausbildung. Minijobs, Teilzeit, Zuschläge und die gängigen Sonderfälle sind abgedeckt. Für die Kanzlei gibt es einen Export im DATEV-Format, sodass die Buchungen aus der Lohnabrechnung ohne Abtippen in die Finanzbuchhaltung gelangen.",
        ],
      ],
      [
        "Alternative im eigenen Haus",
        [
          "Wer Lexware Office nutzt, kann dort ein Lohnmodul für 12,90 € im Monat hinzubuchen. Für wenige Beschäftigte mit einfachen Verhältnissen ist das oft die bequemere Wahl, weil Lohn und Buchhaltung in einem System bleiben. Bei vielen Sonderfällen spielt das eigenständige lohn+gehalt seine Stärken aus.",
        ],
      ],
      [
        "Kosten",
        [
          "Die Editionen werden im Lexware-Shop als Abonnement angeboten, der Preis hängt von der Edition und der Zahl der Abrechnungen ab. Prüfen Sie dort die aktuelle Staffel, bevor Sie sich festlegen.",
        ],
      ],
    ],
  },

  "sage-hr-payroll": {
    r: [4.3, 4.3, 4.4, 4.2, 4.2],
    verdict:
      "Sage HR & Payroll ist eine der wenigen Cloud-Lösungen, die Personalverwaltung und Lohnabrechnung mit einem klaren Festpreis verbindet. Für kleine und mittlere Betriebe, die HR und Lohn selbst führen wollen, ist der Tarif Essentials für 40 € einer der fairsten Einstiege am Markt.",
    sections: [
      [
        "Das Konzept",
        [
          "Viele Betriebe arbeiten mit zwei Welten: einem HR-Tool für Urlaub, Dokumente und Stammdaten und einem getrennten Lohnprogramm oder der Kanzlei. Sage HR & Payroll führt beides zusammen. Wer einen neuen Mitarbeiter anlegt, legt ihn für HR und Abrechnung gleichzeitig an, Abwesenheiten fließen direkt in die Entgeltabrechnung.",
        ],
      ],
      [
        "Was im Alltag hilft",
        [
          "Beschäftigte pflegen ihre persönlichen Daten selbst im Self-Service, beantragen Urlaub und finden ihre Abrechnungen digital. Für neue Mitarbeitende gibt es ein Onboarding-Portal. Die gesetzlichen Meldungen an Finanzamt und Sozialversicherung erzeugt das System aus der laufenden Abrechnung.",
          "Die Buchungssätze lassen sich an Sage und DATEV exportieren. Damit bleibt die Zusammenarbeit mit einer DATEV-Kanzlei möglich, auch wenn Sie die Abrechnung selbst machen.",
        ],
      ],
      [
        "Preise",
        [
          "Essentials kostet 40 € netto im Monat und enthält fünf Mitarbeitende, jede weitere Person kostet ab 7 €. Standard für 60 € ist für komplexere Abrechnungen gedacht, mit Sonderlöhnen, Mehrmandantenfähigkeit und einem Controlling-Modul, weitere Mitarbeitende kosten ab 9 €. Premium für 80 € deckt umfassende HR-Prozesse ab. Die Tarife sind jederzeit kündbar.",
        ],
      ],
      [
        "Test und Fazit",
        [
          "Essentials lässt sich 30 Tage kostenlos testen, für alle Tarife gibt es eine Webdemo. Für Firmen mit fünf bis fünfzig Beschäftigten ohne exotische Branchenregeln ist das Paket sehr stimmig. Baubetriebe mit Baulohn bleiben besser bei der Kanzlei und DATEV.",
        ],
      ],
    ],
  },

  edlohn: {
    r: [4.1, 3.9, 4.0, 4.1, 4.4],
    verdict:
      "edlohn von eurodata ist eine webbasierte Lohnabrechnung, die sich vor allem an Steuerkanzleien und ihre Mandanten richtet. Für Betriebe mit Filialen und Stundenlöhnen, etwa in Gastronomie und Handel, ist es besonders interessant.",
    sections: [
      [
        "Einordnung",
        [
          "eurodata aus Saarbrücken ist seit Jahrzehnten Rechenzentrumsdienstleister für Kanzleien. edlohn ist die Lohnlösung dieses Ökosystems und läuft vollständig im Browser. Kanzlei und Mandant arbeiten auf denselben Daten, was die Vorerfassung von Stunden und Zuschlägen einfach macht.",
        ],
      ],
      [
        "Stärken",
        [
          "Stark ist edlohn bei Branchen mit vielen Stundenkräften und wechselnden Einsätzen. Die Anbindung an Kassen- und Zeiterfassungssysteme, wie sie in Gastronomie und Handel verbreitet sind, spart manuelle Übertragungen.",
        ],
      ],
      [
        "Kosten und Fazit",
        [
          "Die Abrechnung erfolgt in der Regel über die Kanzlei, öffentliche Endkundenpreise gibt es nicht. Wenn Ihre Kanzlei mit eurodata arbeitet, ist edlohn eine sehr gute Wahl. Sonst lohnt sich ein Gespräch über die Alternativen.",
        ],
      ],
    ],
  },

  "personio-payroll": {
    r: [4.1, 4.3, 3.9, 4.0, 4.0],
    verdict:
      "Personio Payroll ergänzt die HR-Plattform Personio um die Lohnabrechnung. Sinnvoll ist das vor allem für Unternehmen, die Personio ohnehin nutzen und den Datenfluss zur Abrechnung vereinfachen wollen.",
    sections: [
      [
        "Wie es funktioniert",
        [
          "Stammdaten, Abwesenheiten, Zuschläge und Änderungen werden in Personio gepflegt und stehen der Abrechnung direkt zur Verfügung. Das beseitigt die klassische Fehlerquelle, bei der HR und Lohnbüro mit unterschiedlichen Datenständen arbeiten.",
        ],
      ],
      [
        "Kosten",
        [
          "Personio nennt für die Lohnabrechnung einen Einstiegspreis ab 5 € je Mitarbeitendem im Monat, zusätzlich zur HR-Lizenz. Für Organisationen bis 49 Beschäftigte gibt es HR und Payroll gemeinsam ab 14 € je Mitarbeitendem. Eine Testversion zum Selbstanmelden gibt es nicht, dafür eine interaktive Produkttour und eine persönliche Demo.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Personio-Kunden ist Payroll ein logischer Schritt. Wer nur eine Lohnabrechnung sucht, fährt mit einem eigenständigen Programm oder der Kanzlei günstiger.",
        ],
      ],
    ],
  },

  "paychex-deutschland": {
    r: [3.9, 4.0, 3.7, 4.1, 4.0],
    verdict:
      "Paychex übernimmt die Lohnabrechnung vollständig als Dienstleistung. Das entlastet Betriebe ohne eigene Lohnexpertise, macht sie aber auch abhängig vom Dienstleister.",
    sections: [
      [
        "Das Modell",
        [
          "Paychex ist kein Programm, das Sie selbst bedienen, sondern ein Outsourcing-Anbieter. Sie melden Stunden, Eintritte, Austritte und Änderungen, Paychex rechnet ab, übermittelt die Meldungen und stellt die Unterlagen bereit.",
        ],
      ],
      [
        "Für wen es passt",
        [
          "Das Modell eignet sich für Unternehmen ohne Steuerkanzlei, die die Lohnabrechnung übernimmt, und ohne eigene Lohnbuchhaltung. Wer bereits eine Kanzlei hat, bekommt dort meist eine vergleichbare Leistung.",
        ],
      ],
      [
        "Kosten",
        [
          "Preise gibt es auf Anfrage, sie richten sich nach Mitarbeiterzahl und Leistungsumfang. Vergleichen Sie das Angebot mit dem Lohnhonorar Ihrer Kanzlei und mit Selbstabrechnungslösungen wie Sage HR & Payroll.",
        ],
      ],
    ],
  },

  // ───────────── HR ─────────────
  personio: {
    r: [4.5, 4.5, 4.0, 4.3, 4.7],
    verdict:
      "Personio ist die bekannteste HR-Plattform im deutschen Mittelstand und das aus gutem Grund. Die Software ist ausgereift, gut bedienbar und deckt Personalakte, Abwesenheiten, Recruiting und Performance ab, hat aber auch ihren Preis.",
    sections: [
      [
        "Was Personio leistet",
        [
          "Die Münchner Plattform verwaltet Personaldaten, Dokumente, Abwesenheiten und Arbeitszeiten und begleitet den Weg von der Bewerbung über das Onboarding bis zum Austritt. Über Apps lassen sich Recruiting, Performance und Entwicklung ergänzen. Mehr als 16.000 Unternehmen nutzen Personio nach Angaben des Anbieters.",
        ],
      ],
      [
        "Stärken",
        [
          "Die Bedienung ist für Beschäftigte wie für die Personalabteilung verständlich. Genehmigungsprozesse, etwa für Urlaub oder Dokumente, lassen sich flexibel gestalten. Die vorbereitende Lohnabrechnung überträgt alle relevanten Daten an die Kanzlei oder an Personio Payroll.",
        ],
      ],
      [
        "Preise",
        [
          "Für Unternehmen ab 50 Beschäftigten beginnen die HR-Lösungen bei 7,60 € je Mitarbeitendem im Monat. Für Organisationen bis 49 Beschäftigte gibt es HR und Payroll gemeinsam ab 14 €. Die genaue Höhe hängt von Plan und Apps ab, ein Angebot gibt es nach einer Demo. Eine selbst gestartete Testversion bietet Personio nicht an, wohl aber eine interaktive Produkttour.",
        ],
      ],
      [
        "Für wen es passt",
        [
          "Für wachsende Unternehmen zwischen 20 und 2.000 Beschäftigten ist Personio eine sichere Wahl. Sehr kleine Betriebe finden bei Factorial oder Sage HR & Payroll günstigere Einstiege.",
        ],
      ],
    ],
  },

  hrworks: {
    r: [4.3, 4.2, 4.2, 4.4, 4.4],
    verdict:
      "HRworks aus Freiburg ist eine ausgereifte HR-Software mit einer besonders starken Reisekostenabrechnung. Für Mittelständler mit Außendienst ist das oft der entscheidende Vorteil.",
    sections: [
      [
        "Was HRworks auszeichnet",
        [
          "Personalakte, Abwesenheiten, Zeiterfassung und Recruiting gehören zum Standard. Heraus sticht die Reisekostenabrechnung, die nach den aktuellen Pauschalen des Bundesfinanzministeriums rechnet und Belege per App erfasst. Wer viele Dienstreisen abrechnet, spart hier mehr Zeit als bei jedem anderen HR-Modul.",
        ],
      ],
      [
        "Im Alltag",
        [
          "Die Oberfläche ist sachlich und klar, der Support deutschsprachig und gut erreichbar. Daten für die Lohnabrechnung gehen im DATEV-Format an die Kanzlei.",
        ],
      ],
      [
        "Kosten",
        [
          "HRworks rechnet pro Nutzer ab, mindestens 20 Nutzer werden berechnet. In den ersten sechs Monaten gilt die zu Beginn bestellte Lizenzzahl als Untergrenze. Für ein genaues Angebot und eine Demo bietet HRworks eine Beratung an.",
        ],
      ],
    ],
  },

  "sage-hr-suite": {
    r: [4.2, 3.8, 4.1, 4.3, 4.7],
    verdict:
      "Die Sage HR Suite ist eine modulare Personal- und Abrechnungssoftware für den gehobenen Mittelstand. Sie lässt sich lokal oder in der Cloud betreiben und Schritt für Schritt ausbauen.",
    sections: [
      [
        "Einordnung",
        [
          "Während Sage HR & Payroll auf kleinere Betriebe zielt, ist die HR Suite für mittlere und große Unternehmen gebaut. Personalabrechnung, Personalmanagement, Bewerbermanagement, Zeitwirtschaft und Reisekosten sind eigene Module, die sich einzeln lizenzieren lassen.",
        ],
      ],
      [
        "Stärken",
        [
          "Die Personalabrechnung beherrscht Einzel- und Massenabrechnung, Rückrechnungen und umfangreiche Auswertungen. Die Zeitwirtschaft erfasst Arbeitszeiten ortsunabhängig und bewertet sie direkt für die Abrechnung. Wer Wert auf den Betrieb im eigenen Rechenzentrum legt, hat diese Wahl, was bei Cloud-Anbietern selten ist.",
        ],
      ],
      [
        "Preise",
        [
          "Die Personalabrechnung beginnt bei 39 € im Monat, das Zeitmanagement bei 21 € und das Bewerbermanagement bei 19 €. Lizenziert wird in Paketen zu je 25 Mitarbeitenden, bei jährlicher Rechnung und zwölf Monaten Mindestlaufzeit. Sage bietet eine Produkttour und ein Infopaket, ein Angebot gibt es auf Anfrage.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Unternehmen mit mehreren hundert Beschäftigten und dem Wunsch nach einer integrierten Lösung aus Abrechnung und HR ist die Suite eine starke, in Deutschland verwurzelte Option.",
        ],
      ],
    ],
  },

  "rexx-systems": {
    r: [4.1, 3.7, 3.9, 4.1, 4.7],
    verdict:
      "rexx systems ist eine umfassende HR-Suite aus Hamburg mit besonders starkem Recruiting. Die Stärke liegt in der Tiefe, der Preis dafür ist ein höherer Einführungsaufwand.",
    sections: [
      [
        "Was rexx leistet",
        [
          "Von der Stellenausschreibung über das Bewerbermanagement bis zur Personalentwicklung deckt rexx den gesamten Mitarbeiterlebenszyklus ab. Viele Unternehmen setzen die Software vor allem wegen des Bewerbermanagements ein, das auch große Mengen an Bewerbungen strukturiert.",
        ],
      ],
      [
        "Einführung",
        [
          "Die Suite ist sehr konfigurierbar. Das ist für größere Organisationen ein Vorteil, bedeutet aber auch, dass die Einführung als Projekt geplant werden sollte. Für kleine Betriebe ist rexx meist zu umfangreich.",
        ],
      ],
      [
        "Kosten",
        [
          "Preise veröffentlicht rexx nicht, sie richten sich nach Modulen und Mitarbeiterzahl. Eine Demo ist kostenlos.",
        ],
      ],
    ],
  },

  factorial: {
    r: [4.2, 4.5, 4.2, 3.9, 4.1],
    verdict:
      "Factorial ist eine leicht zugängliche HR-Software für kleine und mittlere Unternehmen mit einem günstigen Einstieg ab 8 € je Nutzer. Sie deckt die wichtigsten HR-Prozesse ab, ohne mit Funktionen zu überfordern.",
    sections: [
      [
        "Worum es geht",
        [
          "Die Plattform aus Barcelona verwaltet Personaldaten, Abwesenheiten, Arbeitszeiten, Dokumente und Schichten. Beschäftigte stempeln per App, beantragen Urlaub und finden ihre Unterlagen an einer Stelle.",
        ],
      ],
      [
        "Stärken",
        [
          "Die Einrichtung geht schnell, die Oberfläche ist modern und auch für Mitarbeitende ohne Schulung verständlich. Für Betriebe, die von Excel-Listen und Papieranträgen kommen, ist der Umstieg einfach.",
        ],
      ],
      [
        "Kosten",
        [
          "Factorial nennt einen Einstieg ab 8 € pro Nutzer im Monat und erstellt darüber hinaus individuelle Angebote. Eine kostenlose Testphase und eine Demo werden angeboten.",
        ],
      ],
      [
        "Fazit",
        [
          "Für kleine und mittlere Betriebe ohne komplexe Anforderungen ist Factorial ein guter, bezahlbarer Einstieg. Wer tiefere Mitbestimmungs- oder Reportinganforderungen hat, sollte Personio und HRworks daneben prüfen.",
        ],
      ],
    ],
  },

  kenjo: {
    r: [4.0, 4.3, 3.9, 4.0, 4.1],
    verdict:
      "Kenjo ist auf Unternehmen mit gewerblichen und mobilen Beschäftigten ausgerichtet. Zeiterfassung, Schichtplanung und Abwesenheiten per App stehen im Mittelpunkt.",
    sections: [
      [
        "Die Ausrichtung",
        [
          "Viele HR-Tools sind für Büroangestellte gedacht. Kenjo richtet sich ausdrücklich an Betriebe in Produktion, Logistik, Einzelhandel und Gastronomie, wo Beschäftigte keinen festen Rechner haben und über das Smartphone arbeiten.",
        ],
      ],
      [
        "Funktionen",
        [
          "Stempeln per App oder Terminal, Schichtpläne, Abwesenheiten und Dokumente bilden den Kern. In den größeren Plänen kommen digitale Signaturen, On- und Offboarding, Standortverwaltung und ein Hinweisgebersystem hinzu.",
        ],
      ],
      [
        "Kosten und Test",
        [
          "Der Preis richtet sich nach Plan und Mitarbeiterzahl, bei jährlicher Zahlung gibt es zehn Prozent Rabatt. Eine kostenlose Testphase dauert 14 Tage, für den größten Plan gibt es eine Demo.",
        ],
      ],
    ],
  },

  softgarden: {
    r: [4.2, 4.3, 4.0, 4.2, 4.3],
    verdict:
      "softgarden ist eine spezialisierte Recruiting-Software aus Berlin. Wer viele Stellen besetzt und Bewerbende gut erreichen will, bekommt hier ein sehr durchdachtes Werkzeug.",
    sections: [
      [
        "Worauf softgarden spezialisiert ist",
        [
          "softgarden ist keine vollständige HR-Suite, sondern konzentriert sich auf das Recruiting. Stellen werden mit wenigen Klicks auf Jobbörsen veröffentlicht, Bewerbungen strukturiert gesammelt und im Team bewertet.",
        ],
      ],
      [
        "Stärken",
        [
          "Die Bewerbung selbst ist kurz und mobil möglich, was die Zahl abgebrochener Bewerbungen senkt. Für Personalabteilungen bieten Bewertungsbögen, Vorlagen und Auswertungen einen guten Überblick über den Stand jeder Stelle.",
        ],
      ],
      [
        "Kosten",
        [
          "Preise gibt es auf Anfrage, sie richten sich nach der Zahl der Stellen und Nutzer. Eine Demo ist kostenlos.",
        ],
      ],
    ],
  },
};
