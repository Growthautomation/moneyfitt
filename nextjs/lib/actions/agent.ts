"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export const createAgent = async (form: FormData) => {
  const supabase = createClient();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const attributes = JSON.parse((form.get("attributes") as string) || "{}");
  const profile = form.get("profile_img") as File;

  // TODO: single transaction for both user and advisor creation
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { userType: "advisor" } },
  });
  if (error) {
    console.error("user creation", error);
    return {
      success: false,
      error: error.message,
    };
  }

  const { data: profileUploaded } = await supabase.storage
    .from("public-files")
    .upload(`${user?.id}/${profile.name}`, profile, {
      cacheControl: "3600",
      upsert: true,
    });

  const { data, error: insertError } = await supabase
    .from("advisor")
    .insert({ id: user?.id, ...attributes, profile_img: profileUploaded?.path })
    .single();
  
  if (insertError) {
    console.error("agent creation", insertError);
    return {
      success: false,
      error: insertError.message,
    };
  }

  return redirect("/agent/chat");
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
