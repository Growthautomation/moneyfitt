"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

