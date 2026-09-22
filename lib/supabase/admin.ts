import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** True when the service-role key is present (server only, never NEXT_PUBLIC_). */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let client: SupabaseClient | null = null;

/**
 * Service-role client for privileged writes (backend spec §1.1): review submissions, newsletter, contact,
 * consent log, affiliate clicks. Bypasses RLS, so it must never reach the browser; `server-only` enforces that.
 */
export function createAdminClient(): SupabaseClient {
  if (!isAdminConfigured()) throw new Error("SUPABASE_SERVICE_ROLE_KEY fehlt. Schreibzugriffe sind ohne Service-Role-Schlüssel nicht möglich.");
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
