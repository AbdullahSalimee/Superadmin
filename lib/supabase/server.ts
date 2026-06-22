import { createClient } from "@supabase/supabase-js";

// NEVER prefix with NEXT_PUBLIC_ — this key must never reach the browser
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);
