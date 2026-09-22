import type { EditorialDef } from "./index";

/** Buchhaltungssoftware. Preise laut pricing-verified.ts, Stand 22.09.2026. */
export const ACCOUNTING: Record<string, EditorialDef> = {
  "datev-unternehmen-online": {
    r: [4.3, 3.7, 4.0, 4.2, 4.6],
    verdict:
      "Wenn Ihre Steuerkanzlei mit DATEV bucht, führt an Unternehmen online kaum ein Weg vorbei. Die Oberfläche ist nicht die modernste, aber kein anderes Programm bringt Belege, Zahlungsverkehr und Kanzlei so reibungslos zusammen.",
    sections: [
      [
        "Wofür das Programm gedacht ist",
        [
          "DATEV Unternehmen online ist keine Buchhaltungssoftware im klassischen Sinn, sondern die Brücke zwischen Ihrem Betrieb und der Kanzlei. Sie erfassen Belege, bezahlen Rechnungen und sehen Auswertungen. Gebucht wird in der Regel weiterhin in der Kanzlei, nur eben ohne Pendelordner und ohne Nachfragen per E-Mail.",
          "Das ist der entscheidende Unterschied zu Lexware Office oder sevdesk. Dort machen Sie die Buchhaltung selbst und exportieren am Ende. Hier bleibt die Arbeitsteilung mit der Steuerberatung erhalten, nur der Weg der Unterlagen wird digital.",
        ],
      ],
      [
        "Was im Alltag überzeugt",
        [
          "Belege lassen sich per App fotografieren, per Scanner hochladen oder per E-Mail einsenden. Sie landen im DATEV-Rechenzentrum in Nürnberg und sind dort für die Kanzlei sofort sichtbar. Bei Rückfragen muss niemand suchen, weil Beleg, Buchung und Zahlung miteinander verknüpft sind.",
          "Stark ist der Zahlungsverkehr. Eingangsrechnungen werden direkt aus dem Belegbild heraus zur Überweisung vorbereitet, und die Zahlung ist später in der Buchung sichtbar. Die betriebswirtschaftliche Auswertung steht zur Verfügung, sobald die Kanzlei den Monat abgeschlossen hat.",
        ],
      ],
      [
        "Wo es hakt",
        [
          "Die Bedienung wirkt stellenweise wie aus einer anderen Zeit. Menüs sind tief verschachtelt, und wer vorher mit einem modernen Cloud-Tool gearbeitet hat, braucht etwas Geduld. Außerdem können Sie das Programm nicht einfach selbst abonnieren. Die Lizenz wird fast immer über die Kanzlei freigeschaltet und abgerechnet.",
        ],
      ],
      [
        "Kosten und Zielgruppe",
        [
          "DATEV veröffentlicht keine Endkundenpreise, weil die Kanzlei die Lizenz pro Mandant bereitstellt und oft mit dem eigenen Honorar bündelt. Fragen Sie deshalb direkt bei Ihrer Steuerberatung nach. Das Programm lohnt sich für jedes Unternehmen, dessen Kanzlei mit DATEV arbeitet, und das sind in Deutschland die allermeisten.",
        ],
      ],
    ],
  },

  "lexware-office": {
    r: [4.5, 4.7, 4.4, 4.2, 4.3],
    verdict:
      "Lexware Office ist das zugänglichste Buchhaltungsprogramm für Selbstständige und kleine Firmen. Wer die Umsatzsteuer selbst meldet und eine EÜR macht, ist mit dem Tarif L für 21,90 € gut versorgt.",
    sections: [
      [
        "Der erste Eindruck",
        [
          "Das frühere lexoffice aus Freiburg hat sich seinen Ruf mit einer Oberfläche erarbeitet, die Buchhaltung weniger nach Buchhaltung aussehen lässt. Rechnungen schreiben, Belege fotografieren, Bankumsätze zuordnen: Die Wege sind kurz, und Fachbegriffe tauchen erst auf, wenn sie wirklich gebraucht werden.",
        ],
      ],
      [
        "Die Tarife genau gelesen",
        [
          "Hier sollten Sie aufpassen, denn die Namen verraten wenig. Der Tarif S für 7,90 € deckt nur die Belegerfassung mit Archiv ab. Rechnungen und Mahnungen kommen erst mit M für 12,90 €. Die eigentliche Buchhaltung mit EÜR, Umsatzsteuer-Voranmeldung, BWA und Kassenbuch gibt es ab L für 21,90 €. XL für 32,90 € ergänzt Abschlags- und EU-Rechnungen sowie eine API.",
          "Für die meisten Selbstständigen ist also L der richtige Tarif. Die Preise sind netto und monatlich kündbar, zum Start gibt es regelmäßig Rabatte für die ersten Monate.",
        ],
      ],
      [
        "Stärken im Alltag",
        [
          "Der Bankabgleich schlägt passende Belege zuverlässig vor, und die Umsatzsteuer-Voranmeldung geht direkt aus dem Programm an ELSTER. Die Steuerkanzlei erhält einen eigenen Zugang oder einen Export im DATEV-Format. E-Rechnungen im XRechnung- und ZUGFeRD-Format können Sie empfangen und erstellen, womit die Pflicht seit 2025 abgedeckt ist.",
        ],
      ],
      [
        "Grenzen",
        [
          "Für bilanzierende GmbHs mit komplexeren Abschlüssen stößt Lexware Office an Grenzen, auch wenn XL mehr kann als früher. Wer eine Lagerverwaltung braucht, muss zu einem anderen Produkt greifen. Die 30 Tage kostenlose Testphase umfasst alle Funktionen und reicht, um einen vollen Monat abzuschließen.",
        ],
      ],
    ],
  },

  sevdesk: {
    r: [4.4, 4.5, 4.3, 4.1, 4.4],
    verdict:
      "sevdesk ist die stärkste Alternative zu Lexware Office, mit besserer Belegerkennung und einem kostenlosen Einstieg. Für die eigentliche Buchhaltung brauchen Sie den Tarif Buchhaltung ab 22,90 € bei jährlicher Zahlung.",
    sections: [
      [
        "Worum es geht",
        [
          "Die Software aus Offenburg richtet sich an Selbstständige, Freiberufler und kleine Firmen, die Rechnungen schreiben und ihre Buchhaltung selbst vorbereiten. Das Programm ist vollständig in der Cloud, eine App für Belege gehört dazu.",
        ],
      ],
      [
        "Was sevdesk besonders gut kann",
        [
          "Die KI-gestützte Belegerfassung liest Betrag, Datum, Lieferant und Steuersatz meist korrekt aus und schlägt eine passende Buchung vor. Wer viele kleine Belege hat, etwa Tankquittungen oder Onlinekäufe, spart hier spürbar Zeit. Die Umsatzsteuer-Voranmeldung wird direkt übermittelt, Einnahmenüberschussrechnung und GuV entstehen laufend.",
          "Für die Zusammenarbeit mit der Kanzlei gibt es einen Steuerberater-Zugang und den DATEV-Export. Im Tarif Buchhaltung Pro kommen Kostenstellen, eine REST-API und die BWA in Echtzeit dazu.",
        ],
      ],
      [
        "Preise",
        [
          "sevdesk hat inzwischen einen dauerhaft kostenlosen Tarif mit drei Rechnungen im Monat. Das reicht zum Ausprobieren, nicht für den Betrieb. Der Tarif Rechnung kostet 11,90 € monatlich, Buchhaltung 25,90 € und Buchhaltung Pro 34,90 €. Bei jährlicher oder zweijähriger Zahlung sinken die Preise deutlich, bei Buchhaltung auf 22,90 € beziehungsweise 19,90 €.",
        ],
      ],
      [
        "Für wen es passt",
        [
          "sevdesk lohnt sich für alle, die ihre Buchhaltung selbst im Griff haben wollen und viele Belege verarbeiten. Wer vor allem Wert auf eine möglichst einfache Oberfläche legt, sollte Lexware Office daneben testen. Beide Programme lassen sich kostenlos ausprobieren.",
        ],
      ],
    ],
  },

  "sage-active": {
    r: [4.3, 4.4, 4.3, 4.3, 4.3],
    verdict:
      "Sage Active ist die modernste Buchhaltung im Sage-Programm und eine der wenigen Cloud-Lösungen dieser Preisklasse, in der die Lohnabrechnung schon im Paket steckt. Mit 49 € für Essentials ist sie für kleine Firmen mit ein oder zwei Angestellten ein ernsthafter Kandidat.",
    sections: [
      [
        "Was Sage Active von anderen unterscheidet",
        [
          "Die meisten Cloud-Buchhaltungen hören beim Lohn auf. Sage Active nicht: Im Tarif Essentials sind doppelte Buchführung nach SKR03 oder SKR04, Anlagenbuchhaltung, EÜR, Bilanz, Umsatzsteuer-Voranmeldung und die Lohnabrechnung für zwei Mitarbeitende enthalten. Dazu kommen zehn Nutzer. Für einen kleinen Betrieb mit einer Bürokraft und einem Gesellen ist das eine runde Sache.",
          "Der Einstieg Starter für 25 € richtet sich an alle, die zunächst nur Angebote und Rechnungen schreiben wollen, mit fünf Nutzern und einem Überblick über offene Posten.",
        ],
      ],
      [
        "Im Alltag",
        [
          "Eingangsrechnungen und Belege lassen sich als Bild, PDF oder E-Rechnung hochladen, die KI liest sie aus und ordnet sie zu. Aus Ausgangsrechnungen und Bankumsätzen entstehen Buchungen automatisch. Der Wechsel von Ist- auf Sollversteuerung ist ohne Umwege möglich, was bei wachsenden Firmen gelegentlich nötig wird.",
          "Der neue Sage Copilot fasst überfällige Rechnungen zusammen und formuliert Zahlungserinnerungen. Das ist kein Muss, aber eine angenehme Hilfe bei der wöchentlichen Kontrolle. Für die Kanzlei gibt es den Export im DATEV-Format.",
        ],
      ],
      [
        "Wo Sage Active noch aufholt",
        [
          "Das Ökosystem an Erweiterungen ist kleiner als bei Lexware oder sevdesk, auch wenn es mit clockin, Shopware und Forderungsmanagement bereits sinnvolle Partner gibt. Wer sehr viele Mitarbeitende abrechnet, stößt irgendwann an die Grenzen des Pakets und sollte sich Sage HR & Payroll ansehen.",
        ],
      ],
      [
        "Kosten und Test",
        [
          "Starter kostet 25 €, Essentials 49 € im Monat netto. Beide Tarife lassen sich 30 Tage kostenlos testen. Sage bietet für Neukunden zeitweise Rabatte auf die ersten Monate an, danach gilt der Listenpreis. Wer eine persönliche Einschätzung möchte, kann einen kostenlosen Beratungstermin buchen.",
        ],
      ],
    ],
  },

  "sage-50-connected": {
    r: [4.2, 3.9, 4.1, 4.2, 4.6],
    verdict:
      "Sage 50 ist die richtige Wahl für kleine Unternehmen, die Buchhaltung, Auftragsbearbeitung und Warenwirtschaft in einem Programm wollen und lieber mit einer installierten Software arbeiten. Kaum ein Cloud-Tool dieser Preisklasse bietet so viel Tiefe.",
    sections: [
      [
        "Das Konzept",
        [
          "Sage 50 ist der Klassiker im Sage-Sortiment und wird auf dem eigenen Rechner oder Server installiert. Über Microsoft 365 und Cloud-Dienste ist das Programm aber an die Außenwelt angebunden, daher der Namenszusatz Connected. Buchhaltung, Auftragsbearbeitung, Warenwirtschaft und Onlinebanking greifen ineinander, ohne dass Daten zwischen Programmen hin und her geschoben werden.",
        ],
      ],
      [
        "Stärken",
        [
          "Wer Waren einkauft, lagert und verkauft, bekommt hier eine echte Warenwirtschaft mit Beständen, Bestellwesen ab Comfort und Belegarchiv. Die Buchhaltung beherrscht EÜR und Bilanz, die DATEV-Schnittstelle und die E-Rechnung sind in allen Tarifen enthalten.",
          "Ein Pluspunkt ist die Erweiterbarkeit. Onlineshop, Lohnabrechnung, Kasse oder Versand lassen sich zubuchen, wenn der Betrieb wächst. So muss nicht nach zwei Jahren das ganze System gewechselt werden.",
        ],
      ],
      [
        "Schwächen",
        [
          "Die Oberfläche ist funktional, aber weniger elegant als bei reinen Cloud-Programmen. Neue Anwender brauchen ein paar Tage Einarbeitung, dafür findet man später auch Funktionen, die anderswo fehlen. Wer ausschließlich im Browser arbeiten möchte, ist mit Sage Active besser bedient.",
        ],
      ],
      [
        "Preise",
        [
          "Standard kostet 30 € je Arbeitsplatz im Monat, Comfort 35 € ab zwei Arbeitsplätzen und Professional 40 € ab drei Arbeitsplätzen, jeweils netto. Alle Varianten lassen sich 30 Tage kostenlos testen, ohne dass Zahlungsdaten nötig sind. Für Handwerksbetriebe gibt es mit Sage 50 Handwerk eine eigene Branchenversion.",
        ],
      ],
    ],
  },

  buchhaltungsbutler: {
    r: [4.3, 4.1, 3.9, 4.3, 4.5],
    verdict:
      "BuchhaltungsButler automatisiert die Belegzuordnung so konsequent wie kaum ein anderes Programm. Das hat seinen Preis: Mit 34,90 € im Monat für den Tarif Smart liegt es klar über Lexware Office und sevdesk.",
    sections: [
      [
        "Was das Programm ausmacht",
        [
          "Die Berliner Software setzt auf Automatisierung. Belege werden ausgelesen, mit den Kontobewegungen abgeglichen und mit einem Buchungsvorschlag versehen, der mit der Zeit immer besser wird. Wer viele wiederkehrende Buchungen hat, etwa im Onlinehandel, merkt das nach wenigen Wochen.",
        ],
      ],
      [
        "Für E-Commerce besonders stark",
        [
          "Anbindungen an Zahlungsdienste und Shopsysteme wie PayPal, Stripe und Shopify sind ein Schwerpunkt. Transaktionen werden automatisch zu Belegen und Buchungen, was bei hunderten kleinen Zahlungen im Monat viel Handarbeit erspart. Für Kanzleien gibt es eigene Tarife.",
        ],
      ],
      [
        "Tarife und Kosten",
        [
          "Light kostet 29,90 € im Monat und ist gedacht für die Arbeitsteilung, bei der Sie vorbuchen und die Kanzlei abschließt. Smart für 34,90 € bietet den vollen Funktionsumfang für EÜR und Bilanz, Premium für 59,90 € richtet sich an bilanzierende Unternehmen mit hohem Belegvolumen. Die Preise gelten bei monatlicher Zahlung, eine Testphase von 14 Tagen ist kostenlos.",
          "Zusätzlich lassen sich Leistungen wie eine assistierte Buchhaltung oder ein manueller Belegreview hinzubuchen. Das ist praktisch, treibt die Kosten aber schnell nach oben.",
        ],
      ],
      [
        "Unser Fazit",
        [
          "BuchhaltungsButler ist keine Software für den Einzelunternehmer mit zehn Rechnungen im Monat. Für Betriebe mit vielen Transaktionen, besonders im Handel, rechnet sich der höhere Preis durch die eingesparte Zeit.",
        ],
      ],
    ],
  },

  fastbill: {
    r: [4.0, 4.2, 4.0, 3.9, 3.8],
    verdict:
      "FastBill ist ein solides Rechnungsprogramm mit Belegerfassung, das vor allem Selbstständigen mit überschaubarem Belegaufkommen hilft. Die eigentliche Buchhaltung übernimmt in diesem Modell die Kanzlei.",
    sections: [
      [
        "Das Konzept",
        [
          "FastBill versteht sich als Vorbereitung für die Steuerkanzlei. Sie schreiben Rechnungen, verbinden das Bankkonto und sammeln Belege. Am Monatsende gehen die Daten per DATEV-Export an die Steuerberatung, die dort bucht und die Umsatzsteuer meldet.",
        ],
      ],
      [
        "Tarife im Detail",
        [
          "Solo kostet 10 € im Monat mit einem Nutzer und einem Bankkonto. Plus für 15 € erlaubt fünf Bankkonten und unbegrenzt eigene Vorlagen. Pro für 30 € bringt drei Nutzer und unbegrenzte Bankkonten, Premium für 59 € fünf Nutzer, automatische Belegerfassung und ein automatisches Mahnwesen. Bei jährlicher Zahlung sind alle Tarife etwas günstiger.",
          "Auffällig ist, dass die automatische Belegerkennung erst im teuersten Tarif enthalten ist. Wer viele Belege hat, sollte das in die Rechnung einbeziehen.",
        ],
      ],
      [
        "Stärken und Schwächen",
        [
          "Der Rechnungsprozess ist übersichtlich, und die Zusammenarbeit mit der Kanzlei funktioniert reibungslos. Wer die Umsatzsteuer selbst melden möchte, ist bei Lexware Office oder sevdesk besser aufgehoben. Die 14 Tage kostenlose Testphase kommt ohne Abo und ohne Verpflichtung aus.",
        ],
      ],
    ],
  },

  papierkram: {
    r: [4.3, 4.4, 4.5, 4.2, 4.0],
    verdict:
      "Papierkram verbindet Buchhaltung, Rechnungen, Projekte und Zeiterfassung zu einem fairen Preis. Für Freiberufler und kleine Agenturen, die nach Stunden abrechnen, ist das eine der stimmigsten Lösungen am Markt.",
    sections: [
      [
        "Das Besondere",
        [
          "Papierkram kombiniert zwei Welten, die sonst getrennt sind: Buchhaltung und Projektarbeit. Sie erfassen Zeiten auf Projekte, rechnen sie ab und sehen im selben Programm, wie sich das auf Umsatz und Steuer auswirkt. Für Grafikbüros, Beratungen und Entwickler ist das sehr praktisch.",
        ],
      ],
      [
        "Tarife",
        [
          "Die kostenlose Version eignet sich für den Einstieg mit einem Nutzer, bietet aber weder Bankanbindung noch Steuerberichte. S für 12,90 € im Monat bringt die Bankanbindung für zwei Konten und die Zeiterfassung. M für 24,90 € ist der eigentliche Standard: unbegrenzte Nutzer, EÜR, Umsatzsteuer-Voranmeldung, BWA, Team-Zeiterfassung und ein Kundenportal. L für 49,90 € ergänzt eine REST-API und unbegrenzt viele Bankkonten.",
          "Bei jährlicher Zahlung sinken die Preise auf 9,90 €, 19,90 € und 39,90 €. Alle Preise sind netto.",
        ],
      ],
      [
        "Im Alltag",
        [
          "Die Oberfläche ist aufgeräumt und schnell. Der Wechsel zwischen Zeiterfassung, Rechnung und Buchhaltung gelingt ohne Umwege. Eine klassische Testphase gibt es nicht, die kostenlose Version übernimmt diese Rolle.",
        ],
      ],
      [
        "Für wen es passt",
        [
          "Papierkram lohnt sich für alle, die projektbasiert arbeiten und ihre Buchhaltung selbst führen. Für Onlinehändler mit hohem Transaktionsvolumen ist BuchhaltungsButler die bessere Wahl.",
        ],
      ],
    ],
  },

  easybill: {
    r: [4.2, 4.3, 4.1, 4.1, 4.2],
    verdict:
      "easybill ist ein spezialisiertes Rechnungsprogramm, das besonders im Onlinehandel glänzt. Marktplatzanbindung, Versand und wiederkehrende Rechnungen machen es zur ersten Wahl für Händler, die ihre Buchhaltung der Kanzlei überlassen.",
    sections: [
      [
        "Worauf easybill spezialisiert ist",
        [
          "easybill schreibt Rechnungen, und zwar sehr viele davon. Die Software verbindet sich mit Marktplätzen und Shops, erzeugt aus Bestellungen automatisch Rechnungen und Lieferscheine und kann Versandlabels für DHL, DPD, Hermes und GLS drucken. Die Daten gehen im DATEV-Format an die Kanzlei.",
        ],
      ],
      [
        "Tarife",
        [
          "Die kostenlose Version erlaubt 50 Dokumente im Monat inklusive E-Rechnung. Starter für 12 € bringt 250 Dokumente, eine KI-Belegerfassung und eigenes Briefpapier. Professional für 39 € ist der Tarif für Händler: unbegrenzte Kunden, wiederkehrende Rechnungen, Versandabwicklung und Marktplatz-Anbindungen. Premium für 45 € ergänzt automatisches Mahnwesen, Projekte und Zeiterfassung.",
          "Bei jährlicher Zahlung kosten die Tarife 9 €, 25 € und 37 €. Die Server stehen in Deutschland, und die Einrichtung übernimmt easybill kostenlos.",
        ],
      ],
      [
        "Einschränkungen",
        [
          "easybill ersetzt keine Buchhaltung. Wer EÜR und Umsatzsteuer selbst erledigen möchte, braucht ein zweites Programm oder die Kanzlei. Die Testphase ist mit sieben Tagen recht kurz, gilt aber für alle Funktionen und ohne Kreditkarte.",
        ],
      ],
    ],
  },

  scopevisio: {
    r: [4.1, 3.8, 3.9, 4.2, 4.6],
    verdict:
      "Scopevisio ist eine Cloud-Unternehmenssoftware aus Bonn, die weit über die Buchhaltung hinausgeht. Für wachsende Mittelständler mit mehreren Gesellschaften ist sie eine ernsthafte Alternative zu klassischen ERP-Systemen.",
    sections: [
      [
        "Einordnung",
        [
          "Wer Scopevisio in einer Reihe mit Lexware Office oder sevdesk sieht, unterschätzt das Programm. Finanzbuchhaltung, Kostenrechnung, Vertrieb, Einkauf, Dokumentenmanagement und Personal lassen sich modular kombinieren. Das Ergebnis ist eher ein Cloud-ERP mit sehr starker Finanzbuchhaltung.",
        ],
      ],
      [
        "Stärken",
        [
          "Mandantenfähigkeit und Konsolidierung sind ausgereift, ebenso die Zusammenarbeit mit Steuerberatung und Wirtschaftsprüfung. Die Daten liegen in deutschen Rechenzentren, was für viele Mittelständler ein wichtiges Argument ist.",
        ],
      ],
      [
        "Preismodell",
        [
          "Feste Tarife gibt es nicht. Der Preis setzt sich aus Plattform, gebuchten Modulen und benannten Nutzern zusammen. Die Beispielrechnungen des Anbieters liegen bei etwa 1,70 € bis 2,40 € pro Nutzer und Tag. Für ein konkretes Angebot führt kein Weg an einem Gespräch vorbei. Eine Testphase von 30 Tagen endet automatisch.",
        ],
      ],
      [
        "Für wen es passt",
        [
          "Für Kleinstbetriebe ist Scopevisio überdimensioniert. Ab etwa 20 Mitarbeitenden, mehreren Gesellschaften oder dem Wunsch nach einer durchgängigen Cloud-Lösung lohnt der Blick.",
        ],
      ],
    ],
  },

  pennylane: {
    r: [4.0, 4.3, 3.9, 3.9, 4.0],
    verdict:
      "Pennylane ist eine moderne Finanzplattform aus Frankreich, die Unternehmen und Kanzleien auf einer gemeinsamen Oberfläche zusammenbringt. In Deutschland ist sie noch jung, die Grundidee aber überzeugt.",
    sections: [
      [
        "Die Idee",
        [
          "Pennylane will die Trennung zwischen Unternehmenssoftware und Kanzleisoftware aufheben. Beide Seiten arbeiten im selben System: Das Unternehmen erfasst Belege, bezahlt Rechnungen und sieht seine Zahlen in Echtzeit, die Kanzlei bucht und schließt ab, ohne dass Daten exportiert werden.",
        ],
      ],
      [
        "Stärken",
        [
          "Die Oberfläche ist schnell und klar, die Auswertungen für Liquidität und Kosten sind ein echter Mehrwert für Geschäftsführungen. In Frankreich nutzen viele Kanzleien die Plattform bereits als Standard.",
        ],
      ],
      [
        "Was Sie bedenken sollten",
        [
          "Der deutsche Markt wird noch aufgebaut. Fragen Sie vor der Entscheidung, ob Ihre Kanzlei mit Pennylane arbeitet oder zumindest einen reibungslosen Export ins eigene System erhält. Preise veröffentlicht Pennylane für Deutschland derzeit nicht, eine Demo ist kostenlos.",
        ],
      ],
    ],
  },

  candis: {
    r: [4.3, 4.3, 3.8, 4.4, 4.4],
    verdict:
      "Candis digitalisiert die Eingangsrechnungen mittelständischer Unternehmen von der Erfassung bis zur Zahlung. Mit einem Einstieg ab 389 € im Monat richtet es sich klar an Firmen, bei denen dieser Prozess heute viele Stunden kostet.",
    sections: [
      [
        "Wofür Candis gebaut ist",
        [
          "Candis ist keine Buchhaltung, sondern ein Werkzeug für den Kreditorenprozess. Rechnungen kommen per E-Mail oder Upload an, werden ausgelesen, von den zuständigen Personen freigegeben, kontiert und zur Zahlung vorbereitet. Am Ende gehen die Buchungen mit Beleg an DATEV.",
        ],
      ],
      [
        "Stärken",
        [
          "Die Freigabe-Workflows sind flexibel und bilden auch mehrstufige Genehmigungen ab. Kostenstellen, Projekte und Budgets lassen sich direkt bei der Freigabe zuordnen. Die Anbindung an DATEV ist eng, was die Kanzlei spürbar entlastet.",
        ],
      ],
      [
        "Kosten",
        [
          "Basis beginnt bei 389 € im Monat, Plus bei 599 € und Max bei 789 €. Der genaue Preis richtet sich nach dem Belegvolumen. Enthalten sind unbegrenzt viele Nutzer und Gesellschaften sowie Implementierung, Onboarding und Support. Eine 30-tägige Testphase ist kostenlos.",
        ],
      ],
      [
        "Unser Fazit",
        [
          "Für Unternehmen mit mehreren hundert Eingangsrechnungen im Monat und verteilten Freigaben ist Candis eine der besten Lösungen am Markt. Für kleinere Betriebe übersteigen die Kosten den Nutzen.",
        ],
      ],
    ],
  },

  "wiso-meinbuero": {
    r: [4.1, 4.2, 4.2, 4.0, 4.0],
    verdict:
      "WISO MeinBüro ist eine bodenständige Bürosoftware mit besonders guten Umsatzsteuer-Funktionen. Die Umsatzgrenzen in den kleinen Tarifen sollten Sie vor dem Kauf genau prüfen.",
    sections: [
      [
        "Herkunft und Anspruch",
        [
          "Buhl Data aus dem Siegerland kennt die meisten als Hersteller von WISO Steuer. MeinBüro überträgt dieses Steuerwissen auf den Alltag kleiner Betriebe: Rechnungen schreiben, Belege erfassen, Umsatzsteuer melden, EÜR erstellen.",
        ],
      ],
      [
        "Tarife und Umsatzgrenzen",
        [
          "Rechnungen und Angebote kostet 10,90 € im Monat und gilt bis 25.000 € Jahresumsatz. Buchhaltung für 19,90 € deckt bis 120.000 € ab. Darüber liegen Auftragswesen für 39,90 € mit zwei Nutzern und Warenwirtschaft für 69,90 € mit fünf Nutzern, beide ohne Umsatzgrenze. Neukunden erhalten zeitweise hohe Rabatte auf die ersten Monate.",
          "Wer knapp unter einer Grenze liegt und wächst, sollte gleich eine Stufe höher einsteigen, um einen Wechsel mitten im Jahr zu vermeiden.",
        ],
      ],
      [
        "Im Alltag",
        [
          "Die Umsatzsteuer-Voranmeldung entsteht direkt aus den Buchungen und wird elektronisch übermittelt. Für die Kanzlei gibt es den DATEV-Export. Die Oberfläche ist sachlich und gut strukturiert, wenn auch weniger verspielt als bei Lexware Office.",
        ],
      ],
      [
        "Test",
        [
          "Alle Tarife lassen sich 14 Tage kostenlos und ohne Angabe von Zahlungsdaten testen. Das reicht, um eine Voranmeldung probeweise vorzubereiten und zu sehen, ob die Arbeitsweise passt.",
        ],
      ],
    ],
  },

  orgamax: {
    r: [4.0, 3.8, 3.9, 4.1, 4.3],
    verdict:
      "orgaMAX deckt den gesamten Weg vom Angebot bis zur Buchung ab und bietet Branchenpakete für Dienstleister, Handel und Produktion. Wer vor allem Rechnungen schreibt, zahlt hier mehr als nötig.",
    sections: [
      [
        "Einordnung",
        [
          "orgaMAX aus Detmold ist ein kleines ERP-System für Betriebe, die mehr brauchen als ein Rechnungsprogramm. Angebote werden zu Aufträgen, Lieferscheinen und Rechnungen, Zahlungen laufen in die Buchhaltung. Die Software gibt es als Cloud und als Desktopversion.",
        ],
      ],
      [
        "Branchenpakete",
        [
          "Das Paket Dienstleister bringt Projektmanagement, Projektzeiterfassung, ein kleines CRM und Abschlags- sowie Schlussrechnungen. Handel ergänzt Lagerverwaltung und automatische Bestellvorschläge. Produktion kommt mit mehrstufigen Stücklisten und einer Kalkulation aus den Herstellkosten.",
        ],
      ],
      [
        "Preise",
        [
          "In der Cloud kostet Start 49 € im Monat, Dienstleister 69 €, Handel 99 € und Produktion 119 €, jeweils bei jährlicher Zahlung. Die Desktopversionen liegen etwas darüber. Eine kostenlose Testphase wird angeboten.",
        ],
      ],
      [
        "Unser Fazit",
        [
          "Für Handwerks- und Handelsbetriebe mit echter Auftragsabwicklung ist orgaMAX eine gute, bodenständige Wahl. Wer nur Rechnungen schreibt, findet bei Lexware Office oder sevdesk günstigere Lösungen.",
        ],
      ],
    ],
  },

  billomat: {
    r: [3.9, 4.1, 3.7, 3.8, 3.9],
    verdict:
      "Billomat ist ein solides Rechnungsprogramm mit direkter DATEV-Verbindung. Der kleinste Tarif ist allerdings so stark eingeschränkt, dass Business für die meisten Betriebe der eigentliche Einstieg ist.",
    sections: [
      [
        "Worum es geht",
        [
          "Billomat gehört zur Berliner aifinyo AG und konzentriert sich auf den Ausgangsprozess: Angebot, Rechnung, Zahlungseingang und Mahnung. Buchhaltungsfunktionen sind vorhanden, stehen aber nicht im Mittelpunkt.",
        ],
      ],
      [
        "Tarife genau betrachtet",
        [
          "Professional kostet 19 € bei jährlicher Zahlung, erlaubt aber nur 30 Dokumente im Monat, einen Nutzer und weder Bankanbindung noch DATEVconnect. Business für 29 € jährlich bringt unbegrenzte Dokumente, die Bankanbindung, DATEVconnect und den Zugang für die Steuerberatung. Enterprise für 99 € enthält fünf Nutzer und einen persönlichen Ansprechpartner.",
          "Bei monatlicher Zahlung kosten die Tarife 29 €, 39 € und 119 €. Jeder weitere Nutzer schlägt mit 10 € im Monat zu Buche.",
        ],
      ],
      [
        "Fazit",
        [
          "Billomat lohnt sich für Betriebe, deren Kanzlei mit DATEV arbeitet und die vor allem einen sauberen Rechnungsprozess brauchen. Die 14 Tage kostenlose Testphase gilt für alle Tarife.",
        ],
      ],
    ],
  },

  collmex: {
    r: [3.9, 3.4, 4.7, 3.7, 4.0],
    verdict:
      "Collmex ist die günstigste ernstzunehmende Buchhaltung für Anwender, die doppelte Buchführung beherrschen. Wer eine geführte, moderne Oberfläche erwartet, wird enttäuscht.",
    sections: [
      [
        "Für wen Collmex gedacht ist",
        [
          "Collmex aus Saarbrücken ist seit vielen Jahren am Markt und richtet sich an Menschen, die Buchungssätze, Konten und Umsatzsteuer verstehen. Die Software nimmt einem wenig ab, lässt einen dafür aber auch zügig arbeiten.",
        ],
      ],
      [
        "Preise",
        [
          "Buchhaltung und Rechnung gibt es jeweils in einer kostenlosen Version. Buchhaltung light kostet 8,95 €, Buchhaltung basic 11,95 €. Die Komplettpakete aus Buchhaltung und Rechnung kosten 16,95 €, 24,95 € oder 46,95 € im Monat. Für Vereine gibt es ein eigenes Paket für 13,95 €. Die ersten 30 Tage sind eine kostenlose Testphase.",
        ],
      ],
      [
        "Stärken und Schwächen",
        [
          "Das Preis-Leistungs-Verhältnis ist hervorragend, die Buchhaltung selbst solide mit Umsatzsteuer-Voranmeldung und DATEV-Export. Bei Belegerkennung, Bankabgleich und Bedienkomfort liegen jüngere Anbieter aber deutlich vorn.",
        ],
      ],
    ],
  },
};
