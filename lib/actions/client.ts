"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { Client } from "@/types/client";

export async function createUserClient(
  data: Omit<Client, "created_at" | "id">
) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      error: error?.message,
    };
  }
  const { error: insertError } = await supabase.from("client").insert({
    ...data,
    id: user.id,
  });

  if (insertError) {
    console.log(insertError);
    return {
      success: false,
      error: insertError.message,
    };
  }

  return redirect("/home");
}
