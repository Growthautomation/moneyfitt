import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ResourceCard from "@/components/resource-card";
import { BarChart2, PiggyBank } from "lucide-react";
import { redirect } from "next/navigation";
import ChatSummaryContainer from "@/components/client/chat-summary/container";
import ComponentLoading from "@/components/utils/component-loading";
import AdvisorList from "@/components/client/advisor-list/list";

export default async function HomePageRoute({ searchParams }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch client data using the user's ID
  const { data: clientData, error: clientError } = await supabase
    .from('client')
    .select('*')
    .eq('id', user.id)
    .single();

  if (clientError) {
    console.error('Error fetching client data:', clientError);
    // Handle the error appropriately
  }

  // Use client data if available, otherwise fallback to user data
  const clientName = clientData?.name || user.email;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center space-x-4">
          <h1 className="text-2xl font-bold">{`Welcome, ${clientName}`}</h1>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Your Matched Advisors</h2>
          <div className="flex flex-col lg:flex-row gap-4">
            <Suspense fallback={<ComponentLoading />}>
              <AdvisorList user={user} />
            </Suspense>

            <Suspense fallback={<ComponentLoading />}>
              <div className="w-full lg:w-1/3">
                <ChatSummaryContainer
                  selectedAdvisor={searchParams?.advisorId}
                  user={user}
                />
              </div>
            </Suspense>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ResourceCard title="Stocks Intro" icon={BarChart2} />
            <ResourceCard title="CPF Explained" icon={PiggyBank} />
          </div>
        </section>
      </main>
    </div>
  );
}
