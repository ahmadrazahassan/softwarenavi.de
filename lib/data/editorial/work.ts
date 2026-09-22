import type { EditorialDef } from "./index";

/** Projektmanagement, Zeiterfassung, Dokumentenmanagement. Preise laut pricing-verified.ts, Stand 22.09.2026. */
export const WORK: Record<string, EditorialDef> = {
  // ───────────── Projektmanagement ─────────────
  awork: {
    r: [4.4, 4.6, 4.2, 4.3, 4.3],
    verdict:
      "awork aus Hamburg verbindet Aufgaben, Auslastungsplanung und Zeiterfassung in einer sehr aufgeräumten Oberfläche. Für Agenturen und Dienstleistungsteams ist es eine der besten Lösungen aus Deutschland.",
    sections: [
      [
        "Was awork auszeichnet",
        [
          "Viele Projekttools zeigen, was zu tun ist. awork zeigt zusätzlich, wer dafür Zeit hat. Die Auslastungsplanung macht auf einen Blick sichtbar, wer in der nächsten Woche überbucht ist, und die Zeiterfassung fließt direkt in die Projektauswertung.",
        ],
      ],
      [
        "Preise",
        [
          "Basic kostet 8 €, Standard 16 € und Professional 29 € je Nutzer im Monat. Bei jährlicher Zahlung sinken die Preise auf 5 €, 12 € und 22 €. KI-Funktionen lassen sich als Zusatzpaket buchen. Getestet werden kann ohne Kreditkarte, mit allen Funktionen im Team.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Teams zwischen fünf und zweihundert Personen, die nach Stunden arbeiten oder abrechnen, ist awork eine sehr gute Wahl. Die Daten liegen in Deutschland.",
        ],
      ],
    ],
  },

  factro: {
    r: [4.2, 4.2, 4.3, 4.1, 4.2],
    verdict:
      "factro ist ein Projektmanagement-Tool aus Bochum mit Projektstrukturplan, Gantt und Kanban, gehostet in Deutschland. Die kostenlose Version für drei Nutzer macht den Einstieg leicht.",
    sections: [
      [
        "Worum es geht",
        [
          "factro verbindet klassische und agile Methoden. Projekte werden über einen Projektstrukturplan aufgebaut, im Gantt-Diagramm terminiert und im Kanban-Board abgearbeitet. Das spricht besonders Organisationen an, die mit formalen Projektstrukturen arbeiten.",
        ],
      ],
      [
        "Preise",
        [
          "Basic ist kostenlos für bis zu drei Nutzer. Business kostet 19,99 € und Professional 29,99 € je Nutzer im Monat, jeweils ab drei Nutzern. Für Behörden und Kommunen gibt es einen eigenen Government-Tarif.",
        ],
      ],
      [
        "Fazit",
        [
          "Für mittelständische Unternehmen und öffentliche Einrichtungen, die Wert auf deutsches Hosting und strukturierte Projektplanung legen, ist factro eine überzeugende Lösung.",
        ],
      ],
    ],
  },

  stackfield: {
    r: [4.3, 4.3, 4.1, 4.3, 4.4],
    verdict:
      "Stackfield aus München kombiniert Aufgaben, Chat, Dokumente und Videokonferenzen mit Ende-zu-Ende-Verschlüsselung und Hosting in Deutschland. Für datenschutzsensible Teams ist das ein starkes Paket.",
    sections: [
      [
        "Das Konzept",
        [
          "Stackfield will mehrere Werkzeuge ersetzen: Projektboards, Team-Chat, Dateiablage und Videotelefonie. Inhalte lassen sich Ende-zu-Ende verschlüsseln, was für Kanzleien, Beratungen und den öffentlichen Sektor ein echter Unterschied ist.",
        ],
      ],
      [
        "Preise",
        [
          "Starter kostet 9 € je Nutzer im Monat und ist auf zehn Nutzer begrenzt. Business kostet 14 €, Premium 18 € und Enterprise 28 € je Nutzer, jeweils ohne Nutzerlimit. Ein KI-Paket kostet 3,90 € zusätzlich. Bei jährlicher Zahlung sparen Sie 17 Prozent. Die 14 Tage kostenlose Testphase umfasst alle Premium-Funktionen und endet automatisch.",
        ],
      ],
      [
        "Fazit",
        [
          "Wer Slack, Trello und Dropbox durch eine datenschutzfreundliche deutsche Lösung ersetzen will, sollte Stackfield ausprobieren.",
        ],
      ],
    ],
  },

  openproject: {
    r: [4.2, 3.9, 4.6, 4.0, 4.5],
    verdict:
      "OpenProject ist die führende Open-Source-Lösung für Projektmanagement mit Gantt, agilen Boards und Zeiterfassung. Die kostenlose Community-Edition und faire Cloud-Preise machen es besonders attraktiv.",
    sections: [
      [
        "Was OpenProject bietet",
        [
          "Die Berliner Software deckt klassisches und agiles Projektmanagement ab, von Arbeitspaketen und Meilensteinen über Gantt-Diagramme bis zu Scrum-Boards und Zeiterfassung. Sie kann in der Cloud oder auf eigenen Servern betrieben werden.",
        ],
      ],
      [
        "Preise",
        [
          "Die Community-Edition ist kostenlos und selbst gehostet. Basic kostet 5,95 €, Professional 10,95 € und Premium 15,95 € je Nutzer im Monat, jeweils in der Cloud oder vor Ort. Corporate gibt es auf Anfrage. Alle Editionen lassen sich 14 Tage kostenlos testen.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Organisationen mit hohem Anspruch an Datenhoheit, etwa Behörden, Forschung und Ingenieurbüros, ist OpenProject eine der besten Wahlen.",
        ],
      ],
    ],
  },

  inloox: {
    r: [4.0, 4.0, 3.7, 4.1, 4.3],
    verdict:
      "InLoox ist tief in Microsoft Outlook integriert und damit ideal für Unternehmen, deren Projektarbeit im Postfach stattfindet. Preise gibt es nur auf Anfrage.",
    sections: [
      [
        "Das Besondere",
        [
          "InLoox aus München bringt Projektmanagement direkt in Outlook. Aufgaben, Zeitpläne und Dokumente liegen dort, wo viele Mitarbeitende ohnehin den ganzen Tag arbeiten. Eine Webversion steht zusätzlich zur Verfügung.",
        ],
      ],
      [
        "Editionen und Test",
        [
          "Professional beginnt bei fünf Nutzern, Enterprise und Enterprise Plus bei zehn, die Self-Hosted-Variante bei 20 Nutzern. Alle Editionen lassen sich 14 Tage kostenlos testen. Preise nennt InLoox auf Anfrage.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Microsoft-geprägte Mittelständler mit klassischen Projekten ist InLoox eine naheliegende Wahl.",
        ],
      ],
    ],
  },

  meistertask: {
    r: [4.2, 4.6, 4.3, 3.9, 3.8],
    verdict:
      "MeisterTask ist ein intuitives Kanban-Tool aus München mit einer dauerhaft kostenlosen Version. Für kleine Teams und einfache Projekte ist es eine der angenehmsten Lösungen.",
    sections: [
      [
        "Worum es geht",
        [
          "MeisterTask organisiert Aufgaben auf Boards, mit Automatisierungen für wiederkehrende Abläufe und Integrationen in gängige Werkzeuge. Die Oberfläche ist so einfach, dass Teams ohne Schulung loslegen.",
        ],
      ],
      [
        "Preise",
        [
          "Basic ist dauerhaft kostenlos mit bis zu drei Projekten. Pro kostet 7 € und Business 12,50 € je Nutzer im Monat, Enterprise gibt es auf Anfrage. Bei jährlicher Zahlung sparen Sie bis zu 22 Prozent.",
        ],
      ],
      [
        "Fazit",
        [
          "Für komplexe Projektplanung mit Ressourcen und Budgets ist MeisterTask zu schlank. Für Teams, die ihre Aufgaben übersichtlich halten wollen, ist es ideal.",
        ],
      ],
    ],
  },

  "monday-com": {
    r: [4.3, 4.5, 3.9, 4.0, 4.5],
    verdict:
      "monday.com ist eine sehr flexible Plattform für Arbeitsabläufe aller Art. Die Preise pro Sitzplatz sind fair, die Mindestgrößen und Zusatzkosten sollten Sie aber im Blick behalten.",
    sections: [
      [
        "Das Konzept",
        [
          "monday.com ist weniger ein Projekttool als ein Baukasten für Abläufe. Boards, Automatisierungen und Dashboards lassen sich für Projekte, Vertrieb, Recruiting oder Wartungspläne einsetzen.",
        ],
      ],
      [
        "Preise",
        [
          "Die kostenlose Version erlaubt zwei Nutzer. Basic kostet 9 €, Standard 12 € und Pro 19 € je Nutzer im Monat bei jährlicher Zahlung, zuzüglich Steuern. Die Preisrechnung auf der Anbieterseite geht von Teams mit mehreren Sitzplätzen aus, prüfen Sie deshalb die tatsächliche Staffel für Ihre Teamgröße.",
        ],
      ],
      [
        "Datenschutz",
        [
          "monday.com bietet eine Datenhaltung in der EU an. Richten Sie diese vor dem Start ein und schließen Sie den Auftragsverarbeitungsvertrag ab.",
        ],
      ],
    ],
  },

  asana: {
    r: [4.3, 4.4, 3.9, 4.0, 4.5],
    verdict:
      "Asana ist eines der ausgereiftesten Werkzeuge für Aufgaben und Projekte in wachsenden Teams. Für kleine Teams reicht oft die kostenlose Version, im Advanced-Tarif wird es teuer.",
    sections: [
      [
        "Stärken",
        [
          "Asana verbindet Listen, Boards, Zeitleisten und Kalender mit Zielen und Portfolios. Abhängigkeiten zwischen Aufgaben, Regeln für Automatisierungen und saubere Berichte machen es zu einem starken Werkzeug für Teams mit vielen parallelen Projekten.",
        ],
      ],
      [
        "Preise",
        [
          "Personal ist kostenlos für bis zu zwei Nutzer. Starter kostet 13,49 € je Nutzer im Monat, jährlich 10,99 €. Advanced liegt bei 30,49 €, jährlich 24,99 €. Enterprise gibt es auf Anfrage.",
        ],
      ],
      [
        "Fazit",
        [
          "Asana lohnt sich für Teams ab etwa zehn Personen mit vielen Projekten und Abhängigkeiten. Für einfache Aufgabenlisten genügt MeisterTask.",
        ],
      ],
    ],
  },

  // ───────────── Zeiterfassung ─────────────
  clockodo: {
    r: [4.4, 4.5, 4.4, 4.2, 4.2],
    verdict:
      "clockodo aus Hamburg ist eine unkomplizierte Online-Zeiterfassung für Arbeits- und Projektzeiten, gehostet in Deutschland. Mit Preisen ab 4 € je Nutzer gehört sie zu den fairsten Angeboten.",
    sections: [
      [
        "Was clockodo leistet",
        [
          "clockodo erfasst Arbeitszeiten, Pausen und Projektzeiten per Browser, App oder Terminal und erfüllt damit die Anforderungen an die Arbeitszeiterfassung nach dem Beschluss des Bundesarbeitsgerichts. Projektzeiten lassen sich nach Kunde und Leistung auswerten und für die Abrechnung nutzen.",
        ],
      ],
      [
        "Preise",
        [
          "Für eine einzelne Person ist clockodo kostenlos. Basic kostet 4 €, Pro 10 € und Pro Plus 12 € je Nutzer im Monat, im ersten Jahr gibt es auf Pro und Pro Plus einen Rabatt. Alle Preise sind netto, die Testphase dauert 14 Tage.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Agenturen, Beratungen und Handwerksbetriebe, die Arbeits- und Projektzeiten sauber trennen wollen, ist clockodo eine sehr gute Wahl.",
        ],
      ],
    ],
  },

  papershift: {
    r: [4.1, 4.2, 3.8, 4.1, 4.3],
    verdict:
      "Papershift aus Karlsruhe verbindet Dienstplanung, Zeiterfassung und Urlaubsverwaltung. Für Gastronomie, Handel und Pflege mit wechselnden Schichten ist es eine durchdachte Lösung.",
    sections: [
      [
        "Worauf Papershift spezialisiert ist",
        [
          "Schichtbetriebe haben andere Sorgen als Büroteams. Papershift plant Dienste, berücksichtigt Verfügbarkeiten und Qualifikationen, erfasst die tatsächlich geleisteten Stunden und bereitet sie für die Lohnabrechnung vor.",
        ],
      ],
      [
        "Preise",
        [
          "Die Pakete Core, Premium und Professional werden für eine Gruppe von 16 Mitarbeitenden angeboten und kosten 64 €, 96 € und 144 € im Monat, bei jährlicher Zahlung zehn Prozent weniger. Hinzu kommt eine Grundgebühr von 39 € im Monat. Die Testphase dauert 14 Tage.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Betriebe mit Schichtplanung ist Papershift eine der rundesten Lösungen. Reine Bürobetriebe sind mit clockodo oder Crewmeister günstiger bedient.",
        ],
      ],
    ],
  },

  zep: {
    r: [4.2, 4.0, 4.3, 4.2, 4.4],
    verdict:
      "ZEP ist die Wahl für Beratungen und IT-Dienstleister, die Projektzeiten nicht nur erfassen, sondern auch steuern und abrechnen wollen. Die Tarife reichen von der einfachen Stempeluhr bis zur Professional-Services-Lösung.",
    sections: [
      [
        "Die Tarife",
        [
          "ZEP Clock ist eine digitale Stempeluhr ab 2 € je Nutzer im Monat. ZEP Compact für 7 € ergänzt projekt- und kundenbezogene Zeiten mit Auswertungen. ZEP Professional für 18 € ist eine Lösung für Professional Services mit Controlling und Reisekosten. Alle Tarife lassen sich 14 Tage kostenlos testen.",
        ],
      ],
      [
        "Stärken",
        [
          "Projektbudgets, Stundensätze und Abrechnung sind eng verzahnt. Für Beratungshäuser, die Stunden gegenüber Kunden belegen müssen, ist das der entscheidende Vorteil. Für Non-Profits und Startups gibt es Rabatte, studentische Unternehmensberatungen nutzen ZEP kostenlos.",
        ],
      ],
      [
        "Fazit",
        [
          "Wer Projektzeiten in Umsatz verwandelt, sollte ZEP Compact oder Professional ernsthaft prüfen.",
        ],
      ],
    ],
  },

  timetac: {
    r: [4.1, 4.1, 3.9, 4.2, 4.3],
    verdict:
      "TimeTac ist eine ausgereifte Zeiterfassung mit Projektzeiten, Urlaubsverwaltung und Terminals. Die Testphase von 30 Tagen ist großzügig, Preise gibt es auf der Anbieterseite im Detail.",
    sections: [
      [
        "Funktionen",
        [
          "TimeTac erfasst Arbeitszeiten per App, Browser oder Terminal, verwaltet Abwesenheiten und bietet Projektzeiterfassung. Die Software richtet sich an kleine bis große Unternehmen und bietet Schnittstellen zur Lohnabrechnung.",
        ],
      ],
      [
        "Test und Kosten",
        [
          "Die Testphase dauert 30 Tage und kommt ohne Kreditkarte aus. Die Preise richten sich nach Modulen und Nutzerzahl, eine persönliche Beratung ist kostenlos.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Unternehmen, die mehr als eine einfache Stempeluhr brauchen und mehrere Standorte verwalten, ist TimeTac eine solide Wahl.",
        ],
      ],
    ],
  },

  crewmeister: {
    r: [4.3, 4.6, 4.7, 4.0, 3.9],
    verdict:
      "Crewmeister ist die günstigste ernstzunehmende Zeiterfassung in diesem Vergleich. Ab 1,50 € je Nutzer bekommen kleine Betriebe eine einfache App mit Terminal und Urlaubsplaner.",
    sections: [
      [
        "Tarife",
        [
          "Go kostet 1,50 € je Nutzer im Monat bei jährlicher Zahlung und umfasst Zeiterfassung per App und Terminal, Projektzeiten und GPS. Easy für 2 € ergänzt Urlaubsplaner, Abwesenheiten und Überstundenkonto. Pro für 3 € bringt Zuschläge, erweiterte Projektzeiten und individuelle Berechtigungen. Schichtplaner und DATEV-Anbindung lassen sich hinzubuchen.",
        ],
      ],
      [
        "Test",
        [
          "Die Testphase dauert 14 Tage, verlangt keine Zahlungsdaten und endet automatisch. Bei jährlicher Zahlung ist ein Monat gratis.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Kleinbetriebe, die die Arbeitszeiterfassung schnell und günstig umsetzen wollen, ist Crewmeister kaum zu schlagen. Für komplexe Projektcontrollings ist ZEP die bessere Wahl.",
        ],
      ],
    ],
  },

  clockin: {
    r: [4.3, 4.6, 4.3, 4.2, 4.0],
    verdict:
      "clockin aus Münster ist eine Zeiterfassung für mobile Teams im Handwerk, mit Dokumentation direkt am Auftrag. Die einfache App ist ihr stärkstes Argument.",
    sections: [
      [
        "Für wen clockin gebaut ist",
        [
          "Monteure, Handwerker und Servicetechniker stempeln per App, auf Wunsch mit Baustellen- und Projektbezug. Fotos und Notizen landen direkt am Auftrag, das Büro sieht die Stunden ohne Stundenzettel. clockin ist auch als Erweiterung für Sage Active verfügbar.",
        ],
      ],
      [
        "Preise",
        [
          "Starter kostet 3,99 €, Pro 6,99 € und Expert 9,99 € je Nutzer im Monat. Bei jährlicher Zahlung gibt es fünf Prozent Rabatt, bei zwei Jahren zehn Prozent. Konten mit einem bis vier Nutzern zahlen eine Plattformpauschale von 10 € im Monat. Die Testphase dauert 14 Tage, ohne Zahlungsdaten.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Handwerks- und Servicebetriebe mit Mitarbeitenden draußen ist clockin eine der alltagstauglichsten Lösungen.",
        ],
      ],
    ],
  },

  // ───────────── Dokumentenmanagement ─────────────
  docuware: {
    r: [4.3, 4.0, 3.8, 4.3, 4.7],
    verdict:
      "DocuWare aus Germering bei München ist eines der etabliertesten Dokumentenmanagement-Systeme im deutschen Mittelstand. Stark bei revisionssicherer Archivierung und Workflows wie dem Rechnungseingang.",
    sections: [
      [
        "Was DocuWare leistet",
        [
          "Dokumente werden revisionssicher archiviert, per Texterkennung indexiert und in Workflows weiterverarbeitet, etwa im Rechnungseingang mit Freigabe und Übergabe an die Buchhaltung. Die Lösung gibt es als Cloud und für den Betrieb im eigenen Haus.",
        ],
      ],
      [
        "Kosten",
        [
          "Preise gibt es auf Anfrage über Partner, abhängig von Nutzern, Speicher und Workflows. Eine Demo ist kostenlos.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Mittelständler, die Papierarchive ablösen und Freigabeprozesse digitalisieren wollen, gehört DocuWare auf die Auswahlliste.",
        ],
      ],
    ],
  },

  "d-velop-documents": {
    r: [4.2, 4.0, 3.9, 4.2, 4.6],
    verdict:
      "d.velop documents aus Gescher ist ein Cloud-Dokumentenmanagement mit revisionssicherer Archivierung, Workflows und DATEV-Integration, gehostet in Deutschland.",
    sections: [
      [
        "Einordnung",
        [
          "d.velop gehört zu den großen deutschen DMS-Anbietern. Die Cloud-Lösung verbindet Archiv, Akten und Workflows und bietet eine enge Integration in DATEV und Microsoft 365. Viele Kommunen und Mittelständler arbeiten damit.",
        ],
      ],
      [
        "Kosten",
        [
          "Preise gibt es auf Anfrage, eine Demo ist kostenlos. Ein großes Partnernetz übernimmt die Einführung.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Unternehmen mit DATEV-Kanzlei und Microsoft-Umgebung ist d.velop documents eine starke Wahl.",
        ],
      ],
    ],
  },

  ecodms: {
    r: [4.2, 3.8, 4.8, 3.8, 4.1],
    verdict:
      "ecoDMS ist das günstigste revisionssichere Archiv in diesem Vergleich, mit einer einmaligen Lizenz ab 89 € inklusive Mehrwertsteuer. Ideal für kleine Betriebe, die ihr Papierarchiv selbst digitalisieren wollen.",
    sections: [
      [
        "Das Konzept",
        [
          "ecoDMS archiviert Dokumente revisionssicher, erkennt Texte automatisch und legt sie nach Regeln ab. Die Software läuft im eigenen Netz, etwa auf einem kleinen Server oder NAS.",
        ],
      ],
      [
        "Kosten",
        [
          "Die Lizenz kostet einmalig ab 89 € inklusive Mehrwertsteuer, ein E-Mail-Archiv 69 €. Das Paket ecoDMS ONE mit Support und Wartung für die Vertragslaufzeit beginnt bei 250 € netto. Die Software lässt sich kostenlos testen.",
        ],
      ],
      [
        "Fazit",
        [
          "Für kleine Betriebe mit etwas technischem Verständnis ist ecoDMS eine hervorragende Lösung zum kleinen Preis. Wer Workflows und Cloud braucht, sollte DocuWare oder d.velop prüfen.",
        ],
      ],
    ],
  },

  elo: {
    r: [4.2, 3.8, 3.8, 4.2, 4.8],
    verdict:
      "ELO aus Stuttgart ist eine umfassende ECM-Plattform für Archivierung, Workflows und digitale Akten, vom Mittelstand bis zum Konzern.",
    sections: [
      [
        "Einordnung",
        [
          "ELO deckt weit mehr ab als ein Archiv. Digitale Personal-, Vertrags- und Kundenakten, Rechnungseingang und individuelle Workflows lassen sich abbilden, die Lösung skaliert bis in Konzerngröße.",
        ],
      ],
      [
        "Kosten",
        [
          "Preise gibt es über ELO-Partner auf Anfrage. Eine Demo ist kostenlos.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Unternehmen mit vielen Abteilungen und hohen Anforderungen an Prozesse und Rechte ist ELO eine der stärksten Plattformen aus Deutschland.",
        ],
      ],
    ],
  },
};
