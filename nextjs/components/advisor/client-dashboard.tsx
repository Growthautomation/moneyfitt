import { createClient } from "@/lib/supabase/server";
import Chat from "../chat/chat-container";
import UserInfoCard from "./client-info";

export default async function ClientDashboard({ client }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("client-dashboard: User not authenticated");
    return null; // or handle this case appropriately
  }

  const { data: messages } = await supabase
    .from("messages")
    .select()
    .or(
      `and(sender.eq.${user.id},recipient.eq.${client.id}),and(sender.eq.${client.id},recipient.eq.${user.id})`
    );

  return (
    <div className="flex w-full gap-5">
      <div className="grow">
        <UserInfoCard client={client} />
      </div>
      <div className="grow-1 min-w-[40rem]">
        <Chat
          messages={messages ?? []}
          recipentId={client.id}
          recipentName={client.shared_details ? client.name : `Client`}
        />
      </div>
    </div>
  );
}
