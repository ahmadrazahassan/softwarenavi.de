import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSoftwareBySlug } from "@/lib/supabase/queries";
import { formatCount, formatRating } from "@/lib/utils/format";
import { seedReviewsEnabled } from "@/lib/seedMode";

/**
 * Dynamic OpenGraph image, 1200×630. Bundles General Sans (full Latin incl. ä ö ü ß) so umlauts render
 * from a real font rather than the default. Node runtime: Next 16 reads bundled fonts with fs.
 */
export const runtime = "nodejs";

const fontDir = join(process.cwd(), "assets", "fonts");
const fonts = Promise.all([readFile(join(fontDir, "GeneralSans-Medium.ttf")), readFile(join(fontDir, "GeneralSans-Regular.ttf"))]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const title = searchParams.get("title");
  const software = slug ? await getSoftwareBySlug(slug) : null;
  const accent = "#B4ADF5";
  const [medium, regular] = await fonts;

  const heading = software?.name ?? title ?? "Unternehmenssoftware unabhängig vergleichen";
  const sub = software?.tagline ?? (title ? "Softwarenavi" : "Buchhaltung, Lohnabrechnung, HR, CRM und ERP. Geprüft für den deutschen Mittelstand.");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#F4F3EF",
          fontFamily: "GeneralSans",
          color: "#15131E",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: accent,
            opacity: 0.55,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="52" height="52" viewBox="0 0 64 64">
            <path d="M50 12H27C18 12 12 16 12 23S18 34 27 34h10c9 0 15 4 15 11s-6 11-15 11H14" fill="none" stroke="#15131E" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="12" r="5" fill="#5B4FE0" />
          </svg>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 500 }}>
            <span>Software</span>
            <span style={{ color: "#5B4FE0" }}>navi</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 980 }}>
          <div style={{ fontSize: heading.length > 40 ? 64 : 80, fontWeight: 500, lineHeight: 1.05, letterSpacing: -2.5 }}>{heading}</div>
          <div style={{ fontSize: 30, fontWeight: 400, color: "#5F5D6B", lineHeight: 1.35 }}>{sub}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {software ? (
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <svg width="44" height="44" viewBox="0 0 24 24">
                <path d="M12 2.5l2.95 6.1 6.7.9-4.9 4.65 1.2 6.65L12 17.6l-5.95 3.2 1.2-6.65L2.35 9.5l6.7-.9Z" fill="#8A7FFE" />
              </svg>
              <div style={{ display: "flex", fontSize: 40, fontWeight: 500 }}>{formatRating(software.overall_rating)} / 5</div>
              <div style={{ display: "flex", fontSize: 28, fontWeight: 400, color: "#5F5D6B" }}>
                {software.review_count > 0 ? `${formatCount(software.review_count)} ${seedReviewsEnabled() ? "" : "geprüfte "}Bewertungen` : "Redaktionelle Bewertung"}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 28, fontWeight: 400, color: "#5F5D6B" }}>Unabhängig. Geprüft. Deutsch.</div>
          )}
          <div style={{ display: "flex", fontSize: 28, fontWeight: 500, color: "#5B4FE0" }}>softwarenavi.de</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "GeneralSans", data: medium, weight: 500, style: "normal" },
        { name: "GeneralSans", data: regular, weight: 400, style: "normal" },
      ],
      headers: { "cache-control": "public, max-age=86400, s-maxage=86400" },
    },
  );
}
