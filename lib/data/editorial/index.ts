import type { EditorialReview } from "@/lib/types";
import { ACCOUNTING } from "./accounting";
import { PAYROLL_HR } from "./payroll-hr";
import { CRM_ERP } from "./crm-erp";
import { WORK } from "./work";

/**
 * Redaktionelle Bewertungen. Written by the editorial team on the basis of vendor documentation,
 * the verified price lists (`pricing-verified.ts`) and product research. They are not user reviews and are
 * always shown with their own label, byline and date. Scores: 1.0 to 5.0, one decimal.
 */
export interface EditorialDef {
  /** overall, Bedienung, Preis-Leistung, Service, Funktionsumfang */
  r: [number, number, number, number, number];
  verdict: string;
  sections: [heading: string, paragraphs: string[]][];
}

export const EDITORIAL_AUTHOR = "Nadeem Abbas";
export const EDITORIAL_DATE = "2026-09-22";

const build = (d: EditorialDef): EditorialReview => ({
  rating: d.r[0],
  ease: d.r[1],
  value: d.r[2],
  service: d.r[3],
  functionality: d.r[4],
  verdict: d.verdict,
  body: d.sections.map(([h, ps]) => `<h3>${h}</h3>${ps.map((p) => `<p>${p}</p>`).join("")}`).join(""),
  author: EDITORIAL_AUTHOR,
  tested_at: EDITORIAL_DATE,
});

const ALL: Record<string, EditorialDef> = { ...ACCOUNTING, ...PAYROLL_HR, ...CRM_ERP, ...WORK };

export const EDITORIAL: Record<string, EditorialReview> = Object.fromEntries(Object.entries(ALL).map(([slug, d]) => [slug, build(d)]));
