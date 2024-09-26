import { createClient } from "@/lib/supabase/server";
import Chat from "../chat/chat-container";
import UserInfoCard from "./client-info";

export default async function ClientDashboard({ client }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: messages } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user?.id},recipient.eq.${client.id}),and(sender.eq.${client.id},recipient.eq.${user?.id})`
    );

  return (
    <div className="flex w-full gap-10">
      <Chat
        messages={messages ?? []}
        recipentId={client.id}
        recipentName={client.name}
      />
      <UserInfoCard client={client} />
    </div>
  );
}
