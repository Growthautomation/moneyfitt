import ChatList from "@/components/advisor/chat-list";
import ChatContextProvider from "@/components/chat/chat-context";
import { Faq } from "@/components/client/faqadvisor";
import { createClient } from "@/lib/supabase/server";
import { annonomiseMatching } from "@/lib/utils/annonomize";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("advisor/chat/layout: Error fetching user:", error);
    return redirect("/advisor/sign-in");
  }

  // Fetch matchings for the current advisor
  const { data: matchings, error: matchingsError } = await supabase
    .from("matchings")
    .select("client_id, advisor_visibility, client(*)")
    .eq("advisor_id", user.id)
    .eq("enabled", true);

  if (matchingsError) {
    console.error(
      "app/advisor/chat/layout: Error fetching matchings:",
      matchingsError
    );
    return "Error fetching clients";
  }
  return (
    <div className="min-h-screen bg-[#ECF0F3]">
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar - collapsible on mobile */}
          <div className="md:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-xl font-bold text-[#222222] mb-4 px-2">Your Clients</h2>
              <ChatList clients={matchings.map((m) => annonomiseMatching(m))} />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm">
              {children}
            </div>
            <div className="mt-4">
              <Faq />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
