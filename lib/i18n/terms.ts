/**
 * UK → DE terminology scrub map. Used by editorial tooling to lint for stray British terms.
 * Order matters: longer phrases first so "HM Revenue & Customs" matches before "HMRC".
 */
export const UK_TO_DE_TERMS: ReadonlyArray<readonly [RegExp, string]> = [
  [/HM Revenue (?:&|and) Customs/gi, "Finanzamt"],
  [/\bHMRC\b/g, "Finanzamt"],
  [/Making Tax Digital|\bMTD\b(?:-ready)?/gi, "ELSTER-Übermittlung"],
  [/VAT returns?/gi, "Umsatzsteuer-Voranmeldung (UStVA)"],
  [/VAT at 20\s?%/gi, "Umsatzsteuer 19 %"],
  [/\bRTI\b(?: submissions?)?/g, "Lohnsteueranmeldung und DEÜV-Meldungen"],
  [/National Insurance(?: \(NI\))?/gi, "Sozialversicherungsbeiträge"],
  [/NI number/gi, "Sozialversicherungsnummer"],
  [/(?:the )?Apprenticeship Levy/gi, "Umlage U1/U2/U3"],
  [/\bP60s?\b/g, "Lohnsteuerbescheinigung"],
  [/\bP45\b/g, "Arbeitsbescheinigung"],
  [/\bPAYE\b/g, "Lohnsteuerabzugsverfahren (ELStAM)"],
  [/pension auto-enrol?ment/gi, "betriebliche Altersvorsorge (bAV)"],
  [/Companies House/gi, "Handelsregister"],
  [/\bICO\b/g, "BfDI / Landesdatenschutzbehörden"],
  [/UK GDPR/gi, "DSGVO"],
  [/\bPECR\b/g, "TDDDG"],
  [/Data Protection Act 2018|DPA 2018/gi, "BDSG"],
  [/Construction Industry Scheme|\bCIS\b/g, "Bauabzugsteuer (§ 48 EStG)"],
  [/chart of accounts/gi, "Kontenrahmen SKR 03 / SKR 04"],
  [/year-end accounts/gi, "Jahresabschluss"],
  [/\baccountant\b/gi, "Steuerberater/-in"],
  [/payroll bureau/gi, "Lohnbüro"],
  [/\bBACS\b|direct debit/gi, "SEPA-Lastschrift"],
  [/London, United Kingdom/gi, "Berlin, Deutschland"],
  [/United Kingdom|\bUK\b/g, "Deutschland"],
  [/stackmatch\.uk/gi, "softwarenavi.de"],
  [/Stack Match/gi, "Softwarenavi"],
  [/en-GB/g, "de-DE"],
  [/en_GB/g, "de_DE"],
  [/\bGBP\b/g, "EUR"],
];

/** Terms that must never appear in user-facing German copy. */
export const FORBIDDEN_UK_TERMS = [
  "HMRC", "Making Tax Digital", "VAT return", "RTI", "National Insurance", "P60", "P45", "PAYE",
  "ICO", "PECR", "UK GDPR", "Companies House", "United Kingdom", "London", "stackmatch", "en-GB", "en_GB", "£",
] as const;

export function scrubUKtoDE(text: string) {
  return UK_TO_DE_TERMS.reduce((acc, [re, de]) => acc.replace(re, de), text);
}

export function findUKTerms(text: string) {
  return FORBIDDEN_UK_TERMS.filter((t) => text.includes(t));
}
