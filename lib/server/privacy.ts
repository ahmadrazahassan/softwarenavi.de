import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";

/**
 * Request metadata for the privileged write paths (backend spec §5).
 * A raw IP address is never stored or logged. It is only used to derive a salted SHA-256 pseudonym
 * (spec §5.1). Without IP_HASH_SALT we store no IP-derived value at all rather than an unsalted hash.
 */
export interface ClientMeta {
  ipHash: string | null;
  userAgent: string | null;
  referrer: string | null;
  countryCode: string | null;
}

export function clientMeta(h: Headers): ClientMeta {
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  return {
    ipHash: hashIp(ip),
    userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
    referrer: h.get("referer")?.slice(0, 500) ?? null,
    countryCode: (h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || "").slice(0, 2).toUpperCase() || null,
  };
}

export function hashIp(ip: string): string | null {
  const salt = process.env.IP_HASH_SALT;
  if (!ip || !salt) return null;
  return createHash("sha256").update(`${ip}|${salt}`).digest("hex").slice(0, 32);
}

/** URL-safe random token for double opt-in and unsubscribe links. */
export const randomToken = () => randomBytes(24).toString("base64url");

/**
 * Per-IP-hash rate limit backed by the table the write goes into.
 * Returns true when the caller may proceed. Without an IP hash the limit cannot be applied; honeypots and
 * moderation still protect the forms in that case.
 */
export async function withinRateLimit(table: string, hashColumn: string, ipHash: string | null, max: number, windowMinutes = 60): Promise<boolean> {
  if (!ipHash || !isAdminConfigured()) return true;
  const since = new Date(Date.now() - windowMinutes * 60_000).toISOString();
  const { count, error } = await createAdminClient()
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq(hashColumn, ipHash)
    .gte("created_at", since);
  if (error) return true;
  return (count ?? 0) < max;
}

/** Versions of the consent texts shown next to each form (Art. 7 Abs. 1 DSGVO: prove what was agreed to). */
export const CONSENT_VERSIONS = {
  review: "bewertung-2026-09",
  newsletter: "newsletter-2026-09",
  contact: "kontakt-2026-09",
} as const;
