import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdvisorProfileCard } from "@/components/advisor-profile-card";
import ResourceCard from "@/components/resource-card";
import { BarChart2, PiggyBank } from "lucide-react";
import { redirect } from "next/navigation";
import ChatList from "@/components/chat/chat-list";
import UserInfoCard from "@/components/user/user-info";

export default async function AgentHome() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/agent/sign-in");
  }

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
          <h2 className="text-xl font-semibold mb-4">Your Clients</h2>
          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
            <div>
              <ChatList clients={[{id: '123', name: "Ye aung"}]} />
            </div>
            <div>
              <div>
                <UserInfoCard client={{ name: "Name", email: "Email" }} />
              </div>
              <div>
                
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
