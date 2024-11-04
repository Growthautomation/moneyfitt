import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xpjrqmknieuxbnpilskz.supabase.co/";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwanJxbWtuaWV1eGJucGlsc2t6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzA2OTA0OSwiZXhwIjoyMDQyNjQ1MDQ5fQ.nGWHOoL6_4EVnTja8dpBUiGDSqAXvsWQYxkBUCghVYQ";

export async function createUser(email: string, password: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL || SUPABASE_URL,
    process.env.SUPABASE_KEY || SUPABASE_KEY
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { userType: "advisor" } },
  });

  if (error) {
    console.error(error);
    throw error.message;
  }

  return data.user;
}

export async function createAdvisor(id: string, attributes: any) {
  const supabase = createClient(
    process.env.SUPABASE_URL || SUPABASE_URL,
    process.env.SUPABASE_KEY || SUPABASE_KEY
  );

  const { data, error } = await supabase
    .from("advisor")
    .insert({ id, ...attributes })
    .single();

  if (error) {
    throw error.message;
  }

  return data;
}
