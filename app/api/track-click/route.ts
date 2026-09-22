import { NextResponse } from "next/server";
import { getSoftwareById } from "@/lib/supabase/queries";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { clientMeta } from "@/lib/server/privacy";

/**
 * Affiliate redirect, the single source of truth for vendor URLs (backend spec §5.1).
 * Destination = affiliate_url || vendor_website; without either it falls back to the profile page.
 * Each click is logged pseudonymously in `affiliate_clicks` (salted IP hash, never a raw IP).
 * Logging never blocks or breaks the redirect.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const software = id ? await getSoftwareById(id) : null;
  if (!software) return NextResponse.redirect(new URL("/software", url.origin), 307);

  const destination = software.affiliate_url || software.vendor_website;
  if (!destination || !/^https:\/\//.test(destination)) {
    return NextResponse.redirect(new URL(`/software/${software.slug}`, url.origin), 307);
  }

  if (isAdminConfigured() && /^[0-9a-f-]{36}$/.test(software.id)) {
    const meta = clientMeta(req.headers);
    try {
      await createAdminClient().from("affiliate_clicks").insert({
        software_id: software.id,
        software_name: software.name,
        affiliate_url: destination,
        ip_hash: meta.ipHash,
        user_agent: meta.userAgent,
        referrer: meta.referrer,
        country_code: meta.countryCode,
      });
    } catch {
      /* a lost click row must never cost the visitor the redirect */
    }
  }

  const res = NextResponse.redirect(destination, 307);
  res.headers.set("x-robots-tag", "noindex, nofollow");
  res.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  return res;
}
