export const DEFAULT_BRAND_COLOR = "#0E7C86";

/**
 * Slug → vendor accent. The first block is confident. The German-vendor block approximates each
 * vendor's logo colour and is marked for verification: before launch, sample every hex from the
 * vendor's own logo SVG and replace it here (or set `software.brand_color` in the admin).
 */
const BRAND_COLORS: Record<string, string> = {
  // confident
  odoo: "#714B67",
  "zoho-crm": "#F0483E",
  salesforce: "#00A1E0",
  hubspot: "#FF7A59",
  pipedrive: "#017737",
  "monday-com": "#FF3D57",
  asana: "#F06A6A",
  "sap-business-one": "#0070F2",

  // TODO(brand): verify against the vendor's logo SVG before launch
  "datev-unternehmen-online": "#2E8B3D",
  "datev-lohn-und-gehalt": "#2E8B3D",
  "datev-lodas": "#2E8B3D",
  "lexware-office": "#1D63ED",
  "lexware-lohn-gehalt": "#1D63ED",
  sevdesk: "#EE3E4F",
  "sage-active": "#00A15F",
  "sage-50-connected": "#00A15F",
  "sage-hr-payroll": "#00A15F",
  "sage-hr-suite": "#00A15F",
  "sage-100": "#00A15F",
  buchhaltungsbutler: "#2C6BEF",
  fastbill: "#E94E3C",
  papierkram: "#3D9A5B",
  easybill: "#1B75BB",
  scopevisio: "#E30613",
  pennylane: "#1A1446",
  candis: "#1C2B5A",
  edlohn: "#004B87",
  "personio-payroll": "#1C1C1C",
  personio: "#1C1C1C",
  "paychex-deutschland": "#004B8D",
  hrworks: "#E4003A",
  "rexx-systems": "#B2002D",
  factorial: "#E51943",
  kenjo: "#2B67F6",
  softgarden: "#009A4E",
  centralstationcrm: "#2C8FD6",
  "cas-genesisworld": "#E2001A",
  "dynamics-365-sales": "#0B53CE",
  "dynamics-365-business-central": "#008575",
  weclapp: "#0096D6",
  xentral: "#5F3BF6",
  myfactory: "#E2001A",
  "haufe-x360": "#D7000F",
  awork: "#5A4BFF",
  factro: "#F39200",
  stackfield: "#3B5BDB",
  openproject: "#1A67A3",
  inloox: "#0072C6",
  meistertask: "#2A9CE8",
  clockodo: "#0C7BDC",
  papershift: "#15B7AE",
  zep: "#004E9E",
  timetac: "#E4032E",
  crewmeister: "#0DBE8B",
  docuware: "#0063AF",
  "d-velop-documents": "#E30613",
  ecodms: "#6E9B00",
  elo: "#009DE0",
};

export function brandColorFor(
  s: { slug?: string | null; brand_color?: string | null } | null | undefined,
  fallback: string = DEFAULT_BRAND_COLOR,
) {
  if (!s) return fallback;
  if (s.brand_color && /^#[0-9a-f]{3,8}$/i.test(s.brand_color)) return s.brand_color;
  if (s.slug && BRAND_COLORS[s.slug]) return BRAND_COLORS[s.slug];
  return fallback;
}

/** Readable text colour (dark or white) on a given accent, by relative luminance. */
export function readableOn(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.45 ? "#111827" : "#ffffff";
}
