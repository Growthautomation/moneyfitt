"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { Client } from "@/types/client";
import matchAdvisors from "../matching/match";

export async function createUserClient(
  data: Omit<Client, "created_at" | "id">
) {
  // TODO: Clean up this function, add validation, error handling to FE, 
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
  const { data: clientData, error: insertError } = await supabase.from("client").insert({
    ...data,
    id: user.id,
  }).select().single();

  if (insertError) {
    console.log(insertError);
    return {
      success: false,
      error: insertError.message,
    };
  }

  const { data: advisors } = await supabase.from("advisor").select();
  if (!advisors) {
    return {
      success: false,
      error: "No advisors found",
    }
  }

  const matches = matchAdvisors(advisors, clientData);

  for (const match of matches) {
    const { error } = await supabase.from("matchings").insert({
      advisor_id: match.id,
      client_id: user.id,
      need_score: match.needScore,
      personal_score: match.personalScore,
      total_score: match.totalScore,
      enabled: true,
    });
  }

  return redirect("/home");
}

export async function createMatching() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const { data: advisors } = await supabase.from("advisor").select();
  if (!advisors) {
    return {
      success: false,
      error: "No advisors found",
    }
  }
  const { data: client } = await supabase
    .from("client")
    .select()
    .eq("id", user.id)
    .single();
  if (!client) {
    return {
      success: false,
      error: "No client found",
    }
  }

  await supabase.from("matchings").update({enabled: false}).eq("client_id", user.id);

  const matches = matchAdvisors(advisors, client);

  for (const match of matches) {
    const { error } = await supabase.from("matchings").insert({
      advisor_id: match.id,
      client_id: user.id,
      need_score: match.needScore,
      personal_score: match.personalScore,
      total_score: match.totalScore,
      enabled: true,
    });
  }

  return {
    success: true,
  }
  
}
