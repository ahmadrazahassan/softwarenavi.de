import type { Article } from "@/lib/types";
import { AUTHOR_BIO, AUTHOR_NAME, AUTHOR_TITLE } from "@/lib/site";

/**
 * Demo Ratgeber seed (backend §8.4). Author names are placeholders for the editorial team and must be
 * replaced with the real Redaktion before launch. Legal statements reflect the status of September 2026
 * and are not legal advice.
 */

const AUTHORS = {
  buchhaltung: {
    author_name: "Miriam Keller",
    author_title: "Fachredaktion Buchhaltung",
    author_bio:
      "Miriam Keller schreibt über Rechnungswesen, Umsatzsteuer und die Digitalisierung der Finanzbuchhaltung in kleinen und mittleren Unternehmen.",
  },
  hr: {
    author_name: "Jonas Brenner",
    author_title: "Fachredaktion HR & Lohn",
    author_bio:
      "Jonas Brenner beschäftigt sich mit Personalprozessen, Entgeltabrechnung und Arbeitsrecht in der Praxis des Mittelstands.",
  },
  redaktion: {
    author_name: "Nadeem Abbas",
    author_title: "Redaktion",
    author_bio:
      "Die Redaktion von Softwarenavi vergleicht Unternehmenssoftware für den deutschen Markt auf Basis von Herstellerangaben, geprüften Preislisten und Nutzerbewertungen.",
  },
  it: {
    author_name: "Katharina Lenz",
    author_title: "Fachredaktion IT & Datenschutz",
    author_bio:
      "Katharina Lenz schreibt über Cloud-Software, Datenschutz nach DSGVO und IT-Sicherheit in Unternehmen.",
  },
};

type Seed = Omit<Article, "id" | "featured" | "status" | "featured_image_url" | "author_avatar_url" | "meta_title" | "meta_description" | "og_image_url" | "created_at" | "updated_at" | "author_name" | "author_title" | "author_bio"> & {
  author: keyof typeof AUTHORS;
  featured?: boolean;
};

