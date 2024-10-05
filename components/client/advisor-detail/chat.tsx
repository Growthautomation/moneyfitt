import { Advisor } from "@/types/advisor";
import { User } from "@supabase/supabase-js";
import Chat from "@/components/chat/chat-container";
import { createClient } from "@/lib/supabase/server";
import ComponentError from "@/components/utils/component-error";

interface AdvisorChatProps {
  user: User;
  advisor: Advisor;
}

export default async function AdvisorChat({ user, advisor }: AdvisorChatProps) {
  // TODO: handle pagination
  const supabase = createClient();
  const { data: messages, error } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user.id},recipient.eq.${advisor.id}),and(sender.eq.${advisor.id},recipient.eq.${user.id})`
    )
    .order("created_at", { ascending: false });

  if (!messages) {
    console.error("Error fetching messages:", error);
    return <ComponentError message="Error loading messages" />;
  }
  return (
    <Chat
      messages={messages.reverse()}
      recipentId={advisor.id}
      recipentName={`${advisor.first_name} ${advisor.last_name}`}
      showSuggestion
    />
  );
}
