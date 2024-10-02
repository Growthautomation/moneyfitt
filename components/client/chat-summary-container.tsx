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

  console.log("Starting ChatSummaryContainer function");

  // Fetch all messages between the user and the selected advisor, ordered by ID
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user.id},recipient.eq.${selectedAdvisor?.id}),and(sender.eq.${selectedAdvisor?.id},recipient.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("Error fetching messages:", messagesError);
    return <div>Error loading messages</div>;
  }

  console.log(`Fetched ${messages.length} messages`);

  // Fetch the last conversation summary between the user and the advisor
  const { data: lastSummary, error: summaryError } = await supabase
    .from("conversation_summaries")
    .select()
    .eq("client_id", user.id)
    .eq("advisor_id", selectedAdvisor.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (summaryError && summaryError.code !== 'PGRST116') {
    console.error("Error fetching last summary:", summaryError);
    return <div>Error loading summary</div>;
  }

  console.log("Last summary:", lastSummary);

  let summaryData = lastSummary ? JSON.parse(lastSummary.summary) : null;
  let needNewSummary = false;

  if (!lastSummary) {
    console.log("No previous summary found, creating new one");
    needNewSummary = true;
  } else {
    // Check if there are new messages to summarize
    const lastSummarizedMessageTime = new Date(lastSummary.created_at);
    needNewSummary = messages.some(
      (message) => new Date(message.created_at) > lastSummarizedMessageTime
    );
    console.log(`Need new summary: ${needNewSummary}`);
  }

  // If we need a new summary (no previous summary or new messages), generate one
  if (needNewSummary && messages.length > 0) {
    console.log("Generating new summary");
    const conversation = messages
      .map((msg) => `${msg.sender === user.id ? "User" : "Advisor"}: ${msg.message}`)
      .join("\n");

    // Include the previous summary in the prompt
    let previousSummary = "";
    if (lastSummary) {
      const parsedLastSummary = JSON.parse(lastSummary.summary);
      previousSummary = `
Previous Summary:
Quick Summary: ${parsedLastSummary.quickSummary}
Main Points: ${parsedLastSummary.mainPoints.join(", ")}
Services Offered: ${parsedLastSummary.servicesOffered.join(", ")}
Analysis: ${parsedLastSummary.analysis}
`;
    }

    // Prepare the prompt with the conversation, user data, and previous summary
    const prompt = SUMMARY_PROMPT
      .replace("{{CONVERSATION}}", conversation)
      .replace("{{USER}}", JSON.stringify(user))
      .replace("{{PREVIOUS_SUMMARY}}", previousSummary);

    // Call GPT-4 to generate a new summary
    const newSummaryText = await callGPT4(prompt, "");
    console.log("New summary text:", newSummaryText);

    // Parse the GPT-4 response
    summaryData = parseSummaryResponse(newSummaryText);
    console.log("Parsed summary data:", summaryData);

    // Get the latest message
    const latestMessage = messages[messages.length - 1];

    // Insert the new summary into the database
    const { data, error } = await supabase
      .from("conversation_summaries")
      .insert({
        client_id: user.id,
        advisor_id: selectedAdvisor.id,
        summary: JSON.stringify(summaryData),
        last_message_id: latestMessage.id,
        created_at: latestMessage.created_at,
      })
      .select();

    if (error) {
      console.error("Error inserting summary:", error);
      // Handle the error appropriately, maybe set a state or show a user message
    } else if (data) {
      console.log("Summary inserted successfully:", data);
      // Optionally, update local state or trigger a re-fetch if necessary
    }
  } else {
    console.log("Using existing summary");
  }

  console.log("Final summary data:", summaryData);

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