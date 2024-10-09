"use server";

import { Json } from "@/types/database.types";
import {
  GENERATE_INITIAL_QUESTIONS_PROMPT,
  GENERATE_QUESTIONS_PROMPT,
} from "../prompts";
import { createClient } from "../supabase/server";
import { callGPT4 } from "../utils";
import { getUserAnswerSummary } from "../utils/user-answer-summary";

export const sendMessage = async (recipient: string, formData: FormData) => {
  try {
    const supabase = createClient();
    const message = formData.get("message");

    if (typeof message !== "string" || typeof recipient !== "string") {
      throw new Error("Invalid message or recipient");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Authentication failed");
    }

    const insertPayload = {
      message,
      recipient,
      sender: user.id,
      files: [] as string[],
    };

    const file = formData.get("file");

    if (file instanceof File && file?.size > 0) {
      const promises = await Promise.all(
        formData.getAll("file").map((f: File) =>
          supabase.storage
            .from("client-files")
            .upload(`${user.id}/${f.name}`, f, {
              cacheControl: "3600",
              upsert: true,
            })
        )
      );

      if (promises.some((p) => p.error)) {
        console.log(promises);
        throw new Error("Failed to upload files");
      }

      insertPayload.files = promises.map((p) => p.data?.path) as string[];
    }

    const { data, error } = await supabase
      .from("messages")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: error.message };
  }
};

export const getSuggestions = async (recipient: string) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Authentication failed");
  }

  const { data: messages, error } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user?.id},recipient.eq.${recipient}),and(sender.eq.${recipient},recipient.eq.${user?.id})`
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  const { data: suggestion, error: suggestionError } = await supabase
    .from("chat_suggestion")
    .select()
    .eq("client_id", user.id)
    .eq("advisor_id", recipient)
    .limit(1)
    .maybeSingle();

  if (suggestionError) {
    throw suggestionError;
  }

  if (suggestion?.last_message_id === messages[messages.length - 1]?.id) {
    return suggestion.suggestions;
  }
  const { data: client } = await supabase
    .from("client")
    .select()
    .eq("id", user.id)
    .single();

  let prompt = "";

  if (messages && messages.length > 0) {
    // Format the conversation text with speaker identification
    const conversationText = messages
      .map((m) => `${m.sender === user.id ? "User" : "Advisor"}: ${m.message}`)
      .join("\n");

    const userSummary = getUserAnswerSummary(client?.all_answers ?? {});

    prompt = GENERATE_QUESTIONS_PROMPT.replace(
      "{{CONVERSATION}}",
      conversationText
    ).replace("{{USER}}", JSON.stringify(userSummary));
  } else {
    // Generate initial questions using GENERATE_INITIAL_QUESTIONS_PROMPT
    prompt = GENERATE_INITIAL_QUESTIONS_PROMPT.replace(
      "{{USER}}",
      JSON.stringify(client)
    );
  }
  const suggestions = (await callGPT4(prompt, "")).split("||");
  const { data: newSuggestion, error: newSuggestionError } = await supabase
    .from("chat_suggestion")
    .upsert(
      {
        client_id: user.id,
        advisor_id: recipient,
        last_message_id: messages[messages.length - 1]?.id,
        suggestions,
      },
      {
        onConflict: "client_id,advisor_id",
      }
    )
    .select()
    .single();
  if (newSuggestionError) {
    throw newSuggestionError;
  }
  return newSuggestion?.suggestions;
};
