import { NextResponse } from "next/server";
import { searchContent } from "@/lib/supabase/queries";

/**
 * Full-text search over software, categories and Ratgeber.
 * BACKEND PHASE: `textSearch('search_vector', q, { type: 'websearch', config: 'german' })` with a
 * pg_trgm fallback on `name` (backend §5.8). Response shape stays the same.
 */
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").slice(0, 100);
  const result = await searchContent(q, 8);
  return NextResponse.json(result, { headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } });
}
