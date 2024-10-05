import { v4 as uuid } from "uuid";
import ComponentError from "@/components/utils/component-error";
import { createClient } from "@/lib/supabase/server";
import SummaryDisplay from "./summary-display";
import { SUMMARY_PROMPT } from "@/lib/prompts";
import { callGPT4 } from "@/lib/utils";
import { parseSummaryResponse } from "./helper";

export default async function Summarizer({ user, selectedAdvisor }) {
  const supabase = createClient();
  const { data: summary, error: summaryError } = await supabase
    .from("conversation_summaries")
    .select()
    .eq("advisor_id", selectedAdvisor)
    .eq("client_id", user.id)
    .maybeSingle();

  if (summaryError) {
    console.error(summaryError);
    return <ComponentError message={"Fail to fetch summary"} />;
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user.id},recipient.eq.${selectedAdvisor}),and(sender.eq.${selectedAdvisor},recipient.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  if (!messages) {
    console.error(messagesError);
    return <ComponentError message={"Fail to fetch messages"} />;
  }

  if (summary && summary.last_message_id === messages[messages.length - 1]?.id) {
    return (
      <SummaryDisplay
        services={summary.summary?.["servicesOffered"] || []}
        mainPoints={summary.summary?.["mainPoints"] || []}
        quickSummary={summary.summary?.["quickSummary"]}
        analysis={summary.summary?.["analysis"]}
      />
    );
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
    .replace("{{USER}}", JSON.stringify(client?.all_answers))
    .replace("{{PREVIOUS_SUMMARY}}", previousSummary);

  const response = await callGPT4(prompt, "");

  const { data: newSummary, error } = await supabase
    .from("conversation_summaries")
    .upsert({
      id: summary?.id || uuid(),
      advisor_id: selectedAdvisor,
      client_id: user.id,
      last_message_id: messages[messages.length - 1]?.id,
      summary: parseSummaryResponse(response),
    })
    .select()
    .single();

  return (
    <SummaryDisplay
      services={newSummary?.summary?.["servicesOffered"] || []}
      mainPoints={newSummary?.summary?.["mainPoints"] || []}
      quickSummary={newSummary?.summary?.["quickSummary"]}
      analysis={newSummary?.summary?.["analysis"]}
    />
  );
}
