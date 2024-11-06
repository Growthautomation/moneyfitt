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
    )
    .order("created_at", { ascending: false });;

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="lg:w-1/3">
        <UserInfoCard client={client} />
      </div>
      <div className="lg:w-2/3">
        <Chat
          messages={messages?.reverse() ?? []}
          userId={user.id}
          recipentId={client.id}
          recipentName={client.shared_details ? client.name : `Client`}
          systemMessagePostfix="You might need to reload the page to view the details"
        />
      </div>
    </div>
  );
}
