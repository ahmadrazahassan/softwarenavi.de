import { getSoftwareBySlug } from "@/lib/supabase/queries";
import { brandColorFor } from "@/lib/brandColors";

/**
 * Placeholder product UI mock (SVG) used until real vendor screenshots are uploaded to the
 * `screenshots` storage bucket. Clearly labelled „Beispielansicht" so it is never mistaken for a real screenshot.
 */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "";
  const view = url.searchParams.get("view") ?? "dashboard";
  const s = await getSoftwareBySlug(slug);
  const name = esc(s?.name ?? "Software");
  const c = brandColorFor(s ?? { slug });
  const dark = url.searchParams.get("theme") === "dark";
  const bg = dark ? "#0b0b0e" : "#f6f7f9";
  const panel = dark ? "#18181b" : "#ffffff";
  const line = dark ? "#27272a" : "#e5e7eb";
  const muted = dark ? "#3f3f46" : "#e9ecf1";
  const text = dark ? "#fafafa" : "#111827";

  const bars = [62, 88, 54, 120, 96, 140, 110, 158, 132, 176, 150, 190]
    .map((h, i) => `<rect x="${300 + i * 44}" y="${470 - h}" width="26" height="${h}" rx="6" fill="${c}" opacity="${0.45 + (i % 4) * 0.15}"/>`)
    .join("");
  const rows = Array.from({ length: 7 }, (_, i) => {
    const y = 180 + i * 48;
    return `<rect x="276" y="${y}" width="820" height="40" rx="10" fill="${i % 2 ? panel : bg}"/>
      <rect x="296" y="${y + 14}" width="${120 + ((i * 37) % 90)}" height="12" rx="6" fill="${muted}"/>
      <rect x="560" y="${y + 14}" width="90" height="12" rx="6" fill="${muted}"/>
      <rect x="760" y="${y + 14}" width="70" height="12" rx="6" fill="${muted}"/>
      <rect x="960" y="${y + 10}" width="96" height="20" rx="10" fill="${c}" opacity="${i % 3 === 0 ? 0.9 : 0.25}"/>`;
  }).join("");

  const body =
    view === "liste"
      ? `<text x="276" y="150" font-size="26" font-weight="800" fill="${text}">Übersicht</text>${rows}`
      : view === "auswertung"
        ? `<text x="276" y="150" font-size="26" font-weight="800" fill="${text}">Auswertungen</text>
           <circle cx="420" cy="360" r="110" fill="none" stroke="${muted}" stroke-width="36"/>
           <circle cx="420" cy="360" r="110" fill="none" stroke="${c}" stroke-width="36" stroke-dasharray="460 700" transform="rotate(-90 420 360)"/>
           <circle cx="420" cy="360" r="110" fill="none" stroke="#F5A623" stroke-width="36" stroke-dasharray="120 700" stroke-dashoffset="-460" transform="rotate(-90 420 360)"/>
           ${[0, 1, 2, 3].map((i) => `<rect x="620" y="${250 + i * 56}" width="440" height="40" rx="10" fill="${bg}"/><rect x="640" y="${264 + i * 56}" width="${260 - i * 40}" height="12" rx="6" fill="${i === 0 ? c : muted}"/>`).join("")}`
        : `<text x="276" y="150" font-size="26" font-weight="800" fill="${text}">Dashboard</text>
           ${[0, 1, 2].map((i) => `<rect x="${276 + i * 280}" y="176" width="260" height="96" rx="16" fill="${bg}"/><rect x="${296 + i * 280}" y="198" width="90" height="10" rx="5" fill="${muted}"/><rect x="${296 + i * 280}" y="222" width="${130 - i * 20}" height="24" rx="8" fill="${i === 0 ? c : text}" opacity="${i === 0 ? 1 : 0.8}"/>`).join("")}
           <rect x="276" y="292" width="820" height="200" rx="16" fill="${bg}"/>${bars}`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 560" font-family="Inter, Arial, sans-serif">
  <rect width="1120" height="560" rx="24" fill="${bg}"/>
  <rect x="0" y="0" width="1120" height="56" rx="24" fill="${panel}"/>
  <rect x="0" y="32" width="1120" height="24" fill="${panel}"/>
  <circle cx="30" cy="28" r="7" fill="#ff5f57"/><circle cx="52" cy="28" r="7" fill="#febc2e"/><circle cx="74" cy="28" r="7" fill="#28c840"/>
  <rect x="380" y="16" width="360" height="24" rx="12" fill="${bg}"/>
  <rect x="24" y="80" width="220" height="456" rx="18" fill="${panel}" stroke="${line}"/>
  <rect x="44" y="102" width="34" height="34" rx="10" fill="${c}"/>
  <text x="90" y="126" font-size="18" font-weight="800" fill="${text}">${name}</text>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="44" y="${166 + i * 44}" width="${i === 0 ? 180 : 140 - (i % 3) * 20}" height="${i === 0 ? 30 : 12}" rx="${i === 0 ? 10 : 6}" fill="${i === 0 ? c : muted}" opacity="${i === 0 ? 0.15 : 1}"/>`).join("")}
  <rect x="256" y="80" width="840" height="456" rx="18" fill="${panel}" stroke="${line}"/>
  ${body}
  <rect x="930" y="500" width="150" height="24" rx="12" fill="${text}" opacity=".7"/>
  <text x="1005" y="517" font-size="12" font-weight="700" fill="${bg}" text-anchor="middle">Beispielansicht</text>
</svg>`;

  return new Response(svg, {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=86400", "x-robots-tag": "noindex" },
  });
}
