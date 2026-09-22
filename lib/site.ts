export const SITE_NAME = "Softwarenavi";
export const SITE_DOMAIN = "softwarenavi.de";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://softwarenavi.de").replace(/\/$/, "");

/** Drives every „… 2026“ heading — change once per year, not in ten places. */
export const CURRENT_YEAR = 2026;

export const CONTACT_EMAIL = "hallo@softwarenavi.de";
export const EDITORIAL_EMAIL = "hallo@softwarenavi.de";
export const PRESS_EMAIL = "hallo@softwarenavi.de";

export const TAGLINE = "Deutschlands unabhängiges Vergleichsportal für Unternehmenssoftware.";
export const SHORT_TAGLINE = "Unabhängige Software-Vergleiche für den Mittelstand";
export const CLAIM = "Unabhängig. Geprüft. Deutsch.";

/** Version string of the consent texts shown in forms — stored with every consent (Art. 7 Abs. 1 DSGVO). */
export const CONSENT_TEXT_VERSION = "2026-09-v1";
export const COOKIE_POLICY_VERSION = "2026-09-v1";

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

/** Public contact details (full postal address only in the Impressum). */
export const CONTACT_PHONE = "+49 155 10369734";
export const CONTACT_LOCATION = "Neu-Isenburg (bei Frankfurt am Main), Deutschland";
/** Byline used for every article and review: the site is run privately by its founder. */
export const AUTHOR_NAME = "Nadeem Abbas";
export const AUTHOR_TITLE = "Gründer und Autor von Softwarenavi";
export const AUTHOR_BIO =
  "Nadeem Abbas betreibt Softwarenavi als private, unabhängige Website und vergleicht Unternehmenssoftware für den deutschen Markt auf Basis von Herstellerangaben, geprüften Preislisten und Nutzerbewertungen.";
