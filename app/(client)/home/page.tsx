import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdvisorProfileCard } from "@/components/advisor-profile-card";
import ResourceCard from "@/components/resource-card";
import { BarChart2, PiggyBank } from "lucide-react";
import { redirect } from "next/navigation";

const advisors = [
  {
    id: "b0631cd8-ab49-4a1c-8b98-a63236dc68a4",
    name: "Sarah Johnson",
    title: "Financial Advisor",
    avatarSrc: "/lib/images/profile1.png",
    initials: "SJ",
    description:
      "Experienced financial advisor specializing in retirement planning and investment strategies.",
  },
  {
    id: "b0631cd8-ab49-4a1c-8b98-a63236dc68a4",
    name: "John Smith",
    title: "Investment Specialist",
    avatarSrc: "/lib/images/profile3.png",
    initials: "JS",
    description:
      "Expert in creating diversified investment portfolios tailored to individual goals.",
  },
  {
    id: "b0631cd8-ab49-4a1c-8b98-a63236dc68a4",
    name: "Emily Chen",
    title: "Retirement Planner",
    avatarSrc: "/lib/images/profile2.png",
    initials: "EC",
    description:
      "Specialized in helping clients prepare for a comfortable and secure retirement.",
  },
];

export default async function HomePageRoute() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
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
          <h2 className="text-xl font-semibold mb-4">Your Matched Advisors</h2>
          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
            {advisors.map((advisor) => (
              <div
                key={advisor.id}
                className="flex-none w-full sm:w-1/2 lg:w-1/3 max-w-md"
              >
                <AdvisorProfileCard advisor={advisor} redirectTo={`/chat/${advisor.id}`} />
              </div>
            ))}
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
