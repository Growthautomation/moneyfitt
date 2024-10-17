import { Advisor } from "@/types/advisor";
import { User } from "@supabase/supabase-js";
import Chat from "@/components/chat/chat-container";
import { createClient } from "@/lib/supabase/server";
import ComponentError from "@/components/utils/component-error";
import ShareButton from "../share-contact/button";
import InfoDialog from "@/components/client/InfoDialog";

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
    console.error(
      "client/advisor-detail/chat: Error fetching messages:",
      error
    );
    return <ComponentError message="Error loading messages" />;
  }
  return (
    <div className="md:block" id="advisor-chat">
      <div className="m-2 flex justify-between items-center">
        <InfoDialog />
        <ShareButton advisorId={advisor.id} />
      </div>
      <Chat
        messages={messages.reverse()}
        userId={user.id}
        recipentId={advisor.id}
        recipentName={`${advisor.first_name} ${advisor.last_name}`}
        showSuggestion
      />
    </div>
  );
}
