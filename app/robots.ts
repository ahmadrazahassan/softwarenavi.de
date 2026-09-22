import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { seedReviewsEnabled } from "@/lib/seedMode";

export default function robots(): MetadataRoute.Robots {
  if (seedReviewsEnabled()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/track-click", "/suche", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
