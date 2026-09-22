/**
 * Editorial copy per category: the noun used in „Die beste … in Deutschland {Jahr}", a buying guide
 * and FAQs. Keyed by category slug. Replaced by a CMS field in the backend phase.
 */
export const CATEGORY_GUIDES: Record<
  string,
  { h1Noun: string; checklist: { title: string; text: string }[]; faq: { q: string; a: string }[] }
> = {
  buchhaltungssoftware: {
    h1Noun: "Buchhaltungssoftware",
    checklist: [
      { title: "E-Rechnung", text: "Empfang von XRechnung und ZUGFeRD ist seit 2025 Pflicht, die Ausstellung folgt 2027/2028." },
      { title: "DATEV-Schnittstelle", text: "Klären Sie mit Ihrer Steuerkanzlei, ob ein DATEV-Export genügt oder Belege über DATEV Unternehmen online kommen sollen." },
      { title: "GoBD", text: "Festschreibung, Protokollierung und revisionssichere Archivierung, idealerweise mit Prüftestat." },
      { title: "EÜR oder Bilanz", text: "Schlanke Tools reichen für die EÜR; bilanzierende Unternehmen brauchen doppelte Buchführung nach HGB." },
      { title: "ELSTER", text: "Eine direkte UStVA-Übermittlung spart Übertragungsfehler, wenn Sie die Voranmeldung selbst abgeben." },
    ],
    faq: [
      { q: "Welche Buchhaltungssoftware nutzen Steuerberater?", a: "Die meisten Steuerkanzleien in Deutschland arbeiten mit DATEV. Entscheidend ist daher, dass Ihre Software Daten im DATEV-Format übergeben oder direkt an DATEV Unternehmen online übertragen kann." },
      { q: "Brauche ich als Kleinunternehmer eine Buchhaltungssoftware?", a: "Pflicht ist sie nicht, aber sie erleichtert die GoBD-konforme Ablage, die EÜR und den Empfang von E-Rechnungen, den auch Kleinunternehmer nach § 19 UStG sicherstellen müssen." },
      { q: "Sind QuickBooks oder Xero in Deutschland eine Option?", a: "Kaum. Beide Programme sind nicht für Deutschland lokalisiert: Es fehlen unter anderem eine DATEV-Schnittstelle, GoBD-Nachweise und die deutschen E-Rechnungsformate. Wir listen sie deshalb nicht als Buchhaltungslösung für den deutschen Markt." },
    ],
  },
  lohnabrechnung: {
    h1Noun: "Lohnabrechnungssoftware",
    checklist: [
      { title: "Meldewesen", text: "Lohnsteueranmeldung, Beitragsnachweise und DEÜV-Meldungen sollten elektronisch und fristgerecht übermittelt werden." },
      { title: "ELStAM", text: "Der automatische Abruf der Lohnsteuerabzugsmerkmale ist Grundvoraussetzung." },
      { title: "Sonderfälle", text: "Baulohn, Kurzarbeit, Minijobs oder bAV: Prüfen Sie, welche Konstellationen Sie brauchen." },
      { title: "Kanzlei-Anbindung", text: "Wer vorbereitend abrechnet, braucht eine saubere DATEV-Übergabe an Kanzlei oder Lohnbüro." },
    ],
    faq: [
      { q: "Selbst abrechnen oder die Kanzlei beauftragen?", a: "Für wenige Mitarbeitende ist die Kanzlei meist die sicherere Wahl. Ab etwa 15 bis 20 Mitarbeitenden und mit Lohn-Know-how im Haus kann sich eine eigene Lohnsoftware lohnen." },
      { q: "Was ist vorbereitende Lohnabrechnung?", a: "HR-Systeme sammeln Stammdaten, Abwesenheiten und Zuschläge und übergeben sie per Schnittstelle an die Kanzlei, die die eigentliche Abrechnung erstellt." },
    ],
  },
  "hr-software": {
    h1Noun: "HR-Software",
    checklist: [
      { title: "Betriebsrat", text: "HR-Software ist regelmäßig mitbestimmungspflichtig nach § 87 Abs. 1 Nr. 6 BetrVG. Planen Sie die Betriebsvereinbarung ein." },
      { title: "Rollen & Rechte", text: "Ein feingranulares Rechtekonzept ist wichtig für Datenschutz und Mitbestimmung." },
      { title: "Lohnvorbereitung", text: "Eine DATEV-Schnittstelle vermeidet doppelte Erfassung für die Entgeltabrechnung." },
      { title: "Hosting & AV-Vertrag", text: "Personaldaten sind besonders sensibel. Achten Sie auf EU-Hosting und einen AV-Vertrag nach Art. 28 DSGVO." },
    ],
    faq: [
      { q: "Muss der Betriebsrat einer HR-Software zustimmen?", a: "Wenn die Software geeignet ist, Verhalten oder Leistung zu überwachen, was bei HR-Systemen fast immer zutrifft, hat der Betriebsrat ein Mitbestimmungsrecht. In der Praxis wird eine Betriebsvereinbarung abgeschlossen." },
      { q: "Ersetzt HR-Software die Lohnabrechnung?", a: "Meist nicht. Viele HR-Systeme übernehmen die vorbereitende Lohnabrechnung und übergeben die Daten an Kanzlei oder Lohnsoftware." },
    ],
  },
  "crm-software": {
    h1Noun: "CRM-Software",
    checklist: [
      { title: "DSGVO-Einwilligungen", text: "Double-Opt-in und Einwilligungen müssen nachweisbar dokumentiert werden." },
      { title: "E-Mail-Integration", text: "Outlook- oder Gmail-Anbindung entscheidet über die Akzeptanz im Vertrieb." },
      { title: "Hosting", text: "Viele US-Anbieter bieten EU-Rechenzentren; deutsche Anbieter hosten häufig in Deutschland." },
      { title: "Angebote & Buchhaltung", text: "Eine Anbindung an Ihre Buchhaltung vermeidet doppelte Pflege von Kunden und Angeboten." },
    ],
    faq: [
      { q: "Darf ich ein US-CRM DSGVO-konform nutzen?", a: "Ja, wenn ein AV-Vertrag besteht und die Datenübermittlung abgesichert ist, etwa durch EU-Hosting, die Zertifizierung nach dem EU-US Data Privacy Framework oder Standardvertragsklauseln." },
    ],
  },
  "erp-warenwirtschaft": {
    h1Noun: "ERP-Software",
    checklist: [
      { title: "Branchenfit", text: "Handel, Fertigung und Dienstleistung stellen sehr unterschiedliche Anforderungen." },
      { title: "E-Rechnung & DATEV", text: "Ein ERP sollte E-Rechnungen verarbeiten und die Finanzdaten an DATEV übergeben können." },
      { title: "Einführungsaufwand", text: "Planen Sie Partner, Datenmigration und Schulungen realistisch ein." },
      { title: "Cloud oder On-Premise", text: "Cloud senkt den IT-Aufwand, On-Premise gibt volle Datenhoheit." },
    ],
    faq: [
      { q: "Ab wann lohnt sich ein ERP-System?", a: "Sobald Einkauf, Lager, Auftragsabwicklung und Buchhaltung in getrennten Tools oder Excel-Listen gepflegt werden und Fehler oder Doppelerfassungen zunehmen." },
    ],
  },
  projektmanagement: {
    h1Noun: "Projektmanagement-Software",
    checklist: [
      { title: "Methodik", text: "Klassisch mit Gantt, agil mit Boards oder beides?" },
      { title: "Ressourcenplanung", text: "Die Auslastung im Team sichtbar zu machen, ist oft wichtiger als jedes Diagramm." },
      { title: "Serverstandort", text: "Mehrere deutsche Anbieter hosten in Deutschland oder bieten On-Premise an." },
      { title: "Zeiterfassung", text: "Integrierte Zeiterfassung erleichtert die Abrechnung von Kundenprojekten." },
    ],
    faq: [
      { q: "Gibt es Projektmanagement-Software mit Servern in Deutschland?", a: "Ja, zum Beispiel awork, factro, Stackfield und InLoox. OpenProject kann zudem im eigenen Rechenzentrum betrieben werden." },
    ],
  },
  zeiterfassung: {
    h1Noun: "Zeiterfassungssoftware",
    checklist: [
      { title: "Pflicht zur Erfassung", text: "Seit dem BAG-Beschluss von 2022 müssen Arbeitgeber die Arbeitszeit erfassen." },
      { title: "Manipulationsschutz", text: "Änderungen sollten protokolliert und nachvollziehbar sein." },
      { title: "ArbZG-Prüfung", text: "Warnungen bei fehlenden Pausen oder zu langen Arbeitstagen." },
      { title: "Lohnexport", text: "Stunden und Zuschläge sollten an die Lohnabrechnung übergeben werden können." },
    ],
    faq: [
      { q: "Ist die elektronische Zeiterfassung Pflicht?", a: "Die Pflicht zur Erfassung besteht seit dem BAG-Beschluss vom 13.09.2022. Eine gesetzliche Vorgabe zur elektronischen Form war zum Redaktionsschluss noch nicht in Kraft, prüfen Sie den aktuellen Stand." },
    ],
  },
  dokumentenmanagement: {
    h1Noun: "Dokumentenmanagement-Software",
    checklist: [
      { title: "Revisionssicherheit", text: "Unveränderbare Archivierung nach GoBD mit Überwachung der Aufbewahrungsfristen." },
      { title: "E-Rechnung", text: "E-Rechnungen müssen im Originalformat archiviert werden." },
      { title: "Workflows", text: "Digitaler Rechnungseingang mit Freigaben spart den meisten Unternehmen am meisten Zeit." },
      { title: "DATEV-Anbindung", text: "Die Übergabe von Belegen an DATEV Unternehmen online erleichtert die Arbeit der Kanzlei." },
    ],
    faq: [
      { q: "Wie lange müssen Belege aufbewahrt werden?", a: "Buchungsbelege acht Jahre (seit dem Vierten Bürokratieentlastungsgesetz), Bücher und Jahresabschlüsse zehn Jahre, Handels- und Geschäftsbriefe sechs Jahre." },
    ],
  },
};
