import { createClient } from "@supabase/supabase-js";

export default function useSupabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPERBASE_PROJECT_URL || "",
    process.env.NEXT_PUBLIC_SUPERBASE_API_KEY || ""
  );
  return supabase;
}
