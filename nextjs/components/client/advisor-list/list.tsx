import { createClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";
import { AdvisorProfileCard } from "@/components/client/advisor-list/profile-card";
import ComponentError from "@/components/utils/component-error";
import Rematch from "./rematch";

export default async function AdvisorList({ user }: { user: User }) {
  const supabase = createClient();
  const { data: advisors, error } = await supabase
    .from("matchings")
    .select(
      `
        *,
        advisor (
          *
        )
      `
    )
    .eq("client_id", user.id)
    .eq("enabled", true);

  if (!advisors) {
    console.error("client/advisor-list/list: Error fetching advisors", error);
    return <ComponentError message="Error loading advisors" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {advisors.map((m) => (
        <div key={m.advisor_id}>
          <AdvisorProfileCard
            advisor={m.advisor as never}
            redirectTo={`/chat/${m.advisor_id}`}
            footer={<Rematch matching={m} />}
          />
        </div>
      ))}
    </div>
  );
}
