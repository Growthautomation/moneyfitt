"use server";

import { v4 as uuid } from "uuid";
import {
  GENERATE_INITIAL_QUESTIONS_PROMPT,
  GENERATE_QUESTIONS_PROMPT,
  SUMMARY_PROMPT,
} from "../prompts";
import { createClient } from "../supabase/server";
import { callGPT4, parseSummaryResponse } from "../utils/llm";
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

  if (suggestion && suggestion?.last_message_id === messages[messages.length - 1]?.id) {
    return (suggestion.suggestions as string[]) || [];
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
  const {error: activitiesErr} = await supabase.from('activities').insert({
    client_id: user.id,
    advisor_id: recipient,
    prompt,
    output: suggestions.join("||"),
    message: 'User created new suggestions'
  })
  if(activitiesErr){
    console.error("client/chat-summary/suggestions: fail to insert activities", activitiesErr);
  }
  return (newSuggestion?.suggestions as string[]) || [];
};

export const getChatSummary = async (advisorId: string) => {
  const supabase = createClient();
  const { data: { user }, error: userError} = await supabase.auth.getUser();
  if(!user){
    console.error("client/chat-summary/summarizer: fail to fetch user", userError);
    throw userError
  }
  const { data: summary, error: summaryError } = await supabase
    .from("conversation_summaries")
    .select()
    .eq("advisor_id", advisorId)
    .eq("client_id", user.id)
    .limit(1)
    .maybeSingle();

  if (summaryError) {
    console.error("client/chat-summary/summarizer: fail to fetch summary", summaryError);
    throw summaryError;
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user.id},recipient.eq.${advisorId}),and(sender.eq.${advisorId},recipient.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  if (!messages) {
    console.error("client/chat-summary/summarizer: fail to fetch messages", messagesError);
    throw messagesError;
  }

  if (
    summary &&
    summary.last_message_id === messages[messages.length - 1]?.id
  ) {
    return summary.summary ?? {}
  }

  const { data: client } = await supabase
    .from("client")
    .select()
    .eq("id", user.id)
    .single();

  const previousSummary = `
        Previous Summary:
        Quick Summary: ${summary?.summary?.["quickSummary"]}
        Main Points: ${(summary?.summary?.["mainPoints"] ?? []).join(", ")}
        Services Offered: ${summary?.summary?.["servicesOffered"].join(", ")}
        Analysis: ${summary?.summary?.["analysis"]}
    `;
  const conversation = messages
    .map(
      (msg) => `${msg.sender === user.id ? "User" : "Advisor"}: ${msg.message}`
    )
    .join("\n");

  const prompt = SUMMARY_PROMPT.replace("{{CONVERSATION}}", conversation)
    .replace(
      "{{USER}}",
      JSON.stringify(getUserAnswerSummary(client?.all_answers))
    )
    .replace("{{PREVIOUS_SUMMARY}}", previousSummary);

  const response = await callGPT4(prompt, "");

  const { data: newSummary, error } = await supabase
    .from("conversation_summaries")
    .upsert({
      id: summary?.id || uuid(),
      advisor_id: advisorId,
      client_id: user.id,
      last_message_id: messages[messages.length - 1]?.id,
      summary: parseSummaryResponse(response),
    })
    .select()
    .single();

  if (error) {
    console.error("client/chat-summary/summarizer: fail to upsert summary", error);
    throw error
  }

  const { error: activitiesErr } = await supabase.from('activities').insert({
    client_id: user.id,
    advisor_id: advisorId,
    prompt,
    output: response,
    message: 'User created new summary'
  })

  if(activitiesErr){
    console.error("client/chat-summary/summarizer: fail to insert activities", activitiesErr);
  }

  return newSummary.summary ?? {}
}