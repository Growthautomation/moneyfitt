import ResourceCard from "@/components/resource-card";
import ComponentError from "@/components/utils/component-error";
import { createClient } from "@/lib/supabase/server";
import { BarChart2, PiggyBank, BookOpen } from "lucide-react";

export default async function Contents({ user }) {
  const supabase = createClient();
  const { data: client, error } = await supabase
    .from("client")
    .select()
    .eq("id", user.id)
    .single();
  if (error) {
    console.error("components/client/contents/main:", error);
    return <ComponentError message="Fail to fetch client" />;
  }

  // Define resource icons as strings
  const resourceIcons = [
    "BarChart2",
    "PiggyBank",
    "BookOpen",
    "Briefcase",
    "CreditCard",
    "DollarSign",
    "LineChart",
    "Percent",
    "Wallet",
    "ChevronRight",
  ];
  return (
    client.contents?.length && (
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {client.contents.map((contentId, index) => (
            <ResourceCard
              key={contentId as string}
              contentId={contentId as string}
              iconName={resourceIcons[index % resourceIcons.length]}
            />
          ))}
        </div>
      </section>
    )
  );
}
