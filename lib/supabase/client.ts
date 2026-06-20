import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Same Supabase project the normal admin/teacher AMS app points at.
// Drop the two env vars into .env.local and both systems read the
// same academies / students / fees / etc — no separate database,
// no separate setup. Service-role key bypasses RLS since the
// superadmin console operates across all academies, not one.
//
// Typed `any` here (no generated supabase gen types in this repo yet) —
// row shapes are enforced at the call site via lib/queries/types.ts instead.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: SupabaseClient<any, "public", any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function db(): SupabaseClient<any, "public", any> {
  if (!_client) {
    if (!url || !serviceKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — set them in .env.local"
      );
    }
    _client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _client;
}
