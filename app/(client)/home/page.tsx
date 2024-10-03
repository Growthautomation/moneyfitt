import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdvisorProfileCard } from "@/components/advisor-profile-card";
import ResourceCard from "@/components/resource-card";
import { BarChart2, PiggyBank } from "lucide-react";
import { redirect } from "next/navigation";
import ChatSummaryContainer from "@/components/client/chat-summary-container";
import { Suspense } from "react";

// TODO: format and style return error page properly

export default async function HomePageRoute({ searchParams }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: advisors } = await supabase
    .from("matchings")
    .select(
      `
        advisor_id,
        advisor (
          *
        )
      `
    )
    .eq("client_id", user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Jack" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{`Welcome, ${user.email}`}</h1>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Your Matched Advisors</h2>
          <div className="flex">
            {/* TODO: Fix advisor card width overflowing */}
            <div className="w-full lg:w-2/3 flex flex-nowrap overflow-x-auto gap-4 pb-4">
              {advisors?.map(({ advisor_id, advisor }) => (
                <div
                  key={advisor_id}
                  className="flex-none w-full sm:w-1/2 lg:w-1/3 max-w-md"
                >
                  <AdvisorProfileCard
                    advisor={advisor as never}
                    redirectTo={`/chat/${advisor_id}`}
                  />
                </div>
              ))}
            </div>
            <Suspense
              fallback={
                <div className="flex justify-center items-center">
                  Loading...
                </div>
              }
            >
              <div className="w-full lg:w-1/3">
                <ChatSummaryContainer
                  advisors={advisors?.map((a) => ({
                    ...a.advisor,
                    id: a.advisor_id,
                  }))}
                  selectedAdvisor={
                    advisors?.find(
                      (a) => a.advisor_id === searchParams?.advisorId
                    )?.advisor ?? advisors?.[0]?.advisor
                  }
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
