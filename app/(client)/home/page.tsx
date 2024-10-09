import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatSummaryContainer from "@/components/client/chat-summary/container";
import ComponentLoading from "@/components/utils/component-loading";
import AdvisorList from "@/components/client/advisor-list/list";
import Contents from "@/components/client/contents/main";

export default async function HomePageRoute({ searchParams }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: clientData } = await supabase
    .from("client")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center space-x-4">
          <h1 className="text-xl font-bold">{`Welcome, ${
            clientData?.name || user?.email
          }`}</h1>
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
        <Suspense fallback={<ComponentLoading />}>
          <Contents user={user} />
        </Suspense>
      </main>
    </div>
  );
}
