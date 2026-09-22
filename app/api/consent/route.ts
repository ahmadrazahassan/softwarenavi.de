import { NextResponse } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { clientMeta } from "@/lib/server/privacy";

const ACTIONS = new Set(["granted", "denied", "updated", "withdrawn"]);
const CATEGORY_KEYS = new Set(["notwendig", "statistik", "externe_medien"]);

/**
 * TDDDG consent log (Art. 7 Abs. 1 DSGVO: the site must be able to prove what was consented to).
 * Stores the random consent id from the `sl_consent` cookie, the chosen categories, the policy version,
 * a salted IP hash and the user agent. No identity. Retention: 3 years (purge_expired_personal_data).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const b = body as { consent_id?: unknown; categories?: unknown; action?: unknown; policy_version?: unknown };
  const cats = b.categories as Record<string, unknown> | null;
  const catsValid =
    !!cats && typeof cats === "object" && Object.entries(cats).every(([k, v]) => CATEGORY_KEYS.has(k) && typeof v === "boolean");
  if (
    typeof b.consent_id !== "string" ||
    !/^[A-Za-z0-9_-]{8,64}$/.test(b.consent_id) ||
    typeof b.action !== "string" ||
    !ACTIONS.has(b.action) ||
    !catsValid
  ) {
    return NextResponse.json({ error: "Ungültige Einwilligungsdaten." }, { status: 422 });
  }

  if (isAdminConfigured()) {
    const meta = clientMeta(req.headers);
    const { error } = await createAdminClient().from("consent_log").insert({
      consent_id: b.consent_id,
      categories: cats,
      action: b.action,
      policy_version: typeof b.policy_version === "string" ? b.policy_version.slice(0, 40) : null,
      ip_hash: meta.ipHash,
      user_agent: meta.userAgent,
    });
    if (error) return NextResponse.json({ error: "Einwilligung konnte nicht gespeichert werden." }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
