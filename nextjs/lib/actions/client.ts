"use server";

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { Client } from "@/types/client";
import matchAdvisors from "../matching/match";

export async function createUserClient(
  data: Omit<
    Client,
    | "created_at"
    | "id"
    | "phone_number"
    | "preferred_contact_email"
    | "telegram"
  >
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
  const { data: clientData, error: insertError } = await supabase
    .from("client")
    .insert({
      ...data,
      id: user.id,
    })
    .select()
    .single();

  if (insertError) {
    console.error(insertError);
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
    };
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
    };
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
    };
  }

  await supabase
    .from("matchings")
    .update({ enabled: false })
    .eq("client_id", user.id);

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
  };
}

export async function shareContact(data: FormData) {
  const sharedScope: string[] = [];
  const payload = {} as any;
  if (data.get("advisor_id")) {
    return {
      success: false,
      error: "Advisor ID is missing",
    };
  }
  if (data.get("shareName")) {
    if (!data.get("name")) {
      return {
        success: false,
        error: "Name is required",
      };
    }
    sharedScope.push("name");
    payload.name = data.get("name");
  }

  if (data.get("shareEmail")) {
    if (!data.get("email")) {
      return {
        success: false,
        error: "Email is required",
      };
    }
    sharedScope.push("preferred_contact_email");
    payload.preferred_contact_email = data.get("email");
  }

  if (data.get("sharePhone")) {
    if (!data.get("phone")) {
      return {
        success: false,
        error: "Phone is required",
      };
    }
    sharedScope.push("phone_number");
    payload.phone_number = data.get("phone");
  }

  if (data.get("shareTelegram")) {
    if (!data.get("telegram")) {
      return {
        success: false,
        error: "Telegram is required if selected to share",
      };
    }
    sharedScope.push("telegram");
    payload.telegram = data.get("telegram");
  }

  if (sharedScope.length === 0) {
    return {
      success: false,
      error: "Should share at least one field",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }

  const { data: client, error } = await supabase
    .from("client")
    .select()
    .eq("id", user.id)
    .single();

  if (!client) {
    return {
      success: false,
      error: "Client not found",
    };
  }

  const { error: updVisibilityErr } = await supabase
    .from("matchings")
    .update({
      advisor_visibility: sharedScope,
    })
    .eq("client_id", user.id)
    .eq("enabled", true)
    .eq("advisor_id", data.get("advisorId") || "");

  if (updVisibilityErr) {
    console.error(updVisibilityErr);
    return {
      success: false,
      error: "Error updating visibility",
    };
  }

  const { error: updClientErr } = await supabase
    .from("client")
    .update(payload)
    .eq("id", user.id);

  if (updClientErr) {
    console.error(updClientErr);
    return {
      success: false,
      error: "Error updating client",
    };
  }

  const { error: msgErr } = await supabase.from("messages").insert({
    message: "[SYSTEM]User shared contact info with advisor",
    sender: user.id,
    recipient: (data.get("advisorId") as string) || "",
    files: [],
  });

  if (msgErr) {
    console.error(msgErr);
    return {
      success: false,
      error: "Error sending message",
    };
  }

  const { error: actErr } = await supabase.from("activities").insert({
    client_id: user.id,
    advisor_id: (data.get("advisorId") as string) || "",
    prompt: "",
    output: `scope: ${sharedScope}, payload: ${JSON.stringify(payload)}`,
    message: "User shared contact info with advisor",
  });

  if (actErr) {
    console.error(actErr);
    return {
      success: false,
      error: "Error inserting activity",
    };
  }

  return {
    success: true,
    error: null,
  };
}

export async function updatePreferenceAndMatch(data: FormData) {
  const broadScopes = (data.getAll("broadScope") as string[]) || [];
  const narrowScopes = (data.getAll("narrowScope") as string[]) || [];
  const religions = (data.getAll("religions") as string[]) || [];
  const gender = data.get("gender") as string;
  const languages = (data.getAll("languages") as string[]) || [];
  const age = (data.getAll("age") as string[]) || [];

  const supabase = createClient();
  const {
    data: { user },
    error: usrErr,
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("updatePreferenceAndMatch", usrErr);
    return redirect("/sign-in");
  }
  const { data: client, error: clientErr } = await supabase
    .from("client")
    .update({
      broad_scope: broadScopes,
      narrow_scope: narrowScopes,
      preferred_religion: religions,
      preferred_age_group: age,
      preferred_sex: gender,
      preferred_language: languages,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (clientErr) {
    console.error("updatePreferenceAndMatch", clientErr);
    throw new Error("Failed to update client");
  }

  const { data: advisors, error: advisorErr } = await supabase
  .from("advisor")
  .select("*")
  .not(
    "id",
    "in",
    `(${(await supabase
      .from("matchings")
      .select("advisor_id")
      .eq("client_id", user.id)
      .eq("enabled", true))
      .data?.map(m => `"${m.advisor_id}"`).join(',')})`
  );
  if (!advisors) {
    console.error("updatePreferenceAndMatch", advisorErr);
    throw new Error("No advisors found");
  }

  const matches = matchAdvisors(advisors, client);

  await supabase
    .from("matchings")
    .update({ enabled: false })
    .eq("client_id", user.id);

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
