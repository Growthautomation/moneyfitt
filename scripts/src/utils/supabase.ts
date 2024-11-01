import { createClient } from "@supabase/supabase-js";

export async function createUser(email: string, password: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_KEY || ""
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
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_KEY || ""
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
