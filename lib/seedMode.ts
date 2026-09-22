/** Seed reviews (SEED_REVIEWS=true) are test data: available locally and on previews, never on Vercel Production. */
export const seedReviewsEnabled = () => process.env.SEED_REVIEWS === "true" && process.env.VERCEL_ENV !== "production";
