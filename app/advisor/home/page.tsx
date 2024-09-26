import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";
import ChatList from "@/components/chat/chat-list";
import ClientDashboard from "@/components/client/client-dashboard";
import ChatContextProvider from "@/components/chat/chat-context";

export default async function AgentHome({ searchParams }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/agent/sign-in");
  }

  const { data: clients } = await supabase.from("client").select().limit(6);

  const selectedClient = clients?.find((x) => x.id === searchParams?.clientId);

  return (
    <ChatContextProvider userId={user?.id}>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Your Clients</h2>
            <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
              <div>
                <ChatList
                  clients={clients ?? []}
                  selectedClientId={searchParams?.clientId}
                />
              </div>
              {selectedClient && <ClientDashboard client={selectedClient} />}
            </div>
          </section>
        </main>
      </div>
    </ChatContextProvider>
  );
}
