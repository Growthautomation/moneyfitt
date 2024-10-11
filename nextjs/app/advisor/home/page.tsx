import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatList from "@/components/advisor/chat-list";
import ClientDashboard from "@/components/advisor/client-dashboard";
import ChatContextProvider from "@/components/chat/chat-context";
import { annonomiseMatching } from "@/lib/utils/annonomize";
import { Suspense } from "react";
import ComponentLoading from "@/components/utils/component-loading";

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
    .select("client_id, advisor_visibility, client(*)")
    .eq("advisor_id", user.id)
    .eq("enabled", true);

  if (matchingsError) {
    console.error(
      "app/advisor/home: Error fetching matchings:",
      matchingsError
    );
    return "Error fetching clients";
  }

  const selectedClient =
    matchings.find((m) => m.client_id === searchParams.clientId) ??
    matchings[0];

  return (
    <ChatContextProvider userId={user?.id}>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Your Clients</h2>
            <div className="flex min-h-[100vh] flex-nowrap gap-4 pb-4">
              <ChatList
                clients={matchings.map((m) => annonomiseMatching(m))}
                selectedClientId={searchParams?.clientId}
              />
              <Suspense
                key={selectedClient?.client_id}
                fallback={<ComponentLoading />}
              >
                {selectedClient ? (
                  <ClientDashboard
                    client={annonomiseMatching(selectedClient)}
                  />
                ) : (
                  <div className="flex justify-center items-center grow">
                    We will email when we find client for you
                  </div>
                )}
              </Suspense>
            </div>
          </section>
        </main>
      </div>
    </ChatContextProvider>
  );
}
