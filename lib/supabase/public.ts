import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** True when the public (RLS-constrained) Supabase credentials are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

let client: SupabaseClient | null = null;

/**
 * Anonymous read client for public data (backend spec §1.2). Row Level Security limits it to published rows.
 * No session, no cookies: safe to use from server components and route handlers alike.
 */
export function createPublicClient(): SupabaseClient {
  if (!isSupabaseConfigured()) throw new Error("Supabase ist nicht konfiguriert (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
