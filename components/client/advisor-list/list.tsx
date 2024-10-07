import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { AdvisorProfileCard } from "@/components/client/advisor-list/profile-card";
import ComponentError from "@/components/utils/component-error";

export default async function AdvisorList({ user }: { user: User }) {
  const supabase = createClient();
  const { data: advisors, error } = await supabase
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
  if (!advisors) {
    console.error("client/advisor-list/list: Error fetching advisors", error);
    return <ComponentError message="Error loading advisors" />;
  }
  return (
    <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {advisors.map(({ advisor_id, advisor }) => (
        <div key={advisor_id} className="h-full">
          <AdvisorProfileCard
            advisor={advisor as never}
            redirectTo={`/chat/${advisor_id}`}
          />
        </div>
      ))}
    </div>
  );
}