const SEED: Seed[] = [
  {
    slug: "buchhaltungssoftware-fuer-kleine-unternehmen",
    title: "Buchhaltungssoftware für kleine Unternehmen: Worauf es 2026 wirklich ankommt",
    excerpt:
      "E-Rechnung, GoBD, DATEV-Schnittstelle, ELSTER: Welche Funktionen kleine Unternehmen wirklich brauchen und wo sich Mehrkosten nicht lohnen.",
    category_tag: "Buchhaltung",
    related_software_id: "sw-lexware-office",
    read_time_minutes: 8,
    published_date: "2026-01-14",
    updated_date: "2026-08-28",
    author: "buchhaltung",
    featured: true,
    content: `
<p>Die Auswahl an Buchhaltungsprogrammen für kleine Unternehmen ist groß, und die Unterschiede liegen oft im Detail. Wer 2026 eine neue Lösung sucht, sollte weniger auf Werbeversprechen achten als auf vier Punkte, die im deutschen Alltag tatsächlich zählen: E-Rechnung, GoBD-Konformität, die Zusammenarbeit mit der Steuerkanzlei und die Übermittlung an das Finanzamt.</p>
<h2 id="e-rechnung">1. E-Rechnung: Empfang ist Pflicht, Versand folgt</h2>
<p>Seit dem 1. Januar 2025 müssen alle inländischen Unternehmen E-Rechnungen im B2B-Verkehr empfangen und verarbeiten können. Eine PDF-Datei per E-Mail ist dabei ausdrücklich <strong>keine</strong> E-Rechnung. Gemeint sind strukturierte Formate nach der europäischen Norm EN&nbsp;16931, also XRechnung oder ZUGFeRD ab Version&nbsp;2.0.1.</p>
<p>Ab 2027 müssen Unternehmen mit einem Vorjahresumsatz von mehr als 800.000&nbsp;€ E-Rechnungen auch ausstellen, ab 2028 gilt das für alle. Eine gute Software sollte deshalb beide Formate lesen, validieren und erzeugen können.</p>
<h2 id="gobd">2. GoBD: Festschreibung, Archiv, Verfahrensdokumentation</h2>
<p>Die Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern (GoBD) verlangen unter anderem, dass Buchungen nachträglich nicht unbemerkt verändert werden können und Belege unveränderbar archiviert werden. Achten Sie darauf, dass der Anbieter die GoBD-Konformität durch ein Prüftestat belegt und eine Musterverfahrensdokumentation bereitstellt.</p>
<h2 id="datev">3. Die DATEV-Schnittstelle entscheidet über die Zusammenarbeit mit der Kanzlei</h2>
<p>Die meisten Steuerkanzleien arbeiten mit DATEV. Kann Ihre Software Buchungsstapel und Belegbilder im DATEV-Format übergeben, sparen beide Seiten viel Zeit. Fragen Sie Ihre Kanzlei vor dem Kauf, welche Übergabe sie bevorzugt. Manche Kanzleien möchten Belege ausschließlich über DATEV Unternehmen online erhalten.</p>
<h2 id="elster">4. ELSTER: Umsatzsteuer-Voranmeldung aus der Software</h2>
<p>Wer die Umsatzsteuer-Voranmeldung selbst abgibt, profitiert von einer direkten ELSTER-Übermittlung aus dem Programm. Die UStVA ist bis zum 10. des Folgemonats fällig (mit Dauerfristverlängerung einen Monat später). Eine Software, die die Werte automatisch aus den Buchungen ableitet, reduziert Übertragungsfehler.</p>
<h2 id="entscheidung">So treffen Sie die Entscheidung</h2>
<ul>
<li><strong>EÜR oder Bilanz?</strong> Für Freiberufler und Kleingewerbe mit EÜR genügen schlanke Cloud-Lösungen. Bilanzierende Unternehmen brauchen doppelte Buchführung nach HGB.</li>
<li><strong>Wer bucht?</strong> Übernimmt die Kanzlei die Buchhaltung, zählt vor allem die Belegübergabe. Buchen Sie selbst, zählen Automatisierung und Kontierungsvorschläge.</li>
<li><strong>Serverstandort:</strong> Viele deutsche Anbieter hosten in Deutschland. Rechtlich genügt in der Regel ein Hosting in der EU. Mehr dazu in unserem Beitrag zum Serverstandort.</li>
<li><strong>Kosten realistisch rechnen:</strong> Vergleichen Sie Nettopreise inklusive der Funktionen, die Sie wirklich benötigen. Oft sind UStVA oder Kassenbuch erst in höheren Paketen enthalten.</li>
</ul>
<blockquote>Die beste Buchhaltungssoftware ist die, die Ihre Steuerkanzlei ohne Umwege weiterverarbeiten kann.</blockquote>
<h2 id="fazit">Fazit</h2>
<p>Für die meisten kleinen Unternehmen führt 2026 kein Weg an einer Lösung vorbei, die E-Rechnungen beherrscht, GoBD-konform archiviert und Daten sauber an DATEV übergibt. Nutzen Sie die kostenlosen Testphasen und binden Sie Ihre Steuerkanzlei früh in die Auswahl ein.</p>`,
  },
  {
    slug: "sevdesk-lexware-office-oder-datev",
    title: "sevdesk, Lexware Office oder DATEV: Welche Lösung passt zu Ihrem Unternehmen?",
    excerpt:
      "Drei verbreitete Wege zur digitalen Buchhaltung im Vergleich: für wen sich die Cloud-Tools lohnen und wann DATEV Unternehmen online die bessere Wahl ist.",
    category_tag: "Vergleich",
    related_software_id: "sw-sevdesk",
    read_time_minutes: 9,
    published_date: "2026-02-10",
    updated_date: "2026-08-30",
    author: "buchhaltung",
    featured: true,
    content: `
<p>sevdesk und Lexware Office sind die bekanntesten Cloud-Buchhaltungen für Selbstständige und kleine Unternehmen. DATEV Unternehmen online spielt in einer anderen Liga: Es ist weniger eine eigene Buchhaltung als die digitale Verbindung zur Steuerkanzlei. Welche Lösung passt, hängt vor allem davon ab, wer bei Ihnen bucht.</p>
<h2 id="wer-bucht">Die entscheidende Frage: Wer bucht?</h2>
<p>Wenn Sie Rechnungen schreiben, Belege erfassen und die Umsatzsteuer-Voranmeldung selbst abgeben, sind sevdesk und Lexware Office naheliegend. Beide leiten die UStVA aus Ihren Buchungen ab und übermitteln sie per ELSTER. Führt dagegen die Kanzlei Ihre Buchhaltung in DATEV, ist Unternehmen online oft die reibungsloseste Lösung.</p>
<h2 id="preise">Preise im Überblick</h2>
<table>
<thead><tr><th>Lösung</th><th>Einstieg (netto)</th><th>Abrechnung</th></tr></thead>
<tbody>
<tr><td>Lexware Office</td><td>ab 7,90&nbsp;€ / Monat</td><td>pro Konto</td></tr>
<tr><td>sevdesk</td><td>ab 12,90&nbsp;€ / Monat</td><td>pro Konto</td></tr>
<tr><td>DATEV Unternehmen online</td><td>über die Kanzlei</td><td>pro Mandant</td></tr>
</tbody>
</table>
<p>Alle Preise verstehen sich netto zzgl. 19&nbsp;% Umsatzsteuer. Achten Sie darauf, welche Funktionen im jeweiligen Paket enthalten sind: Die Buchhaltung mit UStVA ist bei beiden Cloud-Anbietern erst in den mittleren oder größeren Tarifen enthalten.</p>
<h2 id="unterschiede">Die wichtigsten Unterschiede</h2>
<h3>Lexware Office</h3>
<p>Punktet mit sehr einfacher Bedienung und einem günstigen Einstieg. Ab Paket L sind EÜR, Anlagenverwaltung und Kassenbuch enthalten. Für Steuerkanzleien gibt es einen kostenlosen Zugang.</p>
<h3>sevdesk</h3>
<p>Bietet eine sehr gute automatische Belegerkennung und einen dauerhaft kostenlosen Einstiegstarif. Die eigentliche Buchhaltung beginnt im Tarif Buchhaltung ab 22,90 € bei jährlicher Zahlung.</p>
<h3>DATEV Unternehmen online</h3>
<p>Ist das Werkzeug der Wahl, wenn Ihre Kanzlei mit DATEV arbeitet. Und das sind in Deutschland die meisten. Belege landen direkt dort, wo gebucht wird.</p>
<h2 id="empfehlung">Unsere Empfehlung</h2>
<ul>
<li><strong>Selbst buchen, EÜR, wenig Belege:</strong> Lexware Office.</li>
<li><strong>Selbst buchen, viele Belege:</strong> sevdesk mit seiner KI-Belegerkennung.</li>
<li><strong>Kanzlei bucht in DATEV:</strong> DATEV Unternehmen online oder eine Cloud-Lösung mit gutem DATEV-Export, wenn Sie Rechnungen komfortabler schreiben möchten.</li>
</ul>
<p>Im direkten <a href="/vergleich/sevdesk-vs-lexware-office">Vergleich sevdesk vs. Lexware Office</a> finden Sie Bewertungen, Funktionen und Preise nebeneinander.</p>`,
  },
  {
    slug: "e-rechnungspflicht-2027-2028",
    title: "E-Rechnungspflicht: Was ab 2027 und 2028 auf Ihr Unternehmen zukommt",
    excerpt:
      "Empfangspflicht seit 2025, Ausstellungspflicht ab 2027 und 2028: Fristen, Formate, Ausnahmen und was Ihre Software können muss.",
    category_tag: "E-Rechnung",
    related_software_id: "sw-sevdesk",
    read_time_minutes: 7,
    published_date: "2026-03-03",
    updated_date: "2026-09-01",
    author: "buchhaltung",
    featured: true,
    content: `
<p>Mit dem Wachstumschancengesetz hat der Gesetzgeber die E-Rechnung im inländischen B2B-Verkehr verpflichtend gemacht. Die Einführung erfolgt stufenweise, und für viele Unternehmen steht der entscheidende Schritt noch bevor.</p>
<h2 id="fristen">Die Fristen im Überblick</h2>
<ol>
<li><strong>Seit 01.01.2025:</strong> Alle Unternehmen müssen E-Rechnungen empfangen und verarbeiten können.</li>
<li><strong>Ab 01.01.2027:</strong> Unternehmen mit einem Vorjahresumsatz von mehr als 800.000&nbsp;€ müssen E-Rechnungen ausstellen.</li>
<li><strong>Ab 01.01.2028:</strong> Die Ausstellungspflicht gilt für alle Unternehmen im inländischen B2B-Verkehr.</li>
</ol>
<h2 id="formate">Welche Formate zählen?</h2>
<p>Eine E-Rechnung ist ein strukturiertes elektronisches Format, das der europäischen Norm EN&nbsp;16931 entspricht. In Deutschland sind das vor allem <strong>XRechnung</strong> (reines XML) und <strong>ZUGFeRD</strong> ab Version&nbsp;2.0.1 (PDF mit eingebettetem XML, außer den Profilen MINIMUM und BASIC-WL). Eine PDF-Datei ohne strukturierte Daten gilt nicht als E-Rechnung.</p>
<h2 id="ausnahmen">Ausnahmen</h2>
<ul>
<li>Kleinbetragsrechnungen bis 250&nbsp;€ brutto</li>
<li>Fahrausweise</li>
<li>Kleinunternehmer nach § 19 UStG müssen keine E-Rechnungen ausstellen, aber empfangen können</li>
<li>Rechnungen an Privatpersonen (B2C)</li>
</ul>
<h2 id="software">Was Ihre Software können muss</h2>
<p>Prüfen Sie, ob Ihre Buchhaltungs- oder ERP-Software E-Rechnungen im Eingang automatisch einliest, validiert und GoBD-konform im Originalformat archiviert. Für den Ausgang sollte sie mindestens ZUGFeRD erzeugen, idealerweise auch XRechnung, die öffentliche Auftraggeber verlangen.</p>
<blockquote>Die Archivierung muss im Originalformat erfolgen. Ein Ausdruck oder eine Bilddatei genügt nicht.</blockquote>
<h2 id="checkliste">Checkliste für die Umstellung</h2>
<ul>
<li>Empfangsweg festlegen (zentrale E-Mail-Adresse oder Portal)</li>
<li>Software auf XRechnung/ZUGFeRD prüfen und Visualisierung testen</li>
<li>Archivierung im Originalformat sicherstellen</li>
<li>Verfahrensdokumentation aktualisieren</li>
<li>Mit der Steuerkanzlei die Übergabe klären</li>
</ul>
<p><em>Hinweis: Dieser Beitrag gibt den Stand September 2026 wieder und ersetzt keine steuerliche Beratung.</em></p>`,
  },
  {
    slug: "gobd-in-der-praxis",
    title: "GoBD in der Praxis: Verfahrensdokumentation, Aufbewahrungsfristen und typische Fehler",
    excerpt:
      "Was die GoBD im Alltag bedeuten, welche Fristen seit dem Bürokratieentlastungsgesetz gelten und wo Betriebsprüfer genau hinsehen.",
    category_tag: "GoBD",
    related_software_id: "sw-docuware",
    read_time_minutes: 8,
    published_date: "2026-03-24",
    updated_date: "2026-08-12",
    author: "buchhaltung",
    content: `
<p>Die GoBD, also die Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form sowie zum Datenzugriff, regeln, wie Unternehmen ihre Buchführung digital organisieren müssen. Software kann dabei helfen, entbindet aber nicht von der Verantwortung.</p>
<h2 id="grundsaetze">Die Grundsätze in Kürze</h2>
<ul>
<li><strong>Nachvollziehbarkeit und Nachprüfbarkeit:</strong> Jeder Geschäftsvorfall muss sich vom Beleg bis zur Buchung verfolgen lassen.</li>
<li><strong>Vollständigkeit und Richtigkeit:</strong> Alle Vorgänge werden lückenlos erfasst.</li>
<li><strong>Zeitgerechte Buchung:</strong> Kasseneinnahmen und -ausgaben täglich, unbare Vorgänge zeitnah.</li>
<li><strong>Unveränderbarkeit:</strong> Änderungen müssen protokolliert werden, der ursprüngliche Inhalt bleibt erkennbar.</li>
</ul>
<h2 id="fristen">Aufbewahrungsfristen</h2>
<p>Mit dem Vierten Bürokratieentlastungsgesetz wurde die Aufbewahrungsfrist für Buchungsbelege von zehn auf <strong>acht Jahre</strong> verkürzt. Bücher, Jahresabschlüsse und Inventare sind weiterhin <strong>zehn Jahre</strong> aufzubewahren, Handels- und Geschäftsbriefe sechs Jahre. Die Frist beginnt jeweils mit dem Schluss des Kalenderjahres.</p>
<h2 id="verfahrensdokumentation">Die Verfahrensdokumentation</h2>
<p>Die Verfahrensdokumentation beschreibt, wie Belege in Ihrem Unternehmen entstehen, erfasst, verarbeitet und archiviert werden. Sie besteht typischerweise aus einer allgemeinen Beschreibung, einer Anwenderdokumentation, einer technischen Systemdokumentation und einer Betriebsdokumentation. Viele Softwareanbieter stellen Muster bereit. Anpassen müssen Sie diese dennoch an Ihre tatsächlichen Abläufe.</p>
<h2 id="fehler">Typische Fehler</h2>
<ol>
<li>Belege werden gescannt und das Papier vernichtet, ohne dass ein ersetzendes Scannen dokumentiert ist.</li>
<li>E-Rechnungen werden nur als PDF-Ausdruck abgelegt statt im Originalformat.</li>
<li>Die Kasse erlaubt nachträgliche Änderungen ohne Protokoll.</li>
<li>Es gibt keine oder eine veraltete Verfahrensdokumentation.</li>
<li>Archivierte Daten sind bei einem Systemwechsel nicht mehr lesbar.</li>
</ol>
<h2 id="software">Wie Software hilft</h2>
<p>GoBD-konforme Buchhaltungsprogramme schreiben Buchungen fest und protokollieren Änderungen. Ein revisionssicheres Dokumentenmanagement-System überwacht Aufbewahrungsfristen und stellt den Datenzugriff für Betriebsprüfer bereit. Achten Sie auf ein Prüftestat nach IDW PS 880 oder vergleichbare Nachweise.</p>
<p><em>Hinweis: Dieser Beitrag ersetzt keine steuerliche Beratung.</em></p>`,
  },
  {
    slug: "lohnabrechnung-selbst-machen-oder-kanzlei",
    title: "Lohnabrechnung selbst machen oder an die Kanzlei geben? Eine Entscheidungshilfe",
    excerpt:
      "Kosten, Aufwand, Haftung: Wann sich die eigene Lohnbuchhaltung lohnt und wann die Kanzlei oder ein Lohnbüro die bessere Wahl ist.",
    category_tag: "Lohn",
    related_software_id: "sw-lexware-lohn-gehalt",
    read_time_minutes: 7,
    published_date: "2026-04-08",
    updated_date: "2026-07-30",
    author: "hr",
    content: `
<p>Die Entgeltabrechnung gehört zu den fehleranfälligsten Aufgaben im Unternehmen. Lohnsteuer, Sozialversicherung, Meldewesen und laufende Gesetzesänderungen verlangen Fachwissen und Sorgfalt. Die Frage, ob Sie die Abrechnung selbst übernehmen, ist deshalb vor allem eine Frage der Ressourcen.</p>
<h2 id="aufgaben">Was zur Lohnabrechnung gehört</h2>
<ul>
<li>ELStAM-Abruf beim Bundeszentralamt für Steuern</li>
<li>Monatliche Entgeltabrechnung inklusive Zuschlägen und Sachbezügen</li>
<li>Lohnsteueranmeldung bis zum 10. des Folgemonats</li>
<li>Beitragsnachweise an die Krankenkassen</li>
<li>DEÜV-Meldungen bei Ein- und Austritten sowie Jahresmeldungen</li>
<li>Jährliche Lohnsteuerbescheinigungen</li>
<li>Umlageanträge U1/U2 und Meldungen an die Berufsgenossenschaft</li>
</ul>
<h2 id="selbst">Wann sich die eigene Abrechnung lohnt</h2>
<p>Ab etwa 15 bis 20 Mitarbeitenden mit überschaubaren Konstellationen kann eine eigene Lohnsoftware wirtschaftlich sein. Voraussetzung ist eine Person mit Lohn-Know-how und Vertretung für Urlaub und Krankheit. Programme wie Lexware lohn+gehalt führen durch die Monatsabrechnung.</p>
<h2 id="kanzlei">Wann die Kanzlei die bessere Wahl ist</h2>
<p>Bei wenigen Mitarbeitenden, komplexen Fällen (Baulohn, Kurzarbeit, Entsendungen) oder fehlender Vertretung ist die Kanzlei meist sicherer. Moderne HR-Systeme wie Personio übernehmen dann die <strong>vorbereitende Lohnabrechnung</strong>: Stammdaten und Abwesenheiten werden gesammelt und per DATEV-Schnittstelle übergeben.</p>
<h2 id="kosten">Kostenvergleich</h2>
<p>Kanzleien und Lohnbüros rechnen meist pro Abrechnung ab. Dem stehen bei der eigenen Abrechnung Softwarekosten, Arbeitszeit und Schulungen gegenüber. Vergessen Sie nicht die Kosten von Fehlern: Säumniszuschläge oder Nachforderungen nach einer Betriebsprüfung können teuer werden.</p>
<h2 id="fazit">Fazit</h2>
<p>Für die meisten kleinen Unternehmen ist die Kombination aus HR-Software für die Datenerfassung und Kanzlei für die Abrechnung der pragmatischste Weg. Wer wächst und Lohn-Know-how im Haus hat, kann später auf eine eigene Lohnsoftware umsteigen.</p>`,
  },
  {
    slug: "datev-schnittstelle-softwareauswahl",
    title: "DATEV-Schnittstelle: Warum sie bei der Softwareauswahl den Ausschlag gibt",
    excerpt:
      "DATEV-Export, DATEVconnect, Unternehmen online: Was die verschiedenen Schnittstellen bedeuten und wie Sie Ihre Kanzlei richtig einbinden.",
    category_tag: "DATEV",
    related_software_id: "sw-datev-unternehmen-online",
    read_time_minutes: 6,
    published_date: "2026-04-29",
    updated_date: "2026-08-05",
    author: "buchhaltung",
    content: `
<p>Kaum eine Frage wird bei der Auswahl von Buchhaltungs-, ERP- oder HR-Software so oft gestellt wie diese: „Gibt es eine DATEV-Schnittstelle?“ Der Grund ist einfach: Die überwiegende Mehrheit der Steuerkanzleien in Deutschland arbeitet mit DATEV.</p>
<h2 id="arten">Nicht jede Schnittstelle ist gleich</h2>
<h3>DATEV-Export (Buchungsstapel)</h3>
<p>Die Software erzeugt eine Datei im DATEV-Format, die die Kanzlei importiert. Das funktioniert zuverlässig, ist aber ein manueller Schritt. Achten Sie darauf, dass auch Belegbilder übergeben werden.</p>
<h3>Direkte Übertragung an DATEV Unternehmen online</h3>
<p>Belege und Buchungsdaten werden über eine zertifizierte Schnittstelle direkt in das DATEV-Rechenzentrum übertragen. Die Kanzlei findet alles an einem Ort, ganz ohne Dateiaustausch.</p>
<h3>Vollintegration</h3>
<p>DATEV-eigene Produkte wie Unternehmen online oder DATEV Lohn und Gehalt arbeiten direkt auf derselben Datenbasis wie die Kanzlei.</p>
<h2 id="marktplatz">Der DATEV-Marktplatz</h2>
<p>Anbieter, deren Schnittstelle von DATEV geprüft wurde, sind im DATEV-Marktplatz gelistet. Das ist ein gutes Indiz für eine stabile Anbindung.</p>
<h2 id="fragen">Diese Fragen sollten Sie Ihrer Kanzlei stellen</h2>
<ul>
<li>Welche Übergabe bevorzugen Sie: Export-Datei oder Unternehmen online?</li>
<li>Arbeiten Sie mit SKR&nbsp;03 oder SKR&nbsp;04?</li>
<li>Wie oft möchten Sie Daten erhalten, monatlich oder quartalsweise?</li>
<li>Sollen Belege digital übergeben werden, und in welchem Format?</li>
</ul>
<p>Auf Softwarenavi können Sie das Software-Verzeichnis nach der DATEV-Schnittstelle filtern.</p>`,
  },
  {
    slug: "arbeitszeiterfassung-bag-beschluss",
    title: "Arbeitszeiterfassung: Was der BAG-Beschluss für Ihre Softwareauswahl bedeutet",
    excerpt:
      "Seit dem Beschluss des Bundesarbeitsgerichts von 2022 besteht eine Pflicht zur Arbeitszeiterfassung. Was gilt, was noch offen ist und worauf Sie bei Software achten.",
    category_tag: "Zeiterfassung",
    related_software_id: "sw-clockodo",
    read_time_minutes: 6,
    published_date: "2026-05-19",
    updated_date: "2026-09-05",
    author: "hr",
    content: `
<p>Mit seinem Beschluss vom 13. September 2022 (1&nbsp;ABR&nbsp;22/21) hat das Bundesarbeitsgericht klargestellt: Arbeitgeber in Deutschland sind verpflichtet, ein System einzuführen, mit dem die Arbeitszeit der Beschäftigten erfasst wird. Das Gericht stützte sich dabei auf § 3 Abs. 2 Nr. 1 Arbeitsschutzgesetz in unionsrechtskonformer Auslegung.</p>
<h2 id="was-gilt">Was bereits gilt</h2>
<ul>
<li>Beginn, Ende und Dauer der täglichen Arbeitszeit sind zu erfassen.</li>
<li>Die Pflicht gilt grundsätzlich für alle Arbeitnehmerinnen und Arbeitnehmer.</li>
<li>Die Erfassung kann an Beschäftigte delegiert werden. Die Verantwortung bleibt beim Arbeitgeber.</li>
</ul>
<h2 id="offen">Was noch offen ist</h2>
<p>Eine gesetzliche Neuregelung im Arbeitszeitgesetz, die Form und Ausnahmen konkretisiert, war zum Redaktionsschluss noch nicht in Kraft. Diskutiert werden insbesondere die elektronische Erfassung als Regelfall und Übergangsfristen für kleine Betriebe. Prüfen Sie deshalb den aktuellen Stand, bevor Sie eine Lösung einführen.</p>
<h2 id="software">Worauf Sie bei der Software achten sollten</h2>
<ol>
<li><strong>Manipulationsschutz:</strong> Änderungen müssen protokolliert werden.</li>
<li><strong>ArbZG-Prüfung:</strong> Warnungen bei fehlenden Pausen oder Überschreitung der Höchstarbeitszeit.</li>
<li><strong>Mehrere Erfassungswege:</strong> App, Browser oder Terminal, je nach Arbeitsplatz.</li>
<li><strong>Lohnexport:</strong> Übergabe von Stunden und Zuschlägen an die Lohnabrechnung.</li>
<li><strong>Datenschutz:</strong> AV-Vertrag, klare Löschfristen und, falls vorhanden, die Einbindung des Betriebsrats.</li>
</ol>
<blockquote>Eine Zeiterfassung ist eine technische Einrichtung im Sinne des § 87 Abs. 1 Nr. 6 BetrVG. Gibt es einen Betriebsrat, ist er bei der Ausgestaltung zu beteiligen.</blockquote>
<p><em>Hinweis: Dieser Beitrag ersetzt keine Rechtsberatung.</em></p>`,
  },
  {
    slug: "hr-software-und-betriebsrat",
    title: "HR-Software und Betriebsrat: Mitbestimmung nach § 87 BetrVG richtig einplanen",
    excerpt:
      "Warum der Betriebsrat bei der Einführung von HR-Software mitbestimmt, wie eine Betriebsvereinbarung aussieht und wie Sie Verzögerungen vermeiden.",
    category_tag: "HR",
    related_software_id: "sw-personio",
    read_time_minutes: 7,
    published_date: "2026-06-11",
    updated_date: "2026-08-18",
    author: "hr",
    content: `
<p>Wer in einem Unternehmen mit Betriebsrat eine HR-Software einführt, muss die Mitbestimmung von Anfang an einplanen. Nach § 87 Abs. 1 Nr. 6 BetrVG hat der Betriebsrat mitzubestimmen bei der Einführung und Anwendung technischer Einrichtungen, die dazu <em>geeignet</em> sind, das Verhalten oder die Leistung der Beschäftigten zu überwachen. Auf eine Überwachungsabsicht kommt es nicht an.</p>
<h2 id="warum">Warum fast jede HR-Software betroffen ist</h2>
<p>Abwesenheiten, Arbeitszeiten, Zielvereinbarungen, Zugriffsprotokolle: Moderne HR-Systeme verarbeiten zahlreiche Daten, aus denen Rückschlüsse auf Verhalten oder Leistung möglich sind. Damit ist die Mitbestimmung praktisch immer ausgelöst.</p>
<h2 id="betriebsvereinbarung">Inhalte einer Betriebsvereinbarung</h2>
<ul>
<li>Zweck und Umfang der Software, eingesetzte Module</li>
<li>Verarbeitete Datenkategorien und Zugriffsrechte</li>
<li>Ausschluss von Leistungs- und Verhaltenskontrollen (oder deren Grenzen)</li>
<li>Auswertungen und Berichte, die zulässig sind</li>
<li>Löschfristen und Protokollierung</li>
<li>Verfahren bei Änderungen und neuen Modulen</li>
</ul>
<h2 id="praxis">Praxistipps</h2>
<ol>
<li>Binden Sie den Betriebsrat bereits bei der Anbieterauswahl ein.</li>
<li>Fragen Sie Anbieter nach Muster-Betriebsvereinbarungen und Rollenkonzepten.</li>
<li>Planen Sie eine Testphase mit echten Anwendungsfällen.</li>
<li>Stimmen Sie sich parallel mit der oder dem Datenschutzbeauftragten ab.</li>
</ol>
<h2 id="software">Worauf Sie bei der Software achten</h2>
<p>Ein feingranulares Rollen- und Rechtekonzept, konfigurierbare Löschfristen und eine transparente Protokollierung erleichtern die Verhandlung erheblich. Anbieter mit viel Erfahrung im deutschen Mittelstand, etwa Personio, HRworks oder rexx systems, kennen die typischen Fragen und liefern entsprechende Unterlagen.</p>
<p><em>Hinweis: Dieser Beitrag ersetzt keine Rechtsberatung.</em></p>`,
  },
  {
    slug: "serverstandort-deutschland-oder-eu",
    title: "Serverstandort Deutschland: Wann er zählt und wann EU-Hosting genügt",
    excerpt:
      "DSGVO, Drittlandübermittlung, EU-US Data Privacy Framework: Was der Serverstandort rechtlich bedeutet und wann „Hosting in Deutschland“ ein echter Vorteil ist.",
    category_tag: "Datenschutz",
    related_software_id: "sw-stackfield",
    read_time_minutes: 7,
    published_date: "2026-07-02",
    updated_date: "2026-09-08",
    author: "it",
    featured: true,
    content: `
<p>„Serverstandort Deutschland“ ist eines der häufigsten Verkaufsargumente deutscher Softwareanbieter. Rechtlich schreibt die DSGVO aber keinen deutschen Serverstandort vor. Entscheidend ist, ob personenbezogene Daten den Europäischen Wirtschaftsraum verlassen.</p>
<h2 id="eu">Hosting in der EU: rechtlich gleichwertig</h2>
<p>Innerhalb der EU und des EWR gilt dasselbe Datenschutzniveau. Ein Rechenzentrum in Frankfurt ist aus Sicht der DSGVO nicht „sicherer“ als eines in Amsterdam oder Dublin. Voraussetzung in beiden Fällen: ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO.</p>
<h2 id="drittland">Drittlandübermittlung</h2>
<p>Werden Daten in ein Land außerhalb des EWR übermittelt oder hat ein Anbieter von dort aus Zugriff, gelten die Art. 44&nbsp;ff. DSGVO. Für die USA existiert seit Juli 2023 das EU-US Data Privacy Framework; zertifizierte Unternehmen gelten als angemessen. Alternativ kommen Standardvertragsklauseln mit einer Transfer-Folgenabschätzung in Betracht.</p>
<h2 id="wann">Wann Deutschland trotzdem zählt</h2>
<ul>
<li><strong>Berufsgeheimnisträger</strong> wie Kanzleien, Ärztinnen und Ärzte haben zusätzliche Anforderungen (§ 203 StGB).</li>
<li><strong>Öffentliche Auftraggeber</strong> verlangen häufig Hosting in Deutschland oder BSI-C5-Testate.</li>
<li><strong>Kunden- und Betriebsratsanforderungen</strong> können einen deutschen Standort vertraglich vorgeben.</li>
<li><strong>US-Mutterkonzerne</strong> unterliegen dem CLOUD Act, unabhängig vom Serverstandort. Ein deutscher Anbieter ohne US-Bezug vermeidet dieses Risiko.</li>
</ul>
<h2 id="pruefen">So prüfen Sie Anbieter</h2>
<ol>
<li>Wo stehen die Rechenzentren, und wo sitzen Backup und Support?</li>
<li>Welche Unterauftragsverarbeiter gibt es, und in welchen Ländern?</li>
<li>Gibt es einen AV-Vertrag und aktuelle Zertifikate (ISO 27001, BSI C5)?</li>
<li>Hat eine Konzernmutter außerhalb der EU Zugriffsmöglichkeiten?</li>
</ol>
<p>Im Software-Verzeichnis können Sie nach Serverstandort filtern.</p>
<p><em>Hinweis: Dieser Beitrag ersetzt keine Rechtsberatung.</em></p>`,
  },
  {
    slug: "kleinunternehmerregelung-software",
    title: "Kleinunternehmerregelung nach § 19 UStG: Welche Software reicht aus?",
    excerpt:
      "Neue Grenzen seit 2025, E-Rechnung und EÜR: Was Kleinunternehmer wirklich brauchen und welche Programme ausreichen.",
    category_tag: "Buchhaltung",
    related_software_id: "sw-papierkram",
    read_time_minutes: 5,
    published_date: "2026-08-04",
    updated_date: "2026-09-10",
    author: "buchhaltung",
    content: `
<p>Die Kleinunternehmerregelung nach § 19 UStG befreit kleine Unternehmen von der Umsatzsteuer. Seit dem 1. Januar 2025 gelten neue Grenzen und ein neues Verfahren. Auch die E-Rechnung spielt dabei eine Rolle.</p>
<h2 id="grenzen">Die Grenzen seit 2025</h2>
<ul>
<li>Umsatz im <strong>Vorjahr</strong> höchstens 25.000&nbsp;€</li>
<li>Umsatz im <strong>laufenden Jahr</strong> höchstens 100.000&nbsp;€</li>
</ul>
<p>Wird die Grenze von 100.000&nbsp;€ im laufenden Jahr überschritten, entfällt die Regelung ab dem Umsatz, mit dem die Grenze überschritten wird. Eine Software, die den Jahresumsatz laufend anzeigt, hilft, diesen Moment nicht zu verpassen.</p>
<h2 id="e-rechnung">E-Rechnung für Kleinunternehmer</h2>
<p>Kleinunternehmer müssen E-Rechnungen <strong>empfangen</strong> können, sind aber von der Pflicht zur Ausstellung ausgenommen. Eine einfache Lösung, die ZUGFeRD- und XRechnung-Dateien lesbar darstellt und archiviert, genügt.</p>
<h2 id="software">Welche Software reicht?</h2>
<p>Für die meisten Kleinunternehmer genügt ein Programm mit:</p>
<ol>
<li>Rechnungsstellung mit dem Hinweis auf die Steuerbefreiung nach § 19 UStG</li>
<li>Belegerfassung und GoBD-konformer Ablage</li>
<li>EÜR inklusive Anlage EÜR</li>
<li>Empfang und Archivierung von E-Rechnungen</li>
</ol>
<p>Programme wie Papierkram bieten dafür eine kostenlose Einstiegsversion; Lexware Office und sevdesk starten mit günstigen Paketen. Eine Umsatzsteuer-Voranmeldung ist für Kleinunternehmer in der Regel nicht erforderlich.</p>
<p><em>Hinweis: Dieser Beitrag ersetzt keine steuerliche Beratung.</em></p>`,
  },
  {
    slug: "sage-software-deutschland-welches-produkt",
    title: "Sage in Deutschland: Welches Produkt passt zu welchem Unternehmen?",
    excerpt:
      "Von Sage Active für kleine Firmen bis Sage 100 für den Mittelstand: Wir ordnen die acht Sage-Lösungen für den deutschen Markt ein, mit aktuellen Nettopreisen und Testmöglichkeiten.",
    category_tag: "Ratgeber",
    related_software_id: "sw-sage-active",
    read_time_minutes: 8,
    published_date: "2026-09-22",
    updated_date: "2026-09-22",
    author: "redaktion",
    featured: true,
    content: `
<p>Sage ist in Deutschland seit Jahrzehnten im Mittelstand verankert, doch das Produktangebot ist breit und die Namen sind nicht immer selbsterklärend. Wer nach „Sage Buchhaltung“ sucht, landet je nach Betriebsgröße bei ganz unterschiedlichen Lösungen. Dieser Überblick ordnet die Produkte ein, die Sage aktuell für den deutschen Markt anbietet. Alle Preise sind Nettopreise laut Sage, Stand 22. September 2026.</p>

<h2 id="kleine-unternehmen">Für kleine Unternehmen und Selbstständige</h2>
<h3>Sage Active</h3>
<p>Die Cloud-Lösung für Angebote, Rechnungen, Buchhaltung und Lohn. Der Tarif Starter für 25 € im Monat deckt Angebote und Rechnungen mit fünf Nutzern ab. Essentials für 49 € ergänzt doppelte Buchführung nach SKR03 oder SKR04, EÜR, Bilanz, Umsatzsteuer-Voranmeldung und die Lohnabrechnung für zwei Mitarbeitende. Beide Tarife lassen sich 30 Tage kostenlos testen. <a href="/software/sage-active">Zur redaktionellen Bewertung von Sage Active</a></p>

<h3>Sage 50</h3>
<p>Der Klassiker für kleine Unternehmen, die Buchhaltung, Auftragsbearbeitung und Warenwirtschaft in einem installierten Programm wollen. Standard kostet 30 € je Arbeitsplatz im Monat, Comfort 35 € und Professional 40 €. Die Testphase dauert 30 Tage, Zahlungsdaten sind nicht nötig. <a href="/software/sage-50-connected">Zur Bewertung von Sage 50</a></p>

<h3>Sage 50 Handwerk</h3>
<p>Die Branchenlösung für Handwerksbetriebe mit Aufmaß, Teil- und Schlussrechnungen, GAEB sowie den Großhändlerschnittstellen IDS und OCI. Essential für einen Benutzer kostet 19,90 €, Enterprise mit unbegrenzten Benutzern 59 € im Monat bei jährlicher Zahlung. <a href="/software/sage-50-handwerk">Zur Bewertung von Sage 50 Handwerk</a></p>

<h2 id="personal">Für Personal und Lohn</h2>
<h3>Sage HR &amp; Payroll</h3>
<p>Personalverwaltung und Lohnabrechnung in einer Cloud. Essentials kostet 40 € im Monat für fünf Mitarbeitende, jede weitere Person ab 7 €. Standard für komplexere Abrechnungen liegt bei 60 €. Essentials lässt sich 30 Tage kostenlos testen. <a href="/software/sage-hr-payroll">Zur Bewertung von Sage HR &amp; Payroll</a></p>

<h3>Sage HR Suite</h3>
<p>Die modulare Lösung für mittlere und große Unternehmen, lokal oder in der Cloud. Personalabrechnung ab 39 €, Zeitmanagement ab 21 € und Bewerbermanagement ab 19 € im Monat, lizenziert in Paketen zu 25 Mitarbeitenden. <a href="/software/sage-hr-suite">Zur Bewertung der Sage HR Suite</a></p>

<h2 id="mittelstand">Für den Mittelstand</h2>
<h3>Sage 100</h3>
<p>Das ERP für Unternehmen, die über Sage 50 hinausgewachsen sind. Die Module Warenwirtschaft ab 56 €, Rechnungswesen ab 58 € und Produktion ab 90 € je Nutzer im Monat lassen sich kombinieren. <a href="/software/sage-100">Zur Bewertung von Sage 100</a></p>

<h3>Sage b7</h3>
<p>Ein ERP für Händler und Fertiger mit komplexen Preis- und Konditionsmodellen und mehreren Standorten. Preise gibt es auf Anfrage. <a href="/software/sage-b7">Zur Bewertung von Sage b7</a></p>

<h3>Sage Sales Management</h3>
<p>Ein CRM für Vertriebsteams mit viel Außendienst, mit offline nutzbarer App. 55 € je Nutzer im Monat, ab fünf Nutzern. <a href="/software/sage-sales-management">Zur Bewertung von Sage Sales Management</a></p>

<h2 id="entscheidung">So treffen Sie die Wahl</h2>
<ul>
<li><strong>Bis zehn Beschäftigte, alles in der Cloud:</strong> Sage Active Essentials.</li>
<li><strong>Kleines Unternehmen mit Lager und installierter Software:</strong> Sage 50.</li>
<li><strong>Handwerksbetrieb:</strong> Sage 50 Handwerk.</li>
<li><strong>HR und Lohn selbst machen:</strong> Sage HR &amp; Payroll.</li>
<li><strong>Mittelstand mit individuellen Prozessen:</strong> Sage 100.</li>
</ul>
<p>Wie sich Sage gegen die bekanntesten Alternativen schlägt, zeigen unsere Vergleiche <a href="/vergleich/sage-50-connected-vs-lexware-office">Sage 50 vs. Lexware Office</a>, <a href="/vergleich/sage-active-vs-sevdesk">Sage Active vs. sevdesk</a> und <a href="/vergleich/sage-hr-payroll-vs-personio">Sage HR &amp; Payroll vs. Personio</a>.</p>
<p><em>Hinweis: Preise laut Hersteller, Stand 22.09.2026, zuzüglich Mehrwertsteuer. Aktionsrabatte für Neukunden sind nicht berücksichtigt.</em></p>`,
  },
];

export const ARTICLES: Article[] = SEED.map((s) => {
  void AUTHORS;
  const { author, featured, ...rest } = s;
  void author;
  return {
    ...rest,
    id: `ar-${s.slug}`,
    content: s.content.trim(),
    featured_image_url: null,
    author_avatar_url: null,
    meta_title: null,
    meta_description: s.excerpt,
    og_image_url: null,
    status: "published" as const,
    featured: featured ?? false,
    author_name: AUTHOR_NAME,
    author_title: AUTHOR_TITLE,
    author_bio: AUTHOR_BIO,
    created_at: `${s.published_date}T08:00:00.000Z`,
    updated_at: `${s.updated_date ?? s.published_date}T08:00:00.000Z`,
  };
});
