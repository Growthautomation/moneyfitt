import Link from "next/link";
import ChatSummary from "./chat-summary";
import { createClient } from "@/lib/supabase/server";
import { callGPT4 } from "@/lib/utils";
import { SUMMARY_PROMPT } from "@/lib/prompts";

export default async function ChatSummaryContainer({
  advisors,
  selectedAdvisor,
  user,
}) {
  const supabase = createClient();

  // Fetch all messages between the user and the selected advisor, ordered by ID
  const { data: messages } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user.id},recipient.eq.${selectedAdvisor?.id}),and(sender.eq.${selectedAdvisor?.id},recipient.eq.${user.id})`
    )
    .order("id", { ascending: true });

  // Fetch the last conversation summary between the user and the advisor
  const { data: lastSummary } = await supabase
    .from("conversation_summaries")
    .select()
    .eq("client_id", user.id)
    .eq("advisor_id", selectedAdvisor.id)
    .single();

  // Determine the ID of the last message included in the summary
  const lastSummarizedMessageId = lastSummary?.last_message_id || 0;

  // Filter messages that have not been summarized yet
  const newMessages = messages.filter(
    (message) => message.id > lastSummarizedMessageId
  );

  let summaryData = lastSummary?.summary;

  // Check if there are new messages to summarize
  if (newMessages.length > 0) {
    // Prepare the conversation string
    const conversation = messages
      .map((msg) => `${msg.sender === user.id ? "User" : "Advisor"}: ${msg.message}`)
      .join("\n");

    // Prepare the prompt with the conversation and user data
    const prompt = SUMMARY_PROMPT
      .replace("{{CONVERSATION}}", conversation)
      .replace("{{USER}}", JSON.stringify(user));

    // Call GPT-4 to generate a new summary
    const newSummaryText = await callGPT4(prompt, "");

    // Parse the GPT-4 response
    summaryData = parseSummaryResponse(newSummaryText);

    // Upsert the new summary into the database
    await supabase.from("conversation_summaries").upsert({
      client_id: user.id,
      advisor_id: selectedAdvisor.id,
      summary: summaryData,
      last_message_id: messages[messages.length - 1].id,
    });
  }

  return (
    <div className="text-sm max-w-4xl mx-auto p-4 font-['Fira_Sans'] text-[#222222]">
      {/* Tabs to switch between advisors */}
      <div className="flex mb-6 border-b border-[#ECF0F3]">
        {advisors.map((advisor) => (
          <Link
            key={advisor.id}
            href={{
              pathname: `/home`,
              query: { advisorId: advisor.id },
            }}
            className={`px-4 py-2 text-lg ${
              selectedAdvisor.id === advisor.id
                ? "text-[#5C59E4] border-b-2 border-[#5C59E4]"
                : "text-[#9CABC2]"
            }`}
          >
            {`${advisor.first_name} ${advisor.last_name}`}
          </Link>
        ))}
      </div>

      {/* Render the ChatSummary component with the latest summary data */}
      <ChatSummary
        quickSummary={summaryData?.quickSummary || ""}
        mainPoints={summaryData?.mainPoints || []}
        services={summaryData?.servicesOffered || []}
        analysis={summaryData?.analysis || ""}
      />

      {/* Disclaimer */}
      <p className="mt-8 text-sm italic text-[#9CABC2]">
        Disclaimer: This summary is for informational purposes only and does not
        constitute financial advice.
      </p>
    </div>
  );
}

function parseSummaryResponse(response: string) {
  const summary = {
    quickSummary: "",
    mainPoints: [],
    servicesOffered: [],
    analysis: "",
  };

  const summaryMatch = response.match(/<summary>([\s\S]*?)<\/summary>/);
  if (summaryMatch) summary.quickSummary = summaryMatch[1].trim();

  const mainPointsMatch = response.match(/<main_points>([\s\S]*?)<\/main_points>/);
  if (mainPointsMatch) {
    summary.mainPoints = mainPointsMatch[1]
      .split("\n")
      .map((point) => point.trim())
      .filter((point) => point.startsWith("-"))
      .map((point) => point.slice(1).trim());
  }

  const servicesMatch = response.match(/<services_offered>([\s\S]*?)<\/services_offered>/);
  if (servicesMatch) {
    summary.servicesOffered = servicesMatch[1]
      .split("\n")
      .map((service) => service.trim())
      .filter((service) => service.startsWith("-"))
      .map((service) => service.slice(1).trim());
  }

  const analysisMatch = response.match(/<analysis>([\s\S]*?)<\/analysis>/);
  if (analysisMatch) summary.analysis = analysisMatch[1].trim();

  return summary;
}