"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const createAgent = async (form: FormData) => {
  const supabase = createClient();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const name = form.get("name") as string;

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { userType: "advisor" } },
  });
  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  const { data, error: insertError } = await supabase
    .from("advisor")
    .insert({ id: user?.id, email, name })
    .single();
  if (insertError) {
    return {
      success: false,
      error: insertError.message,
    };
  }

  return redirect("/agent/home");
};

export const agentSignIn = async (form: FormData) => {
  const supabase = createClient();
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return redirect("/agent/home");
};
