import type { MetadataRoute } from "next";
import { getArticles, getCategories, getPublishedComparisons, getSoftwareList } from "@/lib/supabase/queries";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

const STATIC = [
  "",
  "/software",
  "/kategorien",
  "/vergleich",
  "/ratgeber",
  "/newsletter",
  "/kontakt",
  "/ueber-uns",
  "/impressum",
  "/datenschutz",
  "/cookie-richtlinie",
  "/agb",
  "/affiliate-hinweis",
  "/redaktionelle-grundsaetze",
  "/barrierefreiheit",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [software, categories, comparisons, articles] = await Promise.all([
    getSoftwareList({ perPage: 5000 }),
    getCategories(),
    getPublishedComparisons(),
    getArticles(1, 5000),
  ]);
  const now = new Date();
  return [
    ...STATIC.map((p) => ({ url: `${siteUrl}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: `${siteUrl}/kategorie/${c.slug}`, lastModified: now, priority: 0.8 })),
    ...software.items.flatMap((s) => [
      { url: `${siteUrl}/software/${s.slug}`, lastModified: new Date(s.updated_at), priority: 0.9 },
      { url: `${siteUrl}/software/${s.slug}/bewertungen`, lastModified: new Date(s.updated_at), priority: 0.5 },
      { url: `${siteUrl}/software/${s.slug}/alternativen`, lastModified: new Date(s.updated_at), priority: 0.5 },
    ]),
    ...comparisons.map((c) => ({
      url: `${siteUrl}/vergleich/${c.slug}`,
      lastModified: new Date([c.a.updated_at, c.b.updated_at].sort().reverse()[0]),
      priority: 0.7,
    })),
    ...articles.items.map((a) => ({ url: `${siteUrl}/ratgeber/${a.slug}`, lastModified: new Date(a.updated_at), priority: 0.7 })),
  ];
}
