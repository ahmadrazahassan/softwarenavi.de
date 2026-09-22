/** Seed reviews (SEED_REVIEWS=true) fill products with generated reviews, including on Vercel Production. */
export const seedReviewsEnabled = () => process.env.SEED_REVIEWS === "true";
