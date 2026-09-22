import type { EditorialDef } from "./index";

/** CRM und ERP. Preise laut pricing-verified.ts, Stand 22.09.2026. */
export const CRM_ERP: Record<string, EditorialDef> = {
  // ───────────── CRM ─────────────
  hubspot: {
    r: [4.4, 4.5, 4.0, 4.1, 4.7],
    verdict:
      "HubSpot bietet den großzügigsten kostenlosen Einstieg aller CRM-Systeme und wächst bis in die Enterprise-Liga mit. Ab dem Tarif Professional werden die Kosten allerdings schnell erheblich.",
    sections: [
      [
        "Der Einstieg",
        [
          "Das kostenlose CRM erlaubt bis zu zwei Nutzer und enthält Kontakte, Unternehmen, Deals und eine Pipeline. Für Gründer und kleine Teams ist das ein echter Mehrwert, und viele bleiben lange in dieser Stufe.",
        ],
      ],
      [
        "Stärken",
        [
          "HubSpot verbindet Vertrieb, Marketing und Service auf einer Datenbasis. E-Mails, Anrufe und Meetings landen automatisch am Kontakt, und die Oberfläche ist so aufgeräumt, dass auch vertriebsferne Kolleginnen sie nutzen. Der Marktplatz bietet Anbindungen an nahezu jedes gängige Werkzeug.",
        ],
      ],
      [
        "Die Kostenfrage",
        [
          "Der Sales Hub Starter kostet 20 € je Lizenz im Monat, bei jährlicher Zahlung ab 7 €. Professional liegt bei 100 € je Lizenz und verlangt eine einmalige Onboarding-Gebühr von 1.470 €. Enterprise kostet 150 € je Lizenz plus 3.420 € Onboarding. Für ein Team von zehn Personen im Professional-Tarif kommen so schnell über 13.000 € im ersten Jahr zusammen.",
        ],
      ],
      [
        "Datenschutz",
        [
          "HubSpot ist ein US-Anbieter, bietet aber eine Datenhaltung in der EU und einen Auftragsverarbeitungsvertrag an. Klären Sie die Einstellungen vor dem Import Ihrer Kundendaten mit Ihrer Datenschutzbeauftragten.",
        ],
      ],
    ],
  },

  salesforce: {
    r: [4.3, 3.8, 3.8, 4.1, 4.9],
    verdict:
      "Salesforce ist das mächtigste CRM am Markt und lässt sich an fast jeden Vertriebsprozess anpassen. Für kleine Teams ist es meist zu groß, für wachsende Vertriebsorganisationen oft alternativlos.",
    sections: [
      [
        "Einordnung",
        [
          "Salesforce setzt seit Jahren den Maßstab für Vertriebssoftware. Pipelines, Prognosen, Gebietsmanagement, Angebote und Berichte lassen sich tief anpassen, und die Plattform wächst mit Unternehmen bis in Konzerngröße.",
        ],
      ],
      [
        "Preise",
        [
          "Die Starter Suite kostet 25 € je Nutzer im Monat, die Pro Suite 100 €. Darüber liegen Core für 195 €, Advanced für 395 € und Max für 550 € je Nutzer, jeweils bei jährlicher Zahlung. Hinzu kommen in der Praxis häufig Kosten für Implementierungspartner.",
        ],
      ],
      [
        "Für wen es passt",
        [
          "Die Starter Suite ist ein ordentlicher Einstieg für kleine Teams, die später wachsen wollen. Richtig spielt Salesforce seine Stärken aus, wenn mehrere Vertriebsteams, komplexe Freigaben und viele Integrationen zusammenkommen. Eine kostenlose Testphase wird für die kleineren Editionen angeboten.",
        ],
      ],
    ],
  },

  pipedrive: {
    r: [4.4, 4.7, 4.3, 4.0, 4.1],
    verdict:
      "Pipedrive ist das CRM für Vertriebsteams, die vor allem ihre Pipeline im Blick behalten wollen. Klar, schnell und mit fairen Preisen ab 14 € je Nutzer.",
    sections: [
      [
        "Das Prinzip",
        [
          "Pipedrive stellt die Verkaufschance in den Mittelpunkt. Deals wandern per Ziehen und Ablegen durch die Phasen, und die Software erinnert daran, was als Nächstes zu tun ist. Wer aus Excel oder einem überladenen CRM kommt, ist in wenigen Stunden arbeitsfähig.",
        ],
      ],
      [
        "Preise",
        [
          "Lite kostet 14 €, Growth 24 €, Premium 49 € und Ultimate 69 € je Nutzer im Monat. Alle Tarife lassen sich 14 Tage kostenlos testen, ohne Kreditkarte.",
        ],
      ],
      [
        "Grenzen",
        [
          "Marketing- und Serviceprozesse deckt Pipedrive nur in Ansätzen ab. Wer ein System für den gesamten Kundenlebenszyklus sucht, sollte HubSpot vergleichen. Für reine Vertriebsteams ist Pipedrive aber eine der besten Lösungen.",
        ],
      ],
    ],
  },

  "zoho-crm": {
    r: [4.1, 3.9, 4.5, 3.8, 4.4],
    verdict:
      "Zoho CRM bietet viel Funktion für wenig Geld und eine kostenlose Edition für bis zu drei Nutzer. Die Einarbeitung ist etwas aufwendiger als bei Pipedrive.",
    sections: [
      [
        "Was Zoho bietet",
        [
          "Zoho CRM ist Teil einer großen Produktfamilie mit Buchhaltung, Helpdesk, Umfragen und mehr. Workflows, Berechtigungen und Berichte lassen sich weitgehend anpassen, auch in den günstigeren Editionen.",
        ],
      ],
      [
        "Preise und Test",
        [
          "Die kostenlose Edition erlaubt bis zu drei Nutzer mit den wichtigsten Grundfunktionen. Die kostenpflichtigen Editionen Standard, Professional, Enterprise und Ultimate werden je Nutzer abgerechnet, eine kostenlose Testphase ist verfügbar. Die aktuellen Euro-Preise zeigt Zoho nach Auswahl der Währung auf der Preisseite an.",
        ],
      ],
      [
        "Fazit",
        [
          "Für preisbewusste Teams, die bereit sind, etwas Zeit in die Einrichtung zu stecken, ist Zoho CRM ein sehr gutes Angebot. Rechenzentren in der EU stehen zur Verfügung.",
        ],
      ],
    ],
  },

  centralstationcrm: {
    r: [4.3, 4.7, 4.3, 4.3, 3.7],
    verdict:
      "CentralStationCRM aus Köln ist das CRM für kleine Teams, die es einfach und datenschutzfreundlich wollen. Server in Deutschland, klare Preise und eine kostenlose Version für bis zu drei Nutzer.",
    sections: [
      [
        "Das Konzept",
        [
          "Das Programm verzichtet bewusst auf Funktionsfülle. Kontakte, Firmen, Aufgaben, Angebote und Notizen stehen im Mittelpunkt, dazu eine Teamübersicht. Wer von Excel oder Outlook-Kontakten kommt, findet sich sofort zurecht.",
        ],
      ],
      [
        "Preise",
        [
          "Starter ist kostenlos für drei Nutzer und 200 Kontakte. Team kostet 24 € im Monat für drei Nutzer und 3.000 Kontakte, Small Office 75 € für zehn Nutzer, Business 149 € für 20 Nutzer und Enterprise 289 € für 40 Nutzer. Alle bezahlten Tarife haben den gleichen Funktionsumfang. Eine Testphase von 30 Tagen läuft ohne Zahlungsdaten und ohne Kündigung aus.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Handwerksbetriebe, Agenturen und Dienstleister mit einem kleinen Vertriebsteam ist CentralStationCRM eine der sympathischsten Lösungen. Wer Automatisierung und Marketingfunktionen braucht, stößt an Grenzen.",
        ],
      ],
    ],
  },

  "cas-genesisworld": {
    r: [4.1, 3.7, 3.9, 4.3, 4.6],
    verdict:
      "CAS genesisWorld aus Karlsruhe ist ein etabliertes xRM-System für den Mittelstand, das weit über den Vertrieb hinausgeht. Die Stärke ist die Anpassbarkeit, die Einführung braucht einen Partner.",
    sections: [
      [
        "Einordnung",
        [
          "genesisWorld verwaltet nicht nur Kunden, sondern beliebige Beziehungen, etwa zu Lieferanten, Partnern oder Mitarbeitenden. Viele mittelständische Unternehmen nutzen es als zentrale Kontaktdatenbank über Abteilungsgrenzen hinweg.",
        ],
      ],
      [
        "Stärken",
        [
          "Die Software kann im eigenen Rechenzentrum oder in der Cloud betrieben werden, die Integration in Microsoft Office ist tief. Ein großes Partnernetz in Deutschland übernimmt Einführung und Anpassung.",
        ],
      ],
      [
        "Kosten",
        [
          "Preise werden individuell über Partner kalkuliert. Eine Demo ist kostenlos.",
        ],
      ],
    ],
  },

  "dynamics-365-sales": {
    r: [4.1, 3.7, 3.7, 4.0, 4.7],
    verdict:
      "Dynamics 365 Sales ist für Unternehmen interessant, die tief in der Microsoft-Welt arbeiten. Die Verzahnung mit Outlook, Teams und Business Central ist das stärkste Argument.",
    sections: [
      [
        "Was das System leistet",
        [
          "Microsofts Vertriebs-CRM deckt Leads, Verkaufschancen, Angebote, Prognosen und Berichte ab. Wer ohnehin Microsoft 365 nutzt, arbeitet mit vertrauten Oberflächen und hat Kontakte, E-Mails und Termine ohne Umwege im CRM.",
        ],
      ],
      [
        "Preise",
        [
          "Sales Professional kostet 56,30 € je Nutzer im Monat, Sales Enterprise 91 € und Sales Premium 130 €, jeweils bei jährlicher Zahlung. Eine kostenlose Testversion ist verfügbar.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Microsoft-Häuser mit Business Central als ERP ist Dynamics 365 Sales der natürliche Partner. Für kleine Teams ohne Microsoft-Schwerpunkt sind Pipedrive oder HubSpot schneller eingeführt.",
        ],
      ],
    ],
  },

  "sage-sales-management": {
    r: [4.1, 4.3, 3.9, 4.1, 4.1],
    verdict:
      "Sage Sales Management ist ein CRM für Vertriebsteams im Außendienst, mit einer Offline-App, die unterwegs zuverlässig funktioniert. Die Mindestabnahme von fünf Nutzern macht es für Kleinstteams zu groß.",
    sections: [
      [
        "Für wen es gebaut ist",
        [
          "Das CRM zielt auf Vertriebsteams, die viel beim Kunden sind. Die App arbeitet offline und mit Standortbezug, Besuchsberichte lassen sich als Sprachbericht aufnehmen. Pipeline, Aufgaben und Teamziele laufen in einer Oberfläche zusammen.",
        ],
      ],
      [
        "Funktionen",
        [
          "Im Tarif Professional sind bis zu 100.000 Accounts und Kontakte enthalten, dazu Opportunities, Hierarchien mit bis zu fünf Geschäftseinheiten, Berichte, Widgets und die Anbindung an Microsoft 365 und Google Workspace. Angebote, Bestellungen und Vertriebskampagnen lassen sich optional dazubuchen. Die Integration in das ERP ist vorgesehen, was es für Sage-100-Kunden besonders interessant macht.",
        ],
      ],
      [
        "Preis und Test",
        [
          "Professional kostet 55 € je Nutzer im Monat, ab fünf Nutzern. Sage bietet einen kostenlosen Test und eine Demo an.",
        ],
      ],
    ],
  },

  // ───────────── ERP ─────────────
  "sap-business-one": {
    r: [4.1, 3.5, 3.6, 4.0, 4.8],
    verdict:
      "SAP Business One ist die Mittelstandsvariante des Weltmarktführers. Funktional sehr stark, aber nur mit Partner einzuführen und entsprechend teuer.",
    sections: [
      [
        "Einordnung",
        [
          "Business One deckt Finanzen, Einkauf, Vertrieb, Lager, Produktion und Service ab und richtet sich an Unternehmen mit etwa 10 bis 250 Beschäftigten. Viele Betriebe entscheiden sich dafür, weil Kunden oder Konzernmütter bereits mit SAP arbeiten.",
        ],
      ],
      [
        "Einführung und Kosten",
        [
          "Das System wird immer über zertifizierte Partner verkauft und eingeführt. Preise gibt es nur auf Anfrage und hängen von Lizenzmodell, Nutzerzahl und Anpassungen ab. Rechnen Sie neben der Lizenz mit einem Einführungsprojekt.",
        ],
      ],
      [
        "Fazit",
        [
          "Für produzierende und handelnde Mittelständler mit internationaler Ausrichtung ist Business One eine sichere Wahl. Kleine Betriebe finden bei weclapp oder Odoo schnellere und günstigere Lösungen.",
        ],
      ],
    ],
  },

  "dynamics-365-business-central": {
    r: [4.3, 3.9, 4.0, 4.1, 4.7],
    verdict:
      "Business Central ist das Cloud-ERP von Microsoft für kleine und mittlere Unternehmen. Es verbindet eine sehr gute Finanzbuchhaltung mit Lager, Einkauf, Vertrieb und optionaler Fertigung.",
    sections: [
      [
        "Was das System leistet",
        [
          "Business Central ist der Nachfolger von Navision, einem der verbreitetsten ERP-Systeme im deutschen Mittelstand. Die deutsche Lokalisierung umfasst Umsatzsteuer-Voranmeldung, DATEV-Export und E-Rechnung, und die Integration in Outlook, Excel und Teams ist tief.",
        ],
      ],
      [
        "Preise",
        [
          "Essentials kostet 69,30 € je Nutzer im Monat, Premium mit Service und Fertigung 95,30 €, Team Members mit eingeschränkten Rechten 6,90 €, jeweils bei jährlicher Zahlung. Eine Testphase von 30 Tagen ist kostenlos. Für die Einführung arbeitet Microsoft mit Partnern, deren Kosten hinzukommen.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Unternehmen mit 10 bis 250 Beschäftigten, die in der Microsoft-Welt arbeiten, ist Business Central eine der überzeugendsten ERP-Lösungen.",
        ],
      ],
    ],
  },

  weclapp: {
    r: [4.2, 4.1, 4.1, 4.1, 4.4],
    verdict:
      "weclapp aus Marburg ist ein Cloud-ERP, das sich ohne großes Einführungsprojekt starten lässt. Für Dienstleister und Händler mit bis zu 50 Beschäftigten ist es eine sehr gute Wahl.",
    sections: [
      [
        "Das Konzept",
        [
          "weclapp verbindet CRM, Warenwirtschaft, Projekte, Buchhaltung und Fulfillment in einer Cloud-Anwendung. Die Tarife sind nach Branchen geschnitten, was die Auswahl einfacher macht als bei klassischen ERP-Systemen.",
        ],
      ],
      [
        "Preise",
        [
          "ERP Starter kostet 39 € je Nutzer im Monat. ERP Dienstleistung liegt bei 95 €, bei jährlicher Zahlung bei 86 €. ERP Handel kostet 179 €, jährlich 163 €. Ab zehn Nutzern gibt es individuelle Konditionen. Alle Tarife lassen sich 30 Tage kostenlos testen, der Test endet automatisch.",
        ],
      ],
      [
        "Fazit",
        [
          "Wer sein Unternehmen aus mehreren Einzeltools in ein System überführen will, findet in weclapp eine moderne, deutsche Lösung mit Rechenzentrum in Deutschland.",
        ],
      ],
    ],
  },

  xentral: {
    r: [4.1, 4.2, 3.8, 4.0, 4.4],
    verdict:
      "Xentral ist das ERP für wachsende Onlinehändler mit vielen Aufträgen. Unbegrenzte Nutzer in allen Tarifen sind ein starkes Argument, die Preise steigen aber mit Umsatz und Auftragsvolumen.",
    sections: [
      [
        "Einordnung",
        [
          "Das Augsburger Unternehmen hat sich auf den E-Commerce spezialisiert. Aufträge aus Shops und Marktplätzen, Lager, Versand und Buchhaltungsexport laufen in einem System zusammen.",
        ],
      ],
      [
        "Preise",
        [
          "Launch kostet 99 € im Monat für Unternehmen bis 500.000 € Jahresumsatz und 1.200 Aufträge im Monat. Starter liegt bei 349 € mit 500 inklusiven Aufträgen, Business bei 649 € mit Automatisierung und API, Pro bei 849 €. Alle Tarife enthalten unbegrenzt viele Nutzer. Eine Testphase von 14 Tagen ist kostenlos und endet automatisch.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Händler, die aus JTL oder Einzeltools herauswachsen, ist Xentral eine naheliegende Wahl. Für Dienstleister ohne Warenfluss passt weclapp besser.",
        ],
      ],
    ],
  },

  odoo: {
    r: [4.2, 3.9, 4.6, 3.7, 4.7],
    verdict:
      "Odoo ist das flexibelste ERP-System in diesem Vergleich und dank Open-Source-Kern sehr günstig. Die deutsche Lokalisierung sollte vor dem Start mit einem erfahrenen Partner geprüft werden.",
    sections: [
      [
        "Das Baukastenprinzip",
        [
          "Odoo besteht aus Apps für CRM, Verkauf, Lager, Fertigung, Buchhaltung, Website, Onlineshop und vieles mehr. Man startet mit dem, was man braucht, und ergänzt später.",
        ],
      ],
      [
        "Preise",
        [
          "Eine einzelne App ist dauerhaft kostenlos, mit unbegrenzt vielen Nutzern. Standard mit allen Apps kostet 8,95 € je Nutzer im Monat, bei jährlicher Zahlung 7,25 €. Custom mit Odoo Studio, Multi-Company und API liegt bei 13,60 €, jährlich 10,90 €. Hosting, Wartung und Support sind enthalten.",
        ],
      ],
      [
        "Worauf Sie achten sollten",
        [
          "Für die deutsche Buchhaltung mit DATEV-Export, GoBD-Anforderungen und E-Rechnung braucht es eine sorgfältige Einrichtung. Viele Unternehmen arbeiten dafür mit einem deutschen Odoo-Partner zusammen, dessen Kosten in die Kalkulation gehören.",
        ],
      ],
    ],
  },

  "sage-100": {
    r: [4.3, 3.9, 4.1, 4.3, 4.7],
    verdict:
      "Sage 100 ist ein bewährtes ERP für den deutschen Mittelstand, das Warenwirtschaft, Rechnungswesen und Produktion modular verbindet. Transparente Modulpreise machen die Kalkulation einfacher als bei vielen Wettbewerbern.",
    sections: [
      [
        "Einordnung",
        [
          "Sage 100 richtet sich an Unternehmen, die über Sage 50 hinausgewachsen sind oder individuelle Prozesse abbilden müssen. Die Module Warenwirtschaft, Rechnungswesen und Produktion lassen sich einzeln oder kombiniert einsetzen, ergänzt durch Lösungen wie xRM, DMS oder einen Webshop.",
        ],
      ],
      [
        "Stärken",
        [
          "Das Rechnungswesen bietet Finanz- und Anlagenbuchhaltung, Controlling mit Dashboard, Mahnwesen und die Umsatzsteuer-Voranmeldung über ELSTER, bei unbegrenzter Mandantenzahl. Die Warenwirtschaft deckt Bestellwesen, Kommissionierung, Lager, Inventur sowie Seriennummern und Chargen ab. Das Produktionsmodul eignet sich für Einzel-, Projekt- und Serienfertiger mit Kalkulation und Betriebsdatenerfassung.",
          "Über eine API lassen sich Partnerlösungen anbinden, und Sage verfügt über ein dichtes Partnernetz in Deutschland für Einführung und Betreuung.",
        ],
      ],
      [
        "Preise",
        [
          "Die Warenwirtschaft beginnt bei 56 € je Nutzer im Monat, das Rechnungswesen bei 58 € und die Produktion bei 90 €, bei jährlicher Zahlung und zwölf Monaten Mindestlaufzeit. Für ein konkretes Angebot und eine Produkttour bietet Sage eine kostenlose Beratung an.",
        ],
      ],
      [
        "Für wen es passt",
        [
          "Für mittelständische Händler und Fertiger mit 20 bis 250 Beschäftigten, die ein deutsches ERP mit klarer Preisstruktur suchen, gehört Sage 100 auf die Auswahlliste.",
        ],
      ],
    ],
  },

  myfactory: {
    r: [4.0, 3.8, 3.9, 4.0, 4.5],
    verdict:
      "myfactory ist ein Cloud-ERP für den Mittelstand mit starker Warenwirtschaft und Finanzbuchhaltung. Es richtet sich an Unternehmen, die eine vollständige Branchenlösung ohne eigenen Server suchen.",
    sections: [
      [
        "Einordnung",
        [
          "myfactory war einer der frühen Anbieter eines vollständigen ERP-Systems im Browser. Warenwirtschaft, Finanzbuchhaltung, CRM und Produktion sind integriert, Branchenpakete gibt es unter anderem für Großhandel und Fertigung.",
        ],
      ],
      [
        "Kosten",
        [
          "Preise gibt es auf Anfrage, meist über Partner. Eine Demo ist kostenlos.",
        ],
      ],
      [
        "Fazit",
        [
          "Für mittelständische Händler und Fertiger, die auf die Cloud setzen, ist myfactory eine solide Alternative zu Business Central und weclapp.",
        ],
      ],
    ],
  },

  "haufe-x360": {
    r: [4.0, 3.8, 3.7, 4.1, 4.5],
    verdict:
      "Haufe X360 ist ein Cloud-ERP für den gehobenen Mittelstand mit sehr flexibler Konfiguration. Der Mindestumsatz von 449 € im Monat zeigt, dass es nicht für Kleinbetriebe gedacht ist.",
    sections: [
      [
        "Einordnung",
        [
          "Haufe X360 deckt Finanzen, Vertrieb, Einkauf, Lager und Projekte ab und wird nach gebuchten Funktionen und Nutzern abgerechnet. Die Plattform ist für Unternehmen gedacht, die aus einer Sammlung von Einzellösungen ein zentrales System machen wollen.",
        ],
      ],
      [
        "Preise",
        [
          "Der Einstieg für Dienstleister liegt bei 49 € je Nutzer im Monat, mit Vertrieb oder im Großhandel deutlich darüber. Der monatliche Mindestbetrag beträgt 449 €. Eine Testversion gibt es nicht, dafür eine kostenlose Beratung mit Produktdemo.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Mittelständler mit 20 Nutzern und mehr, die eine konfigurierbare Cloud-Lösung aus deutscher Hand suchen, ist Haufe X360 eine ernsthafte Option.",
        ],
      ],
    ],
  },

  "jtl-wawi": {
    r: [4.3, 3.8, 4.8, 3.9, 4.5],
    verdict:
      "JTL-Wawi ist für Onlinehändler die naheliegende erste Warenwirtschaft: dauerhaft kostenlos, mit unbegrenzt vielen Nutzern und einer großen Community. Wachstum kostet dann Geld und Pflegeaufwand.",
    sections: [
      [
        "Warum so viele Händler damit starten",
        [
          "JTL aus Hückelhoven bietet die Warenwirtschaft als lokale Installation in der Edition JTL Start dauerhaft kostenlos an, mit unbegrenzten Nutzern und einem kostenlosen Shop mit bis zu 500 Artikeln. Für Händler, die auf Amazon, eBay und im eigenen Shop verkaufen, ist das ein sehr günstiger Einstieg.",
        ],
      ],
      [
        "Kosten beim Wachstum",
        [
          "JTL Advanced mit einem professionellen Shop und unbegrenzten Artikeln kostet 119 € im Monat, bei jährlicher Zahlung weniger. JTL Pro mit drei Shops und Workflow-Automatisierung liegt bei 369 €. Lagerverwaltung und Versand haben eigene Preisstufen.",
        ],
      ],
      [
        "Worauf Sie achten sollten",
        [
          "Weil die Software lokal läuft, brauchen Sie einen Rechner oder Server und kümmern sich um Updates und Sicherungen. Viele Händler holen sich dafür einen JTL-Servicepartner.",
        ],
      ],
    ],
  },

  "sage-50-handwerk": {
    r: [4.2, 4.1, 4.2, 4.1, 4.3],
    verdict:
      "Sage 50 Handwerk ist konsequent auf die Abläufe im Handwerk zugeschnitten, mit Aufmaß, Teilrechnungen und Großhändlerschnittstellen. Der Einstieg für 19,90 € im Monat ist für Einzelbetriebe sehr fair.",
    sections: [
      [
        "Warum eine Branchenlösung",
        [
          "Ein Elektro- oder Sanitärbetrieb rechnet anders als ein Onlinehändler. Angebote entstehen aus Aufmaß und Leistungsverzeichnis, Rechnungen kommen in Abschlägen, und Materialpreise ändern sich ständig. Sage 50 Handwerk bildet genau das ab.",
        ],
      ],
      [
        "Stärken",
        [
          "Über die Schnittstellen IDS und OCI rufen Sie Preise und Verfügbarkeiten direkt beim Großhandel ab, ohne abzutippen. Ausschreibungen im GAEB-Format lassen sich einlesen. E-Rechnungen im Format ZUGFeRD 2.1 und XRechnung erstellt die Software direkt, was besonders bei öffentlichen Auftraggebern wichtig ist.",
          "Mit einem Cloud-Paket lassen sich Leistungen und Arbeitszeiten auf der Baustelle erfassen. Zusatzpakete für mobiles Arbeiten, Zeiterfassung und Dokumentenmanagement sind verfügbar.",
        ],
      ],
      [
        "Preise",
        [
          "Essential für einen Benutzer kostet 19,90 € im Monat, Enterprise mit unbegrenzten Benutzern, Teil- und Schlussrechnungen und Terminkalender 59 €, jeweils bei jährlicher Zahlung mit zwölf Monaten Laufzeit. Nachkalkulation, Wartung und Service sowie die Finanzbuchhaltung sind optional erweiterbar. Eine Selbsttestversion gibt es nicht, dafür Webinare und ein kostenloses Infopaket.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Handwerksbetriebe vom Einmannbetrieb bis zur mittleren Firma ist Sage 50 Handwerk eine der rundesten Branchenlösungen am Markt.",
        ],
      ],
    ],
  },

  "sage-b7": {
    r: [4.0, 3.6, 3.8, 4.1, 4.6],
    verdict:
      "Sage b7 ist ein ERP für mittelständische Händler und Fertiger mit komplexen Preis- und Konditionsmodellen. Es wird als Projekt mit einem Partner eingeführt, Preise gibt es nur auf Anfrage.",
    sections: [
      [
        "Einsatzfelder",
        [
          "Typische Anwender sind der technische Großhandel, der Kfz-Teilehandel und Filialisten, die mehrere Standorte aus zentralen Lagern versorgen. Die Stärke liegt in Preis- und Konditionsfindung, Multi-Sourcing und Handelskalkulation.",
        ],
      ],
      [
        "Funktionen",
        [
          "Neben Warenwirtschaft und Disposition bietet b7 Produktion, Zeitwirtschaft, eine Integration in Microsoft 365 und E-Procurement-Schnittstellen. Das System ist individuell erweiterbar.",
        ],
      ],
      [
        "Fazit",
        [
          "Für Händler mit vielen tausend Artikeln und verschachtelten Konditionen ist b7 eine Option aus dem deutschen Mittelstand. Sage bietet ein kostenloses Infopaket und eine Beratung.",
        ],
      ],
    ],
  },
};
