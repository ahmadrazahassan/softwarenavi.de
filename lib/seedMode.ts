/** Seed reviews (SEED_REVIEWS=true) are generated demo reviews: available locally, previews, and production. */
export const seedReviewsEnabled = () => process.env.SEED_REVIEWS === "true";
