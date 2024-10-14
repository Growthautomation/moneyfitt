import ChatList from "@/components/advisor/chat-list";
import ChatContextProvider from "@/components/chat/chat-context";
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
  return (
    <ChatContextProvider userId={user?.id}>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Your Clients</h2>
            <div className="flex min-h-[100vh] flex-nowrap gap-4 pb-4">
              <ChatList clients={matchings.map((m) => annonomiseMatching(m))} />
              {children}
            </div>
          </section>
        </main>
      </div>
    </ChatContextProvider>
  );
}
