/**
 * Inserts soft hyphens (U+00AD) at common German compound boundaries so long words like
 * „Buchhaltungssoftware" or „Kleinunternehmerregelung" can break cleanly even where the browser has
 * no German hyphenation dictionary (e.g. Chrome on Windows). `hyphens: auto` still applies where available.
 */
const STEMS = [
  "software",
  "abrechnung",
  "management",
  "erfassung",
  "wirtschaft",
  "buchhaltung",
  "freiheit",
  "erklärung",
  "bescheinigung",
  "anmeldung",
  "richtlinie",
  "grundsätze",
  "verwaltung",
  "vergleich",
  "plattform",
  "regelung",
  "unternehmer",
  "schnittstelle",
  "standort",
  "dokumentation",
  "archivierung",
  "portal",
];

const RE = new RegExp(`(?<=\\p{L}{3})(?=(?:${STEMS.join("|")}))`, "giu");

export function hy(text: string): string {
  return text.replace(/\p{L}{13,}/gu, (word) => word.replace(RE, "­"));
}
