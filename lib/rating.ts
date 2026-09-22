import type { Software } from "@/lib/types";
import { formatCount } from "@/lib/utils/format";
import { seedReviewsEnabled } from "@/lib/seedMode";

/**
 * Which score a product shows.
 * User reviews win as soon as at least one published review exists; until then the product carries the
 * Redaktionsnote, and every caption says so. The two are never mixed or averaged.
 */
export function withDisplayScores<T extends Software>(s: T): T {
  if (s.review_count > 0 || !s.editorial) return { ...s, rating_source: s.review_count > 0 ? "nutzer" : null };
  const e = s.editorial;
  return {
    ...s,
    rating_source: "redaktion",
    overall_rating: e.rating,
    ease_of_use_rating: e.ease,
    value_for_money_rating: e.value,
    customer_service_rating: e.service,
    functionality_rating: e.functionality,
  };
}

/** „48 Bewertungen" · „Redaktionsnote" */
export function ratingCaption(s: Pick<Software, "review_count" | "rating_source">, long = false): string {
  if (s.rating_source === "redaktion") return long ? "Redaktionelle Bewertung" : "Redaktionsnote";
  return `${formatCount(s.review_count)} ${long && !seedReviewsEnabled() ? "geprüfte " : ""}${s.review_count === 1 ? "Bewertung" : "Bewertungen"}`;
}

/** compact form for tight rows: „(48)" · „Redaktion" */
export function ratingCaptionShort(s: Pick<Software, "review_count" | "rating_source">): string {
  return s.rating_source === "redaktion" ? "Redaktion" : `(${formatCount(s.review_count)})`;
}

/** Ranking key: Bayesian-weighted user rating, or the editorial score while no user reviews exist. */
export function rankScore(s: Pick<Software, "overall_rating" | "review_count" | "rating_source">): number {
  if (s.rating_source === "redaktion") return s.overall_rating;
  const C = 4.0;
  const m = 10;
  return (s.review_count / (s.review_count + m)) * s.overall_rating + (m / (s.review_count + m)) * C;
}

/** German verbal grade for a 1–5 score: „Hervorragend" · „Sehr gut" · „Gut" · „Befriedigend" · „Ausreichend" */
export function ratingWord(r: number): string {
  if (r >= 4.5) return "Hervorragend";
  if (r >= 4.0) return "Sehr gut";
  if (r >= 3.5) return "Gut";
  if (r >= 3.0) return "Befriedigend";
  return "Ausreichend";
}
