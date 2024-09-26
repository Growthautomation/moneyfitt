import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdvisorProfileCard } from "@/components/advisor-profile-card";
import ResourceCard from "@/components/resource-card";
import { BarChart2, PiggyBank } from "lucide-react";
import { redirect } from "next/navigation";
import { FintechConversationSummary } from "@/components/fintech-conversation-summary";

const advisors = [
  {
    id: "b0631cd8-ab49-4a1c-8b98-a63236dc68a4",
    name: "Sarah Johnson",
    title: "Financial Advisor",
    avatarSrc: "/lib/images/profile1.png",
    initials: "SJ",
    description:
      "Experienced financial advisor specializing in retirement planning and investment strategies.",
    quickSummary: "30-minute discussion about retirement planning and investment strategies",
    mainPoints: [
      "Reviewed current financial situation",
      "Discussed long-term financial goals",
      "Explained various investment options"
    ],
    offered: [
      "Personalized retirement savings plan",
      "Portfolio rebalancing service",
      "Annual financial health check-up"
    ],
    analysis: "Client shows strong interest in aggressive growth strategies but needs more education on associated risks."
  },
  {
    id: "b0631cd8-ab49-4a1c-8b98-a63236dc68a4",
    name: "John Smith",
    title: "Investment Specialist",
    avatarSrc: "/lib/images/profile3.png",
    initials: "JS",
    description:
      "Expert in creating diversified investment portfolios tailored to individual goals.",
    quickSummary: "30-minute discussion about investment strategies and risk management",
    mainPoints: [
      "Discussed investment goals and risk tolerance",
      "Explained various investment options",
      "Recommended diversified portfolio"
    ],
    offered: [
      "Personalized investment plan",
      "Regular portfolio rebalancing",
      "Annual investment review"
    ],
    analysis: "Client shows strong interest in conservative investment strategies but needs more education on associated risks."
  },
  {
    id: "b0631cd8-ab49-4a1c-8b98-a63236dc68a4",
    name: "Emily Chen",
    title: "Retirement Planner",
    avatarSrc: "/lib/images/profile2.png",
    initials: "EC",
    description:
      "Specialized in helping clients prepare for a comfortable and secure retirement.",
    quickSummary: "30-minute discussion about retirement planning and savings strategies",
    mainPoints: [
      "Discussed retirement goals and savings needs",
      "Explained various retirement savings options",
      "Recommended personalized retirement plan"
    ],
    offered: [
      "Personalized retirement savings plan",
      "Regular portfolio rebalancing",
      "Annual financial health check-up"
    ],
    analysis: "Client shows strong interest in aggressive growth strategies but needs more education on associated risks."
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

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Your Matched Advisors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {advisors.map((advisor) => (
                  <div key={advisor.id}>
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
          </div>

          <div className="w-full lg:w-1/3">
            <FintechConversationSummary advisors={advisors} />
          </div>
        </div>
      </main>
    </div>
  );
}
