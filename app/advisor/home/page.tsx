import { createClient } from "@/lib/supabase/server";
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

  // Fetch matchings for the current advisor
  const { data: matchings, error: matchingsError } = await supabase
    .from("matchings")
    .select("client_id, shared_details")
    .eq("advisor_id", user.id)
    .eq("enabled", true);

  if (matchingsError) {
    console.error("Error fetching matchings:", matchingsError);
    // Handle the error appropriately
  }

  // Extract client IDs from matchings
  const clientIds = matchings?.map(matching => matching.client_id) || [];

  // Fetch clients based on the matchings
  const { data: clients, error: clientsError } = await supabase
    .from("client")
    .select()
    .in("id", clientIds);

  if (clientsError) {
    console.error("Error fetching clients:", clientsError);
    // Handle the error appropriately
  }

  // Combine client data with shared_details information
  const clientsWithSharedDetails = clients?.map(client => {
    const matching = matchings?.find(m => m.client_id === client.id);
    return {
      ...client,
      shared_details: matching?.shared_details || false
    };
  }) || [];

  const selectedClient = clientsWithSharedDetails.find((x) => x.id === searchParams?.clientId);

  return (
    <ChatContextProvider userId={user?.id}>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Your Clients</h2>
            <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
              <div>
                <ChatList
                  clients={clientsWithSharedDetails}
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
